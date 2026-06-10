import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import logo from '../../assets/imagotipo.png';
import { useAuth } from '../../context/AuthContext';
import { useUserData } from '../../hooks/useUserData';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { LayoutDashboard, LogOut, Users, ArrowLeft, Edit2, AlertCircle, ChevronDown, Plus, User, Mail, Phone, FileText, Calendar, Truck, TableProperties } from 'lucide-react';

const ViewDriverPage = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const { userData, loading: dataLoading } = useUserData();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
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
    <main style={{ minHeight: '100vh', fontFamily: "'Inter', sans-serif", background: 'var(--gray-50)', padding: '2rem', overflow: 'auto' }}>
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
  );
};

export default ViewDriverPage;
