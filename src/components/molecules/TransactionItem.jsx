import { format } from "date-fns";
import CategoryIcon from "@/components/molecules/CategoryIcon";
import { cn } from "@/utils/cn";

const TransactionItem = ({ transaction, category }) => {
  const isExpense = transaction.type === "expense";
  
  return (
    <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-3">
        <CategoryIcon 
          icon={category?.icon || "DollarSign"} 
          color={category?.color || "#6B7280"} 
          size="sm"
        />
        <div>
          <div className="font-medium text-gray-900 text-sm">
            {transaction.description}
          </div>
          <div className="text-xs text-gray-500">
            {category?.name} • {format(new Date(transaction.date), "MMM d")}
          </div>
        </div>
      </div>
      
      <div className={cn(
        "font-semibold",
        isExpense ? "text-error" : "text-success"
      )}>
        {isExpense ? "-" : "+"}${Math.abs(transaction.amount).toFixed(2)}
      </div>
    </div>
  );
};

export default TransactionItem;