import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrUpdateUserProfile, getUserProfile } from '../services/userProfile';

export function useProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const navigate = useNavigate();

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createOrUpdateUserProfile(profileData);
      if (!result.success) throw new Error(result.error);
      
      // Check if profile is now complete after update
      const updatedProfile = await getUserProfile();
      if (updatedProfile.success) {
        checkProfileCompletion(updatedProfile.profile);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getUserProfile();
      if (!result.success) throw new Error(result.error);
      
      // Check if profile is complete
      checkProfileCompletion(result.profile);
      
      return result.profile;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Check if the user profile is complete
  const checkProfileCompletion = (profile) => {
    // Define what constitutes a complete profile
    const isComplete = profile && 
                      profile.userType;
    
    setIsProfileComplete(isComplete);
    return isComplete;
  };
  
  // Function to handle authentication flow
  const handleAuthFlow = async () => {
    try {
      const profile = await getProfile();
      
      if (checkProfileCompletion(profile)) {
        // Profile is complete, go to home
        navigate('/home');
      } else {
        // Profile is incomplete, go to user type selection
        navigate('/auth/user-type');
      }
    } catch (err) {
      console.error('Error in auth flow:', err);
      // If there's an error, assume profile is incomplete
      navigate('/auth/user-type');
    }
  };

  return { 
    updateProfile, 
    getProfile, 
    loading, 
    error, 
    isProfileComplete,
    checkProfileCompletion,
    handleAuthFlow
  };
} 