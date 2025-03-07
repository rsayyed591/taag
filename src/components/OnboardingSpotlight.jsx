import { useEffect } from "react";
import { IonAlert } from "@ionic/react";

function OnboardingSpotlight({ steps, onComplete }) {
  useEffect(() => {
    // Check if spotlight has been shown before
    const hasSeenSpotlight = localStorage.getItem("hasSeenSpotlight");
    if (hasSeenSpotlight) {
      onComplete();
    }
  }, [onComplete]);

  const handleDismiss = () => {
    // Save to localStorage so it doesn't show again
    localStorage.setItem("hasSeenSpotlight", "true");
    onComplete();
  };

  return (
    <IonAlert
      isOpen={true}
      header="Welcome to Taag!"
      subHeader="Let's get you started"
      message={steps[0]?.description || "Discover all the features Taag has to offer."}
      buttons={[
        {
          text: "Skip",
          role: "cancel",
          handler: handleDismiss,
        },
        {
          text: "Got it",
          handler: handleDismiss,
        },
      ]}
      onDidDismiss={handleDismiss}
    />
  );
}

export default OnboardingSpotlight;
