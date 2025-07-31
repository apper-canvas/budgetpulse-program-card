import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CategoryIcon = ({ icon, color, size = "md" }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <div 
      className={cn(
        "rounded-full flex items-center justify-center shadow-sm",
        sizes[size]
      )}
      style={{ backgroundColor: `${color}20`, border: `2px solid ${color}30` }}
    >
      <ApperIcon 
        name={icon} 
        size={iconSizes[size]} 
        style={{ color: color }}
      />
    </div>
  );
};

export default CategoryIcon;