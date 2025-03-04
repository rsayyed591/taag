import { Routes, Route, Navigate, BrowserRouter as Router } from "react-router-dom"
import Landing from "./pages/Landing"
import UserType from "./pages/UserType"
import Socials from "./pages/Socials"
function App() {

  return (
    <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/landing" />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/user-type" element={<UserType />} />
      <Route path="/socials" element={<Socials />} />
    </Routes>
    </Router>
  )
}

export default App
