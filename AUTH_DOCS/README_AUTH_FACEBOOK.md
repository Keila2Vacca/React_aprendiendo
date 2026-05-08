# Autenticación con Facebook

## Descripción General
Sistema de autenticación mediante Facebook usando Firebase Authentication. Este método permite a los usuarios iniciar sesión usando su cuenta de Facebook, proporcionando acceso a millones de usuarios en todo el mundo.

---

## 📋 Tabla de Contenidos
1. [Requisitos Previos](#requisitos-previos)
2. [Configuración en Facebook Developers](#configuración-en-facebook-developers)
3. [Configuración en Firebase](#configuración-en-firebase)
4. [Implementación Frontal](#implementación-frontal)
5. [Funcionalidades](#funcionalidades)
6. [Seguridad](#seguridad)
7. [Troubleshooting](#troubleshooting)

---

## Requisitos Previos

- Proyecto Firebase creado en `hacaritamaweb`
- Cuenta Facebook (o crear una)
- Node.js 18+ instalado
- Firebase SDK instalado
- Dominio configurado para desarrollo

---

## Configuración en Facebook Developers

### Paso 1: Crear Aplicación en Facebook Developers

1. Ve a [Facebook Developers](https://developers.facebook.com/)
2. Inicia sesión o crea una cuenta
3. Ve a **My Apps** → **Create App**
4. Selecciona **Consumer** como tipo de app
5. Completa la información:
   - **App Name:** "Hacaritama - Reserva de Pasajes"
   - **App Contact Email:** tu-email@example.com
   - **App Purpose:** Selecciona la que corresponda
6. Haz clic en **Create App**

### Paso 2: Configurar Facebook Login

1. En el dashboard de la app, busca **Products** en el menú izquierdo
2. Haz clic en **+ Add Product**
3. Busca **Facebook Login** → **Set Up**
4. Selecciona **Web**
5. Proporciona:
   - **Site URL:** `http://localhost:5173` (para desarrollo)

### Paso 3: Configurar URIs Autorizados

1. En **Facebook Login** → **Settings**
2. En **Valid OAuth Redirect URIs**, añade:
   ```
   http://localhost:5173/
   http://localhost:5173/login
   https://hacaritamaweb.firebaseapp.com/
   https://hacaritamaweb.firebaseapp.com/login
   ```
3. Guarda cambios

### Paso 4: Obtener App ID y Secret

1. Ve a **Settings** → **Basic**
2. Copia:
   - **App ID**
   - **App Secret** (guárdalo en secreto)
3. En **App Domains**, añade:
   ```
   localhost
   hacaritamaweb.firebaseapp.com
   ```

### Paso 5: Configurar Acceso a Datos Públicos

1. Ve a **Products** → **Facebook Login** → **Settings**
2. En **Client OAuth Settings**:
   - ✅ Enable Client OAuth Login
   - ✅ Require App Secret
   - Guarda cambios

### Paso 6: Solicitar Permisos Mínimos

1. En **Roles** → **Test Users**, añade cuentas de prueba
2. En **Permissions**, solicita:
   - `email` - Acceso a correo
   - `public_profile` - Perfil público
3. En **App Roles**, establece roles necesarios

---

## Configuración en Firebase

### Paso 1: Habilitar Facebook Sign-In

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona el proyecto `hacaritamaweb`
3. En el menú lateral, ve a **Authentication** → **Sign-in method**
4. Busca **Facebook**
5. Haz clic en el icono de editar (lápiz)
6. Activa ✅ **Facebook**
7. Ingresa:
   - **App ID:** (del paso anterior)
   - **App Secret:** (del paso anterior)
8. Copia la **URI de redirección de OAuth** proporcionada por Firebase
9. Añade esta URI en Facebook Developers → **Settings** → **Valid OAuth Redirect URIs**
10. Guarda los cambios

### Paso 2: Configurar Reglas de Firestore

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

### Paso 1: Instalar SDK de Facebook

```bash
npm install firebase
# El SDK de Facebook se incluye automáticamente a través de Firebase
```

### Paso 2: Inicializar SDK de Facebook en HTML

Archivo: [index.html](../index.html)

Añade el SDK de Facebook al principio del `<body>`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Hacaritama - Reserva de Pasajes</title>
</head>
<body>
  <div id="root"></div>
  
  <!-- SDK de Facebook -->
  <script async defer crossorigin="anonymous" 
    src="https://connect.facebook.net/es_ES/sdk.js#xfbml=1&version=v18.0&appId=YOUR_APP_ID" 
    nonce="YOUR_NONCE">
  </script>

  <!-- Script de inicialización -->
  <script>
    window.fbAsyncInit = function() {
      FB.init({
        appId   : 'YOUR_APP_ID',
        xfbml   : true,
        version : 'v18.0'
      });
    };
  </script>

  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

### Paso 3: Implementar Login con Facebook

Archivo: [src/pages/auth/LoginPage.jsx](../src/pages/auth/LoginPage.jsx)

```javascript
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  signInWithPopup, 
  FacebookAuthProvider 
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setSessionId } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFacebookLogin = async () => {
    setError("");
    setLoading(true);

    try {
      // Crear proveedor de Facebook
      const facebookProvider = new FacebookAuthProvider();
      
      // Configurar scopes
      facebookProvider.addScope('email');
      facebookProvider.addScope('public_profile');

      // Mostrar popup de Facebook
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;

      // Obtener información de Facebook
      const credential = FacebookAuthProvider.credentialFromResult(result);
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
        authMethod: "facebook",
        facebookAccessToken: accessToken,
        status: "active",
      });

      // Guardar o actualizar perfil de usuario
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        authMethods: ["facebook"],
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });

      setSessionId(sessionId, new Date());
      navigate("/dashboard");
    } catch (error) {
      console.error("Error en login con Facebook:", error);

      if (error.code === "auth/popup-closed-by-user") {
        setError("Ventana de Facebook cerrada. Intente nuevamente.");
      } else if (error.code === "auth/popup-blocked") {
        setError("El navegador bloqueó la ventana emergente.");
      } else if (error.code === "auth/account-exists-with-different-credential") {
        setError("Una cuenta con este email ya existe con un método de login diferente.");
      } else if (error.code === "auth/operation-not-allowed") {
        setError("Facebook Sign-In no está habilitado en Firebase.");
      } else {
        setError("Error al iniciar sesión con Facebook. Intente nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      
      <button 
        onClick={handleFacebookLogin} 
        disabled={loading}
        className="btn-facebook"
      >
        {loading ? "Conectando..." : "Iniciar sesión con Facebook"}
      </button>
    </div>
  );
};

export default LoginPage;
```

### Paso 4: Componente Visual para Facebook

```jsx
import { Facebook } from "lucide-react";

const FacebookSignInButton = ({ onClick, loading }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
    >
      <Facebook size={20} />
      {loading ? "Conectando..." : "Facebook"}
    </button>
  );
};

export default FacebookSignInButton;
```

---

## Funcionalidades

### ✅ Inicio de Sesión con Facebook
- Popup seguro de autenticación
- Acceso a email y perfil público
- Obtención de foto de perfil
- Token de acceso para futuras operaciones

### ✅ Creación Automática de Usuario
- Si es la primera vez, se crea el registro
- Almacenamiento de foto y nombre
- Tracking de método de autenticación

### ✅ Vinculación de Múltiples Métodos
- Detectar si el email ya existe
- Opción de vincular multiple métodos a una cuenta

### ✅ Logout
- Cierre de sesión limpio
- Limpieza de tokens

---

## Manejo de Errores Comunes

### Vincular Email Existente

```javascript
// Si el usuario ya tiene cuenta con email/contraseña
const handleLinkAccount = async (credential) => {
  try {
    await linkWithCredential(auth.currentUser, credential);
    console.log("Cuenta vinculada exitosamente");
  } catch (error) {
    console.error("Error al vincular cuenta:", error);
  }
};
```

---

## Seguridad

### 🔐 Mejores Prácticas

1. **Verificación de Token:**
   ```javascript
   // Verificar token en backend
   const response = await fetch(
     `https://graph.facebook.com/v18.0/me?access_token=${accessToken}`
   );
   ```

2. **HTTPS Obligatorio en Producción:**
   - Facebook requiere HTTPS en producción
   - Certificados SSL válidos

3. **Scopes Mínimos:**
   - Solo `email` y `public_profile`
   - No solicitar acceso innecesario

4. **Refresh de Tokens:**
   ```javascript
   // Token renovado automáticamente por Firebase
   const freshToken = await auth.currentUser.getIdToken();
   ```

---

## Datos Guardados en Firestore

```json
{
  "userSessions": {
    "sessionId": {
      "userId": "facebook_uid_456",
      "userEmail": "usuario@facebook.com",
      "userName": "Juan Pérez",
      "userPhoto": "https://platform-lookaside.fbsbx.com/...",
      "loginTime": "Timestamp",
      "logoutTime": null,
      "authMethod": "facebook",
      "facebookAccessToken": "EAABCCG...",
      "status": "active"
    }
  }
}
```

---

## Troubleshooting

| Problema | Solución |
|----------|----------|
| **"auth/operation-not-allowed"** | Habilita Facebook Login en Firebase Console |
| **"Invalid OAuth redirect URIs"** | Verifica que la URL esté registrada en Facebook Developers |
| **Popup bloqueado** | Asegúrate de que el navegador permite popups |
| **"auth/account-exists-with-different-credential"** | Email ya existe con otro método, ofrece vincular |
| **Token expirado** | Firebase lo maneja automáticamente, obtén token fresco |

---

## Recursos Útiles

- [Firebase Facebook Sign-In Docs](https://firebase.google.com/docs/auth/web/facebook-login)
- [Facebook Developers Documentation](https://developers.facebook.com/docs)
- [Facebook Graph API](https://developers.facebook.com/docs/graph-api)

---

**Última actualización:** Mayo 2026
