import { useReducer } from "react";
import HookLayout from "/src/playground/components/HookLayout";

const initialState = { items: [], input: "" };

function reducer(state, action) {
  switch (action.type) {
    case "SET_INPUT": return { ...state, input: action.payload };
    case "ADD_ITEM":
      if (!state.input.trim()) return state;
      return { items: [...state.items, { id: Date.now(), texto: state.input, done: false }], input: "" };
    case "TOGGLE": return { ...state, items: state.items.map(i => i.id === action.id ? { ...i, done: !i.done } : i) };
    case "REMOVE": return { ...state, items: state.items.filter(i => i.id !== action.id) };
    default: return state;
  }
}

export default function UseReducerEjemplo() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <HookLayout
      nombre="useReducer"
      descripcion="Alternativa a useState para manejar estado complejo. Utiliza un reducer (función pura) que recibe el estado actual y una acción, y retorna el nuevo estado."
      categoria="Estado"
      autor="Keila"
    >
      <h3 style={s.h3}>Lista de tareas con useReducer</h3>
      <div style={s.row}>
        <input
          style={s.input}
          value={state.input}
          onChange={e => dispatch({ type: "SET_INPUT", payload: e.target.value })}
          onKeyDown={e => e.key === "Enter" && dispatch({ type: "ADD_ITEM" })}
          placeholder="Nueva tarea (Enter para agregar)..."
        />
        <button style={s.btn} onClick={() => dispatch({ type: "ADD_ITEM" })}>Agregar</button>
      </div>

      <ul style={s.list}>
        {state.items.length === 0 && <li style={s.empty}>No hay tareas aún.</li>}
        {state.items.map(item => (
          <li key={item.id} style={s.item}>
            <span
              style={{ ...s.texto, textDecoration: item.done ? "line-through" : "none", opacity: item.done ? 0.5 : 1 }}
              onClick={() => dispatch({ type: "TOGGLE", id: item.id })}
            >
            </span>
            <button style={s.del} onClick={() => dispatch({ type: "REMOVE", id: item.id })}>🗑</button>
          </li>
        ))}
      </ul>

    </HookLayout>
  );
}

const s = {
  h3: { color: "#1e1b4b" },
  row: { display: "flex", gap: "0.5rem", marginBottom: "1rem" },
  input: { flex: 1, padding: "0.5rem 0.75rem", borderRadius: 8, border: "1px solid #d1d5db", fontSize: "1rem" },
  btn: { backgroundColor: "#4f46e5", color: "#fff", border: "none", padding: "0.5rem 1.2rem", borderRadius: 8, cursor: "pointer" },
  list: { listStyle: "none", padding: 0, margin: 0 },
  empty: { color: "#9ca3af", fontStyle: "italic", textAlign: "center", padding: "1rem" },
  item: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0", borderBottom: "1px solid #f3f4f6" },
  texto: { cursor: "pointer", flex: 1 },
  del: { background: "none", border: "none", cursor: "pointer", fontSize: "1rem" },
  code: { backgroundColor: "#1e1b4b", color: "#a5b4fc", padding: "0.75rem 1rem", borderRadius: 8, fontFamily: "monospace", fontSize: "0.9rem", marginTop: "1rem" },
};
