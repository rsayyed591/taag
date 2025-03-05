import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Landing from "./pages/auth/Landing";
import UserType from "./pages/auth/UserType";
import Socials from "./pages/auth/Socials";
import Categories from "./pages/auth/Categories";
import Notifications from "./pages/auth/Notifications";
import PhoneVerification from "./pages/auth/PhoneVerification";
import OtpVerification from "./pages/auth/OtpVerification";
import Success from "./pages/auth/Success";
import Home from "./pages/home/Home";
import Invoice from "./pages/invoice/Invoice";
import NewInvoice from "./pages/invoice/NewInvoice";
import EditInvoiceForm from "./pages/invoice/EditInvoiceForm";
import ViewInvoice from "./pages/invoice/ViewInvoice";

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
        <Route path="/home" element={<Home />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/invoice/new-invoice" element={<NewInvoice />} />
        <Route path="/invoice/:brandName" element={<ViewInvoice />} />
        <Route path="/invoice/new-invoice/edit-form" element={<EditInvoiceForm />} />
      </Routes>
    </Router>
  );
}

export default App;
