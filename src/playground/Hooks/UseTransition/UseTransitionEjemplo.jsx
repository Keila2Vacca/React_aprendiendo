import { useState, useTransition } from "react";
import HookLayout from "/src/playground/components/HookLayout";

export default function UseTransitionEjemplo() {

  const [texto, setTexto] = useState("");
  const [lista, setLista] = useState([]);
  const [isPending, startTransition] = useTransition();

  const manejarCambio = (e) => {

    const valor = e.target.value;
    setTexto(valor);

    startTransition(() => {

      const nuevaLista = [];
      for (let i = 0; i < 2000; i++) {
        nuevaLista.push(valor);
      }

      setLista(nuevaLista);
    });

  };

  return (

    <HookLayout
      nombre="useTransition"
      descripcion="Permite marcar actualizaciones como no urgentes para que la interfaz siga respondiendo rápido."
      categoria="Performance"
      autor="Karen"
    >

      <section style={s.section}>
        <h3 style={s.h3}>Búsqueda optimizada</h3>

        <input
          value={texto}
          onChange={manejarCambio}
          style={s.input}
          placeholder="Escribe algo..."
        />

        {isPending && <p style={s.hint}>Actualizando lista...</p>}

        <ul style={s.lista}>
          {lista.slice(0,20).map((item,i)=>
            <li key={i}>{item}</li>
          )}
        </ul>

      </section>

    </HookLayout>

  );
}

const s = {
section:{marginBottom:"1.5rem"},
h3:{color:"#1e1b4b"},
input:{padding:"0.5rem",borderRadius:6,border:"1px solid #ccc"},
lista:{marginTop:"1rem"},
hint:{color:"#6b7280",fontSize:"0.85rem"}
};