import React, { useMemo } from 'react';
import type { RawTask } from '@/types/metrics'; // Now needs both types
import { Star } from 'lucide-react';

interface RatingsOverviewProps {
  tasks: RawTask[]; 
}

const RatingsOverview = ({ tasks }: RatingsOverviewProps) => {
  const ratings = useMemo(() => {
    const ratingCounts: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRatedTasks = 0;

    tasks.forEach(task => {
      if (task.clientRating !== undefined && task.clientRating >= 1 && task.clientRating <= 5) {
        ratingCounts[task.clientRating]++;
        totalRatedTasks++;
      }
    });

    return Object.entries(ratingCounts)
      .map(([stars, count]) => ({
        stars: parseInt(stars, 10),
        count: count,
        total: totalRatedTasks,
      }))
      .sort((a, b) => b.stars - a.stars);
  }, [tasks]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Ratings Overview</h3>
      <div className="space-y-4">
        {ratings.map((rating, index) => (
          <div key={index} className="flex items-center">
            <div className="flex items-center w-16">
              <span className="text-sm font-medium">{rating.stars}</span>
              <Star className="h-4 w-4 text-yellow-400 ml-1" />
            </div>
            <div className="flex-1 mx-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${rating.total > 0 ? (rating.count / rating.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            <span className="text-sm text-gray-500 w-12 text-right">{rating.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingsOverview;