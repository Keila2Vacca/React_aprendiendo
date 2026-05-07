import { useState, useEffect } from "react";
import logo from '../../assets/imagotipo.png';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "../../firebase";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

/**
 * ResetPage component – Real Firebase Auth
 */
const ResetPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [status, setStatus] = useState({ type: null, message: "" });
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [oobCode, setOobCode] = useState(null);

  // Extract oobCode from URL (Firebase sends this in the reset link)
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("oobCode");
    if (code) {
      setOobCode(code);
      // Verify code is valid
      verifyPasswordResetCode(auth, code)
        .then(() => setVerifying(false))
        .catch((error) => {
          console.error("Invalid code:", error);
          setStatus({ type: "error", message: "El código de restablecimiento no es válido o ha expirado." });
          setVerifying(false);
        });
    } else {
      setStatus({ type: "error", message: "No se proporcionó un código de restablecimiento válido." });
      setVerifying(false);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });
    
    if (!formData.password || !formData.confirmPassword) {
      setStatus({ type: "error", message: "Por favor complete todos los campos." });
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
      await confirmPasswordReset(auth, oobCode, formData.password);
      setStatus({ type: "success", message: "¡Contraseña restablecida con éxito! Ya puede iniciar sesión." });
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      console.error("Reset error:", error);
      setStatus({ type: "error", message: "Ocurrió un error al restablecer la contraseña. Inténtelo de nuevo." });
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="bg-cootrans" style={{ width: "100%", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#fff", textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "3px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }} />
          <p>Verificando código...</p>
        </div>
      </div>
    );
  }

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
            Restablecer Contraseña
          </h2>
          <p style={{ color: "var(--gray-600)", fontSize: ".875rem", margin: 0 }}>
            Ingrese su nueva contraseña para asegurar su cuenta.
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

        {status.type !== "success" && !verifying && oobCode && (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            {/* New Password */}
            <div>
              <label htmlFor="password" style={{ display: "block", fontSize: ".875rem", fontWeight: 600, color: "var(--gray-800)", marginBottom: ".4rem" }}>
                Nueva Contraseña
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={17} style={{ position: "absolute", left: ".85rem", top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }} />
                <input
                  id="password"
                  className="form-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{ paddingRight: "3rem" }}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: ".85rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)", display: "flex" }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" style={{ display: "block", fontSize: ".875rem", fontWeight: 600, color: "var(--gray-800)", marginBottom: ".4rem" }}>
                Confirmar Contraseña
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={17} style={{ position: "absolute", left: ".85rem", top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }} />
                <input
                  id="confirmPassword"
                  className="form-input"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  style={{ paddingRight: "3rem" }}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: "absolute", right: ".85rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)", display: "flex" }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-green" style={{ marginTop: ".5rem" }} disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar Contraseña"}
            </button>
          </form>
        )}

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link to="/login" style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", color: "var(--green-main)", fontWeight: 700, fontSize: ".875rem" }}>
            <ArrowLeft size={16} /> Volver a Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPage;
