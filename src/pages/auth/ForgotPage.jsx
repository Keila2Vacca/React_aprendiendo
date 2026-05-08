import { useState } from "react";
import logo from '../../assets/imagotipo.png';
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

/**
 * ForgotPage component – Real Firebase Auth
 */
const ForgotPage = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: null, message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    if (!email) {
      setStatus({ type: "error", message: "Por favor ingrese su correo electrónico." });
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setStatus({ 
        type: "success", 
        message: "Enlace enviado. Por favor revise su bandeja de entrada (y la carpeta de spam)." 
      });
      setEmail("");
    } catch (error) {
      let errorMessage = "Ocurrió un error al enviar el correo.";
      if (error.code === "auth/user-not-found") errorMessage = "No existe una cuenta con este correo.";
      if (error.code === "auth/invalid-email") errorMessage = "El correo electrónico no es válido.";
      setStatus({ type: "error", message: errorMessage });
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
      <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "350px", height: "350px", borderRadius: "50%", background: "rgba(255,255,255,.07)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-80px", left: "-80px", width: "280px", height: "280px", borderRadius: "50%", background: "rgba(255,255,255,.05)", pointerEvents: "none" }} />

      <div className="auth-card animate-fade-up">
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--green-mid), var(--green-dark))",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1rem", boxShadow: "0 4px 20px rgba(45,106,53,.3)",
          }}>
            <img src={logo} alt="Logo" style={{ width: "70%", height: "70%" }} />
          </div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--green-dark)", margin: "0 0 .35rem" }}>
            Recuperar Contraseña
          </h2>
          <p style={{ color: "var(--gray-600)", fontSize: ".875rem", margin: 0 }}>
            Ingrese su correo electrónico para recibir un enlace de recuperación.
          </p>
        </div>
        
        {status.type && (
          <div style={{ 
            padding: "1rem", 
            borderRadius: "10px", 
            marginBottom: "1.5rem", 
            display: "flex", 
            alignItems: "flex-start", 
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

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          <div>
            <label htmlFor="email" style={{ display: "block", fontSize: ".875rem", fontWeight: 600, color: "var(--gray-800)", marginBottom: ".4rem" }}>
              Correo Electrónico
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={17} style={{ position: "absolute", left: ".85rem", top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }} />
              <input
                id="email"
                className="form-input"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="btn-green" style={{ marginTop: ".5rem" }} disabled={loading}>
            {loading ? "Enviando..." : "Enviar Enlace"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link to="/login" style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", color: "var(--green-main)", fontWeight: 700, fontSize: ".875rem" }}>
            <ArrowLeft size={16} /> Volver a Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPage;
