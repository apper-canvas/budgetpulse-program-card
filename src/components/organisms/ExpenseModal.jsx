import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import CategoryIcon from "@/components/molecules/CategoryIcon";
import { cn } from "@/utils/cn";

const ExpenseModal = ({ isOpen, onClose, onSubmit, categories = [] }) => {
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("expense");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !selectedCategory) return;

    onSubmit({
      amount: parseFloat(amount),
      categoryId: selectedCategory.Id,
      description: description || `${selectedCategory.name} transaction`,
      type: type
    });

    // Reset form
    setAmount("");
    setSelectedCategory(null);
    setDescription("");
    setType("expense");
    onClose();
  };

  const numberPadButtons = [
    "1", "2", "3",
    "4", "5", "6", 
    "7", "8", "9",
    ".", "0", "⌫"
  ];

  const handleNumberPad = (value) => {
    if (value === "⌫") {
      setAmount(prev => prev.slice(0, -1));
    } else if (value === "." && amount.includes(".")) {
      return;
    } else {
      setAmount(prev => prev + value);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="relative w-full max-w-md bg-surface rounded-t-3xl sm:rounded-2xl shadow-2xl"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-gray-900">
                  Add Transaction
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="rounded-full p-2"
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type Selector */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setType("expense")}
                    className={cn(
                      "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
                      type === "expense" 
                        ? "bg-surface text-gray-900 shadow-sm" 
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("income")}
                    className={cn(
                      "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
                      type === "income" 
                        ? "bg-surface text-gray-900 shadow-sm" 
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    Income
                  </button>
                </div>

                {/* Amount Display */}
                <div className="text-center">
                  <div className="text-3xl font-bold font-display text-gray-900 mb-2">
                    ${amount || "0.00"}
                  </div>
                  <Input
                    type="text"
                    placeholder="Or type amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                    className="text-center"
                  />
                </div>

                {/* Number Pad */}
                <div className="grid grid-cols-3 gap-2">
                  {numberPadButtons.map((btn) => (
                    <button
                      key={btn}
                      type="button"
                      onClick={() => handleNumberPad(btn)}
                      className="h-12 bg-gray-50 hover:bg-gray-100 rounded-lg font-medium text-gray-900 transition-colors"
                    >
                      {btn}
                    </button>
                  ))}
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Category
                  </label>
                  <div className="grid grid-cols-4 gap-3 max-h-32 overflow-y-auto">
                    {categories.map((category) => (
                      <button
                        key={category.Id}
                        type="button"
                        onClick={() => setSelectedCategory(category)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
                          selectedCategory?.Id === category.Id
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <CategoryIcon 
                          icon={category.icon} 
                          color={category.color} 
                          size="sm"
                        />
                        <span className="text-xs font-medium text-gray-700 text-center">
                          {category.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="What was this for?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={!amount || !selectedCategory}
                >
                  Add {type === "expense" ? "Expense" : "Income"}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ExpenseModal;