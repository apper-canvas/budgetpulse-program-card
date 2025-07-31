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
  }
};

export default transactionService;