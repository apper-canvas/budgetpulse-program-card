import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const BudgetHeader = ({ currentMonth, totalBudget, totalSpent, onMonthChange }) => {
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const remaining = totalBudget - totalSpent;
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getStatusColor = () => {
    if (spentPercentage >= 100) return "text-error";
    if (spentPercentage >= 80) return "text-warning";
    return "text-success";
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (spentPercentage / 100) * circumference;

  return (
    <div className="bg-gradient-to-br from-primary via-primary-600 to-primary-700 text-white p-6 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 p-2 rounded-lg"
            onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
          >
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-semibold">{currentMonth}</span>
              <ApperIcon name="ChevronDown" size={16} />
            </div>
          </Button>
          
          {isMonthPickerOpen && (
            <div className="absolute top-full left-0 mt-2 bg-surface rounded-lg shadow-lg border border-gray-200 py-2 z-50 min-w-[140px]">
              {months.map((month) => (
                <button
                  key={month}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm"
                  onClick={() => {
                    onMonthChange(month);
                    setIsMonthPickerOpen(false);
                  }}
                >
                  {month}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <ApperIcon name="Calendar" size={24} className="opacity-80" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="mb-2">
            <span className="text-white/80 text-sm font-medium">Total Budget</span>
            <div className="text-3xl font-bold font-display">
              ${totalBudget.toLocaleString()}
            </div>
          </div>
          
          <div className="mb-2">
            <span className="text-white/80 text-sm font-medium">Spent</span>
            <div className={`text-xl font-semibold ${getStatusColor()}`}>
              ${totalSpent.toLocaleString()}
            </div>
          </div>
          
          <div>
            <span className="text-white/80 text-sm font-medium">Remaining</span>
            <div className={`text-lg font-medium ${remaining >= 0 ? "text-success" : "text-error"}`}>
              ${remaining.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="relative">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-white/20"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className={spentPercentage >= 100 ? "text-error" : spentPercentage >= 80 ? "text-warning" : "text-success"}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold">
              {spentPercentage.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetHeader;