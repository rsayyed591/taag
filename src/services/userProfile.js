import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';

export const createOrUpdateUserProfile = async (profileData, newUserId = null) => {
  try {
    // Get the user ID - either from the parameter (for new users) or from localStorage
    const uid = newUserId || localStorage.getItem('uid');
    
    if (!uid) {
      throw new Error('No user ID provided. Cannot update profile without user ID.');
    }
    
    console.log('Creating/updating profile for user ID:', uid);
    console.log('Profile data to save:', profileData);
    
    // Reference to the specific user's document
    const userRef = doc(db, 'users', uid);
    
    // Get current user data
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      // Update existing user document
      console.log('Updating existing user document');
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: serverTimestamp()
      });
    } else {
      // Create new user document
      console.log('Creating new user document');
      await setDoc(userRef, {
        ...profileData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    console.log('Profile updated successfully');
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error };
  }
};

export const getUserProfile = async (userId = null) => {
  try {
    // Get the user ID - either from the parameter or from localStorage
    const uid = userId || localStorage.getItem('uid');
    
    if (!uid) {
      console.warn('No user ID found. Returning empty profile.');
      return { success: true, profile: {} };
    }
    
    // Reference to the specific user's document
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return { success: true, profile: userDoc.data() };
    } else {
      return { success: true, profile: {} };
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, error };
  }
}; 