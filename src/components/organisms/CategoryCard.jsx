import { Card, CardContent } from "@/components/atoms/Card";
import CategoryIcon from "@/components/molecules/CategoryIcon";
import CategoryProgress from "@/components/molecules/CategoryProgress";
import Badge from "@/components/atoms/Badge";

const CategoryCard = ({ category }) => {
  const getStatusBadge = () => {
    const percentage = category.limit > 0 ? (category.spent / category.limit) * 100 : 0;
    
    if (percentage >= 100) return { variant: "danger", text: "Over Budget" };
    if (percentage >= 80) return { variant: "warning", text: "Near Limit" };
    return { variant: "success", text: "On Track" };
  };

  const status = getStatusBadge();

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <CategoryIcon 
              icon={category.icon} 
              color={category.color} 
              size="md"
            />
            <div>
              <h3 className="font-display font-semibold text-gray-900">
                {category.name}
              </h3>
              <Badge variant={status.variant} className="mt-1">
                {status.text}
              </Badge>
            </div>
          </div>
        </div>
        
        <CategoryProgress 
          spent={category.spent} 
          limit={category.limit}
        />
      </CardContent>
    </Card>
  );
};

export default CategoryCard;