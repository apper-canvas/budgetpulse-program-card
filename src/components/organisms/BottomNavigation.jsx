import { useNavigate, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/", icon: "Home", label: "Dashboard" },
    { path: "/transactions", icon: "Receipt", label: "Transactions" },
    { path: "/reports", icon: "BarChart3", label: "Reports" },
    { path: "/settings", icon: "Settings", label: "Settings" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-200 px-4 py-2 z-30">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <ApperIcon 
                name={item.icon} 
                size={20} 
                className={isActive ? "text-primary" : ""}
              />
              <span className="text-xs font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;