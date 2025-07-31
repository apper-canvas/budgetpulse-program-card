import Progress from "@/components/atoms/Progress";
import { cn } from "@/utils/cn";

const CategoryProgress = ({ spent, limit, className }) => {
  const percentage = limit > 0 ? (spent / limit) * 100 : 0;
  
  const getVariant = () => {
    if (percentage >= 100) return "danger";
    if (percentage >= 80) return "warning";
    return "success";
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">
          ${spent.toFixed(2)} spent
        </span>
        <span className="text-gray-600">
          ${limit.toFixed(2)} limit
        </span>
      </div>
      <Progress value={percentage} variant={getVariant()} />
      <div className="text-xs text-gray-500 text-center">
        {percentage.toFixed(1)}% of budget used
      </div>
    </div>
  );
};

export default CategoryProgress;