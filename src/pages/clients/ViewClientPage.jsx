import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, Edit2, AlertCircle } from 'lucide-react';

const ViewClientPage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'clients', id));
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          if (data.userId !== user?.uid) {
            setError("No tienes autorización para ver este cliente.");
            setLoading(false);
            return;
          }

          setClient(data);
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

  if (error) {
    return (
      <div style={{ padding: '2rem', backgroundColor: '#fee2e2', borderRadius: '0.5rem', color: '#991b1b', textAlign: 'center' }}>
        <AlertCircle size={32} style={{ margin: '0 auto 1rem' }} />
        <p style={{ marginBottom: '1rem' }}>{error}</p>
        <Link to="/clients" style={{ backgroundColor: '#991b1b', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.375rem', textDecoration: 'none', display: 'inline-block' }}>
          Volver a Clientes
        </Link>
      </div>
    );
  }

  if (!client) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ marginBottom: '1rem', color: '#6b7280' }}>No se encontró el cliente.</p>
        <Link to="/clients" style={{ backgroundColor: '#123456', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.375rem', textDecoration: 'none', display: 'inline-block' }}>
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>
            {client.primerNombre} {client.segundoNombre ? client.segundoNombre + ' ' : ''} {client.primerApellido} {client.segundoApellido || ''}
          </h1>
          <p style={{ color: '#6b7280' }}>Información completa del cliente</p>
        </div>
        <Link
          to={`/clients/edit/${id}`}
          style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '0.625rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, textDecoration: 'none' }}
        >
          <Edit2 size={18} /> Editar
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '900px' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,.1)', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '2px solid #e5e7eb' }}>Información Personal</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>Primer Nombre</p>
              <p style={{ color: '#1f2937', fontWeight: 500, marginTop: '0.25rem' }}>{client.primerNombre}</p>
            </div>
            {client.segundoNombre && (
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>Segundo Nombre</p>
                <p style={{ color: '#1f2937', fontWeight: 500, marginTop: '0.25rem' }}>{client.segundoNombre}</p>
              </div>
            )}
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>Primer Apellido</p>
              <p style={{ color: '#1f2937', fontWeight: 500, marginTop: '0.25rem' }}>{client.primerApellido}</p>
            </div>
            {client.segundoApellido && (
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>Segundo Apellido</p>
                <p style={{ color: '#1f2937', fontWeight: 500, marginTop: '0.25rem' }}>{client.segundoApellido}</p>
              </div>
            )}
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>Género</p>
              <p style={{ color: '#1f2937', fontWeight: 500, marginTop: '0.25rem' }}>{client.genero}</p>
            </div>
            {client.fechaNacimiento && (
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>Fecha de Nacimiento</p>
                <p style={{ color: '#1f2937', fontWeight: 500, marginTop: '0.25rem' }}>{client.fechaNacimiento}</p>
              </div>
            )}
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,.1)', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '2px solid #e5e7eb' }}>Información de Contacto</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>Documento</p>
              <p style={{ color: '#1f2937', fontWeight: 500, marginTop: '0.25rem' }}>{client.documento}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>Teléfono</p>
              <p style={{ color: '#1f2937', fontWeight: 500, marginTop: '0.25rem' }}>{client.telefono}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>Email</p>
              <a href={`mailto:${client.email}`} style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 500, marginTop: '0.25rem', display: 'block' }}>{client.email}</a>
            </div>
          </div>
        </div>

        {(client.empresa || client.ciudad || client.direccion) && (
          <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,.1)', padding: '1.5rem', gridColumn: '1 / -1' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '2px solid #e5e7eb' }}>Información Empresarial</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {client.empresa && (
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>Empresa</p>
                  <p style={{ color: '#1f2937', fontWeight: 500, marginTop: '0.25rem' }}>{client.empresa}</p>
                </div>
              )}
              {client.ciudad && (
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>Ciudad</p>
                  <p style={{ color: '#1f2937', fontWeight: 500, marginTop: '0.25rem' }}>{client.ciudad}</p>
                </div>
              )}
              {client.direccion && (
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>Dirección</p>
                  <p style={{ color: '#1f2937', fontWeight: 500, marginTop: '0.25rem' }}>{client.direccion}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewClientPage;
