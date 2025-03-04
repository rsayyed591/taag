import { Routes, Route, Navigate, BrowserRouter as Router } from "react-router-dom"
import Landing from "./pages/Landing"
import UserType from "./pages/UserType"
import Socials from "./pages/Socials"
import Categories from "./pages/Categories"
import Notifications from "./pages/Notifications"
function App() {

  return (
    <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/landing" />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/user-type" element={<UserType />} />
      <Route path="/socials" element={<Socials />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/notifications" element={<Notifications />} />
    </Routes>
    </Router>
  )
}

export default App
