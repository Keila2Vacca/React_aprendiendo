import { Link } from "react-router-dom";

function HomeHooks() {
  return (
    <>
      <h1>HomeHooks</h1>
      <h2>Keila Nathaly</h2>
      <img className="logo" src="/Pascal.jpg" alt="Pascal" />
      <img className="logo" src="/Pascal1.jpg" alt="Pascal" />

      <h3>Ejemplos disponibles:</h3>
        <Link to="/saludar">
            <button>Ir a Saludar</button>
        </Link>
        <Link to="/usenavigate">
            <button>Ir a useNavigate</button>
        </Link>
        <Link to="/usestate">
            <button>Ir a useState</button>
        </Link>
    </>
  )
}

export default HomeHooks;
