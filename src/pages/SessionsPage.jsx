import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, getDocs, query, orderBy, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';

const SessionsPage = () => {
  const { user, sessionId } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      // Actualizar la sesión con hora de salida
      if (sessionId) {
        const sessionRef = doc(db, "userSessions", sessionId);
        await updateDoc(sessionRef, {
          logoutTime: Timestamp.now(),
          sessionDuration: Date.now() - (new Date(sessionId.split('_')[1]).getTime()),
          status: "inactive"
        });
      }
      // Cerrar sesión en Firebase
      await signOut(auth);
      // Redirigir al login
      navigate('/');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const filteredSessions = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return sessions;
    return sessions.filter(session =>
      session.userName?.toLowerCase().includes(search) ||
      session.userEmail?.toLowerCase().includes(search) ||
      session.authMethod?.toLowerCase().includes(search)
    );
  }, [sessions, searchTerm]);

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) {
        setSessions([]);
        setLoading(false);
        return;
      }
      const q = query(collection(db, "userSessions"), orderBy("loginTime", "desc"));
      const querySnapshot = await getDocs(q);
      const sessionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSessions(sessionsData);
      setLoading(false);
    };
    fetchSessions();
  }, [user]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con botones */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">React Hooks Playground</h1>
          <div className="flex gap-3">
            <button
              onClick={() => {}}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              disabled
            >
              Ver Sesiones
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Registro de Sesiones</h1>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre, correo o método de acceso..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Usuario</th>
              <th className="py-2 px-4 border-b">Correo</th>
              <th className="py-2 px-4 border-b">Hora de Entrada</th>
              <th className="py-2 px-4 border-b">Hora de Salida</th>
              <th className="py-2 px-4 border-b">Duración</th>
              <th className="py-2 px-4 border-b">Método</th>
              <th className="py-2 px-4 border-b">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.length > 0 ? (
              filteredSessions.map(session => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{session.userName}</td>
                  <td className="py-2 px-4 border-b">{session.userEmail}</td>
                  <td className="py-2 px-4 border-b">{formatDate(session.loginTime)}</td>
                  <td className="py-2 px-4 border-b">{formatDate(session.logoutTime)}</td>
                  <td className="py-2 px-4 border-b">{formatDuration(session.sessionDuration)}</td>
                  <td className="py-2 px-4 border-b">{session.authMethod}</td>
                  <td className="py-2 px-4 border-b">{session.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-6 px-4 border-b text-center" colSpan={7}>
                  No se encontraron registros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
};

export default SessionsPage;