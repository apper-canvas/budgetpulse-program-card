import budgetData from "@/services/mockData/budget.json";

const budgetService = {
  getCurrentBudget: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return a copy to prevent mutations
    return JSON.parse(JSON.stringify(budgetData));
  },

  updateBudget: async (budgetId, updates) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // In a real app, this would update the budget on the server
    const updatedBudget = { ...budgetData, ...updates };
    return JSON.parse(JSON.stringify(updatedBudget));
  },

  updateCategoryLimit: async (categoryId, newLimit) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Find and update the category
    const category = budgetData.categories.find(cat => cat.Id === categoryId);
    if (category) {
      category.limit = newLimit;
    }
    
    return JSON.parse(JSON.stringify(budgetData));
  }
};

export default budgetService;