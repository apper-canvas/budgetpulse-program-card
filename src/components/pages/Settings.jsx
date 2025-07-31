import ApperIcon from "@/components/ApperIcon";

const Settings = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary-600/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="Settings" size={40} className="text-primary" />
      </div>
      
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-3">
        App Settings
      </h1>
      
      <p className="text-gray-600 mb-8 max-w-sm">
        Customize your BudgetPulse experience with personal preferences and account settings. This feature is coming soon!
      </p>
      
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 max-w-sm">
        <p className="text-primary font-medium text-sm">
          ⚙️ Coming Soon: Notifications, themes, budget preferences, and more
        </p>
      </div>
    </div>
  );
};

export default Settings;