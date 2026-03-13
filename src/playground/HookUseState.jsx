import { useState } from "react";
import { useNavigate } from "react-router-dom"; 

function HookUseState() {
  const [count, setCount] = useState(0);
  const [nombre, setNombre] = useState("");
  const navigate = useNavigate(); 
  const irAHomeHooks = () => {
    navigate("/");
  };

  function aumentar() {
    setCount(count + 1);
  }

  function disminuir() {
    if (count > 0) {
      setCount(count - 1);
    }
  }

  return (
    <div>
      <h1>HookUseState</h1>

      {/* Navegación con useNavigate */}
      <button onClick={irAHomeHooks}>Ir a HomeHooks</button>
      <br/>
      <img className="logo" src="/Pascal1.jpg" alt="Pascal" />

      {/* Ejemplo 1: Contador */}
      <section>
        <h2>Contador</h2>
        <h3>Valor actual = {count}</h3>
        <button onClick={aumentar}>Aumentar</button>
        <button onClick={disminuir}>Disminuir</button>
        <button onClick={() => setCount(0)}>Reiniciar</button>
      </section>

      {/* Ejemplo 2: Input controlado */}
      <section>
        <h2>Input controlado</h2>
        <input
          type="text"
          placeholder="Escribe tu nombre..."
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        {nombre && <p>Hola, <strong>{nombre}</strong>!</p>}
      </section>
      
    </div>
  );
}

export default HookUseState;
