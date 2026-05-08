# Autenticación con Google

## Descripción General
Sistema de autenticación mediante Google usando Firebase Authentication. Este método permite a los usuarios iniciar sesión usando su cuenta de Google, proporcionando una experiencia de usuario simplificada sin necesidad de recordar contraseñas.

---

## 📋 Tabla de Contenidos
1. [Requisitos Previos](#requisitos-previos)
2. [Configuración en Google Cloud Console](#configuración-en-google-cloud-console)
3. [Configuración en Firebase](#configuración-en-firebase)
4. [Implementación Frontal](#implementación-frontal)
5. [Funcionalidades](#funcionalidades)
6. [Troubleshooting](#troubleshooting)

---

## Requisitos Previos

- Proyecto Firebase creado en `hacaritamaweb`
- Cuenta Google Developer
- Node.js 18+ instalado
- Firebase SDK instalado

---

## Configuración en Google Cloud Console

### Paso 1: Crear Proyecto OAuth 2.0

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. En el menú superior, selecciona o crea el proyecto asociado a `hacaritamaweb`
3. En el menú lateral, ve a **APIs & Services** → **Credentials**
4. Haz clic en **+ Create Credentials** → **OAuth 2.0 Client ID**

### Paso 2: Configurar la Pantalla de Consentimiento OAuth

1. Si es la primera vez, deberás configurar la pantalla de consentimiento:
   - Haz clic en **Configure Consent Screen**
   - Selecciona **External** (para uso público)
   - Completa la información:
     - **App name:** "Hacaritama - Sistema de Reserva de Pasajes"
     - **User support email:** tu-email@example.com
     - **Developer contact:** tu-email@example.com
2. En **Scopes**, añade:
   - `email` - Ver dirección de correo electrónico
   - `profile` - Ver nombre e información de perfil
   - `openid` - Verificación de identidad
3. En **Test users**, añade cuentas de prueba (Gmail)
4. Completa y guarda

### Paso 3: Crear OAuth 2.0 Client ID

1. Vuelve a **APIs & Services** → **Credentials**
2. Haz clic en **+ Create Credentials** → **OAuth 2.0 Client ID**
3. Selecciona **Web application**
4. Nombre: "Hacaritama Web App"
5. En **Authorized JavaScript origins**, añade:
   ```
   http://localhost:5173
   http://localhost:3000
   https://hacaritamaweb.firebaseapp.com
   https://hacaritamaweb.web.app
   ```
6. En **Authorized redirect URIs**, añade:
   ```
   http://localhost:5173
   http://localhost:3000
   https://hacaritamaweb.firebaseapp.com
   https://hacaritamaweb.web.app
   ```
7. Copia el **Client ID** (lo necesitarás después)

---

## Configuración en Firebase

### Paso 1: Habilitar Google Sign-In

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona el proyecto `hacaritamaweb`
3. En el menú lateral, ve a **Authentication** → **Sign-in method**
4. Busca **Google**
5. Haz clic en el icono de editar (lápiz)
6. Activa ✅ **Google**
7. Selecciona el proyecto de Google Cloud
8. Guarda los cambios

### Paso 2: Configurar Reglas de Firestore

Asegúrate de que los usuarios autenticados puedan guardar sus datos de sesión:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /userSessions/{sessionId} {
      allow create, write, read: if request.auth != null;
    }
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

---

## Implementación Frontal

### Paso 1: Instalar SDK de Firebase

```bash
npm install firebase
```

### Paso 2: Configuración de Firebase

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

### Paso 3: Implementar Login con Google

Archivo: [src/pages/auth/LoginPage.jsx](../src/pages/auth/LoginPage.jsx)

```javascript
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  signInWithPopup, 
  GoogleAuthProvider 
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setSessionId } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      // Crear proveedor de Google
      const googleProvider = new GoogleAuthProvider();
      
      // Configurar opciones adicionales de Google
      googleProvider.addScope('profile');
      googleProvider.addScope('email');

      // Mostrar popup de Google
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Guardar información de OAuth
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;

      // Crear sesión en Firestore
      const sessionId = `${user.uid}_${Date.now()}`;
      await setDoc(doc(db, "userSessions", sessionId), {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email.split("@")[0],
        userPhoto: user.photoURL || null,
        loginTime: serverTimestamp(),
        logoutTime: null,
        sessionDuration: null,
        authMethod: "google",
        googleAccessToken: accessToken, // Guardar token para uso posterior
        status: "active",
      });

      // Guardar o actualizar perfil de usuario
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        authMethods: ["google"],
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });

      setSessionId(sessionId, new Date());
      navigate("/dashboard");
    } catch (error) {
      console.error("Error en login con Google:", error);

      if (error.code === "auth/popup-closed-by-user") {
        setError("Ventana de Google cerrada. Intente nuevamente.");
      } else if (error.code === "auth/popup-blocked") {
        setError("El navegador bloqueó la ventana emergente. Verifique la configuración.");
      } else if (error.code === "auth/operation-not-allowed") {
        setError("Google Sign-In no está habilitado en Firebase.");
      } else {
        setError("Error al iniciar sesión con Google. Intente nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      
      <button 
        onClick={handleGoogleLogin} 
        disabled={loading}
        className="btn-google"
      >
        {loading ? "Conectando..." : "Iniciar sesión con Google"}
      </button>
    </div>
  );
};

export default LoginPage;
```

### Paso 4: Botón Visual para Google

```jsx
// Componente reutilizable
import { Mail } from "lucide-react";

const GoogleSignInButton = ({ onClick, loading }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
    >
      {/* Logo de Google SVG */}
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      {loading ? "Conectando..." : "Google"}
    </button>
  );
};

export default GoogleSignInButton;
```

---

## Funcionalidades

### ✅ Inicio de Sesión con Google
- Popup seguro de autenticación
- Obtención automática de información de perfil
- Foto de perfil y nombre
- Token de acceso para futuras operaciones

### ✅ Creación Automática de Usuario
- Si es la primera vez, se crea el registro en Firestore
- Almacenamiento de foto y nombre
- Tracking de método de autenticación

### ✅ Sesiones
- Registro de acceso con Google en Firestore
- Token de acceso guardado
- Información de usuario actualizada

### ✅ Logout
- Cierre de sesión limpio
- Limpieza de datos locales

---

## Seguridad

### 🔐 Mejores Prácticas

1. **Validación de Tokens:**
   ```javascript
   // Verificar token en backend (si aplica)
   const ticket = await client.verifyIdToken({
     idToken: idToken,
     audience: GOOGLE_CLIENT_ID
   });
   ```

2. **CORS y Dominios:**
   - Solo dominios autorizados en Google Cloud Console
   - HTTPS en producción obligatorio

3. **Scopes Mínimos:**
   - Solo solicitar `profile` y `email` necesarios
   - No solicitar scopes innecesarios

4. **Refresh Tokens:**
   ```javascript
   // Usar currentUser.getIdToken() para obtener token fresco
   const token = await auth.currentUser.getIdToken();
   ```

---

## Datos Guardados en Firestore

### Ejemplo de Documento Guardado

```json
{
  "userSessions": {
    "sessionId": {
      "userId": "google_uid_123",
      "userEmail": "usuario@gmail.com",
      "userName": "Juan Pérez",
      "userPhoto": "https://lh3.googleusercontent.com/...",
      "loginTime": "Timestamp",
      "logoutTime": null,
      "sessionDuration": null,
      "authMethod": "google",
      "googleAccessToken": "ya29.a0A...",
      "status": "active"
    }
  },
  "users": {
    "google_uid_123": {
      "uid": "google_uid_123",
      "email": "usuario@gmail.com",
      "displayName": "Juan Pérez",
      "photoURL": "https://lh3.googleusercontent.com/...",
      "authMethods": ["google"],
      "lastLogin": "Timestamp",
      "updatedAt": "Timestamp"
    }
  }
}
```

---

## Troubleshooting

| Problema | Solución |
|----------|----------|
| **"auth/operation-not-allowed"** | Habilita Google Sign-In en Firebase Console |
| **"auth/popup-closed-by-user"** | El usuario cerró el popup, intenta de nuevo |
| **"auth/popup-blocked"** | Navegador bloqueó popup, ajusta configuración |
| **"No hay perfil de usuario"** | Asegúrate de guardar el usuario en Firestore después de login |
| **Token inválido en backend** | Verifica que estés usando el `idToken` correcto de Firebase |

---

## Recursos Útiles

- [Firebase Google Sign-In Docs](https://firebase.google.com/docs/auth/web/google-signin)
- [Google OAuth 2.0 Configuration](https://developers.google.com/identity/protocols/oauth2)
- [Firebase Token Verification](https://firebase.google.com/docs/auth/admin/verify-id-tokens)

---

**Última actualización:** Mayo 2026
