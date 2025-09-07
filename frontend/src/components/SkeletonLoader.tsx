import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-8 bg-gray-300 rounded w-64 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-96"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
              <div className="ml-4">
                <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-8"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
        <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-300 rounded-xl"></div>
          ))}
        </div>
      </div>

      {/* Tasks List Skeleton */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-300 rounded w-16"></div>
          <div className="flex space-x-2">
            <div className="h-8 bg-gray-300 rounded w-24"></div>
            <div className="h-8 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-6">
              <div className="flex justify-between mb-4">
                <div className="h-4 bg-gray-300 rounded w-20"></div>
                <div className="h-6 bg-gray-300 rounded w-16"></div>
              </div>
              <div className="h-6 bg-gray-300 rounded w-full mb-3"></div>
              <div className="h-2 bg-gray-300 rounded w-full mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;