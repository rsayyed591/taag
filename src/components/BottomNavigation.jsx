import { Link, useLocation } from 'react-router-dom';

function BottomNavigation() {
  const location = useLocation();
  
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#EAEAEA] border-[#EAEAEA] rounded-full py-2.5 px-6 max-w-md w-[90%] flex justify-between items-center transition-colors">
      <Link to="/home" className="flex flex-col items-center transition-colors">
        <img 
          src={location.pathname === '/home' ? "/icons/chat-active.svg" : "/icons/chat.svg"} 
          alt="Chats" 
          className="w-6 h-6" 
        />
      </Link>
      <Link to="/campaign" className="flex flex-col items-center transition-colors">
        <img 
          src={location.pathname === '/campaign' ? "/icons/compaign-active.svg" : "/icons/compaign.svg"} 
          alt="Compaign" 
          className="w-6 h-6" 
        />
      </Link>
      <Link to="/invoice" className="flex flex-col items-center transition-colors">
        <img 
          src={location.pathname === '/invoice' ? "/icons/invoice-active.svg" : "/icons/invoice.svg"} 
          alt="Invoices" 
          className="w-6 h-6" 
        />
      </Link>
      <Link to="/profile" className="flex flex-col items-center transition-colors">
        <img 
          src="/icons/profile.svg"
          alt="Profile" 
          className="w-6 h-6 ${location.pathname === '/profile' ? 'border-[#12766A]' : ''}" 
        />
      </Link>
    </div>
  );
}

export default BottomNavigation;
