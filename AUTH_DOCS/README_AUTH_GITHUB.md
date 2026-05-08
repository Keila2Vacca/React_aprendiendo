# Autenticación con GitHub

## Descripción General
Sistema de autenticación mediante GitHub usando Firebase Authentication. Este método es ideal para desarrolladores y es particularmente útil para aplicaciones orientadas a desarrolladores.

---

## 📋 Tabla de Contenidos
1. [Requisitos Previos](#requisitos-previos)
2. [Configuración en GitHub](#configuración-en-github)
3. [Configuración en Firebase](#configuración-en-firebase)
4. [Implementación Frontal](#implementación-frontal)
5. [Funcionalidades](#funcionalidades)
6. [Seguridad](#seguridad)
7. [Troubleshooting](#troubleshooting)

---

## Requisitos Previos

- Cuenta GitHub (personal o empresa)
- Proyecto Firebase creado en `hacaritamaweb`
- Node.js 18+ instalado
- Firebase SDK instalado

---

## Configuración en GitHub

### Paso 1: Registrar Aplicación OAuth en GitHub

1. Ve a [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. O ve a tu perfil → **Settings** → **Developer settings** → **OAuth Apps**
3. Haz clic en **New OAuth App**
4. Completa el formulario:

| Campo | Valor |
|-------|-------|
| **Application name** | Hacaritama - Reserva de Pasajes |
| **Homepage URL** | `https://hacaritamaweb.firebaseapp.com` |
| **Application description** | Sistema de reserva de pasajes para Cooperativa Hacaritama |
| **Authorization callback URL** | `https://hacaritamaweb.firebaseapp.com/__/auth/handler` |

5. Haz clic en **Register application**

### Paso 2: Obtener Client ID y Secret

1. En la página de la aplicación, verás:
   - **Client ID** (copiar)
   - **Client Secret** (hacer clic en "Generate a new client secret" y copiar)

> ⚠️ **Importante:** Guarda el **Client Secret** en un lugar seguro. No lo compartas públicamente.

### Paso 3: Configurar Permisos de Aplicación

1. En **OAuth Settings** de tu app, bajo **User authorization callback URL**, están configurados:
   - ✅ `read:user` (acceso a información pública de usuario)

2. Esto permite acceder a:
   - Nombre de usuario
   - Email público
   - Avatar
   - Bio
   - Ubicación
   - Empresa
   - Blog
   - Ubicación

---

## Configuración en Firebase

### Paso 1: Habilitar GitHub Sign-In

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona el proyecto `hacaritamaweb`
3. En el menú lateral, ve a **Authentication** → **Sign-in method**
4. Busca **GitHub**
5. Haz clic en el icono de editar (lápiz)
6. Activa ✅ **GitHub**
7. Ingresa:
   - **Client ID:** (del paso anterior de GitHub)
   - **Client Secret:** (del paso anterior de GitHub)
8. Copia la **URI de redirección de OAuth** proporcionada por Firebase
9. Actualiza tu aplicación GitHub:
   - Ve a **Settings** de tu aplicación
   - Actualiza **Authorization callback URL** con la URI de Firebase
   - Guarda cambios
10. En Firebase, guarda los cambios

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

### Paso 1: Configurar Firebase

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

### Paso 2: Implementar Login con GitHub

Archivo: [src/pages/auth/LoginPage.jsx](../src/pages/auth/LoginPage.jsx)

```javascript
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  signInWithPopup, 
  GithubAuthProvider 
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setSessionId } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGitHubLogin = async () => {
    setError("");
    setLoading(true);

    try {
      // Crear proveedor de GitHub
      const githubProvider = new GithubAuthProvider();
      
      // Configurar scopes
      githubProvider.addScope('read:user');
      githubProvider.addScope('user:email');

      // Mostrar popup de GitHub
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;

      // Obtener información de GitHub
      const credential = GithubAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;

      // Obtener información adicional del usuario de GitHub
      const userInfo = await fetch('https://api.github.com/user', {
        headers: { Authorization: `token ${accessToken}` }
      }).then(res => res.json());

      // Crear sesión en Firestore
      const sessionId = `${user.uid}_${Date.now()}`;
      await setDoc(doc(db, "userSessions", sessionId), {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || userInfo.login || "Usuario",
        userPhoto: user.photoURL || null,
        loginTime: serverTimestamp(),
        logoutTime: null,
        sessionDuration: null,
        authMethod: "github",
        githubAccessToken: accessToken,
        githubUsername: userInfo.login,
        githubProfile: {
          bio: userInfo.bio,
          company: userInfo.company,
          location: userInfo.location,
          blog: userInfo.blog,
          publicRepos: userInfo.public_repos,
          followers: userInfo.followers,
        },
        status: "active",
      });

      // Guardar o actualizar perfil de usuario
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || userInfo.login,
        photoURL: user.photoURL || null,
        githubUsername: userInfo.login,
        authMethods: ["github"],
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });

      setSessionId(sessionId, new Date());
      navigate("/dashboard");
    } catch (error) {
      console.error("Error en login con GitHub:", error);

      if (error.code === "auth/popup-closed-by-user") {
        setError("Ventana de GitHub cerrada. Intente nuevamente.");
      } else if (error.code === "auth/popup-blocked") {
        setError("El navegador bloqueó la ventana emergente.");
      } else if (error.code === "auth/account-exists-with-different-credential") {
        setError("Una cuenta con este email ya existe con un método de login diferente.");
      } else if (error.code === "auth/operation-not-allowed") {
        setError("GitHub Sign-In no está habilitado en Firebase.");
      } else if (error.code === "auth/network-request-failed") {
        setError("Error de conexión. Verifique su internet.");
      } else {
        setError("Error al iniciar sesión con GitHub. Intente nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      
      <button 
        onClick={handleGitHubLogin} 
        disabled={loading}
        className="btn-github"
      >
        {loading ? "Conectando..." : "Iniciar sesión con GitHub"}
      </button>
    </div>
  );
};

export default LoginPage;
```

### Paso 3: Componente Visual para GitHub

```jsx
import { Github } from "lucide-react";

const GitHubSignInButton = ({ onClick, loading }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
    >
      <Github size={20} />
      {loading ? "Conectando..." : "GitHub"}
    </button>
  );
};

export default GitHubSignInButton;
```

### Paso 4: Obtener Información Adicional de GitHub

```javascript
// Obtener perfil completo del usuario
const getGitHubUserInfo = async (accessToken) => {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: { 
        Authorization: `token ${accessToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    return await response.json();
  } catch (error) {
    console.error("Error obtener info de GitHub:", error);
  }
};

// Obtener repositorios del usuario
const getGitHubRepos = async (accessToken, username) => {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated`,
      {
        headers: { 
          Authorization: `token ${accessToken}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error obtener repos de GitHub:", error);
  }
};
```

---

## Funcionalidades

### ✅ Inicio de Sesión con GitHub
- Popup seguro de autenticación
- Acceso a información de perfil
- Obtención de avatar y username
- Token de acceso para GitHub API

### ✅ Información Enriquecida
- Perfil de GitHub (bio, empresa, ubicación)
- Número de repositorios públicos
- Número de followers
- URL del blog

### ✅ Creación Automática de Usuario
- Registro en Firestore
- Almacenamiento de información de GitHub
- Tracking de método de autenticación

### ✅ Acceso a GitHub API
- Token para futuras operaciones con GitHub
- Obtener repositorios
- Obtener eventos
- Gestionar hooks

---

## Casos de Uso Avanzados

### Mostrar Repositorios del Usuario

```javascript
const DisplayGitHubRepos = ({ accessToken, username }) => {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    const fetchRepos = async () => {
      const reposData = await getGitHubRepos(accessToken, username);
      setRepos(reposData);
    };
    fetchRepos();
  }, [accessToken, username]);

  return (
    <div>
      <h2>Repositorios de {username}</h2>
      <ul>
        {repos.map(repo => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              {repo.name}
            </a>
            <p>{repo.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

---

## Seguridad

### 🔐 Mejores Prácticas

1. **Nunca exponer el Access Token:**
   ```javascript
   // ❌ No hagas esto
   console.log(accessToken); // NO
   
   // ✅ Haz esto
   // Guarda el token seguro en Firestore con reglas restrictivas
   ```

2. **Validar Token en Backend:**
   ```javascript
   // Backend
   const response = await fetch('https://api.github.com/user', {
     headers: { Authorization: `token ${accessToken}` }
   });
   ```

3. **HTTPS Obligatorio en Producción:**
   - Todos los OAuth callbacks deben usar HTTPS
   - Certificados SSL válidos

4. **Scopes Mínimos:**
   - Solo `read:user` y `user:email`
   - No solicitar acceso innecesario

---

## Datos Guardados en Firestore

```json
{
  "userSessions": {
    "sessionId": {
      "userId": "github_uid_789",
      "userEmail": "usuario@github.com",
      "userName": "usuario",
      "userPhoto": "https://avatars.githubusercontent.com/u/...",
      "loginTime": "Timestamp",
      "logoutTime": null,
      "authMethod": "github",
      "githubAccessToken": "ghp_...",
      "githubUsername": "usuario",
      "githubProfile": {
        "bio": "Desarrollador de software",
        "company": "Tech Company",
        "location": "Ábrego, Colombia",
        "blog": "https://miblog.com",
        "publicRepos": 15,
        "followers": 50
      },
      "status": "active"
    }
  }
}
```

---

## Troubleshooting

| Problema | Solución |
|----------|----------|
| **"auth/operation-not-allowed"** | Habilita GitHub Sign-In en Firebase Console |
| **Invalid Authorization callback URL** | Verifica que coincida con la URL en Firebase |
| **"auth/popup-blocked"** | Asegúrate de que el navegador permite popups |
| **Token expirado** | GitHub no expira tokens por defecto, pero puedes revocar manualmente |
| **Información de usuario vacía** | Verifica que el usuario tenga email público en GitHub |

---

## Recursos Útiles

- [Firebase GitHub Sign-In Docs](https://firebase.google.com/docs/auth/web/github-signin)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [GitHub Scopes](https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps)

---

**Última actualización:** Mayo 2026
