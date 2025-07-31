import { useState, useEffect } from 'react';
import ApperIcon from "@/components/ApperIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import transactionService from "@/services/api/transactionService";
import budgetService from "@/services/api/budgetService";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import { toast } from 'react-toastify';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categorySpending, setCategorySpending] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [categoryPerformance, setCategoryPerformance] = useState([]);
  const [spendingInsights, setSpendingInsights] = useState({});
  const [budget, setBudget] = useState(null);

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [categoryData, trendsData, performanceData, insightsData, budgetData] = await Promise.all([
        transactionService.getCategorySpending(),
        transactionService.getMonthlyTrends(),
        transactionService.getCategoryPerformance(),
        transactionService.getSpendingInsights(),
        budgetService.getCurrentBudget()
      ]);

      setCategorySpending(categoryData);
      setMonthlyTrends(trendsData);
      setCategoryPerformance(performanceData);
      setSpendingInsights(insightsData);
      setBudget(budgetData);

      toast.success('Reports loaded successfully');
    } catch (err) {
      console.error('Failed to load reports:', err);
      setError('Failed to load spending reports');
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadReportsData} />;

  // Pie chart data for category spending
  const pieChartData = {
    labels: categorySpending.map(cat => cat.name),
    datasets: [{
      data: categorySpending.map(cat => cat.spent),
      backgroundColor: categorySpending.map(cat => cat.color),
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const percentage = ((context.parsed / categorySpending.reduce((sum, cat) => sum + cat.spent, 0)) * 100).toFixed(1);
            return `${context.label}: $${context.parsed.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Line chart data for monthly trends
  const lineChartData = {
    labels: monthlyTrends.map(trend => trend.month),
    datasets: [{
      label: 'Monthly Spending',
      data: monthlyTrends.map(trend => trend.spending),
      borderColor: '#5B4FE9',
      backgroundColor: 'rgba(91, 79, 233, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#5B4FE9',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 6
    }]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => `Spending: $${context.parsed.y.toFixed(2)}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value}`
        }
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getPerformanceColor = (percentage) => {
    if (percentage > 100) return 'text-red-600 bg-red-50';
    if (percentage > 80) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getPerformanceIcon = (percentage) => {
    if (percentage > 100) return 'TrendingUp';
    if (percentage > 80) return 'Minus';
    return 'TrendingDown';
  };

  return (
    <div className="p-4 pb-20 space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">
          Spending Reports
        </h1>
        <p className="text-gray-600">
          Analyze your spending patterns and budget performance
        </p>
      </div>

      {/* Spending Breakdown Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="PieChart" size={20} />
            Category Breakdown - {budget?.month} {budget?.year}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 mb-4">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {categorySpending.slice(0, 4).map((cat, index) => (
              <div key={cat.Id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="font-medium">{cat.name}</span>
                <span>{formatCurrency(cat.spent)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Spending Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="TrendingUp" size={20} />
            6-Month Spending Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </CardContent>
      </Card>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Target" size={20} />
            Category Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categoryPerformance.map((cat) => {
              const percentage = (cat.spent / cat.limit) * 100;
              return (
                <div key={cat.Id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <div>
                      <span className="font-medium">{cat.name}</span>
                      <div className="text-sm text-gray-600">
                        {formatCurrency(cat.spent)} of {formatCurrency(cat.limit)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPerformanceColor(percentage)}>
                      <ApperIcon name={getPerformanceIcon(percentage)} size={12} className="mr-1" />
                      {percentage.toFixed(0)}%
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Month-to-Month Comparison */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <ApperIcon name="Calendar" size={16} />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(spendingInsights.currentMonthSpending || 0)}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Total spending
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <ApperIcon name="ArrowUpDown" size={16} />
              vs Last Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${spendingInsights.monthlyChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {spendingInsights.monthlyChange >= 0 ? '+' : ''}{spendingInsights.monthlyChange?.toFixed(1) || 0}%
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {spendingInsights.monthlyChange >= 0 ? 'Increase' : 'Decrease'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spending Habits Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Lightbulb" size={20} />
            Spending Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <ApperIcon name="Calendar" size={20} className="text-blue-600" />
                <div>
                  <div className="font-medium">Highest Spending Day</div>
                  <div className="text-sm text-gray-600">
                    {spendingInsights.highestSpendingDay || 'N/A'}
                  </div>
                </div>
              </div>
              <div className="text-blue-600 font-bold">
                {formatCurrency(spendingInsights.highestDayAmount || 0)}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <ApperIcon name="Star" size={20} className="text-purple-600" />
                <div>
                  <div className="font-medium">Most Frequent Category</div>
                  <div className="text-sm text-gray-600">
                    {spendingInsights.mostFrequentCategory || 'N/A'}
                  </div>
                </div>
              </div>
              <div className="text-purple-600 font-bold">
                {spendingInsights.mostFrequentCount || 0} transactions
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <ApperIcon name="DollarSign" size={20} className="text-green-600" />
                <div>
                  <div className="font-medium">Average Transaction</div>
                  <div className="text-sm text-gray-600">
                    Across all categories
                  </div>
                </div>
              </div>
              <div className="text-green-600 font-bold">
                {formatCurrency(spendingInsights.averageTransaction || 0)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Refresh Button */}
      <div className="text-center">
        <Button 
          onClick={loadReportsData}
          className="bg-primary hover:bg-primary-700 text-white"
        >
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Refresh Reports
        </Button>
      </div>
    </div>
  );
};

export default Reports;