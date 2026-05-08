import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState(() => localStorage.getItem('currentSessionId'));
  const [loginTime, setLoginTime] = useState(() => {
    const savedTime = localStorage.getItem('loginTime');
    return savedTime ? new Date(savedTime) : null;
  });

  // Función para cerrar la sesión en Firestore
  const updateSessionInFirestore = useCallback(async (sessionId, startTime) => {
    if (!sessionId || !startTime) return;
    try {
      const sessionRef = doc(db, "userSessions", sessionId);
      const now = new Date();
      const duration = now - new Date(startTime);
      
      // Usamos una operación síncrona si es posible o aseguramos que se envíe
      await updateDoc(sessionRef, {
        logoutTime: serverTimestamp(),
        status: "inactive",
        sessionDuration: duration
      });
    } catch (error) {
      console.error("Error al cerrar sesión en Firestore:", error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      // Si el usuario no está autenticado pero tenemos datos de sesión, los limpiamos
      if (!user) {
        localStorage.removeItem('currentSessionId');
        localStorage.removeItem('loginTime');
        setCurrentSessionId(null);
        setLoginTime(null);
      }
    });

    // Listener para cuando se cierra la pestaña o el navegador
    const handleBeforeUnload = (event) => {
      if (currentSessionId && loginTime) {
        // Intentar actualizar la sesión antes de que se cierre
        // Nota: updateDoc es asíncrono, en algunos navegadores esto puede fallar al cerrar
        // Pero es la mejor aproximación sin usar navigator.sendBeacon con un endpoint de API
        updateSessionInFirestore(currentSessionId, loginTime);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      unsubscribe();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentSessionId, loginTime, updateSessionInFirestore]);

  const logout = useCallback(async () => {
    // Intentar obtener ID y tiempo del estado o del localStorage como respaldo
    const sId = currentSessionId || localStorage.getItem('currentSessionId');
    const lTimeStr = localStorage.getItem('loginTime');
    const lTime = loginTime || (lTimeStr ? new Date(lTimeStr) : null);

    console.log("Intentando cerrar sesión:", sId);

    if (sId && lTime) {
      try {
        const sessionRef = doc(db, "userSessions", sId);
        const now = new Date();
        const duration = now - new Date(lTime);
        
        // Usamos un objeto normal de fecha para mayor rapidez en la respuesta local
        await updateDoc(sessionRef, {
          logoutTime: now, 
          status: "inactive",
          sessionDuration: duration
        });
        console.log("Sesión actualizada en Firestore");
      } catch (error) {
        console.error("Error al actualizar sesión durante logout:", error);
      }
    }

    try {
      await signOut(auth);
      localStorage.removeItem('currentSessionId');
      localStorage.removeItem('loginTime');
      setCurrentSessionId(null);
      setLoginTime(null);
    } catch (error) {
      console.error("Error al cerrar sesión de Firebase:", error);
    }
  }, [currentSessionId, loginTime]);

  const setSessionId = (id, time) => {
    localStorage.setItem('currentSessionId', id);
    localStorage.setItem('loginTime', time.toISOString());
    setCurrentSessionId(id);
    setLoginTime(time);
  };

  return (
    <AuthContext.Provider value={{ user, logout, setSessionId, loading, currentSessionId }}>
      {children}
    </AuthContext.Provider>
  );
};


;