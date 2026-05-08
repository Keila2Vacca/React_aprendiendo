import { useState } from "react";
import logo from '../../assets/imagotipo.png';
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";


const RegisterPage = () => {
  const { setSessionId } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setStatus({ type: "error", message: "Por favor, complete todos los campos." });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus({ type: "error", message: "Por favor ingrese un correo válido." });
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setStatus({ type: "error", message: "El número de teléfono debe tener 10 dígitos." });
      return;
    }

    if (formData.password.length < 6) {
      setStatus({ type: "error", message: "La contraseña debe tener al menos 6 caracteres." });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setStatus({ type: "error", message: "Las contraseñas no coinciden." });
      return;
    }

    setLoading(true);
    try {
      const email = formData.email.trim().toLowerCase();
      const userCredential = await createUserWithEmailAndPassword(auth, email, formData.password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: formData.name });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: formData.name,
        email,
        phone: formData.phone,
        photoURL: null,
        createdAt: serverTimestamp(),
        authMethod: "email",
      });

      setStatus({ type: "success", message: "¡Cuenta creada con éxito! Redirigiendo..." });
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Register error:", error);
      let message = "Error al crear la cuenta.";
      if (error.code === "auth/email-already-in-use") message = "Este correo ya está registrado.";
      setStatus({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setStatus({ type: null, message: "" });
    setLoading(true);
    let authProvider;
    switch (provider) {
      case "Google":
        authProvider = new GoogleAuthProvider();
        authProvider.addScope("email");
        authProvider.addScope("profile");
        break;
      case "Facebook":
        authProvider = new FacebookAuthProvider();
        // Scopes necesarios para obtener email y nombre del usuario
        authProvider.addScope("email");
        authProvider.addScope("public_profile");
        break;
      case "GitHub":
        authProvider = new GithubAuthProvider();
        authProvider.addScope("user:email");
        break;
      default:
        setLoading(false);
        return;
    }

    try {
      const result = await signInWithPopup(auth, authProvider);
      const user = result.user;

      // Guardar perfil de usuario persistente
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName || user.email?.split("@")[0] || "Usuario",
        email: user.email || "",
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
        authMethod: provider.toLowerCase(),
      }, { merge: true });

      const sessionId = `${user.uid}_${Date.now()}`;
      const loginTime = new Date();
      await setDoc(doc(db, "userSessions", sessionId), {
        userId: user.uid,
        userEmail: user.email || "",
        userName: user.displayName || user.email?.split("@")[0] || "Usuario",
        userPhoto: user.photoURL || null,
        loginTime: serverTimestamp(),
        logoutTime: null,
        sessionDuration: null,
        authMethod: provider.toLowerCase(),
        status: "active",
      });

      setSessionId(sessionId, loginTime);
      navigate("/dashboard");
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user" || error.code === "auth/cancelled-popup-request") {
        // Usuario cerró el popup — no mostrar error
      } else if (error.code === "auth/account-exists-with-different-credential") {
        setStatus({ type: "error", message: "Ya existe una cuenta con este correo registrada con otro método (Google, GitHub o contraseña). Por favor inicia sesión con ese método." });
      } else if (error.code === "auth/operation-not-allowed") {
        setStatus({ type: "error", message: "El registro con " + provider + " no está habilitado. Contacte al administrador." });
      } else if (error.code === "auth/popup-blocked") {
        setStatus({ type: "error", message: "El navegador bloqueó la ventana emergente. Por favor permite ventanas emergentes para este sitio." });
      } else {
        setStatus({ type: "error", message: error.message || "Error al autenticar con " + provider });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-cootrans"
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blobs */}
      <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "350px", height: "350px", borderRadius: "50%", background: "rgba(255,255,255,.06)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-80px", left: "-80px", width: "280px", height: "280px", borderRadius: "50%", background: "rgba(255,255,255,.05)", pointerEvents: "none" }} />

      {/* Back to home */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute", top: "1.5rem", left: "1.5rem",
          display: "flex", alignItems: "center", gap: ".4rem",
          color: "rgba(255,255,255,.8)", background: "transparent", border: "none",
          fontSize: ".875rem", cursor: "pointer", fontWeight: 500,
          transition: "color .2s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = "#fff"}
        onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.8)"}
      >
        <ArrowLeft size={16} /> Inicio
      </button>

      <div className="auth-card animate-fade-up" style={{ maxWidth: "460px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--green-mid), var(--green-dark))",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto .875rem", boxShadow: "0 4px 20px rgba(45,106,53,.3)",
          }}>
            <img src={logo} alt="Logo" style={{ width: "70%", height: "70%" }} />
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--green-dark)", margin: "0 0 .3rem" }}>
            Crear Cuenta
          </h1>
          <p style={{ color: "var(--gray-600)", fontSize: ".875rem", margin: 0 }}>
            Registre sus datos para unirse a nosotros
          </p>
        </div>

        {status.type && (
          <div style={{
            padding: ".75rem 1rem",
            borderRadius: "10px",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: ".75rem",
            fontSize: ".875rem",
            background: status.type === "success" ? "#dcfce7" : "#fee2e2",
            color: status.type === "success" ? "#166534" : "#991b1b",
            border: `1px solid ${status.type === "success" ? "#bbf7d0" : "#fecaca"}`
          }}>
            {status.type === "success" ? <CheckCircle2 size={18} style={{ flexShrink: 0 }} /> : <AlertCircle size={18} style={{ flexShrink: 0 }} />}
            <span>{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: ".9rem" }}>
          {/* Name */}
          <div>
            <label htmlFor="name" style={{ display: "block", fontSize: ".875rem", fontWeight: 600, color: "var(--gray-800)", marginBottom: ".35rem" }}>
              Nombre Completo
            </label>
            <div style={{ position: "relative" }}>
              <User size={17} style={{ position: "absolute", left: ".85rem", top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }} />
              <input id="name" className="form-input" type="text" placeholder="Ej. Juan Pérez"
                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required disabled={loading} />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="reg-email" style={{ display: "block", fontSize: ".875rem", fontWeight: 600, color: "var(--gray-800)", marginBottom: ".35rem" }}>
              Correo Electrónico
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={17} style={{ position: "absolute", left: ".85rem", top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }} />
              <input id="reg-email" className="form-input" type="email" placeholder="correo@ejemplo.com"
                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required disabled={loading} />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" style={{ display: "block", fontSize: ".875rem", fontWeight: 600, color: "var(--gray-800)", marginBottom: ".35rem" }}>
              Número de Teléfono
            </label>
            <div style={{ position: "relative" }}>
              <Phone size={17} style={{ position: "absolute", left: ".85rem", top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }} />
              <input id="phone" className="form-input" type="tel" placeholder="1234567890"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                maxLength="10" required disabled={loading} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="reg-password" style={{ display: "block", fontSize: ".875rem", fontWeight: 600, color: "var(--gray-800)", marginBottom: ".35rem" }}>
              Contraseña
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={17} style={{ position: "absolute", left: ".85rem", top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }} />
              <input id="reg-password" className="form-input" type={showPassword ? "text" : "password"} placeholder="••••••••"
                value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{ paddingRight: "3rem" }} required disabled={loading} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: ".85rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)", display: "flex" }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" style={{ display: "block", fontSize: ".875rem", fontWeight: 600, color: "var(--gray-800)", marginBottom: ".35rem" }}>
              Confirmar Contraseña
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={17} style={{ position: "absolute", left: ".85rem", top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }} />
              <input id="confirmPassword" className="form-input" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••"
                value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                style={{ paddingRight: "3rem" }} required disabled={loading} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: "absolute", right: ".85rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)", display: "flex" }}>
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button id="register-submit" type="submit" className="btn-green" style={{ marginTop: ".5rem" }} disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        {/* Social */}
        <div className="divider">O registrarse con</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: ".75rem" }}>
          <button id="reg-google" type="button" className="social-btn" onClick={() => handleSocialLogin("Google")} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          </button>

          <button id="reg-facebook" type="button" className="social-btn" onClick={() => handleSocialLogin("Facebook")} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </button>

          <button id="reg-github" type="button" className="social-btn" onClick={() => handleSocialLogin("GitHub")} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </button>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: ".875rem", color: "var(--gray-600)" }}>
          ¿Ya tiene una cuenta?{" "}
          <Link to="/" style={{ color: "var(--green-main)", fontWeight: 700 }}>
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;