import { useState } from "react";
import HookLayout from "/src/playground/components/HookLayout";

export default function UseFormStatusEjemplo(){

const [enviando,setEnviando]=useState(false)

const enviar=(e)=>{
e.preventDefault()

setEnviando(true)

setTimeout(()=>{
setEnviando(false)
alert("Formulario enviado")
},2000)

}

return(

<HookLayout
nombre="useFormStatus"
descripcion="Permite saber si un formulario se está enviando para mostrar estados de carga."
categoria="React 19"
autor="Karen"
>

<section style={s.section}>

<form onSubmit={enviar}>

<input placeholder="Tu nombre" style={s.input}/>

<button style={s.btn} disabled={enviando}>
{enviando ? "Enviando..." : "Enviar"}
</button>

</form>

</section>

</HookLayout>

)
}

const s={
section:{marginBottom:"1.5rem"},
input:{padding:"0.5rem",borderRadius:6,border:"1px solid #ccc",marginRight:"0.5rem"},
btn:{background:"#4f46e5",color:"#fff",border:"none",padding:"0.5rem 1.5rem",borderRadius:8,cursor:"pointer"}
}