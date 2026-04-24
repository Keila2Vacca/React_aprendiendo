import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [loginTime, setLoginTime] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    if (user && currentSessionId && loginTime) {
      // Actualizar sesión en Firestore
      const sessionRef = doc(db, "userSessions", currentSessionId);
      const logoutTime = new Date();
      const duration = logoutTime - loginTime; // en ms
      await updateDoc(sessionRef, {
        logoutTime: serverTimestamp(),
        status: "finished",
        sessionDuration: duration
      });
    }
    await signOut(auth);
    setCurrentSessionId(null);
    setLoginTime(null);
  };

  const setSessionId = (id, time) => {
    setCurrentSessionId(id);
    setLoginTime(time);
  };

  return (
    <AuthContext.Provider value={{ user, logout, setSessionId, loading }}>
      {children}
    </AuthContext.Provider>
  );
};;