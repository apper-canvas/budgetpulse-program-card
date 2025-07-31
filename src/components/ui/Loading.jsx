import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/atoms/Card";

const Loading = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 p-6 rounded-2xl animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 bg-white/30 rounded w-24"></div>
          <div className="h-6 bg-white/30 rounded w-6"></div>
        </div>
        <div className="flex justify-between items-center">
          <div className="space-y-3">
            <div className="h-4 bg-white/30 rounded w-20"></div>
            <div className="h-8 bg-white/30 rounded w-32"></div>
            <div className="h-4 bg-white/30 rounded w-16"></div>
            <div className="h-6 bg-white/30 rounded w-24"></div>
          </div>
          <div className="w-24 h-24 bg-white/30 rounded-full"></div>
        </div>
      </div>

      {/* Categories Skeleton */}
      <div>
        <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-20 mx-auto"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Transactions Skeleton */}
      <div>
        <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-4 bg-surface rounded-lg border border-gray-100 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading Animation */}
      <motion.div
        className="flex items-center justify-center py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex space-x-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 bg-primary rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Loading;