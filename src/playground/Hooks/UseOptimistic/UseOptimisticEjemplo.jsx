import { useState } from "react";
import HookLayout from "/src/playground/components/HookLayout";

export default function UseOptimisticEjemplo(){

const [mensajes,setMensajes]=useState([])

const enviar=()=>{

const nuevo="Mensaje enviado"

setMensajes([...mensajes,nuevo])

}

return(

<HookLayout
nombre="useOptimistic"
descripcion="Permite mostrar cambios inmediatamente antes de que el servidor confirme la acción."
categoria="React 19"
autor="Karen"
>

<section style={s.section}>

<button style={s.btn} onClick={enviar}>
Enviar mensaje
</button>

<ul>
{mensajes.map((m,i)=><li key={i}>{m}</li>)}
</ul>

</section>

</HookLayout>

)
}

const s={
section:{marginBottom:"1.5rem"},
btn:{background:"#4f46e5",color:"#fff",border:"none",padding:"0.5rem 1.5rem",borderRadius:8,cursor:"pointer"}
}