import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import logo from '../../assets/imagotipo.png';
import { useAuth } from '../../context/AuthContext';
import { useUserData } from '../../hooks/useUserData';
import { db } from '../../firebase';
import { collection, getDocs, query, where, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { LayoutDashboard, TableProperties, LogOut, Users, Search, Eye, Edit2, Trash2, Plus, AlertTriangle, CheckCircle2, ChevronDown } from 'lucide-react';

const DriversListPage = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const { userData, loading: dataLoading } = useUserData();
  const navigate = useNavigate();
  const location = useLocation();

  const [drivers, setDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [expandedMenu, setExpandedMenu] = useState(false);

  useEffect(() => {
    const fetchDrivers = async () => {
      if (!user) {
        setDrivers([]);
        setLoading(false);
        return;
      }
      try {
        console.log("Fetching drivers for user:", user.uid);
        const q = query(
          collection(db, 'drivers'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        console.log("Drivers found:", snap.size);
        setDrivers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching drivers:", err);
        // Si hay error con orderBy, intentar sin ordenar
        try {
          console.log("Retrying without orderBy...");
          const q = query(
            collection(db, 'drivers'),
            where('userId', '==', user.uid)
          );
          const snap = await getDocs(q);
          console.log("Drivers found (no orderBy):", snap.size);
          const driversData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          // Ordenar en el cliente
          driversData.sort((a, b) => {
            const timeA = a.createdAt?.seconds || 0;
            const timeB = b.createdAt?.seconds || 0;
            return timeB - timeA;
          });
          setDrivers(driversData);
        } catch (retryErr) {
          console.error("Error fetching drivers (retry):", retryErr);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, [user]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDoc(doc(db, 'drivers', deleteId));
      setDrivers(drivers.filter(d => d.id !== deleteId));
      setSuccessMsg('Conductor eliminado correctamente.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error("Error deleting driver:", err);
    } finally {
      setDeleteId(null);
    }
  };

  const filteredDrivers = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return drivers;
    return drivers.filter(d => {
      const driverInfo = d.driverInfo;
      const fullName = `${driverInfo.primerNombre} ${driverInfo.segundoNombre || ''} ${driverInfo.primerApellido} ${driverInfo.segundoApellido || ''}`.toLowerCase();
      const document = (driverInfo.documento || '').toLowerCase();
      const phone = (driverInfo.telefono || '').toLowerCase();
      const license = (d.licenseInfo?.numeroLicencia || '').toLowerCase();
      return fullName.includes(search) || document.includes(search) || phone.includes(search) || license.includes(search);
    });
  }, [drivers, searchTerm]);

  if (loading || authLoading) {
    return (
      <div className="bg-cootrans" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{ width: 48, height: 48, border: '4px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ fontWeight: 500 }}>Cargando conductores...</p>
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
            <TableProperties size={18} /> Ver Pasajes
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
                className={`sidebar-link ${location.pathname === '/drivers/new' ? 'active' : ''}`}
                style={{ fontSize: '.85rem', paddingLeft: '.75rem' }}
              >
                <Plus size={16} /> Agregar Conductor
              </Link>
              <Link
                to="/drivers"
                className={`sidebar-link ${location.pathname === '/drivers' ? 'active' : ''}`}
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
        {/* Header */}
        <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--green-dark)', margin: 0 }}>
              Gestión de Conductores
            </h1>
            <p style={{ color: 'var(--gray-600)', margin: '.25rem 0 0', fontSize: '.875rem' }}>
              {filteredDrivers.length} conductor{filteredDrivers.length !== 1 ? 'es' : ''} encontrado{filteredDrivers.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            to="/drivers/new"
            className="btn-gold"
            style={{ padding: '.6rem 1.25rem', borderRadius: '8px', fontSize: '.875rem' }}
          >
            <Plus size={16} /> Agregar Conductor
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
            id="drivers-search"
            type="text"
            placeholder="Buscar por nombre, documento, teléfono o licencia..."
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
                  <th>Conductor</th>
                  <th>Documento</th>
                  <th>Teléfono</th>
                  <th>Licencia</th>
                  <th>Vehículo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.length > 0 ? (
                  filteredDrivers.map(driver => (
                    <tr key={driver.id} style={{ borderBottom: '1px solid var(--gray-200)', transition: 'background 0.2s' }}>
                      <td>
                        <div style={{ fontWeight: 500, color: 'var(--gray-900)' }}>
                          {`${driver.driverInfo.primerNombre} ${driver.driverInfo.primerApellido}`}
                        </div>
                        <div style={{ fontSize: '.8rem', color: 'var(--gray-500)', marginTop: '.2rem' }}>
                          {driver.driverInfo.email || ''}
                        </div>
                      </td>
                      <td>{driver.driverInfo.documento}</td>
                      <td>{driver.driverInfo.telefono}</td>
                      <td>{driver.licenseInfo?.numeroLicencia || '-'}</td>
                      <td>{driver.vehicleInfo?.placa || '-'}</td>
                      <td>
                        <span style={{
                          padding: '.3rem .6rem', borderRadius: '4px', fontSize: '.75rem', fontWeight: 600,
                          background: driver.status === 'activo' ? '#dbeafe' : '#fee2e2',
                          color: driver.status === 'activo' ? '#0c4a6e' : '#7f1d1d'
                        }}>
                          {driver.status === 'activo' ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td style={{ display: 'flex', gap: '.5rem', justifyContent: 'center' }}>
                        <Link
                          to={`/drivers/view/${driver.id}`}
                          style={{
                            padding: '.4rem .6rem', borderRadius: '4px', background: 'var(--blue-50)',
                            border: '1px solid var(--blue-200)', cursor: 'pointer', display: 'inline-flex',
                            alignItems: 'center', gap: '.3rem', color: 'var(--blue-600)', fontSize: '.75rem',
                            fontWeight: 500, transition: 'all 0.2s'
                          }}
                          className="hover-btn"
                        >
                          <Eye size={14} /> Ver
                        </Link>
                        <Link
                          to={`/drivers/edit/${driver.id}`}
                          style={{
                            padding: '.4rem .6rem', borderRadius: '4px', background: 'var(--amber-50)',
                            border: '1px solid var(--amber-200)', cursor: 'pointer', display: 'inline-flex',
                            alignItems: 'center', gap: '.3rem', color: 'var(--amber-600)', fontSize: '.75rem',
                            fontWeight: 500, transition: 'all 0.2s'
                          }}
                          className="hover-btn"
                        >
                          <Edit2 size={14} /> Editar
                        </Link>
                        <button
                          onClick={() => setDeleteId(driver.id)}
                          style={{
                            padding: '.4rem .6rem', borderRadius: '4px', background: 'var(--red-50)',
                            border: '1px solid var(--red-200)', cursor: 'pointer', display: 'inline-flex',
                            alignItems: 'center', gap: '.3rem', color: 'var(--red-600)', fontSize: '.75rem',
                            fontWeight: 500, transition: 'all 0.2s'
                          }}
                          className="hover-btn"
                        >
                          <Trash2 size={14} /> Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-500)' }}>
                      No hay conductores registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ── Modal de Confirmación de Eliminación ── */}
      {deleteId && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#fff', borderRadius: '12px', padding: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,.3)',
            maxWidth: 400, textAlign: 'center'
          }}>
            <AlertTriangle size={48} style={{ margin: '0 auto 1rem', color: '#dc2626' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 .5rem', color: 'var(--gray-900)' }}>
              Confirmar eliminación
            </h2>
            <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem', fontSize: '.875rem' }}>
              ¿Está seguro de que desea eliminar este conductor? Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteId(null)}
                style={{
                  padding: '.6rem 1.25rem', borderRadius: '8px', border: '1px solid var(--gray-300)',
                  background: '#fff', cursor: 'pointer', fontWeight: 500, fontSize: '.875rem',
                  transition: 'all 0.2s'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: '.6rem 1.25rem', borderRadius: '8px', background: '#dc2626', color: '#fff',
                  border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '.875rem',
                  transition: 'all 0.2s'
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

export default DriversListPage;
