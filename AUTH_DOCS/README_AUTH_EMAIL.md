# Autenticación con Email y Contraseña

## Descripción General
Sistema de autenticación tradicional basado en email y contraseña usando Firebase Authentication. Este método es seguro, confiable y permite a los usuarios crear cuentas directas en la aplicación sin depender de proveedores externos.

---

## 📋 Tabla de Contenidos
1. [Requisitos Previos](#requisitos-previos)
2. [Configuración de Firebase](#configuración-de-firebase)
3. [Implementación Frontal](#implementación-frontal)
4. [Funcionalidades](#funcionalidades)
5. [Seguridad](#seguridad)
6. [Troubleshooting](#troubleshooting)

---

## Requisitos Previos

- Proyecto Firebase creado y configurado
- Node.js 18+ instalado
- Dependencias Firebase instaladas:
  ```bash
  npm install firebase
  ```

---

## Configuración de Firebase

### Paso 1: Habilitar Autenticación por Email en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto (`hacaritamaweb`)
3. En el menú lateral, ve a **Authentication** → **Sign-in method**
4. Busca **Email/Password**
5. Haz clic en el icono de editar (lápiz)
6. Activa:
   - ✅ **Email/Password** (obligatorio)
   - ✅ **Email Link (passwordless sign-in)** (opcional, para recuperar contraseña)
7. Guarda los cambios

### Paso 2: Configurar Reglas de Firestore

En **Firestore Database** → **Rules**, asegúrate de que los usuarios puedan leer y escribir sus propios datos de sesión:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Permite lectura/escritura en userSessions para usuarios autenticados
    match /userSessions/{sessionId} {
      allow create, write, read: if request.auth != null;
    }
    
    // Permite lectura/escritura en userData para el usuario autenticado
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

---

## Implementación Frontal

### Paso 1: Configuración de Firebase

Archivo: [firebase.js](../firebase.js)

```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "hacaritamaweb.firebaseapp.com",
  projectId: "hacaritamaweb",
  storageBucket: "hacaritamaweb.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### Paso 2: Crear el Contexto de Autenticación

Archivo: [src/context/AuthContext.jsx](../src/context/AuthContext.jsx)

```javascript
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('currentSessionId');
      localStorage.removeItem('loginTime');
      setCurrentSessionId(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout, setCurrentSessionId }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Paso 3: Página de Login

Archivo: [src/pages/auth/LoginPage.jsx](../src/pages/auth/LoginPage.jsx)

**Funcionalidad de Login con Email/Contraseña:**

```javascript
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!formData.email || !formData.password) {
    setError("Por favor complete todos los campos");
    return;
  }

  setLoading(true);
  try {
    // Autenticar usuario
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      formData.email, 
      formData.password
    );
    
    const user = userCredential.user;
    const sessionId = `${user.uid}_${Date.now()}`;

    // Guardar sesión en Firestore
    await setDoc(doc(db, "userSessions", sessionId), {
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName || user.email.split("@")[0],
      userPhoto: user.photoURL || null,
      loginTime: serverTimestamp(),
      logoutTime: null,
      sessionDuration: null,
      authMethod: "email",
      status: "active",
    });

    setSessionId(sessionId, new Date());
    navigate("/dashboard");
  } catch (error) {
    if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
      setError("Correo o contraseña incorrectos.");
    } else {
      setError("Error de autenticación. Intente nuevamente.");
    }
  } finally {
    setLoading(false);
  }
};
```

### Paso 4: Página de Registro

Archivo: [src/pages/auth/RegisterPage.jsx](../src/pages/auth/RegisterPage.jsx)

```javascript
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

const handleRegister = async (e) => {
  e.preventDefault();
  setError("");

  if (!formData.email || !formData.password || !formData.confirmPassword) {
    setError("Por favor complete todos los campos");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    setError("Las contraseñas no coinciden");
    return;
  }

  if (formData.password.length < 6) {
    setError("La contraseña debe tener al menos 6 caracteres");
    return;
  }

  setLoading(true);
  try {
    // Crear cuenta
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );

    const user = userCredential.user;

    // Guardar datos del usuario en Firestore (opcional)
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      displayName: formData.name || "Usuario",
      photoURL: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    setMessage("Cuenta creada exitosamente. Redirigiendo al login...");
    setTimeout(() => navigate("/login"), 2000);
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      setError("Este correo ya está registrado");
    } else if (error.code === "auth/invalid-email") {
      setError("Correo inválido");
    } else {
      setError("Error al crear la cuenta. Intente nuevamente.");
    }
  } finally {
    setLoading(false);
  }
};
```

### Paso 5: Recuperación de Contraseña

Archivo: [src/pages/auth/ForgotPage.jsx](../src/pages/auth/ForgotPage.jsx)

```javascript
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";

const handleResetRequest = async (e) => {
  e.preventDefault();
  setError("");

  if (!email) {
    setError("Por favor ingrese su correo");
    return;
  }

  setLoading(true);
  try {
    // Enviar email de recuperación
    await sendPasswordResetEmail(auth, email, {
      url: `${window.location.origin}/login`,
      handleCodeInApp: true,
    });

    setMessage("Email de recuperación enviado. Revise su bandeja de entrada.");
    setEmail("");
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      setError("No existe cuenta asociada a este correo");
    } else {
      setError("Error al enviar el email. Intente nuevamente.");
    }
  } finally {
    setLoading(false);
  }
};
```

### Paso 6: Proteger Rutas

```javascript
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  return user ? children : <Navigate to="/login" />;
};

// En App.jsx
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
```

---

## Funcionalidades

### ✅ Crear Cuenta (Registro)
- Validación de email
- Validación de contraseña (mín. 6 caracteres)
- Confirmación de contraseña
- Almacenamiento de datos de usuario en Firestore

### ✅ Iniciar Sesión
- Autenticación con email y contraseña
- Creación de registro de sesión
- Redirección automática al dashboard
- Manejo de errores específicos

### ✅ Recuperar Contraseña
- Envío de email de recuperación
- Link seguro generado automáticamente por Firebase
- Restablecimiento desde el email

### ✅ Cerrar Sesión
- Cierre de sesión seguro
- Limpieza de datos de sesión local
- Actualización de estado en Firestore

---

## Seguridad

### 🔐 Mejores Prácticas Implementadas

1. **Validación en Frontal:**
   - Email válido
   - Contraseña mínimo 6 caracteres
   - Confirmación de contraseña en registro

2. **Seguridad en Firebase:**
   - Reglas de Firestore restrictivas
   - Autenticación de dos factores (disponible en Firebase Console)
   - Contraseñas encriptadas con bcrypt

3. **Protección de Rutas:**
   - Rutas privadas protegidas con `ProtectedRoute`
   - Verificación de autenticación antes de acceder

4. **Manejo de Errores:**
   - Mensajes de error específicos
   - No revelar si un email existe o no (prevenir ataques de enumeración)

### ⚠️ Recomendaciones de Producción

```javascript
// Implementar Rate Limiting
import { RateLimiter } from 'some-package';

const loginLimiter = RateLimiter({
  maxRequests: 5,
  windowMs: 15 * 60 * 1000 // 15 minutos
});

// Implementar CAPTCHA en registro
import ReCAPTCHA from "react-google-recaptcha";

// Añadir 2FA
import speakeasy from 'speakeasy';
```

---

## Troubleshooting

| Problema | Solución |
|----------|----------|
| **"auth/operation-not-allowed"** | Habilita Email/Password en Firebase Console → Authentication → Sign-in methods |
| **"auth/invalid-email"** | Validar formato del email (debe incluir @) |
| **"auth/weak-password"** | Contraseña debe tener mínimo 6 caracteres |
| **"auth/user-not-found"** | Usuario no existe, mostrar mensaje genérico por seguridad |
| **"auth/wrong-password"** | Contraseña incorrecta, mostrar mensaje genérico |
| **"auth/email-already-in-use"** | Email ya registrado, dirigir a login |

---

## Recursos Útiles

- [Firebase Authentication - Web Docs](https://firebase.google.com/docs/auth/web/start)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

**Última actualización:** Mayo 2026
