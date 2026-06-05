import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, getDocs, query, where, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { Search, Eye, Edit2, Trash2, Plus, AlertTriangle, CheckCircle2, Users } from 'lucide-react';

const ClientsListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      if (!user) {
        setClients([]);
        setLoading(false);
        return;
      }
      try {
        console.log("Fetching clients for user:", user.uid);
        const q = query(
          collection(db, 'clients'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        console.log("Clients found:", snap.size);
        setClients(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching clients:", err);
        try {
          console.log("Retrying without orderBy...");
          const q = query(
            collection(db, 'clients'),
            where('userId', '==', user.uid)
          );
          const snap = await getDocs(q);
          console.log("Clients found (no orderBy):", snap.size);
          const clientsData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          clientsData.sort((a, b) => {
            const timeA = a.createdAt?.seconds || 0;
            const timeB = b.createdAt?.seconds || 0;
            return timeB - timeA;
          });
          setClients(clientsData);
        } catch (retryErr) {
          console.error("Error fetching clients (retry):", retryErr);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, [user]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDoc(doc(db, 'clients', deleteId));
      setClients(clients.filter(c => c.id !== deleteId));
      setSuccessMsg('Cliente eliminado correctamente.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error("Error deleting client:", err);
    } finally {
      setDeleteId(null);
    }
  };

  const filteredClients = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return clients;
    return clients.filter(c => {
      const fullName = `${c.primerNombre} ${c.segundoNombre || ''} ${c.primerApellido} ${c.segundoApellido || ''}`.toLowerCase();
      const document = (c.documento || '').toLowerCase();
      const phone = (c.telefono || '').toLowerCase();
      const email = (c.email || '').toLowerCase();
      const company = (c.empresa || '').toLowerCase();
      return fullName.includes(search) || document.includes(search) || phone.includes(search) || email.includes(search) || company.includes(search);
    });
  }, [clients, searchTerm]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '4px solid #e5e7eb', borderTopColor: '#123456', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: '#6b7280' }}>Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>Gestión de Clientes</h1>
        <p style={{ color: '#6b7280' }}>Administra todos tus clientes desde aquí</p>
      </div>

      {successMsg && (
        <div style={{ backgroundColor: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#047857' }}>
          <CheckCircle2 size={20} />
          {successMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
        <Link to="/clients/new" style={{ backgroundColor: '#123456', color: '#fff', padding: '0.625rem 1rem', borderRadius: '0.375rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, cursor: 'pointer', border: 'none' }}>
          <Plus size={18} /> Nuevo Cliente
        </Link>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            type="text"
            placeholder="Buscar por nombre, documento, teléfono o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.625rem', paddingBottom: '0.625rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
          />
        </div>
        <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>
          {filteredClients.length} cliente{filteredClients.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,.1)', overflow: 'hidden' }}>
        {filteredClients.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
            <Users size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>No hay clientes registrados</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Nombre</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Documento</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Teléfono</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Email</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Empresa</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem', color: '#1f2937' }}>
                    {client.primerNombre} {client.segundoNombre ? client.segundoNombre + ' ' : ''} {client.primerApellido} {client.segundoApellido || ''}
                  </td>
                  <td style={{ padding: '1rem', color: '#1f2937', fontSize: '0.875rem' }}>{client.documento}</td>
                  <td style={{ padding: '1rem', color: '#1f2937', fontSize: '0.875rem' }}>{client.telefono}</td>
                  <td style={{ padding: '1rem', color: '#1f2937', fontSize: '0.875rem' }}>{client.email}</td>
                  <td style={{ padding: '1rem', color: '#1f2937', fontSize: '0.875rem' }}>{client.empresa}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                      <Link
                        to={`/clients/view/${client.id}`}
                        style={{ backgroundColor: '#dbeafe', color: '#0284c7', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        to={`/clients/edit/${client.id}`}
                        style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => setDeleteId(client.id)}
                        style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', padding: '2rem', maxWidth: '28rem', width: '90%', boxShadow: '0 10px 15px rgba(0,0,0,.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <AlertTriangle size={24} style={{ color: '#dc2626' }} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937' }}>Eliminar cliente</h3>
            </div>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeleteId(null)}
                style={{ backgroundColor: '#e5e7eb', color: '#1f2937', padding: '0.625rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontWeight: 500 }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                style={{ backgroundColor: '#dc2626', color: '#fff', padding: '0.625rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontWeight: 500 }}
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

export default ClientsListPage;
