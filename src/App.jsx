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
import ViewInvoice from "./pages/invoice/ViewInvoice";
import Profile from "./pages/profile/Profile";
import CreatorDetails from "./pages/profile/CreatorDetails";
import BankDetails from "./pages/profile/BankDetails";
import Managers from "./pages/profile/Managers";
import ResetPassword from "./pages/profile/ResetPassword";
import FAQs from "./pages/profile/FAQs";
import Campaign from "./pages/campaign/Campaign";
import ChatScreen from "./pages/home/ChatScreen"
import NewCampaign from "./pages/campaign/NewCampaign";
import CreatorSelection from "./pages/campaign/CreatorSelection";
import ChatCampaign from "./pages/campaign/ChatCampaign";
import ViewCampaign from "./pages/campaign/ViewCampaign";

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
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/creator-details" element={<CreatorDetails />} />
        <Route path="/profile/bank-details" element={<BankDetails />} />
        <Route path="/profile/managers" element={<Managers />} />
        <Route path="/profile/reset-password" element={<ResetPassword />} />
        <Route path="/profile/faqs" element={<FAQs />} />
        <Route path="/chat/:chatName" element={<ChatScreen />} />      
        <Route path="/campaign" element={<Campaign />} />
        <Route path="/campaign/new-campaign" element={<NewCampaign />} />
        <Route path="/campaign/creator/:campaignId" element={<CreatorSelection />} />
        <Route path="/campaign/view/:campaignId" element={<ViewCampaign />} />
        <Route path="/chat/:campaignId/:creatorName" element={<ChatCampaign />} />
      </Routes>
    </Router>
  );
}

export default App;
