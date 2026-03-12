import { Link } from "react-router-dom";

function HookLayout({ nombre, descripcion, categoria, autor, children }) {
  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <Link to="/" style={styles.backBtn}>← Volver al Home</Link>

      </nav>

      <header style={styles.header}>
        <h2 style={styles.nombre}>{nombre}</h2>
        <p style={styles.descripcion}>{descripcion}</p>
        <div style={styles.meta}>
          <span style={styles.badge}>{categoria}</span>
          <span style={styles.autor}>{autor}</span>
        </div>
      </header>

      <main style={styles.main}>
        {children}
      </main>

  
    </div>
  );
}

export default HookLayout;

const styles = {
  page: { fontFamily: "'Segoe UI', sans-serif", maxWidth: 860, margin: "0 auto", padding: "1.5rem 1rem" },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", borderBottom: "2px solid #e5e7eb", paddingBottom: "0.75rem" },
  backBtn: { backgroundColor: "#1e1b4b", color: "#fff", padding: "0.4rem 1rem", borderRadius: 6, textDecoration: "none", fontSize: "0.85rem" },
  navTitle: { color: "#6b7280", fontSize: "0.9rem" },
  header: { backgroundColor: "#f0f4ff", border: "1px solid #c7d2fe", borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem" },
  nombre: { fontSize: "2rem", color: "#1e1b4b", margin: "0 0 0.5rem" },
  descripcion: { color: "#4b5563", fontSize: "1rem", margin: "0 0 1rem" },
  meta: { display: "flex", gap: "0.75rem", flexWrap: "wrap" },
  badge: { backgroundColor: "#4f46e5", color: "#fff", padding: "0.25rem 0.75rem", borderRadius: 20, fontSize: "0.8rem" },
  autor: { backgroundColor: "#e0e7ff", color: "#3730a3", padding: "0.25rem 0.75rem", borderRadius: 20, fontSize: "0.8rem", fontWeight: 600 },
  main: { marginBottom: "2rem" },
  footer: { textAlign: "center", paddingTop: "1rem", borderTop: "1px solid #f3f4f6" },
  footerLink: { color: "#4f46e5", textDecoration: "none", fontSize: "0.9rem" },
};