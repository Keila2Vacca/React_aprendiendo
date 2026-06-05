import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/imagotipo.png';
import { useAuth } from '../../context/AuthContext';
import { useUserData } from '../../hooks/useUserData';
import { db } from '../../firebase';
import { collection, getDocs, query, where, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { LayoutDashboard, TableProperties, LogOut, Bus, Search, Ticket, Eye, Edit2, Trash2, Plus, AlertTriangle, CheckCircle2 } from 'lucide-react';

const TicketsListPage = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const { userData, loading: dataLoading } = useUserData();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) {
        setTickets([]);
        setLoading(false);
        return;
      }
      try {
        console.log("Fetching tickets for user:", user.uid);
        const q = query(
          collection(db, 'tickets'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        console.log("Tickets found:", snap.size);
        setTickets(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching tickets:", err);
        // Si hay error con orderBy, intentar sin ordenar
        try {
          console.log("Retrying without orderBy...");
          const q = query(
            collection(db, 'tickets'),
            where('userId', '==', user.uid)
          );
          const snap = await getDocs(q);
          console.log("Tickets found (no orderBy):", snap.size);
          const ticketsData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          // Ordenar en el cliente
          ticketsData.sort((a, b) => {
            const timeA = a.createdAt?.seconds || 0;
            const timeB = b.createdAt?.seconds || 0;
            return timeB - timeA;
          });
          setTickets(ticketsData);
        } catch (retryErr) {
          console.error("Error fetching tickets (retry):", retryErr);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [user]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDoc(doc(db, 'tickets', deleteId));
      setTickets(tickets.filter(t => t.id !== deleteId));
      setSuccessMsg('Reserva eliminada correctamente.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error("Error deleting ticket:", err);
    } finally {
      setDeleteId(null);
    }
  };

  const filteredTickets = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return tickets;
    return tickets.filter(t => {
      const passenger = t.passengerInfo;
      const fullName = `${passenger.primerNombre} ${passenger.segundoNombre || ''} ${passenger.primerApellido} ${passenger.segundoApellido || ''}`.toLowerCase();
      const document = (passenger.documento || '').toLowerCase();
      const phone = (passenger.telefono || '').toLowerCase();
      const route = (t.travelInfo?.ruta || '').toLowerCase();
      return fullName.includes(search) || document.includes(search) || phone.includes(search) || route.includes(search);
    });
  }, [tickets, searchTerm]);

  const formatCOP = (val) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  if (loading || authLoading) {
    return (
      <div className="bg-cootrans" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{ width: 48, height: 48, border: '4px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ fontWeight: 500 }}>Cargando pasajes...</p>
        </div>
      </div>
    );
  }

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

          <Link to="/tickets/new" className="sidebar-link">
            <Ticket size={18} /> Reservar Pasaje
          </Link>

          <Link to="/tickets" className="sidebar-link active">
            <Bus size={18} /> Mis Pasajes
          </Link>

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
        {/* Header */}
        <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--green-dark)', margin: 0 }}>
              Mis Pasajes Reservados
            </h1>
            <p style={{ color: 'var(--gray-600)', margin: '.25rem 0 0', fontSize: '.875rem' }}>
              {filteredTickets.length} pasaje{filteredTickets.length !== 1 ? 's' : ''} encontrado{filteredTickets.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            to="/tickets/new"
            className="btn-gold"
            style={{ padding: '.6rem 1.25rem', borderRadius: '8px', fontSize: '.875rem' }}
          >
            <Plus size={16} /> Reservar Pasaje
          </Link>
        </div>

        {/* Success message */}
        {successMsg && (
          <div className="animate-fade-up" style={{
            padding: '.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem',
            display: 'flex', alignItems: 'center', gap: '.75rem', fontSize: '.875rem',
            background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0'
          }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Search */}
        <div className="animate-fade-up delay-100" style={{ position: 'relative', marginBottom: '1.25rem', maxWidth: 480 }}>
          <Search size={17} style={{ position: 'absolute', left: '.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
          <input
            id="tickets-search"
            type="text"
            placeholder="Buscar por pasajero, documento o ruta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.6rem' }}
          />
        </div>

        {/* Table card */}
        <div className="animate-fade-up delay-200" style={{
          background: '#fff', borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)', border: '1px solid var(--gray-200)',
          overflow: 'hidden',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pasajero</th>
                  <th>Documento</th>
                  <th>Ruta</th>
                  <th>Viaje</th>
                  <th>Asiento</th>
                  <th>Precio</th>
                  <th>Pago</th>
                  <th style={{ textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((t) => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 600 }}>
                        {t.passengerInfo.primerNombre} {t.passengerInfo.primerApellido}
                      </td>
                      <td style={{ color: 'var(--gray-600)' }}>{t.passengerInfo.documento}</td>
                      <td>{t.travelInfo.ruta}</td>
                      <td>{t.travelInfo.viajeDisponible}</td>
                      <td style={{ fontWeight: 700, color: 'var(--green-mid)' }}>#{t.travelInfo.nroAsiento}</td>
                      <td style={{ fontWeight: 700 }}>{formatCOP(t.travelInfo.precioTotal)}</td>
                      <td>
                        <span className="badge-active">
                          {t.paymentInfo.metodoPago}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '.4rem', justifyContent: 'center' }}>
                          <button
                            onClick={() => navigate(`/tickets/view/${t.id}`)}
                            title="Visualizar Pasaje"
                            style={{
                              border: 'none', background: 'var(--gray-100)', color: 'var(--gray-800)',
                              padding: '.4rem', borderRadius: '6px', cursor: 'pointer', display: 'flex',
                              alignItems: 'center', transition: 'var(--transition)'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-200)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'var(--gray-100)'}
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => navigate(`/tickets/edit/${t.id}`)}
                            title="Editar Pasaje"
                            style={{
                              border: 'none', background: 'rgba(232,160,32,0.1)', color: 'var(--gold-dark)',
                              padding: '.4rem', borderRadius: '6px', cursor: 'pointer', display: 'flex',
                              alignItems: 'center', transition: 'var(--transition)'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(232,160,32,0.2)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(232,160,32,0.1)'}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteId(t.id)}
                            title="Eliminar Pasaje"
                            style={{
                              border: 'none', background: 'rgba(220,38,38,0.1)', color: '#dc2626',
                              padding: '.4rem', borderRadius: '6px', cursor: 'pointer', display: 'flex',
                              alignItems: 'center', transition: 'var(--transition)'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,38,38,0.2)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(220,38,38,0.1)'}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--gray-400)' }}>
                      <Ticket size={42} style={{ margin: '0 auto .75rem', display: 'block', opacity: .35 }} />
                      <p style={{ margin: 0, fontWeight: 500 }}>No se encontraron pasajes</p>
                      <p style={{ margin: '.35rem 0 0', fontSize: '.85rem' }}>
                        {searchTerm ? 'Intente con otro término de búsqueda' : 'Reserve su primer pasaje haciendo clic en el botón superior'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Confirmar Eliminación */}
      {deleteId && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 1000, padding: "1rem",
          backdropFilter: "blur(4px)"
        }}>
          <div className="animate-fade-up" style={{
            background: "#fff", borderRadius: "var(--radius-lg)",
            padding: "2rem", maxWidth: "420px", width: "100%",
            boxShadow: "var(--shadow-xl)", border: "1px solid var(--gray-200)",
            textAlign: "center"
          }}>
            <div style={{ display: 'inline-flex', color: '#dc2626', background: 'rgba(220,38,38,0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
              <AlertTriangle size={36} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--green-dark)", margin: "0 0 .5rem" }}>
              ¿Eliminar Reserva de Pasaje?
            </h3>
            <p style={{ color: "var(--gray-600)", fontSize: ".875rem", lineHeight: 1.5, margin: "0 0 2rem" }}>
              Esta acción es permanente y eliminará la reserva seleccionada de nuestro sistema. ¿Desea continuar?
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setDeleteId(null)}
                style={{
                  flex: 1, background: 'none', border: '1px solid var(--gray-200)', color: 'var(--gray-600)',
                  padding: '.75rem', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                style={{
                  flex: 1, background: '#dc2626', border: 'none', color: '#fff',
                  padding: '.75rem', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(220,38,38,0.3)'
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketsListPage;
