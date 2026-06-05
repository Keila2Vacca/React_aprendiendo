import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import logo from '../../assets/imagotipo.png';
import { useAuth } from '../../context/AuthContext';
import { useUserData } from '../../hooks/useUserData';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { LayoutDashboard, LogOut, Users, ArrowLeft, CheckCircle2, AlertCircle, ChevronDown, Plus } from 'lucide-react';

const EditDriverPage = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const { userData, loading: dataLoading } = useUserData();
  const { id } = useParams();
  const navigate = useNavigate();
  const [expandedMenu, setExpandedMenu] = useState(false);

  const [formData, setFormData] = useState({
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    documento: '',
    telefono: '',
    email: '',
    genero: 'Masculino',
    fechaNacimiento: '',
    numeroLicencia: '',
    categoriaLicencia: 'A',
    fechaVencimientoLicencia: '',
    placa: '',
    marcaVehiculo: '',
    modeloVehiculo: '',
    status: 'activo',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Load driver details
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'drivers', id));
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // Verify ownership
          if (data.userId !== user?.uid) {
            setError("No tienes autorización para editar este conductor.");
            setLoading(false);
            return;
          }

          setFormData({
            primerNombre: data.driverInfo.primerNombre || '',
            segundoNombre: data.driverInfo.segundoNombre || '',
            primerApellido: data.driverInfo.primerApellido || '',
            segundoApellido: data.driverInfo.segundoApellido || '',
            documento: data.driverInfo.documento || '',
            telefono: data.driverInfo.telefono || '',
            email: data.driverInfo.email || '',
            genero: data.driverInfo.genero || 'Masculino',
            fechaNacimiento: data.driverInfo.fechaNacimiento || '',
            numeroLicencia: data.licenseInfo?.numeroLicencia || '',
            categoriaLicencia: data.licenseInfo?.categoriaLicencia || 'A',
            fechaVencimientoLicencia: data.licenseInfo?.fechaVencimiento || '',
            placa: data.vehicleInfo?.placa || '',
            marcaVehiculo: data.vehicleInfo?.marca || '',
            modeloVehiculo: data.vehicleInfo?.modelo || '',
            status: data.status || 'activo',
          });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validaciones
    if (!formData.primerNombre || !formData.primerApellido || !formData.documento || !formData.telefono || !formData.email) {
      setError('Por favor complete todos los campos obligatorios (*)');
      return;
    }

    if (!/^\d+$/.test(formData.documento)) {
      setError('El documento debe contener solo números.');
      return;
    }

    if (!/^\d+$/.test(formData.telefono) || formData.telefono.length !== 10) {
      setError('El teléfono debe tener exactamente 10 dígitos.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Por favor ingrese un email válido.');
      return;
    }

    if (formData.numeroLicencia && !/^\d+$/.test(formData.numeroLicencia)) {
      setError('El número de licencia debe contener solo números.');
      return;
    }

    setSaving(true);

    try {
      await updateDoc(doc(db, 'drivers', id), {
        driverInfo: {
          primerNombre: formData.primerNombre,
          segundoNombre: formData.segundoNombre,
          primerApellido: formData.primerApellido,
          segundoApellido: formData.segundoApellido,
          documento: formData.documento,
          telefono: formData.telefono,
          email: formData.email,
          genero: formData.genero,
          fechaNacimiento: formData.fechaNacimiento,
        },
        licenseInfo: {
          numeroLicencia: formData.numeroLicencia,
          categoriaLicencia: formData.categoriaLicencia,
          fechaVencimiento: formData.fechaVencimientoLicencia,
        },
        vehicleInfo: {
          placa: formData.placa,
          marca: formData.marcaVehiculo,
          modelo: formData.modeloVehiculo,
        },
        status: formData.status,
        updatedAt: serverTimestamp(),
      });

      setSuccess(true);
      setTimeout(() => {
        navigate(`/drivers/view/${id}`);
      }, 1500);
    } catch (err) {
      console.error("Error updating driver:", err);
      setError('Error al actualizar el conductor. Por favor intente nuevamente.');
    } finally {
      setSaving(false);
    }
  };

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
        <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
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
              Editar Conductor
            </h1>
          </div>
        </div>

        {/* Form Card */}
        <div className="animate-fade-up delay-100" style={{
          background: '#fff', borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)', border: '1px solid var(--gray-200)',
          padding: '2rem', maxWidth: 900
        }}>
          {error && (
            <div style={{
              padding: '.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem',
              display: 'flex', alignItems: 'center', gap: '.75rem', fontSize: '.875rem',
              background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{
              padding: '.75rem 1rem', borderRadius: '10px', marginBottom: '1.25rem',
              display: 'flex', alignItems: 'center', gap: '.75rem', fontSize: '.875rem',
              background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0'
            }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>¡Conductor actualizado exitosamente! Redirigiendo...</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Información Personal */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '1rem', paddingBottom: '.75rem', borderBottom: '2px solid var(--green-50)' }}>
                Información Personal
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '.5rem' }}>
                    Primer Nombre <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="primerNombre"
                    value={formData.primerNombre}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '.5rem' }}>
                    Segundo Nombre
                  </label>
                  <input
                    type="text"
                    name="segundoNombre"
                    value={formData.segundoNombre}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '.5rem' }}>
                    Primer Apellido <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="primerApellido"
                    value={formData.primerApellido}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '.5rem' }}>
                    Segundo Apellido
                  </label>
                  <input
                    type="text"
                    name="segundoApellido"
                    value={formData.segundoApellido}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '.5rem' }}>
                    Documento <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="documento"
                    value={formData.documento}
                    onChange={handleChange}
                    placeholder="Sin puntos ni guiones"
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '.5rem' }}>
                    Email <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '.5rem' }}>
                    Teléfono <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="10 dígitos"
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '.5rem' }}>
                    Género
                  </label>
                  <select
                    name="genero"
                    value={formData.genero}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '.5rem' }}>
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Información de Licencia */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '1rem', paddingBottom: '.75rem', borderBottom: '2px solid var(--green-50)' }}>
                Información de Licencia
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '.5rem' }}>
                    Número de Licencia
                  </label>
                  <input
                    type="text"
                    name="numeroLicencia"
                    value={formData.numeroLicencia}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '.5rem' }}>
                    Categoría de Licencia
                  </label>
                  <select
                    name="categoriaLicencia"
                    value={formData.categoriaLicencia}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '.5rem' }}>
                    Fecha de Vencimiento
                  </label>
                  <input
                    type="date"
                    name="fechaVencimientoLicencia"
                    value={formData.fechaVencimientoLicencia}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Información del Vehículo */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '1rem', paddingBottom: '.75rem', borderBottom: '2px solid var(--green-50)' }}>
                Información del Vehículo (Opcional)
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '.5rem' }}>
                    Placa
                  </label>
                  <input
                    type="text"
                    name="placa"
                    value={formData.placa}
                    onChange={handleChange}
                    placeholder="Ej: ABC123"
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '.5rem' }}>
                    Marca del Vehículo
                  </label>
                  <input
                    type="text"
                    name="marcaVehiculo"
                    value={formData.marcaVehiculo}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '.5rem' }}>
                    Modelo del Vehículo
                  </label>
                  <input
                    type="text"
                    name="modeloVehiculo"
                    value={formData.modeloVehiculo}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Estado */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '1rem', paddingBottom: '.75rem', borderBottom: '2px solid var(--green-50)' }}>
                Estado
              </h2>

              <div>
                <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '.5rem' }}>
                  Estado del Conductor
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--gray-200)' }}>
              <Link
                to="/drivers"
                style={{
                  padding: '.6rem 1.5rem', borderRadius: '8px', border: '1px solid var(--gray-300)',
                  background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '.875rem',
                  transition: 'all 0.2s', color: 'var(--gray-700)', textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: '.6rem 1.5rem', borderRadius: '8px', background: 'var(--green-dark)', color: '#fff',
                  border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '.875rem',
                  transition: 'all 0.2s', opacity: saving ? 0.7 : 1
                }}
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditDriverPage;
