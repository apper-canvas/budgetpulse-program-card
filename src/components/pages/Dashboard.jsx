import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import BudgetHeader from "@/components/molecules/BudgetHeader";
import CategoryCard from "@/components/organisms/CategoryCard";
import TransactionItem from "@/components/molecules/TransactionItem";
import FloatingActionButton from "@/components/molecules/FloatingActionButton";
import ExpenseModal from "@/components/organisms/ExpenseModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import budgetService from "@/services/api/budgetService";
import transactionService from "@/services/api/transactionService";

const Dashboard = () => {
  const [budget, setBudget] = useState(null);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState("November");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [budgetData, transactionData] = await Promise.all([
        budgetService.getCurrentBudget(),
        transactionService.getRecentTransactions(7)
      ]);
      
      setBudget(budgetData);
      setCategories(budgetData.categories || []);
      setTransactions(transactionData);
    } catch (err) {
      setError(err.message || "Failed to load budget data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddExpense = async (expenseData) => {
    try {
      const newTransaction = await transactionService.create({
        ...expenseData,
        date: new Date().toISOString()
      });

      // Update local state
      setTransactions(prev => [newTransaction, ...prev.slice(0, 6)]);
      
      // Update category spent amount
      setCategories(prev => prev.map(cat => 
        cat.Id === expenseData.categoryId 
          ? { ...cat, spent: cat.spent + (expenseData.type === "expense" ? expenseData.amount : -expenseData.amount) }
          : cat
      ));

      toast.success(
        expenseData.type === "expense" 
          ? `Expense of $${expenseData.amount.toFixed(2)} added successfully!`
          : `Income of $${expenseData.amount.toFixed(2)} added successfully!`
      );
    } catch (err) {
      toast.error("Failed to add transaction");
    }
  };

  const handleMonthChange = (month) => {
    setCurrentMonth(month);
    // In a real app, this would load data for the selected month
    toast.info(`Switched to ${month}`);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!budget) return <Empty title="No Budget Found" description="Create your first budget to get started" />;

  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);

  return (
    <div className="space-y-6">
      <BudgetHeader
        currentMonth={currentMonth}
        totalBudget={budget.totalBudget}
        totalSpent={totalSpent}
        onMonthChange={handleMonthChange}
      />

      {/* Budget Categories */}
      <div>
        <h2 className="font-display text-lg font-semibold text-gray-900 mb-4">
          Budget Categories
        </h2>
        {categories.length === 0 ? (
          <Empty 
            title="No Categories" 
            description="Add budget categories to track your spending"
            icon="Folder"
            actionLabel="Add Category"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.Id} category={category} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="font-display text-lg font-semibold text-gray-900 mb-4">
          Recent Transactions
        </h2>
        {transactions.length === 0 ? (
          <Empty 
            title="No Transactions" 
            description="Start tracking your expenses by adding your first transaction"
            icon="Receipt"
            actionLabel="Add Transaction"
            onAction={() => setIsExpenseModalOpen(true)}
          />
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => {
              const category = categories.find(cat => cat.Id === transaction.categoryId);
              return (
                <TransactionItem 
                  key={transaction.Id} 
                  transaction={transaction} 
                  category={category}
                />
              );
            })}
          </div>
        )}
      </div>

      <FloatingActionButton onClick={() => setIsExpenseModalOpen(true)} />

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSubmit={handleAddExpense}
        categories={categories}
      />
    </div>
  );
};

export default Dashboard;