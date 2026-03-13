import { useState, useDeferredValue } from "react";
import HookLayout from "/src/playground/components/HookLayout";

export default function UseDeferredValueEjemplo() {

  const [texto, setTexto] = useState("");
  const textoDiferido = useDeferredValue(texto);

  return (

    <HookLayout
      nombre="useDeferredValue"
      descripcion="Permite retrasar el uso de un valor para evitar renderizados costosos."
      categoria="Performance"
      autor="Karen"
    >

      <section style={s.section}>
        <h3 style={s.h3}>Comparación de valores</h3>

        <input
          value={texto}
          onChange={(e)=>setTexto(e.target.value)}
          style={s.input}
        />

        <p>Valor inmediato: {texto}</p>
        <p>Valor diferido: {textoDiferido}</p>

        <p style={s.hint}>
          El valor diferido se actualiza un poco después.
        </p>

      </section>

    </HookLayout>

  );
}

const s={
section:{marginBottom:"1.5rem"},
h3:{color:"#1e1b4b"},
input:{padding:"0.5rem",borderRadius:6,border:"1px solid #ccc"},
hint:{fontSize:"0.85rem",color:"#6b7280"}
};