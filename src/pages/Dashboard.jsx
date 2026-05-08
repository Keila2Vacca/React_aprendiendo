import { useEffect } from 'react';
import logo from '../assets/imagotipo.png';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../hooks/useUserData';
import { LayoutDashboard, TableProperties, LogOut, Bus, Users, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const { userData, loading: dataLoading } = useUserData();
  const navigate = useNavigate();

  const loading = authLoading || dataLoading;

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

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
    { icon: <Users size={22} />, label: 'Usuarios Activos', value: '—', color: '#2d6a35' },
    { icon: <Clock size={22} />, label: 'Sesiones Hoy', value: '—', color: '#e8a020' },
    { icon: <Bus size={22} />, label: 'Rutas Disponibles', value: '—', color: '#1a4a1f' },
  ];

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
        {/* Brand */}
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

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '.3rem', flex: 1, overflowY: 'auto', marginBottom: '1rem' }}>
          <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', padding: '.5rem 1.25rem .25rem', margin: 0 }}>
            Menú Principal
          </p>

          <button
            id="nav-dashboard"
            className="sidebar-link active"
            onClick={() => navigate('/dashboard')}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>

          <button
            id="nav-sessions"
            className="sidebar-link"
            onClick={() => navigate('/sessions')}
          >
            <TableProperties size={18} /> Ver Sesiones
          </button>
        </nav>

        {/* User + Logout con fpto de perfil */}
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
                {user?.displayName || 'Usuario'}
              </p>
              <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '.7rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email}
              </p>
            </div>
          </div>
          <button
            id="btn-logout"
            className="sidebar-link"
            onClick={logout}
            style={{ color: 'rgba(255,120,120,.9)', width: '100%' }}
          >
            <LogOut size={17} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, background: 'var(--gray-50)', padding: '2rem', overflow: 'auto' }}>
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
          {/* Access log card */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'var(--green-main)18', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-main)' }}>
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
                background: 'linear-gradient(135deg, var(--green-mid), var(--green-dark))',
                color: '#fff', fontWeight: 600, fontSize: '.875rem',
                padding: '.6rem 1.25rem', borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(45,106,53,.3)', transition: 'all .2s',
              }}
            >
              Ver Sesiones
            </Link>
          </div>

          {/* Navigation card */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: '10px', background: '#e8a02018', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e8a020' }}>
                <LayoutDashboard size={20} />
              </div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--green-dark)', margin: 0 }}>
                Navegación Rápida
              </h2>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
              {[
                { label: 'Historial de Sesiones', to: '/sessions' },
                { label: 'Playground de Hooks', to: '/hooks' },
                { label: 'Crear nueva cuenta', to: '/register' },
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
      </main>
    </div>
  );
};

export default Dashboard;
