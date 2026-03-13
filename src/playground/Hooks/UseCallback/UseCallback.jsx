import { useState, useCallback, memo } from "react";
import HookLayout from "/src/playground/components/HookLayout";

const Boton = memo(({ onClick })=>{
  console.log("Render botón");
  return <button style={s.btn} onClick={onClick}>Click hijo</button>;
});

export default function UseCallbackEjemplo(){

  const [count,setCount]=useState(0);

  const handleClick = useCallback(()=>{
    alert("Click desde hijo");
  },[]);

  return(
    <HookLayout
      nombre="useCallback"
      descripcion="Memoriza funciones para evitar recrearlas en cada render y optimizar componentes hijos."
      categoria="Performance"
      autor="Gerardo"
    >

      <section style={s.section}>
        <h3 style={s.h3}>Evitar renders innecesarios</h3>

        <button style={s.btn} onClick={()=>setCount(c=>c+1)}>
          Contador {count}
        </button>

        <Boton onClick={handleClick}/>

        <p style={s.hint}>
          El botón hijo no se vuelve a renderizar innecesariamente.
        </p>
      </section>

    </HookLayout>
  );
}

const s={
section:{marginBottom:"1.5rem"},
h3:{color:"#1e1b4b"},
btn:{backgroundColor:"#4f46e5",color:"#fff",border:"none",padding:"0.5rem 1.5rem",borderRadius:8,cursor:"pointer"},
hint:{color:"#6b7280",fontSize:"0.85rem",marginTop:"0.5rem"}
};