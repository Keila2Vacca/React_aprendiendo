import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

const EditClientPage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    documento: '',
    telefono: '',
    email: '',
    empresa: '',
    direccion: '',
    ciudad: '',
    genero: 'Masculino',
    fechaNacimiento: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'clients', id));
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          if (data.userId !== user?.uid) {
            setError("No tienes autorización para editar este cliente.");
            setLoading(false);
            return;
          }

          setFormData({
            primerNombre: data.primerNombre || '',
            segundoNombre: data.segundoNombre || '',
            primerApellido: data.primerApellido || '',
            segundoApellido: data.segundoApellido || '',
            documento: data.documento || '',
            telefono: data.telefono || '',
            email: data.email || '',
            empresa: data.empresa || '',
            direccion: data.direccion || '',
            ciudad: data.ciudad || '',
            genero: data.genero || 'Masculino',
            fechaNacimiento: data.fechaNacimiento || '',
          });
        } else {
          setError("El cliente no existe.");
        }
      } catch (err) {
        console.error("Error fetching client:", err);
        setError("Error al cargar el cliente.");
      } finally {
        setLoading(false);
      }
    };
    if (id && user) {
      fetchClient();
    }
  }, [id, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === 'documento') {
      finalValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    }

    if (name === 'telefono') {
      finalValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    }

    setFormData({
      ...formData,
      [name]: finalValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.primerNombre || !formData.primerApellido || !formData.documento || !formData.telefono || !formData.email) {
      setError('Por favor complete todos los campos obligatorios (*)');
      return;
    }

    if (!formData.documento || formData.documento.length !== 10) {
      setError('El documento debe tener exactamente 10 dígitos.');
      return;
    }

    if (formData.telefono.length !== 10) {
      setError('El teléfono debe tener exactamente 10 dígitos.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Por favor ingresa un email válido.');
      return;
    }

    setSaving(true);
    try {
      await updateDoc(doc(db, 'clients', id), {
        ...formData,
        updatedAt: serverTimestamp(),
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/clients');
      }, 2000);
    } catch (err) {
      console.error("Error updating client:", err);
      setError('Error al actualizar el cliente. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '4px solid #e5e7eb', borderTopColor: '#123456', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: '#6b7280' }}>Cargando cliente...</p>
        </div>
      </div>
    );
  }

  if (error && !success) {
    return (
      <div style={{ padding: '2rem', backgroundColor: '#fee2e2', borderRadius: '0.5rem', color: '#991b1b', textAlign: 'center' }}>
        <p style={{ marginBottom: '1rem' }}>{error}</p>
        <Link to="/clients" style={{ backgroundColor: '#991b1b', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.375rem', textDecoration: 'none', display: 'inline-block' }}>
          Volver a Clientes
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 1rem' }}>
      <Link to="/clients" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0284c7', textDecoration: 'none', marginBottom: '2rem', fontWeight: 500 }}>
        <ArrowLeft size={18} /> Volver a Clientes
      </Link>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>Editar Cliente</h1>
        <p style={{ color: '#6b7280' }}>Actualiza la información del cliente</p>
      </div>

      {success && (
        <div style={{ backgroundColor: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#047857' }}>
          <CheckCircle2 size={20} />
          Cliente actualizado exitosamente. Redirigiendo...
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#991b1b' }}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,.1)', padding: '2rem', maxWidth: '900px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Información Personal</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151', fontSize: '0.875rem' }}>
                Primer Nombre <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                name="primerNombre"
                value={formData.primerNombre}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                placeholder="Juan"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151', fontSize: '0.875rem' }}>
                Segundo Nombre
              </label>
              <input
                type="text"
                name="segundoNombre"
                value={formData.segundoNombre}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                placeholder="Carlos"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151', fontSize: '0.875rem' }}>
                Primer Apellido <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                name="primerApellido"
                value={formData.primerApellido}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                placeholder="Pérez"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151', fontSize: '0.875rem' }}>
                Segundo Apellido
              </label>
              <input
                type="text"
                name="segundoApellido"
                value={formData.segundoApellido}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                placeholder="García"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151', fontSize: '0.875rem' }}>
                Género
              </label>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
              >
                <option>Masculino</option>
                <option>Femenino</option>
                <option>Otro</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151', fontSize: '0.875rem' }}>
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
              />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Información de Contacto</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151', fontSize: '0.875rem' }}>
                Documento <span style={{ color: '#dc2626' }}>*</span> (10 dígitos)
              </label>
              <input
                type="text"
                name="documento"
                value={formData.documento}
                onChange={handleChange}
                maxLength="10"
                style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                placeholder="1234567890"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151', fontSize: '0.875rem' }}>
                Teléfono <span style={{ color: '#dc2626' }}>*</span> (10 dígitos)
              </label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                maxLength="10"
                style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                placeholder="3001234567"
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151', fontSize: '0.875rem' }}>
              Email <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
              placeholder="cliente@example.com"
            />
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Información Empresarial</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151', fontSize: '0.875rem' }}>
                Empresa
              </label>
              <input
                type="text"
                name="empresa"
                value={formData.empresa}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                placeholder="Nombre de la empresa"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151', fontSize: '0.875rem' }}>
                Ciudad
              </label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                placeholder="Ocaña"
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151', fontSize: '0.875rem' }}>
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
              placeholder="Calle Principal 123"
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid #e5e7eb', paddingTop: '2rem' }}>
          <Link
            to="/clients"
            style={{ backgroundColor: '#e5e7eb', color: '#1f2937', padding: '0.625rem 1.5rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            style={{ backgroundColor: '#123456', color: '#fff', padding: '0.625rem 1.5rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontWeight: 500, opacity: saving ? 0.6 : 1 }}
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditClientPage;
