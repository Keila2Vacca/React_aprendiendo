import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook to fetch and synchronize additional user data from Firestore.
 * Useful for getting profile photos, phone numbers, etc.
 */
export const useUserData = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserData(null);
      setLoading(false);
      return;
    }

    // Subscribe to the user's document in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        // Fallback to basic Firebase user info if document doesn't exist
        setUserData({
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching user data:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { userData, loading };
};
