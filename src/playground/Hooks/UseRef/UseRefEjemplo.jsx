import { useRef } from "react";
import HookLayout from "/src/playground/components/HookLayout";

export default function UseRefEjemplo(){

  const inputRef = useRef(null);

  const enfocarInput = () => {
    inputRef.current.focus();
  };

  return(

    <HookLayout
      nombre="useRef"
      descripcion="Permite acceder directamente a un elemento del DOM o guardar valores que no causan renderizado."
      categoria="Referencias"
      autor="Karen"
    >

      <section style={s.section}>

        <h3 style={s.h3}>Enfocar un input</h3>

        <input
          ref={inputRef}
          style={s.input}
          placeholder="Escribe algo aquí..."
        />

        <br /><br />

        <button style={s.btn} onClick={enfocarInput}>
          Enfocar input
        </button>

        <p style={s.hint}>
          El botón usa useRef para acceder al input directamente.
        </p>

      </section>

    </HookLayout>

  )
}

const s = {
  section:{marginBottom:"1.5rem"},
  h3:{color:"#1e1b4b"},
  input:{padding:"0.5rem",borderRadius:6,border:"1px solid #ccc"},
  btn:{background:"#4f46e5",color:"#fff",border:"none",padding:"0.5rem 1.5rem",borderRadius:8,cursor:"pointer"},
  hint:{fontSize:"0.85rem",color:"#6b7280"}
};