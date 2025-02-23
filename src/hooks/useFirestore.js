// src/hooks/useFirestore.js
// This custom hook will handle our Firestore operations more efficiently
import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export function useFirestore(collectionName, userId) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Creating an initial query for the collection
    const q = query(
      collection(db, collectionName),
      where("userId", "==", userId)
    );

    // Setting up a real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(items);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [collectionName, userId]);

  const addItem = async (item) => {
    try {
      await addDoc(collection(db, collectionName), {
        ...item,
        userId,
        createdAt: new Date(),
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateItem = async (id, updates) => {
    try {
      await updateDoc(doc(db, collectionName, id), updates);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { data, loading, error, addItem, deleteItem, updateItem };
}

