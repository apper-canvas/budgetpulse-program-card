import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import TransactionItem from "@/components/molecules/TransactionItem";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import transactionService from "@/services/api/transactionService";
import budgetService from "@/services/api/budgetService";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [transactionType, setTransactionType] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
const [transactionData, budgetData] = await Promise.all([
        transactionService.getAll(),
        budgetService.getCurrentBudget()
      ]);
      
      setTransactions(transactionData);
      setCategories(budgetData.categories);
      toast.success("Transactions loaded successfully");
    } catch (err) {
      setError(err.message || "Failed to load transactions");
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    // Search filter
    const matchesSearch = searchTerm === "" || 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toString().includes(searchTerm);

    // Category filter
    const matchesCategory = selectedCategory === "" || 
      transaction.categoryId.toString() === selectedCategory;

    // Type filter
    const matchesType = transactionType === "all" || 
      transaction.type === transactionType;

    // Date range filter
    const transactionDate = new Date(transaction.date);
    const matchesDateFrom = dateFrom === "" || 
      transactionDate >= new Date(dateFrom);
    const matchesDateTo = dateTo === "" || 
      transactionDate <= new Date(dateTo + "T23:59:59");

    return matchesSearch && matchesCategory && matchesType && matchesDateFrom && matchesDateTo;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setTransactionType("all");
    setDateFrom("");
    setDateTo("");
    toast.info("Filters cleared");
  };

  const getTransactionCategory = (categoryId) => {
    return categories.find(cat => cat.Id === categoryId);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="p-4 pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">
          Transaction History
        </h1>
        <p className="text-gray-600">
          View and manage all your transactions
        </p>
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-lg border border-gray-100 p-4 mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <ApperIcon 
            name="Search" 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
          <Input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-12 rounded-lg border border-gray-200 bg-surface px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.Id} value={category.Id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="w-full h-12 rounded-lg border border-gray-200 bg-surface px-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Types</option>
              <option value="expense">Expenses</option>
              <option value="income">Income</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>

        {/* Clear Filters */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-sm text-gray-600">
            {filteredTransactions.length} of {transactions.length} transactions
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="text-sm"
          >
            <ApperIcon name="X" size={16} className="mr-1" />
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <Empty 
            icon="Receipt"
            title="No transactions found"
            description="Try adjusting your filters or search terms"
          />
        ) : (
          filteredTransactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(transaction => (
              <TransactionItem
                key={transaction.Id}
                transaction={transaction}
                category={getTransactionCategory(transaction.categoryId)}
              />
            ))
        )}
      </div>
    </div>
  );
};

export default Transactions;