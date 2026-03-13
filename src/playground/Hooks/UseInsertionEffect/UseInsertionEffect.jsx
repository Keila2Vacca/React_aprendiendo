import { useInsertionEffect } from "react";
import HookLayout from "/src/playground/components/HookLayout";

function useDynamicStyle(color){

  useInsertionEffect(()=>{
    const style = document.createElement("style");

    style.innerHTML = `.dynamic-text{color:${color};font-weight:bold}`;

    document.head.appendChild(style);

    return ()=> document.head.removeChild(style);

  },[color]);
}

export default function UseInsertionEffectEjemplo(){

  useDynamicStyle("#ef4444");

  return(
    <HookLayout
      nombre="useInsertionEffect"
      descripcion="Se ejecuta antes de useLayoutEffect y permite insertar estilos antes de que el DOM se pinte."
      categoria="Efectos / ciclo de vida"
      autor="Gerardo"
    >

      <section style={s.section}>
        <h3 style={s.h3}>Estilo dinámico</h3>

        <p className="dynamic-text">
          Este texto recibe estilos antes del render.
        </p>

      </section>

    </HookLayout>
  );
}

const s={
section:{marginBottom:"1.5rem"},
h3:{color:"#1e1b4b"}
};