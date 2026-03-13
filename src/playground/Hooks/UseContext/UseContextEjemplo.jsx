import { createContext, useContext, useState } from "react";
import HookLayout from "/src/playground/components/HookLayout";

const ThemeContext = createContext();

function Panel() {
  const { tema } = useContext(ThemeContext);

  return (
    <div style={{
      padding: "1rem",
      borderRadius: 8,
      backgroundColor: tema === "oscuro" ? "#1e1b4b" : "#e0e7ff",
      color: tema === "oscuro" ? "#fff" : "#000"
    }}>
      Este componente usa el tema desde el contexto.
    </div>
  );
}

export default function UseContextEjemplo() {

  const [tema, setTema] = useState("claro");

  const cambiarTema = () => {
    setTema(t => t === "claro" ? "oscuro" : "claro");
  };

  return (
    <HookLayout
      nombre="useContext"
      descripcion="Permite compartir datos entre muchos componentes sin tener que pasar props manualmente."
      categoria="Contexto"
      autor="Karen"
    >

      <ThemeContext.Provider value={{ tema }}>

        <section style={s.section}>
          <h3 style={s.h3}>Tema global</h3>

          <button style={s.btn} onClick={cambiarTema}>
            Cambiar tema
          </button>

          <p style={s.hint}>Tema actual: {tema}</p>

          <Panel />

        </section>

      </ThemeContext.Provider>

    </HookLayout>
  );
}

const s = {
  section:{marginBottom:"1.5rem"},
  h3:{color:"#1e1b4b"},
  btn:{background:"#4f46e5",color:"#fff",border:"none",padding:"0.5rem 1.5rem",borderRadius:8,cursor:"pointer"},
  hint:{fontSize:"0.85rem",color:"#6b7280"}
};