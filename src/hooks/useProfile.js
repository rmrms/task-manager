// src/hooks/useProfile.js
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';

export function useProfile(userId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profileRef = doc(db, 'userProfiles', userId);
        const profileSnap = await getDoc(profileRef);
        
        if (profileSnap.exists()) {
          setProfile(profileSnap.data());
        } else {
          // Create default profile if it doesn't exist
          const defaultProfile = {
            displayName: auth.currentUser?.displayName || '',
            email: auth.currentUser?.email || '',
            phoneNumber: '',
            bio: '',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            notificationPreferences: {
              email: true,
              push: false
            },
            createdAt: new Date(),
            lastUpdated: new Date()
          };
          
          await setDoc(profileRef, defaultProfile);
          setProfile(defaultProfile);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const updateUserProfile = async (updates) => {
    try {
      setLoading(true);
      const profileRef = doc(db, 'userProfiles', userId);
      
      // Update Firebase Auth profile if display name is changed
      if (updates.displayName) {
        await updateProfile(auth.currentUser, {
          displayName: updates.displayName
        });
      }

      // Update email if changed
      if (updates.email && updates.email !== auth.currentUser.email) {
        await updateEmail(auth.currentUser, updates.email);
      }

      // Update password if provided
      if (updates.newPassword) {
        await updatePassword(auth.currentUser, updates.newPassword);
        delete updates.newPassword; // Don't store password in Firestore
      }

      // Update Firestore profile
      await updateDoc(profileRef, {
        ...updates,
        lastUpdated: new Date()
      });

      // Update local state
      setProfile(prevProfile => ({
        ...prevProfile,
        ...updates,
        lastUpdated: new Date()
      }));

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, updateUserProfile };
}