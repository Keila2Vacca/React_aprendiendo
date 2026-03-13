import { Link } from "react-router-dom";

const hooks = [
  // --- Estado ---
  { nombre: "useState", ruta: "/HookuseState", descripcion: "Maneja el estado local dentro de un componente funcional.", categoria: "Estado", autor: "Keila" },
  { nombre: "useReducer", ruta: "/HookuseReducer", descripcion: "Gestiona estado complejo mediante un reducer (acción + estado).", categoria: "Estado", autor: "Keila" },

  // --- Referencias ---
  { nombre: "useRef", ruta: "/HookuseRef", descripcion: "Crea una referencia mutable que persiste entre renders.", categoria: "Referencias", autor: "Karen" },
  { nombre: "useImperativeHandle", ruta: "/HookuseImperativeHandle", descripcion: "Personaliza el valor expuesto por ref al componente padre.", categoria: "Referencias", autor: "Karen" },

  // --- Contexto y datos externos ---
  { nombre: "useContext", ruta: "/HookuseContext", descripcion: "Accede al valor de un contexto React sin prop drilling.", categoria: "Contexto y datos externos", autor: "Karen" },
  { nombre: "useSyncExternalStore", ruta: "/HookuseSyncExternalStore", descripcion: "Suscribe el componente a una fuente de datos externa.", categoria: "Contexto y datos externos", autor: "Gerardo" },
  { nombre: "useId", ruta: "/HookuseId", descripcion: "Genera IDs únicos y estables para accesibilidad.", categoria: "Contexto y datos externos", autor: "Gerardo" },

  // --- Performance ---
  { nombre: "useMemo", ruta: "/HookuseMemo", descripcion: "Memoriza el resultado de un cálculo costoso.", categoria: "Performance", autor: "Gerardo" },
  { nombre: "useCallback", ruta: "/HookuseCallback", descripcion: "Memoriza una función para evitar recreaciones innecesarias.", categoria: "Performance", autor: "Gerardo" },
  { nombre: "useTransition", ruta: "/HookuseTransition", descripcion: "Marca actualizaciones de estado como no urgentes.", categoria: "Performance", autor: "Karen" },
  { nombre: "useDeferredValue", ruta: "/HookuseDeferredValue", descripcion: "Difiere la actualización de un valor para mejorar rendimiento.", categoria: "Performance", autor: "Karen" },

  // --- Efectos / ciclo de vida ---
  { nombre: "useEffect", ruta: "/HookuseEffect", descripcion: "Ejecuta efectos secundarios después del render.", categoria: "Efectos / ciclo de vida", autor: "Keila" },
  { nombre: "useLayoutEffect", ruta: "/HookuseLayoutEffect", descripcion: "Como useEffect pero se ejecuta antes de pintar en pantalla.", categoria: "Efectos / ciclo de vida", autor: "Keila" },
  { nombre: "useInsertionEffect", ruta: "/HookuseInsertionEffect", descripcion: "Inserta estilos dinámicos antes de que el DOM se pinte.", categoria: "Efectos / ciclo de vida", autor: "Gerardo" },

  // --- Debug ---
  { nombre: "useDebugValue", ruta: "/HookuseDebugValue", descripcion: "Muestra una etiqueta en React DevTools para hooks personalizados.", categoria: "Debug", autor: "Keila" },

  // --- Nuevos React 19 ---
  { nombre: "useOptimistic", ruta: "/HookuseOptimistic", descripcion: "Actualiza la UI optimistamente antes de confirmar con el servidor.", categoria: "Nuevos en React 19", autor: "Karen" },
  { nombre: "useFormStatus", ruta: "/HookuseFormStatus", descripcion: "Accede al estado de envío del formulario padre.", categoria: "Nuevos en React 19", autor: "Karen" },
  { nombre: "useActionState", ruta: "/HookuseActionState", descripcion: "Gestiona el estado de una acción asíncrona de formulario.", categoria: "Nuevos en React 19", autor: "Gerardo" },
];

const categoriaColores = {
  "Estado": "#4f46e5",
  "Referencias": "#0891b2",
  "Contexto y datos externos": "#7c3aed",
  "Performance": "#059669",
  "Efectos / ciclo de vida": "#d97706",
  "Debug": "#dc2626",
  "Nuevos en React 19": "#db2777",
};

export default function HomeHooks() {
  return (
    <div style={styles.page}>


      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              {["Hook", "Ir al ejemplo", "Descripción", "Categoría", "Autora/or"].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hooks.map((hook, i) => (
              <tr key={hook.nombre} style={{ backgroundColor: i % 2 === 0 ? "#f9fafb" : "#fff" }}>
                <td style={styles.tdName}>{hook.nombre}</td>
                <td style={styles.td}>
                  <Link to={hook.ruta} style={styles.btn}>Ir a ejemplo</Link>
                </td>
                <td style={styles.td}>{hook.descripcion}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, backgroundColor: categoriaColores[hook.categoria] || "#6b7280" }}>
                    {hook.categoria}
                  </span>
                </td>
                <td style={styles.td}>{hook.autor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  page: { fontFamily: "'Segoe UI', sans-serif", maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem" },
  header: { textAlign: "center", marginBottom: "2rem" },
  title: { fontSize: "2rem", color: "#1e1b4b", margin: 0 },
  subtitle: { color: "#6b7280", marginTop: "0.5rem" },
  note: { backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "0.75rem 1rem", display: "inline-block", marginTop: "0.5rem", color: "#1e40af", fontSize: "0.9rem" },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", boxShadow: "0 1px 8px rgba(0,0,0,0.08)", borderRadius: 10, overflow: "hidden" },
  th: { backgroundColor: "#1e1b4b", color: "#fff", padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600, fontSize: "0.9rem" },
  td: { padding: "0.7rem 1rem", fontSize: "0.88rem", color: "#374151", verticalAlign: "middle" },
  tdName: { padding: "0.7rem 1rem", fontWeight: 700, color: "#1e1b4b", whiteSpace: "nowrap" },
  btn: { backgroundColor: "#4f46e5", color: "#fff", padding: "0.35rem 0.9rem", borderRadius: 6, textDecoration: "none", fontSize: "0.82rem", display: "inline-block" },
  badge: { color: "#fff", padding: "0.25rem 0.6rem", borderRadius: 20, fontSize: "0.75rem", fontWeight: 600, whiteSpace: "nowrap" },
};