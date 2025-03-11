import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  
  const handleSignOut = () => {
    localStorage.removeItem('uid');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    
    navigate('/login');
  };
  
  return (
    <nav className="navbar">
      {localStorage.getItem('uid') && (
        <button 
          onClick={handleSignOut}
          className="sign-out-btn"
        >
          Sign Out
        </button>
      )}
    </nav>
  );
}

export default Navbar; 