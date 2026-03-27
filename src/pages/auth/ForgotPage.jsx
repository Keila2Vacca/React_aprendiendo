import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Mail, ArrowLeft } from "lucide-react";

/**
 * ForgotPage component
 * Features: Request email to send recovery token
 */
const ForgotPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email) {
      Swal.fire({
        icon: 'error',
        title: 'Campo requerido',
        text: 'Por favor ingrese su correo electrónico.',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Correo inválido',
        text: 'Por favor ingrese un correo válido.',
      });
      return;
    }

    Swal.fire({
      icon: 'success',
      title: 'Enlace enviado',
      text: `Se ha simulado el envío de recuperación al correo: ${email}`,
      confirmButtonText: 'Ir a restablecer contraseña'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/reset-password");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 bg-gradient-to-tr from-green-50 to-teal-100 relative overflow-hidden">
      
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden z-10 p-8">
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Recuperar Contraseña</h2>
          <p className="text-gray-500 text-sm">
            Ingrese su correo electrónico y simularemos el envío de instrucciones.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 focus:ring-4 focus:ring-teal-200 transition-all shadow-md mt-4"
          >
            Enviar Instrucciones
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="inline-flex items-center text-sm font-semibold text-teal-600 hover:text-teal-500 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver a Iniciar Sesión
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPage;
