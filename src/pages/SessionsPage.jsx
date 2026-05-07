import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/imagotipo.png';
import { db, auth } from '../firebase';
import { collection, getDocs, query, orderBy, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../hooks/useUserData';
import { signOut } from 'firebase/auth';
import { LayoutDashboard, TableProperties, LogOut, Bus, Search, ArrowLeft } from 'lucide-react';

const SessionsPage = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const { userData, loading: dataLoading } = useUserData();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const sidebarLoading = authLoading || dataLoading;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const filteredSessions = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return sessions;
    return sessions.filter(
      (s) =>
        s.userName?.toLowerCase().includes(search) ||
        s.userEmail?.toLowerCase().includes(search) ||
        s.authMethod?.toLowerCase().includes(search)
    );
  }, [sessions, searchTerm]);

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) { setSessions([]); setLoading(false); return; }
      const q = query(collection(db, 'userSessions'), orderBy('loginTime', 'desc'));
      const snap = await getDocs(q);
      setSessions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchSessions();
  }, [user]);

  const formatDate = (ts) => {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString('es-CO');
  };

  const formatDuration = (ms) => {
    if (!ms) return '—';
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${m}m ${s}s`;
  };

  if (loading || authLoading) {
    return (
      <div className="bg-cootrans" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{ width: 48, height: 48, border: '4px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ fontWeight: 500 }}>Cargando sesiones...</p>
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
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '2rem', padding: '0 .25rem' }}>
          <div style={{
            width: 42, height: 42, borderRadius: '50%',
            background: 'rgba(255,255,255,.15)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem',
            border: '1.5px solid rgba(255,255,255,.25)',
          }}>
            <span style={{ fontSize: '2.2rem' }}>
              <img src={logo} alt="Logo" />
            </span>
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

          <button id="nav-dashboard" className="sidebar-link" onClick={() => navigate('/dashboard')}>
            <LayoutDashboard size={18} /> Dashboard
          </button>

          <button id="nav-sessions" className="sidebar-link active" onClick={() => navigate('/sessions')}>
            <TableProperties size={18} /> Ver Sesiones
          </button>
        </nav>

        {/* User + Logout */}
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
          <button id="btn-logout" className="sidebar-link" onClick={handleLogout}
            style={{ color: 'rgba(255,120,120,.9)', width: '100%' }}>
            <LogOut size={17} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, background: 'var(--gray-50)', padding: '2rem', overflow: 'auto' }}>

        {/* Header */}
        <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '.35rem' }}>
              <Link
                to="/dashboard"
                id="back-to-dashboard"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '.3rem',
                  fontSize: '.8rem', color: 'var(--green-main)', fontWeight: 600,
                  transition: 'color .2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--green-dark)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--green-main)'}
              >
                <ArrowLeft size={14} /> Volver al Dashboard
              </Link>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--green-dark)', margin: 0 }}>
              Registro de Sesiones
            </h1>
            <p style={{ color: 'var(--gray-600)', margin: '.25rem 0 0', fontSize: '.875rem' }}>
              {filteredSessions.length} registro{filteredSessions.length !== 1 ? 's' : ''} encontrado{filteredSessions.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="animate-fade-up delay-100" style={{ position: 'relative', marginBottom: '1.25rem', maxWidth: 480 }}>
          <Search size={17} style={{ position: 'absolute', left: '.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
          <input
            id="sessions-search"
            type="text"
            placeholder="Buscar por nombre, correo o método de acceso..."
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
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Hora de Entrada</th>
                  <th>Hora de Salida</th>
                  <th>Duración</th>
                  <th>Método</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.length > 0 ? (
                  filteredSessions.map((session) => (
                    <tr key={session.id}>
                      <td style={{ fontWeight: 600 }}>{session.userName || '—'}</td>
                      <td style={{ color: 'var(--gray-600)' }}>{session.userEmail || '—'}</td>
                      <td>{formatDate(session.loginTime)}</td>
                      <td>{formatDate(session.logoutTime)}</td>
                      <td>{formatDuration(session.sessionDuration)}</td>
                      <td>
                        <span style={{
                          display: 'inline-block',
                          padding: '.2rem .7rem',
                          borderRadius: '99px',
                          fontSize: '.78rem',
                          fontWeight: 600,
                          background: 'var(--gray-100)',
                          color: 'var(--gray-800)',
                          textTransform: 'capitalize',
                        }}>
                          {session.authMethod || '—'}
                        </span>
                      </td>
                      <td>
                        <span className={session.status === 'active' ? 'badge-active' : 'badge-inactive'}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                          {session.status === 'active' ? 'Activa' : 'Inactiva'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--gray-400)' }}>
                      <Bus size={36} style={{ margin: '0 auto .75rem', display: 'block', opacity: .35 }} />
                      <p style={{ margin: 0, fontWeight: 500 }}>No se encontraron registros</p>
                      {searchTerm && (
                        <p style={{ margin: '.35rem 0 0', fontSize: '.85rem' }}>
                          Intente con otro término de búsqueda
                        </p>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SessionsPage;