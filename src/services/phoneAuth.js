import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../../firebase.config';

// Format phone number to E.164 format
const formatPhoneNumber = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  return cleaned.startsWith('91') ? `+${cleaned}` : `+91${cleaned}`;
};

// Send OTP with normal reCAPTCHA implementation
export const sendOTP = async (phoneNumber, setConfirmationResult, setOtpSent) => {
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
    const phoneNumberWithCode = formatPhoneNumber(phoneNumber);
    console.log("Formatted phone:", phoneNumberWithCode);

    // Create new reCAPTCHA verifier
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      //  sitekey: '6Le4aPlqAAAAAFfQSfadbg1Vjrwx9OzcQcv7pcab',
      callback: (response) => {
        console.log("response",response);
        console.log("reCAPTCHA resolved");
      },
      'expired-callback': () => {
        // Reset reCAPTCHA when expired
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        }
      }
    });

    // Render the reCAPTCHA widget
    await window.recaptchaVerifier.render();

    // Send OTP
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumberWithCode,
      window.recaptchaVerifier
    );
    console.log("confirmationResult",confirmationResult);

    window.confirmationResult = confirmationResult;
    // setConfirmationResult(confirmationResult);
    // setOtpSent(true);
    return { success: true };

  } catch (error) {
    console.error('Error sending OTP:', error);
    
    // Clear verifier on error
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
