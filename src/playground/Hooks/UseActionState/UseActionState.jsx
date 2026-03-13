import { useActionState } from "react";
import HookLayout from "/src/playground/components/HookLayout";

async function enviar(prevState,formData){

  const nombre=formData.get("nombre");

  await new Promise(r=>setTimeout(r,1500));

  if(!nombre){
    return {error:"Nombre requerido"};
  }

  return {success:`Hola ${nombre}`};
}

export default function UseActionStateEjemplo(){

  const [state,formAction,isPending]=useActionState(enviar,null);

  return(
    <HookLayout
      nombre="useActionState"
      descripcion="Simplifica el manejo de formularios async gestionando automáticamente estados de loading, error y éxito."
      categoria="Nuevos en React 19"
      autor="Gerardo"
    >

      <section style={s.section}>
        <h3 style={s.h3}>Formulario async</h3>

        <form action={formAction} style={s.row}>
          <input name="nombre" style={s.input}/>
          <button style={s.btn} type="submit">
            {isPending?"Enviando...":"Enviar"}
          </button>
        </form>

        {state?.error && <p style={{color:"red"}}>{state.error}</p>}
        {state?.success && <p style={{color:"green"}}>{state.success}</p>}

      </section>

    </HookLayout>
  );
}

const s={
section:{marginBottom:"1.5rem"},
h3:{color:"#1e1b4b"},
row:{display:"flex",gap:"0.5rem"},
input:{padding:"0.5rem",borderRadius:6,border:"1px solid #ccc"},
btn:{backgroundColor:"#4f46e5",color:"#fff",border:"none",padding:"0.5rem 1rem",borderRadius:8,cursor:"pointer"}
};