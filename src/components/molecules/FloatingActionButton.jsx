import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const FloatingActionButton = ({ onClick, className }) => {
  return (
    <motion.button
      className={cn(
        "fixed bottom-20 right-6 w-14 h-14 bg-gradient-to-r from-primary to-primary-600 text-white rounded-full shadow-fab flex items-center justify-center z-40",
        className
      )}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <ApperIcon name="Plus" size={24} />
    </motion.button>
  );
};

export default FloatingActionButton;