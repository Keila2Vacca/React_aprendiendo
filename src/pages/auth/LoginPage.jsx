import { useState } from "react";
import logo from '../../assets/imagotipo.png';
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, AlertCircle } from "lucide-react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  linkWithCredential,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";


const LoginPage = () => {
  const navigate = useNavigate();
  const { setSessionId } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados para el flujo de vinculación de cuentas
  const [linkState, setLinkState] = useState(null); // { email, pendingCred, provider, methods: [] }
  const [linkPassword, setLinkPassword] = useState("");
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkError, setLinkError] = useState("");
  const [showLinkPassword, setShowLinkPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Por favor complete todos los campos");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      const sessionId = `${user.uid}_${Date.now()}`;
      const loginTime = new Date();
      await setDoc(doc(db, "userSessions", sessionId), {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email.split("@")[0],
        userPhoto: user.photoURL || null,
        loginTime: serverTimestamp(),
        logoutTime: null,
        sessionDuration: null,
        authMethod: "email",
        status: "active",
      });

      setSessionId(sessionId, loginTime);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      let message = "Error de autenticación. Verifique sus credenciales.";
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        message = "Correo o contraseña incorrectos.";
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Enlazar cuenta con contraseña e iniciar sesión
  const handleLinkWithPassword = async (e) => {
    e.preventDefault();
    if (!linkPassword) {
      setLinkError("Por favor ingrese la contraseña");
      return;
    }
    
    if (!linkState.pendingCred) {
      setLinkError("Error: No se pudo obtener la credencial. Por favor intente nuevamente.");
      return;
    }
    
    setLinkLoading(true);
    setLinkError("");
    try {
      // 1. Iniciar sesión con el método original (email/password)
      const userCredential = await signInWithEmailAndPassword(auth, linkState.email, linkPassword);
      const user = userCredential.user;

      // 2. Vincular la credencial del nuevo método (ej. Google)
      await linkWithCredential(user, linkState.pendingCred);

      // 3. Registrar sesión
      const sessionId = `${user.uid}_${Date.now()}`;
      const loginTime = new Date();
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName || user.email?.split("@")[0] || "Usuario",
        email: user.email || "",
        photoURL: user.photoURL || null,
        lastLogin: serverTimestamp(),
        authMethod: linkState.provider.toLowerCase(),
      }, { merge: true });

      await setDoc(doc(db, "userSessions", sessionId), {
        userId: user.uid,
        userEmail: user.email || "",
        userName: user.displayName || user.email?.split("@")[0] || "Usuario",
        userPhoto: user.photoURL || null,
        loginTime: serverTimestamp(),
        logoutTime: null,
        sessionDuration: null,
        authMethod: linkState.provider.toLowerCase(),
        status: "active",
      });

      setSessionId(sessionId, loginTime);
      setLinkState(null);
      navigate("/dashboard");
    } catch (err) {
      console.error("Link with password error:", err);
      let msg = "Error al vincular. Intente nuevamente.";
      if (err.code === "auth/wrong-password") {
        msg = "La contraseña es incorrecta.";
      }
      setLinkError(msg);
    } finally {
      setLinkLoading(false);
    }
  };

  // Enlazar cuenta con otro proveedor social (Google, Facebook, GitHub)
  const handleLinkWithProvider = async (existingProviderName) => {
    setLinkLoading(true);
    setLinkError("");
    
    if (!linkState.pendingCred) {
      setLinkError("Error: No se pudo obtener la credencial. Por favor intente nuevamente.");
      setLinkLoading(false);
      return;
    }
    
    let existingProvider;

    switch (existingProviderName) {
      case "google.com":
      case "Google":
        existingProvider = new GoogleAuthProvider();
        break;
      case "facebook.com":
      case "Facebook":
        existingProvider = new FacebookAuthProvider();
        break;
      case "github.com":
      case "GitHub":
        existingProvider = new GithubAuthProvider();
        break;
      default:
        setLinkLoading(false);
        return;
    }

    try {
      const result = await signInWithPopup(auth, existingProvider);
      const user = result.user;

      await linkWithCredential(user, linkState.pendingCred);

      const sessionId = `${user.uid}_${Date.now()}`;
      const loginTime = new Date();
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName || user.email?.split("@")[0] || "Usuario",
        email: user.email || "",
        photoURL: user.photoURL || null,
        lastLogin: serverTimestamp(),
        authMethod: linkState.provider.toLowerCase(),
      }, { merge: true });

      await setDoc(doc(db, "userSessions", sessionId), {
        userId: user.uid,
        userEmail: user.email || "",
        userName: user.displayName || user.email?.split("@")[0] || "Usuario",
        userPhoto: user.photoURL || null,
        loginTime: serverTimestamp(),
        logoutTime: null,
        sessionDuration: null,
        authMethod: linkState.provider.toLowerCase(),
        status: "active",
      });

      setSessionId(sessionId, loginTime);
      setLinkState(null);
      navigate("/dashboard");
    } catch (err) {
      console.error("Link with provider error:", err);
      setLinkError("Error al iniciar sesión con el proveedor original: " + (err.message || err.code));
    } finally {
      setLinkLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setError("");
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

      const sessionId = `${user.uid}_${Date.now()}`;
      const loginTime = new Date();

      // Guardar perfil de usuario persistente
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName || user.email?.split("@")[0] || "Usuario",
        email: user.email || "",
        photoURL: user.photoURL || null,
        lastLogin: serverTimestamp(),
        authMethod: provider.toLowerCase(),
      }, { merge: true });

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
        const email = error.customData?.email;
        
        // Obtener la credencial pendiente usando el provider correcto
        let pendingCred = null;
        if (provider === "Google") {
          pendingCred = GoogleAuthProvider.credentialFromError(error);
        } else if (provider === "Facebook") {
          pendingCred = FacebookAuthProvider.credentialFromError(error);
        } else if (provider === "GitHub") {
          pendingCred = GithubAuthProvider.credentialFromError(error);
        }

        // Si no pudimos obtener la credencial del error, intentamos obtenerla del popup result
        if (!pendingCred && error.customData?.credential) {
          pendingCred = error.customData.credential;
        }

        let methods = [];
        try {
          methods = await fetchSignInMethodsForEmail(auth, email);
          console.log("Métodos obtenidos de Firebase:", methods);
        } catch (fetchError) {
          console.error("Error al obtener métodos de inicio de sesión:", fetchError);
          // Si falla, ofrecemos todos los métodos sociales como opciones
          methods = [];
        }

        // Si obtenemos un array vacío o solo "password", ofrecemos todos los proveedores sociales
        if (!methods || methods.length === 0) {
          console.log("No se encontraron métodos, ofreciendo opciones de proveedores");
          methods = ["google.com", "facebook.com", "github.com", "password"];
        }

        setLinkState({
          email,
          pendingCred,
          provider,
          methods: methods
        });
      } else if (error.code === "auth/operation-not-allowed") {
        setError("El inicio de sesión con " + provider + " no está habilitado. Contacte al administrador.");
      } else if (error.code === "auth/popup-blocked") {
        setError("El navegador bloqueó la ventana emergente. Por favor permite ventanas emergentes para este sitio.");
      } else {
        setError(error.message || "Error al iniciar sesión con " + provider);
      }
    } finally {
      setLoading(false);
    }
  };
  // ───────────────────────────────────────────────────────────────────────────


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

      <div className="auth-card animate-fade-up">
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--green-mid), var(--green-dark))",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1rem", boxShadow: "0 4px 20px rgba(45,106,53,.3)",
          }}>
            <img src={logo} alt="Logo" style={{ width: "70%", height: "70%" }} />
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--green-dark)", margin: "0 0 .35rem" }}>
            Iniciar Sesión
          </h1>
          <p style={{ color: "var(--gray-600)", fontSize: ".875rem", margin: 0 }}>
            Ingrese sus credenciales para acceder al sistema
          </p>
        </div>

        {error && (
          <div style={{
            padding: ".75rem 1rem",
            borderRadius: "10px",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: ".75rem",
            fontSize: ".875rem",
            background: "#fee2e2",
            color: "#991b1b",
            border: "1px solid #fecaca"
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          {/* Email */}
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
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".4rem" }}>
              <label htmlFor="password" style={{ fontSize: ".875rem", fontWeight: 600, color: "var(--gray-800)" }}>
                Contraseña
              </label>
              <Link to="/forgot-password" style={{ fontSize: ".8rem", color: "var(--green-main)", fontWeight: 500 }}>
                ¿Olvidó su contraseña?
              </Link>
            </div>
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

          <button id="login-submit" type="submit" className="btn-green" style={{ marginTop: ".5rem" }} disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        {/* Social login */}
        <div className="divider">O continuar con</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: ".75rem" }}>
          {/* Google */}
          <button id="login-google" type="button" className="social-btn" onClick={() => handleSocialLogin("Google")} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          </button>

          {/* Facebook */}
          <button id="login-facebook" type="button" className="social-btn" onClick={() => handleSocialLogin("Facebook")} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </button>

          {/* GitHub */}
          <button id="login-github" type="button" className="social-btn" onClick={() => handleSocialLogin("GitHub")} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </button>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: ".875rem", color: "var(--gray-600)" }}>
          ¿No tiene una cuenta?{" "}
          <Link to="/register" style={{ color: "var(--green-main)", fontWeight: 700 }}>
            Registrarse
          </Link>
        </p>
      </div>

      {/* Modal para Vincular Cuentas */}
      {linkState && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 1000, padding: "1rem",
          backdropFilter: "blur(4px)"
        }}>
          <div className="animate-fade-up" style={{
            background: "#fff", borderRadius: "var(--radius-lg)",
            padding: "2rem", maxWidth: "450px", width: "100%",
            boxShadow: "var(--shadow-xl)", border: "1px solid var(--gray-200)",
            position: "relative"
          }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--green-dark)", margin: "0 0 .5rem", textAlign: "center" }}>
              Vincular Cuenta Existente
            </h2>
            <p style={{ color: "var(--gray-600)", fontSize: ".875rem", lineHeight: 1.5, margin: "0 0 1.5rem", textAlign: "center" }}>
              El correo <strong>{linkState.email}</strong> ya existe registrado con otro método de acceso.
            </p>
            <p style={{ color: "var(--gray-700)", fontSize: ".85rem", lineHeight: 1.5, margin: "0 0 1.5rem", textAlign: "center", background: "var(--blue-50)", padding: "1rem", borderRadius: "8px", border: "1px solid var(--blue-200)" }}>
              Para vincular tu cuenta de <strong>{linkState.provider}</strong> con tu cuenta existente, debes iniciar sesión con tu método original de acceso.
            </p>

            {linkError && (
              <div style={{
                padding: ".75rem 1rem", borderRadius: "10px", marginBottom: "1.25rem",
                fontSize: ".875rem", background: "#fee2e2", color: "#991b1b", border: "1px solid #fecaca"
              }}>
                {linkError}
              </div>
            )}

            {/* Si el método original contiene password / email */}
            {linkState.methods.includes("password") ? (
              <form onSubmit={handleLinkWithPassword} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label htmlFor="link-password" style={{ display: "block", fontSize: ".875rem", fontWeight: 600, color: "var(--gray-800)", marginBottom: ".4rem" }}>
                    Contraseña de tu cuenta existente (Email/Contraseña)
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock size={17} style={{ position: "absolute", left: ".85rem", top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }} />
                    <input
                      id="link-password"
                      className="form-input"
                      type={showLinkPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={linkPassword}
                      onChange={(e) => setLinkPassword(e.target.value)}
                      style={{ paddingRight: "3rem" }}
                      required
                      disabled={linkLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLinkPassword(!showLinkPassword)}
                      style={{ position: "absolute", right: ".85rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)", display: "flex" }}
                    >
                      {showLinkPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn-green" disabled={linkLoading} style={{ marginTop: ".5rem" }}>
                  {linkLoading ? "Vinculando..." : "Vincular y Acceder"}
                </button>
              </form>
            ) : null}

            {/* Mostrar opciones de proveedores sociales */}
            {(linkState.methods.includes("google.com") || linkState.methods.includes("facebook.com") || linkState.methods.includes("github.com")) && (
              <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
                {linkState.methods.includes("password") && (
                  <div style={{ textAlign: "center", color: "var(--gray-500)", fontSize: ".8rem", margin: "1rem 0 .5rem" }}>
                    O inicia sesión con uno de estos métodos:
                  </div>
                )}
                {linkState.methods.map((method) => {
                  let providerLabel = "";
                  let providerColor = "var(--green-main)";
                  if (method === "google.com") { providerLabel = "Google"; providerColor = "#4285F4"; }
                  else if (method === "facebook.com") { providerLabel = "Facebook"; providerColor = "#1877F2"; }
                  else if (method === "github.com") { providerLabel = "GitHub"; providerColor = "#24292e"; }
                  else return null;

                  return (
                    <button
                      key={method}
                      onClick={() => handleLinkWithProvider(method)}
                      disabled={linkLoading}
                      className="social-btn"
                      style={{
                        width: "100%", display: "flex", gap: ".5rem", justifyContent: "center",
                        background: providerColor, color: "#fff", border: "none", fontWeight: 700
                      }}
                    >
                      Iniciar sesión con {providerLabel}
                    </button>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => setLinkState(null)}
              disabled={linkLoading}
              style={{
                width: "100%", marginTop: "1rem", background: "none", border: "1px solid var(--gray-200)",
                color: "var(--gray-600)", padding: ".625rem", borderRadius: "var(--radius-sm)",
                fontWeight: 600, cursor: "pointer", fontSize: ".875rem", transition: "var(--transition)"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--gray-50)"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;