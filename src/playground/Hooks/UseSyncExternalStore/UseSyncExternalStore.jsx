import { useSyncExternalStore } from "react";
import HookLayout from "/src/playground/components/HookLayout";

let count = 0;
let listeners = [];

const store = {
  getSnapshot:()=>count,

  subscribe:(listener)=>{
    listeners.push(listener);
    return ()=> listeners = listeners.filter(l=>l!==listener);
  },

  increment(){
    count++;
    listeners.forEach(l=>l());
  }
};

export default function UseSyncExternalStoreEjemplo(){

  const value = useSyncExternalStore(store.subscribe,store.getSnapshot);

  return(
    <HookLayout
      nombre="useSyncExternalStore"
      descripcion="Permite conectar React con un store externo de forma segura en concurrent rendering."
      categoria="Contexto y datos externos"
      autor="Gerardo"
    >

      <section style={s.section}>
        <h3 style={s.h3}>Mini store externo</h3>

        <p>Valor: <strong style={{fontSize:"1.4rem"}}>{value}</strong></p>

        <button style={s.btn} onClick={()=>store.increment()}>
          Incrementar
        </button>
      </section>

    </HookLayout>
  );
}

const s={
section:{marginBottom:"1.5rem"},
h3:{color:"#1e1b4b"},
btn:{backgroundColor:"#4f46e5",color:"#fff",border:"none",padding:"0.5rem 1.5rem",borderRadius:8,cursor:"pointer"}
};