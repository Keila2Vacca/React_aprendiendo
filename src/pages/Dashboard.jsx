import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../hooks/useUserData';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { LayoutDashboard, TableProperties, Bus, Users, Clock, Ticket } from 'lucide-react';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { userData, loading: dataLoading } = useUserData();
  const [ticketCount, setTicketCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [sessionsCount, setSessionsCount] = useState(0);

  const loading = authLoading || dataLoading;

  useEffect(() => {
    const fetchCounts = async () => {
      if (!user) return;
      try {
        // Fetch user tickets count
        const ticketsSnap = await getDocs(query(collection(db, 'tickets'), where('userId', '==', user.uid)));
        setTicketCount(ticketsSnap.size);

        // Fetch user clients count
        const clientsSnap = await getDocs(query(collection(db, 'clients'), where('userId', '==', user.uid)));
        setClientCount(clientsSnap.size);

        // Fetch sessions count
        const sessionsSnap = await getDocs(query(collection(db, 'userSessions'), where('userId', '==', user.uid)));
        setSessionsCount(sessionsSnap.size);
      } catch (err) {
        console.error("Error fetching dashboard counts:", err);
      }
    };
    if (user) {
      fetchCounts();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="bg-cootrans" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{ width: 48, height: 48, border: '4px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ fontWeight: 500 }}>Cargando...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: <Ticket size={22} />, label: 'Pasajes Reservados', value: ticketCount, color: '#2d6a35' },
    { icon: <Users size={22} />, label: 'Clientes Registrados', value: clientCount, color: '#0284c7' },
    { icon: <Clock size={22} />, label: 'Mis Sesiones', value: sessionsCount, color: '#e8a020' },
    { icon: <LayoutDashboard size={22} />, label: 'Rutas Disponibles', value: '4', color: '#1a4a1f' },
  ];

  return (
    <div style={{ padding: '2rem', overflow: 'auto' }}>
      {/* Header */}
      <div className="animate-fade-up" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ position: 'relative' }}>
          {userData?.photoURL ? (
            <img 
              src={userData.photoURL} 
              alt="Perfil" 
              style={{ width: 70, height: 70, borderRadius: '50%', border: '4px solid #fff', boxShadow: 'var(--shadow-md)' }} 
            />
          ) : (
            <div style={{ 
              width: 70, height: 70, borderRadius: '50%', 
              background: 'var(--green-mid)', color: '#fff', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem', fontWeight: 800, border: '4px solid #fff', boxShadow: 'var(--shadow-md)'
            }}>
              {(userData?.name || user?.email || 'U')[0].toUpperCase()}
            </div>
          )}
          <div style={{ position: 'absolute', bottom: 2, right: 2, width: 16, height: 16, background: '#22c55e', borderRadius: '50%', border: '3px solid #fff' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--green-dark)', margin: '0 0 .25rem' }}>
            Dashboard
          </h1>
          <p style={{ color: 'var(--gray-600)', margin: 0, fontSize: '1.05rem' }}>
            Bienvenido, <strong>{userData?.name || user?.email || 'Usuario'}</strong>
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="animate-fade-up delay-100" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map((s, i) => (
          <div key={i} className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.75rem' }}>
              <div style={{
                width: 42, height: 42, borderRadius: '12px',
                background: `${s.color}18`, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: s.color,
              }}>
                {s.icon}
              </div>
            </div>
            <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--green-dark)', margin: '0 0 .2rem' }}>{s.value}</p>
            <p style={{ fontSize: '.8rem', color: 'var(--gray-600)', margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="animate-fade-up delay-200" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {/* Reserva de Pasajes Card */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'var(--green-main)18', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-main)' }}>
              <Ticket size={20} />
            </div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--green-dark)', margin: 0 }}>
              Reserva de Pasajes
            </h2>
          </div>
          <p style={{ color: 'var(--gray-600)', fontSize: '.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Gestiona pasajes: reserva un nuevo viaje, consulta pasajes adquiridos, edítalos, elimínalos o imprímelos en formato de boardsje.
          </p>
          <div style={{ display: 'flex', gap: '.75rem' }}>
            <Link
              to="/tickets/new"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '.4rem',
                background: 'linear-gradient(135deg, var(--green-mid), var(--green-dark))',
                color: '#fff', fontWeight: 600, fontSize: '.825rem',
                padding: '.5rem 1rem', borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(45,106,53,.25)', transition: 'all .2s',
              }}
            >
              Nueva Reserva
            </Link>
            <Link
              to="/tickets"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '.4rem',
                background: 'var(--gray-100)',
                color: 'var(--gray-800)', fontWeight: 600, fontSize: '.825rem',
                padding: '.5rem 1rem', borderRadius: '8px',
                transition: 'all .2s',
              }}
            >
              Ver Mis Pasajes
            </Link>
          </div>
        </div>

        {/* Gestión de Clientes Card */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '10px', background: '#0284c718', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
              <Users size={20} />
            </div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--green-dark)', margin: 0 }}>
              Gestión de Clientes
            </h2>
          </div>
          <p style={{ color: 'var(--gray-600)', fontSize: '.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Administra clientes: registra nuevos clientes, edítalos, consulta sus datos, elimínalos o mantén un registro actualizado de contactos.
          </p>
          <div style={{ display: 'flex', gap: '.75rem' }}>
            <Link
              to="/clients/new"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '.4rem',
                background: 'linear-gradient(135deg, #0284c7, #1e7ba8)',
                color: '#fff', fontWeight: 600, fontSize: '.825rem',
                padding: '.5rem 1rem', borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(2,132,199,.25)', transition: 'all .2s',
              }}
            >
              Nuevo Cliente
            </Link>
            <Link
              to="/clients"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '.4rem',
                background: 'var(--gray-100)',
                color: 'var(--gray-800)', fontWeight: 600, fontSize: '.825rem',
                padding: '.5rem 1rem', borderRadius: '8px',
                transition: 'all .2s',
              }}
            >
              Ver Clientes
            </Link>
          </div>
        </div>

        {/* Access log card */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '10px', background: '#e8a02018', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e8a020' }}>
              <TableProperties size={20} />
            </div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--green-dark)', margin: 0 }}>
              Accesos a la Aplicación
            </h2>
          </div>
          <p style={{ color: 'var(--gray-600)', fontSize: '.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Visualiza el registro completo de sesiones: entradas, salidas, métodos de autenticación y estado.
          </p>
          <Link
            id="link-sessions"
            to="/sessions"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '.4rem',
              background: 'linear-gradient(135deg, #e8a020, #c88010)',
              color: '#fff', fontWeight: 600, fontSize: '.875rem',
              padding: '.6rem 1.25rem', borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(232,160,32,.3)', transition: 'all .2s',
            }}
          >
            Ver Sesiones
          </Link>
        </div>

        {/* Navigation card */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(26,74,31,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-dark)' }}>
              <LayoutDashboard size={20} />
            </div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--green-dark)', margin: 0 }}>
              Navegación Rápida
            </h2>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
            {[
              { label: 'Reservar un nuevo pasaje', to: '/tickets/new' },
              { label: 'Listado de mis pasajes', to: '/tickets' },
              { label: 'Nuevo cliente', to: '/clients/new' },
              { label: 'Gestión de clientes', to: '/clients' },
              { label: 'Historial de Sesiones', to: '/sessions' },
              { label: 'Playground de Hooks', to: '/hooks' },
            ].map((item, i) => (
              <li key={i}>
                <Link
                  to={item.to}
                  style={{ color: 'var(--green-main)', fontWeight: 600, fontSize: '.875rem', display: 'flex', alignItems: 'center', gap: '.4rem' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--green-dark)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--green-main)'}
                >
                  → {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
