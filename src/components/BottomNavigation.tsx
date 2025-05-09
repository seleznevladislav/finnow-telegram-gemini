
import { Home, CreditCard, BarChart2, List, PlusCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function BottomNavigation() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border flex items-center justify-around px-2 z-40">
      <Link to="/" className={`flex flex-col items-center justify-center w-16 py-1 ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}>
        <Home size={30} />
      </Link>
      
      <Link to="/accounts" className={`flex flex-col items-center justify-center w-16 py-1 ${isActive('/accounts') ? 'text-primary' : 'text-muted-foreground'}`}>
        <CreditCard size={30} />
      </Link>
      
      <div className="relative -mt-8">
        <button className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-md">
          <PlusCircle size={30} className="text-white" />
        </button>
      </div>
      
      <Link to="/transactions" className={`flex flex-col items-center justify-center w-16 py-1 ${isActive('/transactions') ? 'text-primary' : 'text-muted-foreground'}`}>
        <List size={30} />
      </Link>
      
      <Link to="/analytics" className={`flex flex-col items-center justify-center w-16 py-1 ${isActive('/analytics') ? 'text-primary' : 'text-muted-foreground'}`}>
        <BarChart2 size={30} />
      </Link>
    </div>
  );
}
