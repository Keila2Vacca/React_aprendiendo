import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/imagotipo.png';
import { useAuth } from '../../context/AuthContext';
import { useUserData } from '../../hooks/useUserData';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { LayoutDashboard, TableProperties, LogOut, Bus, Printer, CreditCard, ArrowLeft, Ticket, CheckCircle2, AlertCircle, Users, ChevronDown, Plus } from 'lucide-react';

const BookTicketPage = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const { userData, loading: dataLoading } = useUserData();
  const navigate = useNavigate();
  const [expandedMenu, setExpandedMenu] = useState(false);

  const [formData, setFormData] = useState({
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    documento: '',
    telefono: '',
    genero: 'Masculino',
    fechaNacimiento: '',
    ruta: 'Abrego -- Ocaña',
    viajeDisponible: '18/12/2025 16:20:00',
    nroAsiento: '',
  });

  const [occupiedSeats, setOccupiedSeats] = useState([4, 1]); // Default occupied seats
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Flujo de pago
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState({
    metodoPago: 'Nequi',
    titular: '',
    referencia: '',
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState(null);

  const routesWithPrices = {
    'Abrego -- Ocaña': 13000,
    'Ocaña -- Abrego': 13000,
    'Cúcuta -- Ocaña': 40000,
    'Ocaña -- Cúcuta': 40000,
  };

  const getPrice = () => {
    return routesWithPrices[formData.ruta] || 13000;
  };

  const formatCOP = (val) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  // Fetch occupied seats for this route & trip to update seat list dynamically
  useEffect(() => {
    const fetchOccupiedSeats = async () => {
      try {
        const q = query(
          collection(db, 'tickets'),
          where('travelInfo.ruta', '==', formData.ruta),
          where('travelInfo.viajeDisponible', '==', formData.viajeDisponible)
        );
        const snap = await getDocs(q);
        const seats = snap.docs.map(doc => parseInt(doc.data().travelInfo.nroAsiento)).filter(seat => !isNaN(seat));
        // Merge with initial dummy occupied seats for showcase
        setOccupiedSeats(Array.from(new Set([...seats, 1, 4])));
      } catch (err) {
        console.error("Error fetching occupied seats:", err);
      }
    };
    fetchOccupiedSeats();
  }, [formData.ruta, formData.viajeDisponible]);

  const handleOpenPayment = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.primerNombre || !formData.primerApellido || !formData.documento || !formData.telefono || !formData.fechaNacimiento || !formData.nroAsiento) {
      setError('Por favor complete todos los campos obligatorios (*)');
      return;
    }

    // Validar documento: solo números
    if (!/^\d+$/.test(formData.documento)) {
      setError('El documento debe contener solo números.');
      return;
    }

    // Validar teléfono: solo números y exactamente 10 dígitos
    if (!/^\d+$/.test(formData.telefono)) {
      setError('El teléfono debe contener solo números.');
      return;
    }
    if (formData.telefono.length !== 10) {
      setError('El teléfono debe tener exactamente 10 dígitos.');
      return;
    }

    const seatNum = parseInt(formData.nroAsiento);
    if (isNaN(seatNum) || seatNum < 1 || seatNum > 40) {
      setError('El número de asiento debe estar entre 1 y 40.');
      return;
    }

    if (occupiedSeats.includes(seatNum)) {
      setError(`El asiento ${seatNum} ya está ocupado. Por favor elija otro.`);
      return;
    }

    // Default cardholder to passenger name
    setPaymentData({
      ...paymentData,
      titular: `${formData.primerNombre} ${formData.primerApellido}`
    });
    setShowPayment(true);
  };

  const handleSimulatePayment = async (e) => {
    e.preventDefault();
    if (!paymentData.titular || !paymentData.referencia) {
      setError('Por favor complete los datos básicos de pago');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Guardar ticket en Firestore
      const docRef = await addDoc(collection(db, 'tickets'), {
        passengerInfo: {
          primerNombre: formData.primerNombre,
          segundoNombre: formData.segundoNombre,
          primerApellido: formData.primerApellido,
          segundoApellido: formData.segundoApellido,
          documento: formData.documento,
          telefono: formData.telefono,
          genero: formData.genero,
          fechaNacimiento: formData.fechaNacimiento,
        },
        travelInfo: {
          ruta: formData.ruta,
          viajeDisponible: formData.viajeDisponible,
          nroAsiento: formData.nroAsiento,
          precioTotal: getPrice(),
        },
        paymentInfo: {
          metodoPago: paymentData.metodoPago,
          titular: paymentData.titular,
          referencia: paymentData.referencia,
          estado: 'Completado',
          fechaPago: new Date().toISOString(),
        },
        userId: user.uid,
        userEmail: user.email,
        createdAt: serverTimestamp(),
      });

      setCreatedTicketId(docRef.id);
      setPaymentSuccess(true);
    } catch (err) {
      console.error("Error creating ticket:", err);
      setError('Error al procesar la reserva. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    navigate(`/tickets/view/${createdTicketId}?print=true`);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* ── Sidebar ── */}
      <aside
        className="bg-cootrans"
        style={{
          width: 260, height: '100vh', display: 'flex', flexDirection: 'column',
          padding: '1.5rem 1rem', flexShrink: 0, position: 'sticky', top: 0,
          boxShadow: '4px 0 20px rgba(0,0,0,.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '2rem', padding: '0 .25rem' }}>
          <div style={{
            width: 42, height: 42, borderRadius: '50%',
            background: 'rgba(255,255,255,.15)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem',
            border: '1.5px solid rgba(255,255,255,.25)',
          }}>
            <img src={logo} alt="Logo" />
          </div>
          <div>
            <p style={{ color: '#fff', fontWeight: 800, fontSize: '.95rem', margin: 0, lineHeight: 1.2 }}>COOTRANS</p>
            <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '.72rem', margin: 0 }}>Hacaritama</p>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '.3rem', flex: 1, overflowY: 'auto', marginBottom: '1rem' }}>
          <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', padding: '.5rem 1.25rem .25rem', margin: 0 }}>
            Menú Principal
          </p>

          <Link to="/dashboard" className="sidebar-link">
            <LayoutDashboard size={18} /> Dashboard
          </Link>

          <Link to="/tickets/new" className="sidebar-link active">
            <Ticket size={18} /> Reservar Pasaje
          </Link>

          <Link to="/tickets" className="sidebar-link">
            <Bus size={18} /> Mis Pasajes
          </Link>

          {/* Menú desplegable para Conductores */}
          <button
            onClick={() => setExpandedMenu(!expandedMenu)}
            className="sidebar-link"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: expandedMenu ? 'rgba(255,255,255,.1)' : 'transparent',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} /> Conductores
            </div>
            <ChevronDown
              size={16}
              style={{
                transform: expandedMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            />
          </button>

          {expandedMenu && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.1rem', paddingLeft: '1rem', marginBottom: '.3rem' }}>
              <Link
                to="/drivers/new"
                className="sidebar-link"
                style={{ fontSize: '.85rem', paddingLeft: '.75rem' }}
              >
                <Plus size={16} /> Agregar Conductor
              </Link>
              <Link
                to="/drivers"
                className="sidebar-link"
                style={{ fontSize: '.85rem', paddingLeft: '.75rem' }}
              >
                <Users size={16} /> Listado de Conductores
              </Link>
            </div>
          )}

          <Link to="/sessions" className="sidebar-link">
            <TableProperties size={18} /> Ver Sesiones
          </Link>
        </nav>

        <div style={{ borderTop: '1px solid rgba(255,255,255,.15)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', padding: '.5rem .75rem', marginBottom: '.75rem' }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(255,255,255,.15)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '.9rem', fontWeight: 700, color: '#fff',
              flexShrink: 0, overflow: 'hidden'
            }}>
              {userData?.photoURL ? (
                <img src={userData.photoURL} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                (userData?.name || user?.email || 'U')[0].toUpperCase()
              )}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ color: '#fff', fontSize: '.8rem', fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {userData?.name || 'Usuario'}
              </p>
              <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '.7rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email}
              </p>
            </div>
          </div>
          <button className="sidebar-link" onClick={logout} style={{ color: 'rgba(255,120,120,.9)', width: '100%' }}>
            <LogOut size={17} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, background: 'var(--gray-50)', padding: '2rem', overflow: 'auto' }}>
        <div className="animate-fade-up" style={{ marginBottom: '1.5rem' }}>
          <Link to="/tickets" style={{ display: 'inline-flex', alignItems: 'center', gap: '.3rem', fontSize: '.8rem', color: 'var(--green-main)', fontWeight: 600, marginBottom: '.5rem' }}>
            <ArrowLeft size={14} /> Volver a Mis Pasajes
          </Link>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--green-dark)', margin: 0 }}>
            Reservar Pasaje
          </h1>
          <p style={{ color: 'var(--gray-600)', margin: '.25rem 0 0', fontSize: '.875rem' }}>
            Complete el formulario para reservar y realizar el pago simulado de un nuevo pasaje.
          </p>
        </div>

        {error && (
          <div className="animate-fade-up" style={{
            padding: '.75rem 1rem', borderRadius: '10px', marginBottom: '1.5rem',
            display: 'flex', alignItems: 'center', gap: '.75rem', fontSize: '.875rem',
            background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <div className="card animate-fade-up delay-100" style={{ padding: '2rem', maxWidth: '800px', background: '#fff' }}>
          {!showPayment ? (
            <form onSubmit={handleOpenPayment}>
              {/* Sección 1: Información del Pasajero */}
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--green-dark)', borderBottom: '1px solid var(--gray-200)', paddingBottom: '.5rem', marginBottom: '1rem' }}>
                Información del Pasajero
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '.35rem' }}>Primer Nombre *</label>
                  <input type="text" placeholder="Ej. Patricio" className="form-input" style={{ paddingLeft: '1rem' }} required
                    value={formData.primerNombre} onChange={(e) => setFormData({ ...formData, primerNombre: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '.35rem' }}>Segundo Nombre</label>
                  <input type="text" placeholder="Ej. Darío" className="form-input" style={{ paddingLeft: '1rem' }}
                    value={formData.segundoNombre} onChange={(e) => setFormData({ ...formData, segundoNombre: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '.35rem' }}>Primer Apellido *</label>
                  <input type="text" placeholder="Ej. Marín" className="form-input" style={{ paddingLeft: '1rem' }} required
                    value={formData.primerApellido} onChange={(e) => setFormData({ ...formData, primerApellido: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '.35rem' }}>Segundo Apellido</label>
                  <input type="text" placeholder="Ej. Morales" className="form-input" style={{ paddingLeft: '1rem' }}
                    value={formData.segundoApellido} onChange={(e) => setFormData({ ...formData, segundoApellido: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '.35rem' }}>Documento * (solo números)</label>
                  <input type="text" placeholder="Ej. 3456789" className="form-input" style={{ paddingLeft: '1rem' }} required
                    value={formData.documento} onChange={(e) => setFormData({ ...formData, documento: e.target.value.replace(/\D/g, '') })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '.35rem' }}>Teléfono * (10 dígitos)</label>
                  <input type="tel" placeholder="Ej. 3216789000" className="form-input" style={{ paddingLeft: '1rem' }} required
                    value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value.replace(/\D/g, '').slice(0, 10) })} maxLength="10" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '.35rem' }}>Género *</label>
                  <select className="form-input" style={{ paddingLeft: '1rem' }}
                    value={formData.genero} onChange={(e) => setFormData({ ...formData, genero: e.target.value })}>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div style={{ maxWidth: '50%', marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '.35rem' }}>Fecha de Nacimiento *</label>
                <input type="date" className="form-input" style={{ paddingLeft: '1rem' }} required
                  value={formData.fechaNacimiento} onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })} />
              </div>

              {/* Sección 2: Información del Viaje */}
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--green-dark)', borderBottom: '1px solid var(--gray-200)', paddingBottom: '.5rem', marginBottom: '1rem', marginTop: '1.5rem' }}>
                Información del Viaje
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '.35rem' }}>Ruta *</label>
                  <select className="form-input" style={{ paddingLeft: '1rem' }}
                    value={formData.ruta} onChange={(e) => setFormData({ ...formData, ruta: e.target.value })}>
                    <option value="Abrego -- Ocaña">Abrego -- Ocaña ({formatCOP(13000)})</option>
                    <option value="Ocaña -- Abrego">Ocaña -- Abrego ({formatCOP(13000)})</option>
                    <option value="Cúcuta -- Ocaña">Cúcuta -- Ocaña ({formatCOP(40000)})</option>
                    <option value="Ocaña -- Cúcuta">Ocaña -- Cúcuta ({formatCOP(40000)})</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '.35rem' }}>Viaje Disponible *</label>
                  <select className="form-input" style={{ paddingLeft: '1rem' }}
                    value={formData.viajeDisponible} onChange={(e) => setFormData({ ...formData, viajeDisponible: e.target.value })}>
                    <option value="18/12/2025 16:20:00">18/12/2025 16:20:00 - Estado: Activo</option>
                    <option value="19/12/2025 08:30:00">19/12/2025 08:30:00 - Estado: Activo</option>
                    <option value="20/12/2025 14:00:00">20/12/2025 14:00:00 - Estado: Activo</option>
                  </select>
                </div>
              </div>

              {/* Detalles de la Reserva */}
              <div style={{
                background: '#f1f8f3', border: '1.5px solid var(--green-pale)',
                borderRadius: 'var(--radius-sm)', padding: '1.25rem', marginBottom: '2rem',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 700, color: 'var(--green-dark)', marginBottom: '.35rem' }}>Número de Asiento *</label>
                  <input type="number" min="1" max="40" placeholder="Ej. 2" className="form-input" style={{ paddingLeft: '1rem', background: '#fff' }} required
                    value={formData.nroAsiento} onChange={(e) => setFormData({ ...formData, nroAsiento: e.target.value })} />
                  <span style={{ fontSize: '.75rem', color: 'var(--gray-600)', display: 'block', marginTop: '.35rem' }}>
                    Asientos ocupados: {occupiedSeats.join(', ')}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '1rem' }}>
                  <span style={{ fontSize: '.75rem', color: 'var(--gray-600)', textTransform: 'uppercase', fontWeight: 600 }}>Precio Total</span>
                  <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--green-dark)' }}>{formatCOP(getPrice())}</span>
                  <span style={{ fontSize: '.7rem', color: 'var(--gray-400)' }}>Precio por persona</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-outline-white" style={{ borderColor: 'var(--gray-400)', color: 'var(--gray-800)' }} onClick={() => navigate('/tickets')}>
                  Cancelar
                </button>
                <button type="submit" className="btn-green" style={{ width: 'auto', padding: '.75rem 2rem' }}>
                  Confirmar Reserva
                </button>
              </div>
            </form>
          ) : (
            // Vista de Pago Simulada
            <div>
              {!paymentSuccess ? (
                <form onSubmit={handleSimulatePayment}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '1.25rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--green-main)15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-main)' }}>
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--green-dark)', margin: 0 }}>Simulación de Pago</h3>
                      <p style={{ margin: 0, fontSize: '.75rem', color: 'var(--gray-600)' }}>Ingrese los datos para autorizar el pasaje</p>
                    </div>
                  </div>

                  <div style={{ background: 'var(--gray-50)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--gray-200)', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.4rem', fontSize: '.875rem' }}>
                      <span style={{ color: 'var(--gray-600)' }}>Pasajero:</span>
                      <strong style={{ color: 'var(--gray-800)' }}>{formData.primerNombre} {formData.primerApellido}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.4rem', fontSize: '.875rem' }}>
                      <span style={{ color: 'var(--gray-600)' }}>Ruta:</span>
                      <strong style={{ color: 'var(--gray-800)' }}>{formData.ruta}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.4rem', fontSize: '.875rem' }}>
                      <span style={{ color: 'var(--gray-600)' }}>Asiento:</span>
                      <strong style={{ color: 'var(--gray-800)' }}>{formData.nroAsiento}</strong>
                    </div>
                    <hr style={{ border: '0', borderTop: '1px solid var(--gray-200)', margin: '.75rem 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem' }}>
                      <span style={{ color: 'var(--green-dark)', fontWeight: 700 }}>Total a Pagar:</span>
                      <strong style={{ color: 'var(--green-dark)', fontSize: '1.2rem', fontWeight: 800 }}>{formatCOP(getPrice())}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '.35rem' }}>Método de Pago *</label>
                      <select className="form-input" style={{ paddingLeft: '1rem' }}
                        value={paymentData.metodoPago} onChange={(e) => setPaymentData({ ...paymentData, metodoPago: e.target.value })}>
                        <option value="Nequi">Nequi</option>
                        <option value="Daviplata">Daviplata</option>
                        <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                        <option value="Efectivo (Taquilla)">Efectivo (Taquilla)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '.35rem' }}>Titular de Cuenta/Tarjeta *</label>
                      <input type="text" placeholder="Nombre completo" className="form-input" style={{ paddingLeft: '1rem' }} required
                        value={paymentData.titular} onChange={(e) => setPaymentData({ ...paymentData, titular: e.target.value })} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '.35rem' }}>
                      {paymentData.metodoPago === 'Tarjeta de Crédito' ? 'Número de Tarjeta (4 últimos dígitos) *' : 'Número de Celular / Referencia *'}
                    </label>
                    <input type="text" placeholder={paymentData.metodoPago === 'Tarjeta de Crédito' ? '4321' : '3001234567'} className="form-input" style={{ paddingLeft: '1rem' }} required
                      value={paymentData.referencia} onChange={(e) => setPaymentData({ ...paymentData, referencia: e.target.value })} />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button type="button" className="btn-outline-white" style={{ borderColor: 'var(--gray-400)', color: 'var(--gray-800)' }} onClick={() => setShowPayment(false)}>
                      Atrás
                    </button>
                    <button type="submit" className="btn-green" style={{ width: 'auto', padding: '.75rem 2.5rem' }} disabled={loading}>
                      {loading ? 'Procesando Pago...' : 'Confirmar y Pagar'}
                    </button>
                  </div>
                </form>
              ) : (
                // Éxito de Pago + Impresión
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', color: '#166534', marginBottom: '1.25rem' }}>
                    <CheckCircle2 size={64} style={{ animation: 'pulse-slow 2s infinite' }} />
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--green-dark)', marginBottom: '.5rem' }}>¡Pago Realizado con Éxito!</h3>
                  <p style={{ color: 'var(--gray-600)', fontSize: '.9rem', maxWidth: '480px', margin: '0 auto 2rem', lineHeight: 1.5 }}>
                    Tu pasaje de <strong>{formData.ruta}</strong> para el <strong>{formData.viajeDisponible}</strong> ha sido reservado correctamente. El botón de impresión ya está disponible.
                  </p>

                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button onClick={() => navigate('/tickets')} className="btn-outline-white" style={{ borderColor: 'var(--gray-400)', color: 'var(--gray-800)' }}>
                      Ver Mis Pasajes
                    </button>
                    <button onClick={handlePrint} className="btn-gold" style={{ display: 'inline-flex', gap: '.5rem', alignItems: 'center' }}>
                      <Printer size={18} /> Imprimir Pasaje
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BookTicketPage;
