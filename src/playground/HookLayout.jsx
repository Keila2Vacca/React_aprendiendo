function HookLayout({ nombre, descripcion, categoria, autor, children }) {
  return (
    <div>
      <h2>{nombre}</h2>
      <p>{descripcion}</p>
      <p><strong>Categoría:</strong> {categoria}</p>
      <p><strong>Autor:</strong> {autor}</p>
      <div>{children}</div>
    </div>
  );
}

export default HookLayout;
