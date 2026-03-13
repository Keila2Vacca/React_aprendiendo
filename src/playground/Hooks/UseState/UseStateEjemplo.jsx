import { useState } from "react";
import HookLayout from "/src/playground/components/HookLayout";

export default function UseStateEjemplo() {
  const [contador, setContador] = useState(0);
  const [nombre, setNombre] = useState("");

  return (
    <HookLayout
      nombre="useState"
      descripcion="Maneja el estado local dentro de un componente funcional. Devuelve el estado actual y una función para actualizarlo."
      categoria="Estado"
      autor="Keila"
    >
      {/* Ejemplo 1: Contador */}
      <section style={s.section}>
        <h3 style={s.h3}>Contador</h3>
        <p style={s.valor}>Valor actual: <strong>{contador}</strong></p>
        <div style={s.btnRow}>
          <button style={s.btn} onClick={() => setContador(c => c - 1)}>Disminuir</button>
          <button style={{ ...s.btn, backgroundColor: "#6b7280" }} onClick={() => setContador(0)}>Reiniciar</button>
          <button style={{ ...s.btn, backgroundColor: "#059669" }} onClick={() => setContador(c => c + 1)}> Aumentar</button>
        </div>
      </section>

      {/* Ejemplo 2: Input controlado */}
      <section style={s.section}>
        <h3 style={s.h3}>Input controlado</h3>
        <input
          style={s.input}
          type="text"
          placeholder="Escribe tu nombre..."
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        {nombre && <p style={s.saludo}>Hola, <strong>{nombre}</strong>!</p>}
      </section>

    </HookLayout>
  );
}

const s = {
  section: { marginBottom: "1.5rem" },
  h3: { color: "#1e1b4b", marginBottom: "0.5rem" },
  valor: { fontSize: "1.2rem", marginBottom: "0.75rem" },
  btnRow: { display: "flex", gap: "0.75rem", flexWrap: "wrap" },
  btn: { backgroundColor: "#4f46e5", color: "#fff", border: "none", padding: "0.5rem 1.2rem", borderRadius: 8, cursor: "pointer", fontSize: "0.9rem" },
  input: { padding: "0.5rem 0.75rem", borderRadius: 8, border: "1px solid #d1d5db", fontSize: "1rem", width: "100%", boxSizing: "border-box" },
  saludo: { marginTop: "0.5rem", color: "#059669", fontWeight: 600 },
  code: { backgroundColor: "#1e1b4b", color: "#a5b4fc", padding: "0.75rem 1rem", borderRadius: 8, fontFamily: "monospace", fontSize: "0.9rem", marginTop: "1rem" },
};
