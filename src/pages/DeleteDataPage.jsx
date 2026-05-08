import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, ShieldCheck } from 'lucide-react';
import logo from '../assets/imagotipo.png';

const DeleteDataPage = () => {
  const navigate = useNavigate();

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

      {/* Back button */}
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
        <ArrowLeft size={16} /> Volver
      </button>

      <div className="auth-card animate-fade-up" style={{ maxWidth: '500px', textAlign: 'center' }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--green-mid), var(--green-dark))",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1.25rem", boxShadow: "0 4px 20px rgba(45,106,53,.3)",
          }}>
            <ShieldCheck size={32} color="#fff" />
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--green-dark)", margin: "0 0 .5rem" }}>
            Eliminación de datos de usuario
          </h1>
          <p style={{ color: "var(--gray-600)", fontSize: ".95rem", lineHeight: 1.6 }}>
            Cumpliendo con las políticas de Meta y la protección de su privacidad.
          </p>
        </div>

        <div style={{ 
          background: "var(--gray-50)", 
          padding: "1.5rem", 
          borderRadius: "12px", 
          marginBottom: "2rem",
          border: "1px solid var(--gray-200)"
        }}>
          <p style={{ color: "var(--gray-700)", fontSize: "1rem", margin: 0, lineHeight: 1.6 }}>
            Si deseas solicitar la eliminación de tus datos asociados con el inicio de sesión de Facebook en nuestra aplicación, puedes comunicarte al correo:
          </p>
          <div style={{ 
            marginTop: "1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: ".5rem",
            color: "var(--green-main)",
            fontWeight: 700,
            fontSize: "1.1rem"
          }}>
            <Mail size={20} />
            <a href="mailto:kmbayonam@gmail.com" style={{ color: "inherit", textDecoration: "none" }}>
              kmbayonam@gmail.com
            </a>
          </div>
        </div>

        

        <p style={{ color: "var(--gray-500)", fontSize: ".8rem", margin: 0 }}>
          Procesaremos su solicitud en un plazo máximo de 48 horas hábiles.
        </p>

        <div style={{ marginTop: "2rem", borderTop: "1px solid var(--gray-100)", paddingTop: "1.5rem" }}>
          <img src={logo} alt="Logo" style={{ height: "30px", opacity: 0.8 }} />
        </div>
      </div>
    </div>
  );
};

export default DeleteDataPage;
