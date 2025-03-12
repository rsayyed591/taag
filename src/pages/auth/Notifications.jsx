import {
  IonAlert,
  IonContent,
  IonPage
} from "@ionic/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../hooks/useProfile";

function Notifications() {
  const navigate = useNavigate();
  const { updateProfile, loading } = useProfile();
  const [showAlert, setShowAlert] = useState(true);

  const handleContinue = async () => {
    try {
      await updateProfile({
        notifications: "denied"
      });
      navigate("/auth/phone-verification");
    } catch (error) {
      console.error('Error updating notifications:', error);
      alert('Error saving notification preference. Please try again.');
    }
  };

  const handleAllow = async () => {
    try {
      await updateProfile({
        notifications: "allowed"
      });
      navigate("/home");
    } catch (error) {
      console.error('Error updating notifications:', error);
      alert('Error saving notification preference. Please try again.');
    }
  };

  const handleDontAllow = async () => {
    try {
      await updateProfile({
        notifications: "denied"
      });
      setShowAlert(false);
    } catch (error) {
      console.error('Error updating notifications:', error);
      alert('Error saving notification preference. Please try again.');
    }
  };

  return (
    <IonPage>
      <IonContent className="page-container ion-padding relative">
        <div className="content-container pt-6 md:pt-12">
          {/* Heading */}
          <h2 className="header">
            Enable notifications to get more opportunities
          </h2>

          {/* Notification Alert */}
          <IonAlert
            isOpen={showAlert}
            header="Enable Notifications"
            subHeader="Get updates from TAAG"
            message="Would you like to enable notifications?"
            buttons={[
              {
                text: "Don't Allow",
                role: "cancel",
                handler: handleDontAllow,
              },
              {
                text: "Allow",
                handler: handleAllow,
              },
            ]}
          />
        </div>

        {/* Continue Button (Fixed at Bottom) */}
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50">
          <button 
            className="btn-primary2 w-[90%] max-w-[400px]" 
            onClick={handleContinue}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default Notifications;
