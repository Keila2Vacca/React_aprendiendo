
import { useNavigate, Link } from "react-router-dom";

function HookUseNavigate() {
  const navigate = useNavigate();

  const irAHomeHooks = () => {
    navigate("/");
  };

  return (
    <div>
      {/* Navegación con Link */}
      <Link to="/">Ir al HomeHooks</Link>

      {/* Navegación con useNavigate */}
      <button onClick={irAHomeHooks}>Ir a HomeHooks</button>

      {/* Navegación con etiqueta <a> (solo para externos) */}
      <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
        Documentación de React
      </a>
    </div>
  );
}

export default HookUseNavigate;
