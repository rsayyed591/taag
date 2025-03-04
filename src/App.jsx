import { Routes, Route, Navigate, BrowserRouter as Router } from "react-router-dom"
import Landing from "./pages/Landing"
import UserType from "./pages/UserType"
function App() {

  return (
    <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/landing" />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/user-type" element={<UserType />} />
    </Routes>
    </Router>
  )
}

export default App
