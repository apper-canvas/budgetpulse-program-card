import ApperIcon from "@/components/ApperIcon";

const Reports = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary-600/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="BarChart3" size={40} className="text-primary" />
      </div>
      
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-3">
        Spending Reports
      </h1>
      
      <p className="text-gray-600 mb-8 max-w-sm">
        Get insights into your spending patterns with detailed charts and analytics. This feature is coming soon!
      </p>
      
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 max-w-sm">
        <p className="text-primary font-medium text-sm">
          📊 Coming Soon: Interactive charts, spending trends, and budget insights
        </p>
      </div>
    </div>
  );
};

export default Reports;