import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import logo from '../../assets/imagotipo.png';
import { useAuth } from '../../context/AuthContext';
import { useUserData } from '../../hooks/useUserData';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { LayoutDashboard, TableProperties, LogOut, Bus, ArrowLeft, Ticket, Printer, Check, User, Calendar, MapPin, CreditCard, Users, ChevronDown, Plus } from 'lucide-react';

const ViewTicketPage = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const { userData, loading: dataLoading } = useUserData();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState(false);

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar ticket
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'tickets', id));
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Validar pertenencia
          if (data.userId !== user?.uid) {
            setError("No tienes autorización para ver esta reserva.");
            setLoading(false);
            return;
          }
          setTicket(data);
        } else {
          setError("La reserva no existe.");
        }
      } catch (err) {
        console.error("Error fetching ticket:", err);
        setError("Error al cargar la reserva.");
      } finally {
        setLoading(false);
      }
    };
    if (id && user) {
      fetchTicket();
    }
  }, [id, user]);

  // Si tiene query param ?print=true, disparar impresión automáticamente una vez cargado
  useEffect(() => {
    if (!loading && ticket && new URLSearchParams(location.search).get('print') === 'true') {
      // Pequeño timeout para dar tiempo al renderizado completo
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [loading, ticket, location.search]);

  const handlePrint = () => {
    window.print();
  };

  const formatCOP = (val) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (loading || authLoading) {
    return (
      <div className="bg-cootrans" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{ width: 48, height: 48, border: '4px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ fontWeight: 500 }}>Cargando pasaje...</p>
        </div>
      </div>
    );
  }

  return (
    <main style={{ background: 'var(--gray-50)', padding: '2rem', overflow: 'auto', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
        {/* Estilos CSS Inline para Impresión */}
        <style>{`
        @media print {
          /* Ocultar barra lateral, botones y cualquier elemento de navegación */
          aside, button, a, nav, .no-print, .header-actions {
            display: none !important;
          }
          /* Quitar márgenes, fondos de pantalla y forzar fondo blanco para el contenido */
          body, html, #root, main {
            background: #fff !important;
            color: #000 !important;
            padding: 0 !important;
            margin: 0 !important;
            min-height: auto !important;
            display: block !important;
          }
          main {
            width: 100% !important;
            margin: 0 !important;
            padding: 1.5cm !important;
          }
          /* Ajustar el contenedor de la tarjeta del pasaje */
          .ticket-card-container {
            box-shadow: none !important;
            border: 2px dashed #000 !important;
            background: #fff !important;
            margin: 0 auto !important;
            width: 100% !important;
            max-width: 650px !important;
          }
          .ticket-header {
            background: #1a4a1f !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            color: #fff !important;
          }
          .badge-active {
            background: #fff !important;
            border: 1px solid #000 !important;
            color: #000 !important;
          }
        }
      `}</style>

        {/* Header - No se imprime */}
        <div className="no-print animate-fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <Link to="/tickets" style={{ display: 'inline-flex', alignItems: 'center', gap: '.3rem', fontSize: '.8rem', color: 'var(--green-main)', fontWeight: 600, marginBottom: '.5rem' }}>
              <ArrowLeft size={14} /> Volver a Mis Pasajes
            </Link>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--green-dark)', margin: 0 }}>
              Visualizar Pasaje
            </h1>
            <p style={{ color: 'var(--gray-600)', margin: '.25rem 0 0', fontSize: '.875rem' }}>
              Vista detallada del pasaje. Puedes imprimirlo o guardarlo en formato físico/PDF.
            </p>
          </div>
          <button onClick={handlePrint} className="btn-gold" style={{ padding: '.6rem 1.5rem', borderRadius: '8px', fontSize: '.875rem' }}>
            <Printer size={17} /> Imprimir Pasaje
          </button>
        </div>

        {error ? (
          <div className="card animate-fade-up" style={{ padding: '2rem', textAlign: 'center', color: '#991b1b', background: '#fee2e2', border: '1px solid #fecaca' }}>
            <Ticket size={48} style={{ margin: '0 auto 1rem', opacity: .6 }} />
            <p style={{ fontWeight: 600, margin: 0 }}>{error}</p>
          </div>
        ) : (
          ticket && (
            <div className="ticket-card-container animate-fade-up delay-100" style={{
              background: '#fff', borderRadius: 'var(--radius-lg)', overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)', border: '1px solid var(--gray-200)',
              maxWidth: '650px', margin: '0 auto 3rem'
            }}>
              {/* Encabezado del Pasaje */}
              <div className="ticket-header" style={{
                background: 'linear-gradient(135deg, var(--green-dark), var(--green-mid))',
                color: '#fff', padding: '1.75rem 2rem', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={logo} alt="Logo" style={{ width: '70%', height: '70%' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, letterSpacing: '.05em', lineHeight: 1.2 }}>COOTRANS</h3>
                    <p style={{ margin: 0, fontSize: '.75rem', opacity: 0.8, fontWeight: 500 }}>Hacaritama - Tiquete de Abordaje</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    fontSize: '.65rem', fontWeight: 800, textTransform: 'uppercase',
                    background: 'rgba(255,255,255,.25)', padding: '.25rem .75rem', borderRadius: '99px',
                    letterSpacing: '.05em'
                  }}>
                    Válido
                  </span>
                  <p style={{ margin: '.35rem 0 0', fontSize: '.75rem', fontFamily: 'monospace' }}>Ref: {id.slice(0,8).toUpperCase()}</p>
                </div>
              </div>

              {/* Contenido del Pasaje */}
              <div style={{ padding: '2rem' }}>
                {/* Ruta grande */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <span style={{ fontSize: '.7rem', textTransform: 'uppercase', color: 'var(--gray-600)', fontWeight: 700 }}>Origen</span>
                    <h2 style={{ margin: '.2rem 0 0', color: 'var(--green-dark)', fontWeight: 800, fontSize: '1.4rem' }}>
                      {ticket.travelInfo.ruta.split('--')[0].trim()}
                    </h2>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--green-main)' }}>
                    <Bus size={24} style={{ animation: 'pulse-slow 2s infinite' }} />
                    <div style={{ width: 80, height: 2, borderBottom: '2px dotted var(--green-pale)', margin: '.25rem 0' }} />
                  </div>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <span style={{ fontSize: '.7rem', textTransform: 'uppercase', color: 'var(--gray-600)', fontWeight: 700 }}>Destino</span>
                    <h2 style={{ margin: '.2rem 0 0', color: 'var(--green-dark)', fontWeight: 800, fontSize: '1.4rem' }}>
                      {ticket.travelInfo.ruta.split('--')[1].trim()}
                    </h2>
                  </div>
                </div>

                {/* Detalles de Pasajero y Viaje */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem 2rem', marginBottom: '2rem', borderTop: '1px solid var(--gray-200)', paddingTop: '1.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', color: 'var(--gray-600)', fontSize: '.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                      <User size={14} /> Pasajero
                    </div>
                    <strong style={{ display: 'block', fontSize: '.95rem', color: 'var(--gray-800)', marginTop: '.2rem' }}>
                      {ticket.passengerInfo.primerNombre} {ticket.passengerInfo.segundoNombre || ''} {ticket.passengerInfo.primerApellido} {ticket.passengerInfo.segundoApellido || ''}
                    </strong>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', color: 'var(--gray-600)', fontSize: '.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                      <Ticket size={14} /> Asiento Reservado
                    </div>
                    <strong style={{ display: 'block', fontSize: '1.2rem', color: 'var(--green-mid)', fontWeight: 800, marginTop: '.1rem' }}>
                      Asiento #{ticket.travelInfo.nroAsiento}
                    </strong>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', color: 'var(--gray-600)', fontSize: '.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                      <Calendar size={14} /> Fecha y Hora de Salida
                    </div>
                    <strong style={{ display: 'block', fontSize: '.95rem', color: 'var(--gray-800)', marginTop: '.2rem' }}>
                      {ticket.travelInfo.viajeDisponible}
                    </strong>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', color: 'var(--gray-600)', fontSize: '.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                      <MapPin size={14} /> Documento Identidad
                    </div>
                    <strong style={{ display: 'block', fontSize: '.95rem', color: 'var(--gray-800)', marginTop: '.2rem' }}>
                      C.C. {ticket.passengerInfo.documento}
                    </strong>
                  </div>
                </div>

                {/* Detalles de Pago y QR */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'var(--gray-50)', padding: '1.25rem 1.5rem', borderRadius: '12px',
                  border: '1.5px solid var(--gray-200)', marginTop: '2rem'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', color: 'var(--gray-600)', fontSize: '.72rem', fontWeight: 600, textTransform: 'uppercase' }}>
                      <CreditCard size={13} /> Detalle de Pago ({ticket.paymentInfo.metodoPago})
                    </div>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--green-dark)', display: 'block', marginTop: '.2rem' }}>
                      {formatCOP(ticket.travelInfo.precioTotal)}
                    </span>
                    <span style={{ fontSize: '.7rem', color: '#166534', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '.2rem', marginTop: '.15rem' }}>
                      <Check size={12} /> Pago Completado
                    </span>
                  </div>

                  {/* QR code simulado con CSS */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: 70, height: 70, border: '2px solid #000', borderRadius: '6px',
                      padding: '3px', background: '#fff', display: 'flex', flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ width: 15, height: 15, bg: '#000', background: '#000' }} />
                        <div style={{ width: 15, height: 15, background: '#000' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
                        <div style={{ width: 8, height: 8, background: '#000' }} />
                        <div style={{ width: 12, height: 12, background: '#000' }} />
                        <div style={{ width: 8, height: 8, background: '#000' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ width: 15, height: 15, background: '#000' }} />
                        <div style={{ width: 6, height: 10, background: '#000' }} />
                        <div style={{ width: 6, height: 15, background: '#000' }} />
                      </div>
                    </div>
                    <span style={{ fontSize: '.55rem', fontFamily: 'monospace', display: 'block', marginTop: '.35rem', color: 'var(--gray-600)' }}>
                      SCAN QR
                    </span>
                  </div>
                </div>

                {/* Nota al pie */}
                <div style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: '1px dashed var(--gray-200)', paddingTop: '1rem' }}>
                  <p style={{ color: 'var(--gray-600)', fontSize: '.75rem', margin: 0, lineHeight: 1.5 }}>
                    Por favor preséntese en la terminal de transporte 15 minutos antes de la salida programada.
                  </p>
                  <p style={{ color: 'var(--gray-400)', fontSize: '.7rem', margin: '.2rem 0 0' }}>
                    COOTRANS Hacaritama - Viajando Juntos
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </main>
  );
};

export default ViewTicketPage;


