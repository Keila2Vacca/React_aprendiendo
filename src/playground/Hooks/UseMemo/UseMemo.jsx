import { useState, useMemo } from "react";
import HookLayout from "/src/playground/components/HookLayout";

function calcularPrimos(limite) {
  console.log("Calculando...");
  const primos = [];

  for (let i = 2; i <= limite; i++) {
    let primo = true;
    for (let j = 2; j < i; j++) {
      if (i % j === 0) {
        primo = false;
        break;
      }
    }
    if (primo) primos.push(i);
  }

  return primos;
}

export default function UseMemoEjemplo() {
  const [limite, setLimite] = useState(3000);
  const [contador, setContador] = useState(0);

  const primos = useMemo(() => calcularPrimos(limite), [limite]);

  return (
    <HookLayout
      nombre="useMemo"
      descripcion="Memoriza el resultado de un cálculo costoso para evitar recalcularlo en cada render."
      categoria="Performance"
      autor="Gerardo"
    >

      <section style={s.section}>
        <h3 style={s.h3}>Cálculo de números primos</h3>

        <p>Total primos: <strong>{primos.length}</strong></p>

        <div style={s.row}>
          <button style={s.btn} onClick={()=>setContador(c=>c+1)}>
            Re-render {contador}
          </button>

          <button style={{...s.btn,backgroundColor:"#059669"}}
            onClick={()=>setLimite(l=>l+1000)}>
            Aumentar límite
          </button>
        </div>

        <p style={s.hint}>
          Observa la consola: solo se recalcula cuando cambia el límite.
        </p>
      </section>

    </HookLayout>
  );
}

const s={
section:{marginBottom:"1.5rem"},
h3:{color:"#1e1b4b"},
row:{display:"flex",gap:"0.75rem"},
btn:{backgroundColor:"#4f46e5",color:"#fff",border:"none",padding:"0.5rem 1.5rem",borderRadius:8,cursor:"pointer"},
hint:{color:"#6b7280",fontSize:"0.85rem",marginTop:"0.5rem"}
};