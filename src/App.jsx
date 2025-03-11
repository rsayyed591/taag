import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Categories from "./pages/auth/Categories";
import Landing from "./pages/auth/Landing";
import Notifications from "./pages/auth/Notifications";
import OtpVerification from "./pages/auth/OtpVerification";
import PhoneVerification from "./pages/auth/PhoneVerification";
import Socials from "./pages/auth/Socials";
import Success from "./pages/auth/Success";
import UserType from "./pages/auth/UserType";
import ChatScreen from "./pages/home/ChatScreen";
import Home from "./pages/home/Home";
import Invoice from "./pages/invoice/Invoice";
import NewInvoice from "./pages/invoice/NewInvoice";
import ViewInvoice from "./pages/invoice/ViewInvoice";
import BankDetails from "./pages/profile/BankDetails";
import CreatorDetails from "./pages/profile/CreatorDetails";
import FAQs from "./pages/profile/FAQs";
import Managers from "./pages/profile/Managers";
import Profile from "./pages/profile/Profile";
import ResetPassword from "./pages/profile/ResetPassword";
// import FAQs from "./pages/profile/FAQs";
import Campaign from "./pages/campaign/Campaign";
// import ChatScreen from "./pages/home/ChatScreen"
import NewCampaign from "./pages/campaign/NewCampaign";
import CreatorSelection from "./pages/campaign/CreatorSelection";
import ChatCampaign from "./pages/campaign/ChatCampaign";
import ViewCampaign from "./pages/campaign/ViewCampaign";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes - Authentication Flow */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth/user-type" element={<UserType />} />
          <Route path="/auth/socials" element={<Socials />} />
          <Route path="/auth/categories" element={<Categories />} />
          <Route path="/auth/notifications" element={<Notifications />} />
          <Route path="/auth/phone-verification" element={<PhoneVerification />} />
          <Route path="/auth/otp-verification" element={<OtpVerification />} />
          <Route path="/auth/success" element={<Success />} />
          
          {/* Protected Routes - Require Authentication */}
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          
          {/* Invoice Routes */}
          <Route path="/invoice" element={
            <ProtectedRoute>
              <Invoice />
            </ProtectedRoute>
          } />
          
          <Route path="/invoice/new-invoice" element={
            <ProtectedRoute>
              <NewInvoice />
            </ProtectedRoute>
          } />
          
          <Route path="/invoice/:id" element={
            <ProtectedRoute>
              <ViewInvoice />
            </ProtectedRoute>
          } />
          
          {/* Profile Routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/profile/creator-details" element={
            <ProtectedRoute>
              <CreatorDetails />
            </ProtectedRoute>
          } />
          
          <Route path="/profile/bank-details" element={
            <ProtectedRoute>
              <BankDetails />
            </ProtectedRoute>
          } />
          
          <Route path="/profile/managers" element={
            <ProtectedRoute>
              <Managers />
            </ProtectedRoute>
          } />
          
          <Route path="/profile/reset-password" element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          } />
          
          <Route path="/profile/faqs" element={
            <ProtectedRoute>
              <FAQs />
            </ProtectedRoute>
          } />
          
          <Route path="/chat/:chatId" element={
            <ProtectedRoute>
              <ChatScreen />
            </ProtectedRoute>
          } />
          
          {/* Catch-all route - redirect to home if logged in, otherwise to landing */}
          <Route path="*" element={
            localStorage.getItem('uid') ? 
              <Navigate to="/home" replace /> : 
              <Navigate to="/" replace />
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
