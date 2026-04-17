import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

/**
 * LoginPage component
 * Features: Email/password login, social mock logins, sweetalert capture
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { setSessionId } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.email || !formData.password) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor complete todos los campos',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Correo inválido',
        text: 'Por favor ingrese un correo electrónico válido',
      });
      return;
    }

    try {
      const email = formData.email.trim().toLowerCase();
      const password = formData.password;
      console.log('Intentando login con:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Registrar sesión en Firestore
      const sessionId = `${user.uid}_${Date.now()}`;
      const loginTime = new Date();
      await setDoc(doc(db, "userSessions", sessionId), {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email.split('@')[0],
        loginTime: serverTimestamp(),
        logoutTime: null,
        sessionDuration: null,
        authMethod: "email",
        status: "active"
      });

      setSessionId(sessionId, loginTime);

      Swal.fire({
        icon: 'success',
        title: '¡Ingreso Exitoso!',
        text: `Bienvenido ${user.displayName || user.email}`,
        confirmButtonText: 'Continuar'
      }).then(() => {
        navigate('/dashboard');
      });
    } catch (error) {
      console.error('Error de login:', error.code, error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: `${error.code}: ${error.message}`,
      });
    }
  };

  const handleSocialLogin = async (provider) => {
    let authProvider;
    switch (provider) {
      case 'Google':
        authProvider = new GoogleAuthProvider();
        break;
      case 'Facebook':
        authProvider = new FacebookAuthProvider();
        break;
      case 'GitHub':
        authProvider = new GithubAuthProvider();
        break;
      default:
        return;
    }

    try {
      const result = await signInWithPopup(auth, authProvider);
      const user = result.user;

      // Registrar sesión en Firestore
      const sessionId = `${user.uid}_${Date.now()}`;
      const loginTime = new Date();
      await setDoc(doc(db, "userSessions", sessionId), {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email.split('@')[0],
        loginTime: serverTimestamp(),
        logoutTime: null,
        sessionDuration: null,
        authMethod: provider.toLowerCase(),
        status: "active"
      });

      setSessionId(sessionId, loginTime);

      Swal.fire({
        icon: 'success',
        title: '¡Ingreso Exitoso!',
        text: `Bienvenido ${user.displayName || user.email}`,
        confirmButtonText: 'Continuar'
      }).then(() => {
        navigate('/dashboard');
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: error.message,
      });
    }
  };


  return (
    <div className="flex-1 w-screen min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">


      <div className="w-full max-w-md bg-linear-to-br from-indigo-50 to-blue-100 rounded-2xl shadow-xl overflow-hidden z-10 p-8 transform transition-all relative">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Iniciar Sesión</h2>
          <p className="text-gray-500 text-sm">Ingrese sus credenciales para acceder</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Contraseña
              </label>
              <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                ¿Olvidó su contraseña?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all shadow-md mt-6"
          >
            Ingresar
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-linear-to-br from-indigo-50 to-blue-100 text-gray-500">O continuar con</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              onClick={() => handleSocialLogin('Google')}
              className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </button>
            <button
              onClick={() => handleSocialLogin('Facebook')}
              className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors"
            >
              <span className="font-semibold text-blue-600">Facebook</span>
            </button>
            <button
              onClick={() => handleSocialLogin('GitHub')}
              className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors"
            >
              <span className="font-semibold text-gray-900">GitHub</span>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          ¿No tiene una cuenta?{" "}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
