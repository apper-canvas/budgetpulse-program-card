import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import budgetService from "@/services/api/budgetService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const PRESET_TEMPLATES = {
  essentials: {
    name: "Essentials",
    description: "Basic living expenses",
    categories: [
      { name: "Groceries", icon: "ShoppingCart", percentage: 25, color: "#34D399" },
      { name: "Utilities", icon: "Zap", percentage: 15, color: "#F59E0B" },
      { name: "Transportation", icon: "Car", percentage: 20, color: "#3B82F6" },
      { name: "Healthcare", icon: "Heart", percentage: 10, color: "#10B981" }
    ]
  },
  lifestyle: {
    name: "Lifestyle",
    description: "Entertainment and personal expenses",
    categories: [
      { name: "Entertainment", icon: "Film", percentage: 15, color: "#A855F7" },
      { name: "Dining Out", icon: "Coffee", percentage: 12, color: "#EF4444" },
      { name: "Shopping", icon: "ShoppingBag", percentage: 18, color: "#EC4899" },
      { name: "Hobbies", icon: "GameController2", percentage: 10, color: "#8B5CF6" }
    ]
  },
  savings: {
    name: "Savings",
    description: "Future planning and investments",
    categories: [
      { name: "Emergency Fund", icon: "Shield", percentage: 15, color: "#10B981" },
      { name: "Investments", icon: "TrendingUp", percentage: 20, color: "#3B82F6" },
      { name: "Education", icon: "BookOpen", percentage: 8, color: "#8B5CF6" },
      { name: "Vacation", icon: "Plane", percentage: 7, color: "#F59E0B" }
    ]
  }
};

