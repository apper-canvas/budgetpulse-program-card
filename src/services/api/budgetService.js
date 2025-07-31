import budgetData from "@/services/mockData/budget.json";

let currentBudgetData = JSON.parse(JSON.stringify(budgetData));
let nextCategoryId = Math.max(...budgetData.categories.map(c => c.Id)) + 1;

const budgetService = {
  getCurrentBudget: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return a copy to prevent mutations
    return JSON.parse(JSON.stringify(currentBudgetData));
  },

  updateTotalBudget: async (budgetId, newTotal) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (typeof newTotal !== 'number' || newTotal <= 0) {
      throw new Error('Invalid budget amount');
    }
    
    // Check if new total is less than current allocated amount
    const totalAllocated = currentBudgetData.categories.reduce((sum, cat) => sum + cat.limit, 0);
    if (newTotal < totalAllocated) {
      throw new Error('Budget cannot be less than allocated amount');
    }
    
    currentBudgetData.totalBudget = newTotal;
    return JSON.parse(JSON.stringify(currentBudgetData));
  },

  updateBudget: async (budgetId, updates) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // In a real app, this would update the budget on the server
    currentBudgetData = { ...currentBudgetData, ...updates };
    return JSON.parse(JSON.stringify(currentBudgetData));
  },

  addCategory: async (categoryData) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (!categoryData.name || !categoryData.name.trim()) {
      throw new Error('Category name is required');
    }
    
    if (typeof categoryData.limit !== 'number' || categoryData.limit <= 0) {
      throw new Error('Category limit must be a positive number');
    }
    
    // Check if adding this category would exceed total budget
    const currentAllocated = currentBudgetData.categories.reduce((sum, cat) => sum + cat.limit, 0);
    if (currentAllocated + categoryData.limit > currentBudgetData.totalBudget) {
      throw new Error('Category limits would exceed total budget');
    }
    
    const newCategory = {
      Id: nextCategoryId++,
      name: categoryData.name.trim(),
      icon: categoryData.icon || "DollarSign",
      limit: categoryData.limit,
      spent: categoryData.spent || 0,
      color: categoryData.color || "#5B4FE9"
    };
    
    currentBudgetData.categories.push(newCategory);
    return JSON.parse(JSON.stringify(currentBudgetData));
  },

  updateCategory: async (categoryId, updates) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const categoryIndex = currentBudgetData.categories.findIndex(cat => cat.Id === categoryId);
    if (categoryIndex === -1) {
      throw new Error('Category not found');
    }
    
    if (updates.name && !updates.name.trim()) {
      throw new Error('Category name is required');
    }
    
    if (updates.limit !== undefined) {
      if (typeof updates.limit !== 'number' || updates.limit <= 0) {
        throw new Error('Category limit must be a positive number');
      }
      
      // Check if updating this category would exceed total budget
      const otherCategoriesTotal = currentBudgetData.categories
        .filter(cat => cat.Id !== categoryId)
        .reduce((sum, cat) => sum + cat.limit, 0);
      
      if (otherCategoriesTotal + updates.limit > currentBudgetData.totalBudget) {
        throw new Error('Category limits would exceed total budget');
      }
    }
    
    const updatedCategory = {
      ...currentBudgetData.categories[categoryIndex],
      ...updates
    };
    
    if (updatedCategory.name) {
      updatedCategory.name = updatedCategory.name.trim();
    }
    
    currentBudgetData.categories[categoryIndex] = updatedCategory;
    return JSON.parse(JSON.stringify(currentBudgetData));
  },

  deleteCategory: async (categoryId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const categoryIndex = currentBudgetData.categories.findIndex(cat => cat.Id === categoryId);
    if (categoryIndex === -1) {
      throw new Error('Category not found');
    }
    
    currentBudgetData.categories.splice(categoryIndex, 1);
    return JSON.parse(JSON.stringify(currentBudgetData));
  },

  updateCategoryLimit: async (categoryId, newLimit) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return await this.updateCategory(categoryId, { limit: newLimit });
  },

  applyTemplate: async (budgetId, templateCategories) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Validate template categories
    const totalPercentage = templateCategories.reduce((sum, cat) => sum + (cat.percentage || 0), 0);
    const totalLimit = templateCategories.reduce((sum, cat) => sum + cat.limit, 0);
    
    if (totalLimit > currentBudgetData.totalBudget) {
      throw new Error('Template categories exceed total budget');
    }
    
    // Replace current categories with template categories
    const newCategories = templateCategories.map((cat, index) => ({
      Id: nextCategoryId + index,
      name: cat.name,
      icon: cat.icon || "DollarSign",
      limit: cat.limit,
      spent: cat.spent || 0,
      color: cat.color || "#5B4FE9"
    }));
    
    nextCategoryId += templateCategories.length;
    currentBudgetData.categories = newCategories;
    
    return JSON.parse(JSON.stringify(currentBudgetData));
  }
};

export default budgetService;