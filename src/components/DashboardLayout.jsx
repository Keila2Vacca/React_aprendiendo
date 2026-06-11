import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/imagotipo.png';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../hooks/useUserData';
import { LayoutDashboard, Ticket, Bus, TableProperties, Users, LogOut } from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { userData } = useUserData();
  const navigate = useNavigate();

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
            className="sidebar-link"
            onClick={() => navigate('/dashboard')}
            style={{ color: '#fff', padding: '0.75rem 1.25rem', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500, fontSize: '0.9rem' }}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>

          <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', padding: '.5rem 1.25rem .25rem', margin: '0.5rem 0 0' }}>
            Pasajes
          </p>

          <button
            className="sidebar-link"
            onClick={() => navigate('/tickets/new')}
            style={{ color: '#fff', padding: '0.75rem 1.25rem', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500, fontSize: '0.9rem' }}
          >
            <Ticket size={18} /> Reservar Pasaje
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate('/tickets')}
            style={{ color: '#fff', padding: '0.75rem 1.25rem', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500, fontSize: '0.9rem' }}
          >
            <Bus size={18} /> Mis Pasajes
          </button>

          <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', padding: '.5rem 1.25rem .25rem', margin: '0.5rem 0 0' }}>
            Clientes
          </p>

          <button
            className="sidebar-link"
            onClick={() => navigate('/clients/new')}
            style={{ color: '#fff', padding: '0.75rem 1.25rem', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500, fontSize: '0.9rem' }}
          >
            <Users size={18} /> Nuevo Cliente
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate('/clients')}
            style={{ color: '#fff', padding: '0.75rem 1.25rem', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500, fontSize: '0.9rem' }}
          >
            <Bus size={18} /> Gestión de Clientes
          </button>

          <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', padding: '.5rem 1.25rem .25rem', margin: '0.5rem 0 0' }}>
            Conductores
          </p>

          <button
            className="sidebar-link"
            onClick={() => navigate('/drivers/new')}
            style={{ color: '#fff', padding: '0.75rem 1.25rem', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500, fontSize: '0.9rem' }}
          >
            <Users size={18} /> Nuevo Conductor
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate('/drivers')}
            style={{ color: '#fff', padding: '0.75rem 1.25rem', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500, fontSize: '0.9rem' }}
          >
            <Bus size={18} /> Listado de Conductores
          </button>

          <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', padding: '.5rem 1.25rem .25rem', margin: '0.5rem 0 0' }}>
            Sistema
          </p>

          <button
            className="sidebar-link"
            onClick={() => navigate('/sessions')}
            style={{ color: '#fff', padding: '0.75rem 1.25rem', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500, fontSize: '0.9rem' }}
          >
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
                {user?.displayName || 'Usuario'}
              </p>
              <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '.7rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email}
              </p>
            </div>
          </div>
          <button
            className="sidebar-link"
            onClick={logout}
            style={{ color: 'rgba(255,120,120,.9)', width: '100%', padding: '0.75rem 1.25rem', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500, fontSize: '0.9rem' }}
          >
            <LogOut size={17} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, background: 'var(--gray-50)', overflow: 'auto' }}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