const Settings = () => {
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTotal, setEditingTotal] = useState(false);
  const [totalBudget, setTotalBudget] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: "", limit: "", icon: "DollarSign", color: "#5B4FE9" });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadBudget();
  }, []);

  const loadBudget = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await budgetService.getCurrentBudget();
      setBudget(data);
      setTotalBudget(data.totalBudget.toString());
    } catch (err) {
      setError(err.message || "Failed to load budget data");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTotalBudget = async () => {
    const newTotal = parseFloat(totalBudget);
    const currentAllocated = budget.categories.reduce((sum, cat) => sum + cat.limit, 0);
    
    if (newTotal <= 0) {
      toast.error("Budget must be greater than 0");
      return;
    }
    
    if (newTotal < currentAllocated) {
      toast.error(`Budget cannot be less than allocated amount ($${currentAllocated})`);
      return;
    }

    try {
      const updatedBudget = await budgetService.updateTotalBudget(budget.Id, newTotal);
      setBudget(updatedBudget);
      setEditingTotal(false);
      toast.success("Total budget updated successfully");
    } catch (err) {
      toast.error("Failed to update budget");
    }
  };

  const handleSaveCategory = async () => {
    const limit = parseFloat(categoryForm.limit);
    
    if (!categoryForm.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    
    if (limit <= 0) {
      toast.error("Category limit must be greater than 0");
      return;
    }

    const otherCategoriesTotal = budget.categories
      .filter(cat => editingCategory ? cat.Id !== editingCategory.Id : true)
      .reduce((sum, cat) => sum + cat.limit, 0);
    
    if (otherCategoriesTotal + limit > budget.totalBudget) {
      toast.error("Category limits exceed total budget");
      return;
    }

    try {
      let updatedBudget;
      if (editingCategory) {
        updatedBudget = await budgetService.updateCategory(editingCategory.Id, {
          name: categoryForm.name,
          limit: limit,
          icon: categoryForm.icon,
          color: categoryForm.color
        });
        toast.success("Category updated successfully");
      } else {
        updatedBudget = await budgetService.addCategory({
          name: categoryForm.name,
          limit: limit,
          icon: categoryForm.icon,
          color: categoryForm.color,
          spent: 0
        });
        toast.success("Category added successfully");
      }
      
      setBudget(updatedBudget);
      setShowAddCategory(false);
      setEditingCategory(null);
      setCategoryForm({ name: "", limit: "", icon: "DollarSign", color: "#5B4FE9" });
    } catch (err) {
      toast.error(editingCategory ? "Failed to update category" : "Failed to add category");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const updatedBudget = await budgetService.deleteCategory(categoryId);
      setBudget(updatedBudget);
      setDeleteConfirm(null);
      toast.success("Category deleted successfully");
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  const handleApplyTemplate = async (templateKey) => {
    const template = PRESET_TEMPLATES[templateKey];
    const templateCategories = template.categories.map(cat => ({
      ...cat,
      limit: Math.round((budget.totalBudget * cat.percentage) / 100),
      spent: 0
    }));

    try {
      const updatedBudget = await budgetService.applyTemplate(budget.Id, templateCategories);
      setBudget(updatedBudget);
      setShowTemplates(false);
      toast.success(`${template.name} template applied successfully`);
    } catch (err) {
      toast.error("Failed to apply template");
    }
  };

  const startEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      limit: category.limit.toString(),
      icon: category.icon,
      color: category.color
    });
    setShowAddCategory(true);
  };

  const cancelEdit = () => {
    setShowAddCategory(false);
    setEditingCategory(null);
    setCategoryForm({ name: "", limit: "", icon: "DollarSign", color: "#5B4FE9" });
  };

  const totalAllocated = budget?.categories.reduce((sum, cat) => sum + cat.limit, 0) || 0;
  const remainingBudget = (budget?.totalBudget || 0) - totalAllocated;

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadBudget} />;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Budget Settings</h1>
          <p className="text-gray-600 mt-1">Manage your monthly budget and categories</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowTemplates(true)}
          className="text-primary"
        >
          <ApperIcon name="Sparkles" size={16} className="mr-2" />
          Templates
        </Button>
      </div>

      {/* Total Budget Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Monthly Budget</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingTotal(!editingTotal)}
            >
              <ApperIcon name={editingTotal ? "X" : "Edit"} size={16} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {editingTotal ? (
            <div className="space-y-4">
              <Input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                placeholder="Enter total budget"
                className="text-lg"
              />
              <div className="flex gap-2">
                <Button onClick={handleSaveTotalBudget} size="sm">
                  Save
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setEditingTotal(false);
                    setTotalBudget(budget.totalBudget.toString());
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-3xl font-bold text-gray-900">
                ${budget.totalBudget.toLocaleString()}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Allocated</p>
                  <p className="font-semibold text-primary">${totalAllocated.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Remaining</p>
                  <p className={`font-semibold ${remainingBudget >= 0 ? 'text-success' : 'text-error'}`}>
                    ${remainingBudget.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    totalAllocated <= budget.totalBudget ? 'bg-primary' : 'bg-error'
                  }`}
                  style={{ width: `${Math.min((totalAllocated / budget.totalBudget) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Categories Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-gray-900">Budget Categories</h2>
          <Button
            size="sm"
            onClick={() => setShowAddCategory(true)}
            disabled={remainingBudget <= 0}
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Category
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budget.categories.map((category) => (
            <Card key={category.Id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <ApperIcon
                        name={category.icon}
                        size={20}
                        style={{ color: category.color }}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-600">
                        ${category.spent.toLocaleString()} / ${category.limit.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditCategory(category)}
                      className="p-1"
                    >
                      <ApperIcon name="Edit" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirm(category)}
                      className="p-1 text-error hover:bg-error/10"
                    >
                      <ApperIcon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((category.spent / category.limit) * 100, 100)}%`,
                        backgroundColor: category.spent > category.limit ? '#FF5252' : category.color
                      }}
                    />
                  </div>
                  <p className="text-xs text-center text-gray-600">
                    {Math.round((category.spent / category.limit) * 100)}% used
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add/Edit Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Category name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
              />
              
              <Input
                type="number"
                placeholder="Budget limit"
                value={categoryForm.limit}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, limit: e.target.value }))}
              />
              
              <div className="grid grid-cols-6 gap-2">
                {["DollarSign", "ShoppingCart", "Car", "Coffee", "Film", "Heart", "Zap", "ShoppingBag", "BookOpen", "GameController2", "Shield", "TrendingUp"].map(icon => (
                  <button
                    key={icon}
                    className={`p-2 rounded-lg border ${categoryForm.icon === icon ? 'border-primary bg-primary/10' : 'border-gray-200'}`}
                    onClick={() => setCategoryForm(prev => ({ ...prev, icon }))}
                  >
                    <ApperIcon name={icon} size={16} />
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSaveCategory} className="flex-1">
                  {editingCategory ? "Update" : "Add"} Category
                </Button>
                <Button variant="secondary" onClick={cancelEdit} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Budget Templates</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTemplates(false)}
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(PRESET_TEMPLATES).map(([key, template]) => (
                <div key={key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleApplyTemplate(key)}
                    >
                      Apply Template
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {template.categories.map((cat, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <ApperIcon name={cat.icon} size={14} style={{ color: cat.color }} />
                        <span>{cat.name} ({cat.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-error">Delete Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
              </p>
              
              <div className="flex gap-2">
                <Button
                  variant="danger"
                  onClick={() => handleDeleteCategory(deleteConfirm.Id)}
                  className="flex-1"
                >
                  Delete
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Settings;