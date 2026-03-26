# Sistema de Reserva de Pasajes – Hacaritama

![Estado del Proyecto](https://img.shields.io/badge/estado-en%20desarrollo-yellow)
![Versión](https://img.shields.io/badge/versión-0.1.0-blue)
![Licencia](https://img.shields.io/badge/licencia-Académico-green)
![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-7-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-teal)

Sistema web SPA (Single Page Application) para la gestión y venta de pasajes intermunicipales de la **Cooperativa de Transporte Hacaritama** (Ábrego, Norte de Santander), desarrollado con React.

---

## Descripción

Plataforma web que permite a los usuarios:
- **Comprar pasajes online** con selección de asiento
- **Buscar viajes** por origen, destino y fecha
- **Pagar electrónicamente** de forma segura
- **Recibir pasaje digital** con código QR

Y a la cooperativa:
- **Gestionar flota** de vehículos
- **Administrar conductores** y rutas
- **Control en tiempo real** de asientos disponibles

---

## Problema que Resuelve

**Situación actual:**
-  Venta de pasajes **solo presencial** o por teléfono
-  **Conflictos por dobles asignaciones** de asientos
-  No hay control de inventario en tiempo real
-  Falta de trazabilidad de ventas

**Solución:**
-  Sistema web accesible 24/7
-  Asignación única de asientos (constraint en BD)
-  Inventario actualizado automáticamente
-  Historial completo de transacciones

---

##  Tecnologías Utilizadas

### Frontend
| Herramienta | Versión | Rol |
|------------|---------|-----|
| **React** | 19 | Biblioteca de UI |
| **Vite** | 7 | Build tool y servidor de desarrollo |
| **Tailwind CSS** | 4 | Estilos utilitarios |
| **React Router DOM** | 7 | Navegación SPA |
| **SweetAlert2** | 11 | Modales de retroalimentación |
| **Lucide React** | 1 | Iconografía |

### Control de Versiones
- **Git / GitHub** — Flujo Git Flow con ramas `main`, `develop`, `feature/knvb`, `feature-karen`, `feature-gerardo`

---

##  Estructura del Proyecto

```
src/
├── pages/
│   └── auth/
│       ├── LoginPage.jsx        # Vista Login (Keila)
│       ├── RegisterPage.jsx     # Vista Registro (Karen)
│       ├── ForgotPage.jsx       # Vista Recuperar Contraseña (Gerardo)
│       └── ResetPage.jsx        # Vista Restablecer Contraseña (Gerardo)
├── playground/
│   └── hooks/                   # Ejemplos de Hooks de React (práctica anterior)
├── App.jsx                      # Componente raíz con rutas
└── main.jsx                     # Punto de entrada
```

---

##  Requisitos Previos

- **Node.js** 18+ y npm
- **Git** 2.30+

---

##  Inicio Rápido

### 1. Clonar el repositorio
```bash
git clone https://github.com/Keila2Vacca/React_aprendiendo.git
cd React_aprendiendo
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar el servidor de desarrollo
```bash
npm run dev
```

Frontend corriendo en `http://localhost:5173`

---

##  Vistas de Autenticación

| Vista | Ruta | Descripción |
|-------|------|-------------|
| `LoginPage` | `/` | Inicio de sesión con email y contraseña |
| `RegisterPage` | `/register` | Registro con validaciones y botones sociales |
| `ForgotPage` | `/forgot-password` | Envío de token de recuperación por correo |
| `ResetPage` | `/reset-password` | Creación de nueva contraseña |

> **Nota:** No hay conexión a base de datos aún. Los datos capturados se imprimen en un modal (SweetAlert2).

### Validaciones Implementadas
-  Campos obligatorios en todos los formularios
-  Formato de correo electrónico
-  Longitud mínima de contraseña (6 caracteres)
-  Coincidencia de contraseñas (registro y restablecimiento)

---

##  Flujo de Trabajo (Git Flow)

### Estructura de Branches
```
main           ─── rama de producción
develop        ─── rama de integración
├── feature/knvb         (Keila)
├── feature-karen      (Karen)
└── feature-gerardo  (Gerardo)
```

### Crear Feature Branch
```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-descriptivo
git add .
git commit -m "feat: descripción del cambio"
git push origin feature/nombre-descriptivo
```

---

## 👥 Equipo de Desarrollo

| Rol | Nombre | Código | GitHub | Tarea (Autenticación) |
|-----|--------|--------|--------|-----------------------|
| **Product Owner** | Karen Marcela Bayona Moreno | 192215 | [@KarenMarcela](https://github.com/KarenMarcela) | `RegisterPage` |
| **Scrum Master** | Keila Nathaly Vacca Bacca | 192221 | [@Keila2Vacca](https://github.com/Keila2Vacca) | `LoginPage` |
| **Dev Team** | Gerardo | https://github.com/Gerard176 |  | `ForgotPage` y `ResetPage` |

---

##  Práctica Anterior – Hooks de React

> Esta sección documenta los ejemplos de Hooks implementados como práctica anterior. Para verlos, navega a `/hooks` en el servidor de desarrollo.

### Integrantes y Hooks Asignados

| Nombre | Rama feature | Hooks asignados |
|--------|-------------|-----------------|
| **Keila** | `feature/knvb` | useState, useReducer, useEffect, useLayoutEffect, useDebugValue |
| **Karen** | `feature-karen` | useRef, useImperativeHandle, useContext, useTransition, useDeferredValue, useOptimistic, useFormStatus |
| **Gerardo** | `feature-gerardo` | useSyncExternalStore, useId, useMemo, useCallback, useInsertionEffect, useActionState |

### Tabla General de Hooks

| Hook | Descripción corta | Categoría | Autora/or |
|------|-------------------|-----------|-----------| 
| `useState` | Maneja el estado local de un componente funcional | Estado | Keila |
| `useReducer` | Gestiona estado complejo mediante acciones y un reducer | Estado | Keila |
| `useRef` | Crea una referencia mutable que no causa re-render | Referencias | Karen |
| `useImperativeHandle` | Expone métodos del hijo al padre vía ref | Referencias | Karen |
| `useContext` | Accede a un contexto sin prop drilling | Contexto | Karen |
| `useSyncExternalStore` | Suscribe el componente a un store externo | Contexto | Gerardo |
| `useId` | Genera IDs únicos y estables para accesibilidad | Contexto | Gerardo |
| `useMemo` | Memoriza el resultado de un cálculo costoso | Performance | Gerardo |
| `useCallback` | Memoriza una función para evitar recreaciones | Performance | Gerardo |
| `useTransition` | Marca actualizaciones de estado como no urgentes | Performance | Karen |
| `useDeferredValue` | Difiere la actualización de un valor específico | Performance | Karen |
| `useEffect` | Ejecuta efectos secundarios después del render | Ciclo de vida | Keila |
| `useLayoutEffect` | Como useEffect pero antes de pintar en pantalla | Ciclo de vida | Keila |
| `useInsertionEffect` | Inyecta estilos antes de que el DOM se pinte | Ciclo de vida | Gerardo |
| `useDebugValue` | Muestra etiqueta personalizada en React DevTools | Debug | Keila |
| `useOptimistic` | Actualiza la UI de forma optimista antes del servidor | React 19 | Karen |
| `useFormStatus` | Accede al estado de envío del formulario padre | React 19 | Karen |
| `useActionState` | Gestiona el estado de una acción asíncrona de formulario | React 19 | Gerardo |

### Explicaciones por Integrante

#### Keila
- **useState** — El componente anota lo que no puede olvidar; si cambia un número, este se guarda ahí.
- **useReducer** — Es una agenda organizada; se usa cuando las cosas se ponen complicadas. En lugar de cambiar los datos a lo loco, se mandan "mensajes" (acciones).
- **useEffect** — Este es el que se encarga de las cosas que pasan "fuera" del componente.
- **useLayoutEffect** — Es casi igual al anterior pero trabaja más rápido sin que el usuario note parpadeo.
- **useDebugValue** — Se usa para ponerle una etiqueta de nombre a una caja en el almacén.
