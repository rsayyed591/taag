import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../../firebase.config';

// Format phone number to E.164 format
const formatPhoneNumber = (phoneNumber) => {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Make sure it has country code
  return cleaned.startsWith('91') ? `+${cleaned}` : `+91${cleaned}`;
};

// Send OTP with fixed reCAPTCHA implementation
export const sendOTP = async (phoneNumber) => {
  try {
    // Clear existing verifier if any
    if (window.recaptchaVerifier) {
      try {
        await window.recaptchaVerifier.clear();
      } catch (e) {
        console.log("Error clearing existing verifier:", e);
      }
      window.recaptchaVerifier = null;
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(phoneNumber);
    console.log("Formatted phone:", formattedPhone);

    // Make sure the recaptcha container exists
    const recaptchaContainer = document.getElementById('recaptcha-container');
    if (!recaptchaContainer) {
      console.error('Recaptcha container not found in the DOM');
      return { 
        success: false, 
        error: 'Technical error: Recaptcha container not found' 
      };
    }

    // Create new reCAPTCHA verifier with proper parameters
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        onSignInSubmit();
      }
    });

    // Render the reCAPTCHA widget
    await window.recaptchaVerifier.render();
    
    // Send OTP
    console.log("Sending OTP to:", formattedPhone);
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      formattedPhone,
      window.recaptchaVerifier
    );
    
    window.confirmationResult = confirmationResult;
    return { success: true };

  } catch (error) {
    console.error('Error sending OTP:', error);
    
    // Clear verifier
    if (window.recaptchaVerifier) {
      try {
        await window.recaptchaVerifier.clear();
      } catch (e) {
        console.log("Error clearing verifier:", e);
      }
      window.recaptchaVerifier = null;
    }

    return { 
      success: false, 
      error: error.code === 'auth/too-many-requests'
        ? 'Too many attempts. Please try again after some time.'
        : error.code === 'auth/invalid-phone-number'
        ? 'Please enter a valid phone number'
        : error.message || 'Failed to send OTP. Please try again.'
    };
  }
};

// Verify OTP
export const verifyOTP = async (otp) => {
  try {
    if (!window.confirmationResult) {
      throw new Error('Please request OTP first');
    }

    const result = await window.confirmationResult.confirm(otp);
    return { success: true, user: result.user };

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { 
      success: false, 
      error: error.code === 'auth/invalid-verification-code'
        ? 'Invalid OTP. Please try again.'
        : error.message 
    };

  } finally {
    // Clean up reCAPTCHA
    if (window.recaptchaVerifier) {
      try {
        await window.recaptchaVerifier.clear();
      } catch (clearError) {
        console.error('Error clearing reCAPTCHA:', clearError);
      }
      window.recaptchaVerifier = null;
    }
    window.confirmationResult = null;
  }
};
