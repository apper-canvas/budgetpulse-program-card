import transactionData from "@/services/mockData/transactions.json";
const transactionService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return JSON.parse(JSON.stringify(transactionData));
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const transaction = transactionData.find(t => t.Id === parseInt(id));
    return transaction ? JSON.parse(JSON.stringify(transaction)) : null;
  },

  getRecentTransactions: async (limit = 5) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    const sorted = [...transactionData]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
    return JSON.parse(JSON.stringify(sorted));
  },

  create: async (transactionData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Find the highest existing Id and add 1
    const maxId = Math.max(...transactionData.map(t => t.Id), 0);
    const newTransaction = {
      Id: maxId + 1,
      ...transactionData,
      date: new Date().toISOString()
    };
    
    // Add to the beginning of the array
    transactionData.unshift(newTransaction);
    
    return JSON.parse(JSON.stringify(newTransaction));
  },

  update: async (id, updates) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = transactionData.findIndex(t => t.Id === parseInt(id));
    if (index === -1) throw new Error("Transaction not found");
    
    transactionData[index] = { ...transactionData[index], ...updates };
    return JSON.parse(JSON.stringify(transactionData[index]));
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = transactionData.findIndex(t => t.Id === parseInt(id));
    if (index === -1) throw new Error("Transaction not found");
    
const deleted = transactionData.splice(index, 1)[0];
    return JSON.parse(JSON.stringify(deleted));
  },

  // Analytics methods
  getCategorySpending: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get budget data for category info
    const budgetResponse = await fetch('/src/services/mockData/budget.json');
    const budgetData = await budgetResponse.json();
    
    // Calculate spending by category for current month
    const categorySpending = budgetData.categories.map(category => ({
      Id: category.Id,
      name: category.name,
      spent: category.spent,
      limit: category.limit,
      color: category.color
    }));
    
    return categorySpending;
  },

  getMonthlyTrends: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Generate historical spending data for last 6 months
    const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
    const trends = months.map(month => ({
      month,
      spending: Math.random() * 1000 + 1500 // Random spending between $1500-$2500
    }));
    
    return trends;
  },

  getCategoryPerformance: async () => {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    // Get budget data for performance calculation
    const budgetResponse = await fetch('/src/services/mockData/budget.json');
    const budgetData = await budgetResponse.json();
    
    return budgetData.categories.map(category => ({
      Id: category.Id,
      name: category.name,
      spent: category.spent,
      limit: category.limit,
      color: category.color,
      performance: (category.spent / category.limit) * 100
    }));
  },

  getSpendingInsights: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const transactions = JSON.parse(JSON.stringify(transactionData));
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    // Find highest spending day
    const dailySpending = {};
    expenseTransactions.forEach(transaction => {
      const date = new Date(transaction.date).toLocaleDateString();
      dailySpending[date] = (dailySpending[date] || 0) + transaction.amount;
    });
    
    const highestDay = Object.entries(dailySpending).reduce((max, [date, amount]) => 
      amount > max.amount ? { date, amount } : max, { date: '', amount: 0 });
    
    // Find most frequent category
    const categoryFrequency = {};
    expenseTransactions.forEach(transaction => {
      categoryFrequency[transaction.categoryId] = (categoryFrequency[transaction.categoryId] || 0) + 1;
    });
    
    const mostFrequentCategoryId = Object.entries(categoryFrequency).reduce((max, [id, count]) => 
      count > max.count ? { id: parseInt(id), count } : max, { id: 0, count: 0 });
    
    // Get category name
    const budgetResponse = await fetch('/src/services/mockData/budget.json');
    const budgetData = await budgetResponse.json();
    const mostFrequentCategory = budgetData.categories.find(cat => cat.Id === mostFrequentCategoryId.id);
    
    // Calculate average transaction
    const totalExpenseAmount = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    const averageTransaction = expenseTransactions.length > 0 ? totalExpenseAmount / expenseTransactions.length : 0;
    
    // Calculate current month spending
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentMonthTransactions = expenseTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    });
    const currentMonthSpending = currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Mock previous month for comparison (would be actual data in real app)
    const previousMonthSpending = currentMonthSpending * 0.85; // Mock 15% less spending last month
    const monthlyChange = previousMonthSpending > 0 ? ((currentMonthSpending - previousMonthSpending) / previousMonthSpending) * 100 : 0;
    
    return {
      highestSpendingDay: new Date(highestDay.date).toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      }),
      highestDayAmount: highestDay.amount,
      mostFrequentCategory: mostFrequentCategory?.name || 'Unknown',
      mostFrequentCount: mostFrequentCategoryId.count,
      averageTransaction,
      currentMonthSpending,
      monthlyChange
    };
  }
};

export default transactionService;