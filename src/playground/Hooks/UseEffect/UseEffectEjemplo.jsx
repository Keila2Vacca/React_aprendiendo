import { useState, useEffect } from "react";
import HookLayout from "/src/playground/components/HookLayout";

export default function UseEffectEjemplo() {
  const [segundos, setSegundos] = useState(0);
  const [activo, setActivo] = useState(false);
  const [titulo, setTitulo] = useState("React Playground");

  // Efecto 1: Temporizador
  useEffect(() => {
    if (!activo) return;
    const id = setInterval(() => setSegundos(s => s + 1), 1000);
    return () => clearInterval(id); 
  }, [activo]);

  // Efecto 2: Cambiar título del documento
  useEffect(() => {
    document.title = titulo;
    return () => { document.title = "React Playground"; };
  }, [titulo]);

  return (
    <HookLayout
      nombre="useEffect"
      descripcion="Ejecuta efectos secundarios (side effects) después de cada render. Acepta una función de limpieza (cleanup) y un array de dependencias."
      categoria="Efectos / ciclo de vida"
      autor="Keila"
    >
      <section style={s.section}>
        <h3 style={s.h3}>Temporizador (con cleanup)</h3>
        <p style={s.valor}>{segundos}s transcurridos</p>
        <div style={s.row}>
          <button style={s.btn} onClick={() => setActivo(a => !a)}>
            {activo ? "Pausar" : "Iniciar"}
          </button>
          <button style={{ ...s.btn, backgroundColor: "#dc2626" }} onClick={() => { setActivo(false); setSegundos(0); }}>
            Resetear
          </button>
        </div>
      </section>

      <section style={s.section}>
        <h3 style={s.h3}>Cambiar título de la pestaña</h3>
        <input
          style={s.input}
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          placeholder="Escribe el título..."
        />
        <p style={s.hint}>Mira la pestaña del navegador cambiar en tiempo real</p>
      </section>

      
    </HookLayout>
  );
}

const s = {
  section: { marginBottom: "1.5rem" },
  h3: { color: "#1e1b4b" },
  valor: { fontSize: "2rem", fontWeight: 700, color: "#4f46e5" },
  row: { display: "flex", gap: "0.75rem" },
  btn: { backgroundColor: "#4f46e5", color: "#fff", border: "none", padding: "0.5rem 1.2rem", borderRadius: 8, cursor: "pointer" },
  input: { padding: "0.5rem 0.75rem", borderRadius: 8, border: "1px solid #d1d5db", fontSize: "1rem", width: "100%", boxSizing: "border-box" },
  hint: { color: "#6b7280", fontSize: "0.85rem", marginTop: "0.5rem" },
  code: { backgroundColor: "#1e1b4b", color: "#a5b4fc", padding: "0.75rem 1rem", borderRadius: 8, fontFamily: "monospace", fontSize: "0.85rem", whiteSpace: "pre", overflowX: "auto" },
};
