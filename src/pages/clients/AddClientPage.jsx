import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

const AddClientPage = () => {
  const { user } = useAuth();
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

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    // Validación en tiempo real para documento: solo números y máximo 10 dígitos
    if (name === 'documento') {
      finalValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    }

    // Validación en tiempo real para teléfono: solo números y máximo 10 dígitos
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

    // Validaciones de campos obligatorios
    if (!formData.primerNombre || !formData.primerApellido || !formData.documento || !formData.telefono || !formData.email) {
      setError('Por favor complete todos los campos obligatorios (*)');
      return;
    }

    // Validar documento: exactamente 10 dígitos
    if (formData.documento.length !== 10) {
      setError('El documento debe tener exactamente 10 dígitos.');
      return;
    }

    // Validar teléfono: exactamente 10 dígitos
    if (formData.telefono.length !== 10) {
      setError('El teléfono debe tener exactamente 10 dígitos.');
      return;
    }

    // Validar email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Por favor ingresa un email válido.');
      return;
    }

    setLoading(true);
    try {
      console.log("Creando cliente con datos:", formData);
      console.log("UID del usuario ejecutor:", user.uid);
      
      // Enviamos el documento vinculándolo al usuario actual (user.uid) 
      // Esto cumple con las reglas de seguridad personalizadas de Firestore
      await addDoc(collection(db, 'clients'), {
        ...formData,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/clients');
      }, 2000);
    } catch (err) {
      console.error("Error detallado al agregar cliente:", err);
      
      // Mensajes transparentes basados en la respuesta real de Firebase
      if (err.code === 'permission-denied') {
        setError('Error de Base de Datos: El servidor denegó la escritura. Revisa que las reglas de Firestore estén publicadas.');
      } else if (err.code === 'failed-precondition') {
        setError('Error de Red/Configuración: Hay un problema con los índices o la base de datos de Firestore.');
      } else {
        setError('No se pudo registrar el cliente: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem 1rem' }}>
      {/* Back Button */}
      <Link to="/clients" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#15803d', textDecoration: 'none', marginBottom: '2rem', fontWeight: 500 }}>
        <ArrowLeft size={18} /> Volver a Clientes
      </Link>

      {/* Page Title */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>Nuevo Cliente</h1>
        <p style={{ color: '#6b7280' }}>Completa el formulario para registrar un nuevo cliente</p>
      </div>

      {/* Success Message */}
      {success && (
        <div style={{ backgroundColor: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#047857' }}>
          <CheckCircle2 size={20} />
          Cliente creado exitosamente. Redirigiendo...
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#991b1b' }}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,.1)', padding: '2rem', maxWidth: '900px' }}>
        {/* Section: Información Personal */}
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

        {/* Section: Información de Contacto */}
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

        {/* Section: Información Empresarial */}
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

        {/* Submit Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid #e5e7eb', paddingTop: '2rem' }}>
          <Link
            to="/clients"
            style={{ backgroundColor: '#e5e7eb', color: '#1f2937', padding: '0.625rem 1.5rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#15803d', color: '#fff', padding: '0.625rem 1.5rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontWeight: 500, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Creando...' : 'Crear Cliente'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClientPage;