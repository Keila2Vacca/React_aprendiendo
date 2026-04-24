import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900">Dashboard</h1>
            <p className="mt-2 text-slate-600">Bienvenido, {user?.displayName || user?.email || 'Usuario'}.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={logout}
              className="px-5 py-3 rounded-2xl bg-rose-600 text-white font-semibold hover:bg-rose-700 transition"
            >
              Cerrar sesión
            </button>
            <Link
              to="/sessions"
              className="px-5 py-3 rounded-2xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition text-center"
            >
              Ver sesiones
            </Link>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 p-6 bg-slate-50">
            <h2 className="text-xl font-semibold text-slate-800 mb-3">Accesos a la aplicación</h2>
            <p className="text-slate-600 leading-7">
              Aquí puedes visualizar el registro completo de sesiones y chequear entradas, salidas, métodos de autenticación y estado.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 p-6 bg-slate-50">
            <h2 className="text-xl font-semibold text-slate-800 mb-3">Navegación rápida</h2>
            <ul className="space-y-3 text-slate-600">
              <li>
                <Link to="/sessions" className="font-semibold text-indigo-600 hover:text-indigo-700">Ir a historial de sesiones</Link>
              </li>
              <li>
                <Link to="/hooks" className="font-semibold text-indigo-600 hover:text-indigo-700">Ir al playground de hooks</Link>
              </li>
              <li>
                <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">Crear nueva cuenta</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
