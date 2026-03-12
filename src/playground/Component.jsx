import { Link } from "react-router-dom";

function Saludar() {
  return (
    <div>
      <h1>Bienvenido a la app</h1>
      <img className="logo" src="/pascal_y_rapunzel.jpg" alt="Pascal y Rapunzel" />
      <br/>
      <Link to="/">
        <button>Volver al HomeHooks</button>
      </Link>
    </div>
  );
}

export default Saludar;
