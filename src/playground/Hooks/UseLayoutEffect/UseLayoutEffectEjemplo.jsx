import { useState, useLayoutEffect, useRef } from "react";
import HookLayout from "/src/playground/components/HookLayout";

export default function UseLayoutEffectEjemplo() {
  const cajaRef = useRef(null);
  const [dimensiones, setDimensiones] = useState({ ancho: 0, alto: 0 });
  const [texto, setTexto] = useState("Cambia este texto para ver las dimensiones actualizarse");

  useLayoutEffect(() => {
    if (cajaRef.current) {
      const { width, height } = cajaRef.current.getBoundingClientRect();
      setDimensiones({ ancho: Math.round(width), alto: Math.round(height) });
    }
  }, [texto]);

  return (
    <HookLayout
      nombre="useLayoutEffect"
      descripcion="Idéntico a useEffect pero se dispara de forma síncrona ANTES de que el navegador pinte el DOM. Útil para leer el layout y evitar parpadeos visuales."
      categoria="Efectos / ciclo de vida"
      autor="Keila"
    >
      <h3 style={s.h3}>Medición de dimensiones del DOM</h3>

      <textarea
        style={s.textarea}
        value={texto}
        onChange={e => setTexto(e.target.value)}
        rows={3}
      />

      <div ref={cajaRef} style={s.caja}>
        <p style={{ margin: 0 }}>{texto}</p>
      </div>

      <div style={s.info}>
        <span>Ancho: <strong>{dimensiones.ancho}px</strong></span>
        <span>Alto: <strong>{dimensiones.alto}px</strong></span>
      </div>

      <p style={s.hint}>
        useLayoutEffect lee las dimensiones <em>antes</em> de que el usuario vea el repintado,
        evitando el parpadeo que causaría useEffect.
      </p>

      
    </HookLayout>
  );
}

const s = {
  h3: { color: "#1e1b4b" },
  textarea: { width: "100%", padding: "0.5rem", borderRadius: 8, border: "1px solid #d1d5db", fontSize: "0.9rem", boxSizing: "border-box", marginBottom: "1rem", resize: "vertical" },
  caja: { backgroundColor: "#eff6ff", border: "2px dashed #93c5fd", borderRadius: 8, padding: "1rem", marginBottom: "0.75rem" },
  info: { display: "flex", gap: "2rem", fontSize: "1rem", color: "#1e40af", marginBottom: "0.75rem" },
  hint: { color: "#6b7280", fontSize: "0.85rem" },
  code: { backgroundColor: "#1e1b4b", color: "#a5b4fc", padding: "0.75rem 1rem", borderRadius: 8, fontFamily: "monospace", fontSize: "0.85rem", whiteSpace: "pre", overflowX: "auto" },
};
