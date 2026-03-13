import { useId } from "react";
import HookLayout from "/src/playground/components/HookLayout";

export default function UseIdEjemplo() {
  const id = useId();

  return (
    <HookLayout
      nombre="useId"
      descripcion="Genera IDs únicos y estables para asociar elementos como label e input, especialmente útil en formularios y SSR."
      categoria="Contexto y datos externos"
      autor="Gerardo"
    >

      <section style={s.section}>
        <h3 style={s.h3}>Formulario accesible</h3>

        <label htmlFor={id}>Nombre</label>
        <input id={id} style={s.input} placeholder="Escribe tu nombre" />

        <p style={s.hint}>
          El ID generado es único incluso si el componente se renderiza múltiples veces.
        </p>
      </section>

    </HookLayout>
  );
}

const s = {
  section:{marginBottom:"1.5rem"},
  h3:{color:"#1e1b4b"},
  input:{display:"block",marginTop:"0.5rem",padding:"0.5rem",borderRadius:6,border:"1px solid #ccc"},
  hint:{color:"#6b7280",fontSize:"0.85rem",marginTop:"0.5rem"}
};