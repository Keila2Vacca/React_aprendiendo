# ¿Qué Contraseña Debo Usar al Vincular Cuentas?

## El Problema
Cuando intentas iniciar sesión con GitHub pero tu correo ya existe registrado con otro método, aparece un modal pidiendo tu contraseña. Pero **¿cuál contraseña?** ¿La de Google? ¿La de GitHub? ¿Una que nunca creé?

## La Solución: Usa tu Método ORIGINAL

### Paso 1: Identifica cómo creaste tu cuenta ORIGINALMENTE

Piensa en **cómo fue la primera vez que te registraste**:

| Si hiciste esto | Usa esto en el modal |
|---|---|
| ✅ Click en botón **"Google"** | Click en **"Iniciar sesión con Google"** |
| ✅ Click en botón **"Facebook"** | Click en **"Iniciar sesión con Facebook"** |
| ✅ Click en botón **"GitHub"** | Click en **"Iniciar sesión con GitHub"** |
| ✅ Ingresaste **Email + Contraseña** (sin redes sociales) | Ingresa esa **contraseña en el campo** |

---

## Ejemplos Prácticos

### Ejemplo 1: Cuenta creada con Google, ahora intento con GitHub

```
1. Intento login con GitHub
2. Error: "El correo ya existe"
3. Modal dice: "Para vincular tu cuenta de GitHub..."
4. DEBO hacer: Click en "Iniciar sesión con Google" (mi método original)
5. Resultado: ✅ Cuentas vinculadas - puedo usar ambos métodos
```

### Ejemplo 2: Cuenta creada con Email+Contraseña, ahora intento con Google

```
1. Intento login con Google
2. Error: "El correo ya existe"
3. Modal dice: "Para vincular tu cuenta de Google..."
4. DEBO hacer: Ingresar mi contraseña en el campo (mi método original)
5. Resultado: ✅ Cuentas vinculadas - puedo usar ambos métodos
```

### Ejemplo 3: Cuenta creada con Facebook, ahora intento con GitHub

```
1. Intento login con GitHub
2. Error: "El correo ya existe"
3. Modal dice: "Para vincular tu cuenta de GitHub..."
4. DEBO hacer: Click en "Iniciar sesión con Facebook" (mi método original)
5. Resultado: ✅ Cuentas vinculadas - puedo usar ambos métodos
```

---

## ¿Y si no recuerdo cómo creé mi cuenta?

**Intenta esto:**

1. **Abre el navegador**
2. **Ve a http://localhost:5173/login** (o tu URL de la app)
3. **Intenta cada opción:**
   - Click en Google
   - Click en Facebook
   - Click en GitHub
   - Intenta con tu email + contraseña

4. **Cuál logre abrir tu cuenta, ÉSE es tu método original**

---

## Mensajes de Error Comunes

### ❌ "Error al vincular. Intente nuevamente."

Significa que:
- **No usaste el método correcto** - Intenta con otro
- **Tu contraseña es incorrecta** - Verifica bien (sin espacios)
- **El proveedor no está habilitado** - Intenta con otro método

**Solución**: Prueba los otros botones/métodos hasta que uno funcione.

---

## ¿Después de vincular, qué puedo hacer?

Una vez que vinculues tu cuenta correctamente, podrás:
- ✅ Iniciar sesión con Google
- ✅ Iniciar sesión con Facebook
- ✅ Iniciar sesión con GitHub
- ✅ Iniciar sesión con Email+Contraseña (si la tienes)

**Todo lleva a la MISMA cuenta** porque están vinculadas.

---

## Si aún tienes problemas

1. **Abre la consola del navegador (F12)**
2. **Ve a "Login"**
3. **Intenta vincular de nuevo**
4. **Busca el error en la consola** (Console tab)
5. **Comparte el error exacto** conmigo

El nuevo sistema es mucho más claro - ahora deberías ver exactamente qué opciones tienes disponibles en el modal. 🎯
