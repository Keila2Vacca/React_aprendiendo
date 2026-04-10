import { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const SessionsPage = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) return;
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
            {filteredSessions.map(session => (
              <tr key={session.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{session.userName}</td>
                <td className="py-2 px-4 border-b">{session.userEmail}</td>
                <td className="py-2 px-4 border-b">{formatDate(session.loginTime)}</td>
                <td className="py-2 px-4 border-b">{formatDate(session.logoutTime)}</td>
                <td className="py-2 px-4 border-b">{formatDuration(session.sessionDuration)}</td>
                <td className="py-2 px-4 border-b">{session.authMethod}</td>
                <td className="py-2 px-4 border-b">{session.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SessionsPage;