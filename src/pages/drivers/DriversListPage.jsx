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
    <main style={{ minHeight: '100vh', fontFamily: "'Inter', sans-serif", background: 'var(--gray-50)', padding: '2rem', overflow: 'auto' }}>
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
      </main>
  );
};

export default DriversListPage;
