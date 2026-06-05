import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import logo from '../../assets/imagotipo.png';
import { useAuth } from '../../context/AuthContext';
import { useUserData } from '../../hooks/useUserData';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { LayoutDashboard, LogOut, Users, ArrowLeft, Edit2, AlertCircle, ChevronDown, Plus, User, Mail, Phone, FileText, Calendar, Truck } from 'lucide-react';

const ViewDriverPage = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const { userData, loading: dataLoading } = useUserData();
  const { id } = useParams();
  const navigate = useNavigate();
  const [expandedMenu, setExpandedMenu] = useState(false);

  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar conductor
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'drivers', id));
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Validar pertenencia
          if (data.userId !== user?.uid) {
            setError("No tienes autorización para ver este conductor.");
            setLoading(false);
            return;
          }
          setDriver(data);
        } else {
          setError("El conductor no existe.");
        }
      } catch (err) {
        console.error("Error fetching driver:", err);
        setError("Error al cargar el conductor.");
      } finally {
        setLoading(false);
      }
    };
    if (id && user) {
      fetchDriver();
    }
  }, [id, user]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const InfoCard = ({ icon: Icon, title, children }) => (
    <div style={{
      background: '#fff', borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-md)', border: '1px solid var(--gray-200)',
      padding: '1.5rem', marginBottom: '1.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--gray-200)' }}>
        <div style={{ padding: '.5rem', background: 'var(--green-50)', borderRadius: '8px', color: 'var(--green-dark)' }}>
          <Icon size={20} />
        </div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gray-900)', margin: 0 }}>
          {title}
        </h2>
      </div>
      <div>{children}</div>
    </div>
  );

  const InfoField = ({ label, value }) => (
    <div style={{ marginBottom: '1rem' }}>
      <p style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '.05em', margin: '0 0 .3rem' }}>
        {label}
      </p>
      <p style={{ fontSize: '.95rem', fontWeight: 500, color: 'var(--gray-900)', margin: 0 }}>
        {value || '-'}
      </p>
    </div>
  );

  if (loading || authLoading || dataLoading) {
    return (
      <div className="bg-cootrans" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{ width: 48, height: 48, border: '4px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ fontWeight: 500 }}>Cargando conductor...</p>
        </div>
      </div>
    );
  }

  if (error || !driver) {
    return (
      <div className="bg-cootrans" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#fff', background: 'rgba(220,38,38,.2)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(220,38,38,.3)' }}>
          <AlertCircle size={48} style={{ marginBottom: '1rem', color: '#fca5a5' }} />
          <p style={{ fontWeight: 500, fontSize: '1.1rem' }}>{error}</p>
          <Link
            to="/drivers"
            style={{
              marginTop: '1rem', padding: '.6rem 1.5rem', borderRadius: '8px',
              background: '#fff', color: 'var(--green-dark)', fontWeight: 600,
              fontSize: '.875rem', textDecoration: 'none', display: 'inline-block'
            }}
          >
            Volver al Listado
          </Link>
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
            <Plus size={18} /> Reservar Pasaje
          </Link>

          <Link to="/tickets" className="sidebar-link">
            <LayoutDashboard size={18} /> Ver Pasajes
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
            <LayoutDashboard size={18} /> Ver Sesiones
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link
              to="/drivers"
              style={{
                padding: '.4rem .6rem', borderRadius: '6px', background: 'rgba(0,0,0,.05)',
                display: 'inline-flex', alignItems: 'center', gap: '.4rem', color: 'var(--gray-700)',
                fontSize: '.875rem', fontWeight: 500, transition: 'all 0.2s', border: 'none', cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} /> Volver
            </Link>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--green-dark)', margin: 0 }}>
                {`${driver.driverInfo.primerNombre} ${driver.driverInfo.primerApellido}`}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginTop: '.25rem' }}>
                <span style={{
                  padding: '.2rem .6rem', borderRadius: '4px', fontSize: '.75rem', fontWeight: 600,
                  background: driver.status === 'activo' ? '#dbeafe' : '#fee2e2',
                  color: driver.status === 'activo' ? '#0c4a6e' : '#7f1d1d'
                }}>
                  {driver.status === 'activo' ? '✓ Activo' : '● Inactivo'}
                </span>
              </div>
            </div>
          </div>
          <Link
            to={`/drivers/edit/${id}`}
            style={{
              padding: '.6rem 1.25rem', borderRadius: '8px', background: 'var(--amber-50)',
              border: '1px solid var(--amber-200)', cursor: 'pointer', display: 'inline-flex',
              alignItems: 'center', gap: '.5rem', color: 'var(--amber-600)', fontSize: '.875rem',
              fontWeight: 600, transition: 'all 0.2s', textDecoration: 'none'
            }}
          >
            <Edit2 size={16} /> Editar
          </Link>
        </div>

        {/* Información Personal */}
        <InfoCard icon={User} title="Información Personal">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <InfoField
              label="Nombre Completo"
              value={`${driver.driverInfo.primerNombre} ${driver.driverInfo.segundoNombre || ''} ${driver.driverInfo.primerApellido} ${driver.driverInfo.segundoApellido || ''}`.trim()}
            />
            <InfoField
              label="Documento"
              value={driver.driverInfo.documento}
            />
            <InfoField
              label="Email"
              value={driver.driverInfo.email}
            />
            <InfoField
              label="Teléfono"
              value={driver.driverInfo.telefono}
            />
            <InfoField
              label="Género"
              value={driver.driverInfo.genero}
            />
            <InfoField
              label="Fecha de Nacimiento"
              value={formatDate(driver.driverInfo.fechaNacimiento)}
            />
          </div>
        </InfoCard>

        {/* Información de Licencia */}
        <InfoCard icon={FileText} title="Información de Licencia">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <InfoField
              label="Número de Licencia"
              value={driver.licenseInfo?.numeroLicencia}
            />
            <InfoField
              label="Categoría"
              value={driver.licenseInfo?.categoriaLicencia}
            />
            <InfoField
              label="Fecha de Vencimiento"
              value={formatDate(driver.licenseInfo?.fechaVencimiento)}
            />
          </div>
        </InfoCard>

        {/* Información del Vehículo */}
        {(driver.vehicleInfo?.placa || driver.vehicleInfo?.marca || driver.vehicleInfo?.modelo) && (
          <InfoCard icon={Truck} title="Información del Vehículo">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <InfoField
                label="Placa"
                value={driver.vehicleInfo?.placa}
              />
              <InfoField
                label="Marca"
                value={driver.vehicleInfo?.marca}
              />
              <InfoField
                label="Modelo"
                value={driver.vehicleInfo?.modelo}
              />
            </div>
          </InfoCard>
        )}

        {/* Metadatos */}
        <div style={{
          background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)',
          padding: '1rem', border: '1px solid var(--gray-200)', marginBottom: '1.5rem'
        }}>
          <p style={{ fontSize: '.75rem', color: 'var(--gray-500)', margin: '0 0 .5rem' }}>
            Información del Registro
          </p>
          <div style={{ fontSize: '.8rem', color: 'var(--gray-600)', fontFamily: 'monospace' }}>
            <p style={{ margin: '0.25rem 0' }}>
              ID: {id}
            </p>
            <p style={{ margin: '0.25rem 0' }}>
              Creado: {driver.createdAt ? new Date(driver.createdAt.seconds * 1000).toLocaleString('es-CO') : '-'}
            </p>
            <p style={{ margin: '0.25rem 0' }}>
              Última actualización: {driver.updatedAt ? new Date(driver.updatedAt.seconds * 1000).toLocaleString('es-CO') : '-'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewDriverPage;
