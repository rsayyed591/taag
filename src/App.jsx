import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Landing from "./pages/Landing";
import UserType from "./pages/UserType";
import Socials from "./pages/Socials";
import Categories from "./pages/Categories";
import Notifications from "./pages/Notifications";
import PhoneVerification from "./pages/PhoneVerification";
import OtpVerification from "./pages/OtpVerification";
import Success from "./pages/Success";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        {/* Auth Routes */}
        <Route path="/auth/user-type" element={<UserType />} />
        <Route path="/auth/socials" element={<Socials />} />
        <Route path="/auth/categories" element={<Categories />} />
        <Route path="/auth/notifications" element={<Notifications />} />
        <Route path="/auth/phone-verification" element={<PhoneVerification />} />
        <Route path="/auth/otp-verification" element={<OtpVerification />} />
        <Route path="/auth/success" element={<Success />} />
      </Routes>
    </Router>
  );
}

export default App;
