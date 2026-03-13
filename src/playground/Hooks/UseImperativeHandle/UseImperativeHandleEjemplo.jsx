import { useRef, forwardRef, useImperativeHandle } from "react";
import HookLayout from "/src/playground/components/HookLayout";

const InputHijo = forwardRef((props, ref) => {

  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    enfocar: () => {
      inputRef.current.focus();
    }
  }));

  return <input ref={inputRef} style={s.input} placeholder="Soy un input del hijo" />;
});

export default function UseImperativeHandleEjemplo(){

  const ref = useRef();

  return(

  <HookLayout
  nombre="useImperativeHandle"
  descripcion="Permite exponer funciones específicas de un componente hijo al padre."
  categoria="Referencias"
  autor="Karen"
  >

  <section style={s.section}>

  <InputHijo ref={ref}/>

  <button style={s.btn} onClick={()=>ref.current.enfocar()}>
  Enfocar desde el padre
  </button>

  </section>

  </HookLayout>

  )
}

const s={
section:{marginBottom:"1.5rem"},
input:{padding:"0.5rem",borderRadius:6,border:"1px solid #ccc"},
btn:{background:"#4f46e5",color:"#fff",border:"none",padding:"0.5rem 1.5rem",borderRadius:8,cursor:"pointer"}
}