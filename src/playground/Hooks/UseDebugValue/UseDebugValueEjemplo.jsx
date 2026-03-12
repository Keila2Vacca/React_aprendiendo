

import { useState, useEffect, useDebugValue } from "react";
import HookLayout from "/src/playground/components/HookLayout";

// Custom Hook que usa useDebugValue
function useEstadoConexion() {
  const [online, setOnline] = useState(navigator.onLine);

  useDebugValue(online ? "Online" : "Offline");

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  return online;
}

// Otro custom hook de ejemplo
function useContadorDebug(inicial = 0) {
  const [valor, setValor] = useState(inicial);
  useDebugValue(`Valor actual: ${valor}`);
  return [valor, setValor];
}

export default function UseDebugValueEjemplo() {
  const online = useEstadoConexion();
  const [valor, setValor] = useContadorDebug(10);

  return (
    <HookLayout
      nombre="useDebugValue"
      descripcion="Muestra una etiqueta personalizada en React DevTools cuando inspeccionas un Custom Hook. No afecta el comportamiento de la app, solo ayuda en el debugging."
      categoria="Debug"
      autor="Keila"
    >

      <section style={s.section}>
        <h3 style={s.h3}>Custom Hook: useEstadoConexion</h3>
        <div style={{ ...s.estado, backgroundColor: online ? "#d1fae5" : "#fee2e2", borderColor: online ? "#6ee7b7" : "#fca5a5" }}>
          {online ? "Estás ONLINE" : "Estás OFFLINE"}
        </div>
        <p style={s.hint}>Desactiva tu Wi-Fi para ver el cambio en tiempo real.</p>
      </section>

      <section style={s.section}>
        <h3 style={s.h3}>Custom Hook: useContadorDebug</h3>
        <p>Valor: <strong style={{ fontSize: "1.5rem", color: "#4f46e5" }}>{valor}</strong></p>
        <div style={s.row}>
          <button style={s.btn} onClick={() => setValor(v => v - 1)}>−</button>
          <button style={{ ...s.btn, backgroundColor: "#059669" }} onClick={() => setValor(v => v + 1)}>+</button>
        </div>
      </section>


    </HookLayout>
  );
}

const s = {
  alerta: { backgroundColor: "#fef3c7", border: "1px solid #fde68a", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1.5rem", fontSize: "0.88rem", color: "#92400e" },
  section: { marginBottom: "1.5rem" },
  h3: { color: "#1e1b4b" },
  estado: { padding: "1rem 1.5rem", borderRadius: 10, border: "2px solid", fontWeight: 700, fontSize: "1.1rem", display: "inline-block" },
  hint: { color: "#6b7280", fontSize: "0.85rem", marginTop: "0.5rem" },
  row: { display: "flex", gap: "0.75rem" },
  btn: { backgroundColor: "#4f46e5", color: "#fff", border: "none", padding: "0.5rem 1.5rem", borderRadius: 8, cursor: "pointer", fontSize: "1.1rem" },
  code: { backgroundColor: "#1e1b4b", color: "#a5b4fc", padding: "0.75rem 1rem", borderRadius: 8, fontFamily: "monospace", fontSize: "0.85rem", whiteSpace: "pre", overflowX: "auto" },
};
