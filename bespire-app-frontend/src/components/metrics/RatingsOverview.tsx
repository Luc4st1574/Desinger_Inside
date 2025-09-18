import React, { useMemo, useState } from 'react';
import type { RawTask } from '@/types/metrics';
import { Star, ChevronDown } from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';

interface RatingsOverviewProps {
  tasks: RawTask[];
}

// Data for the Listbox
const roles = [
  { id: 1, name: 'Designer' },
  { id: 2, name: 'Client' },
];

// Define the types and constants for the period selector buttons
type Period = 'Day' | 'Week' | 'Month' | 'Year';
const periods: Period[] = ['Day', 'Week', 'Month', 'Year'];


const RatingsOverview = ({ tasks }: RatingsOverviewProps) => {
  const [selectedRole, setSelectedRole] = useState(roles[0]);

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

  const activePeriod: Period = 'Week';

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 px-2">
        <div className="flex items-center mb-3 sm:mb-0">
          <h2 className="text-xl font-light text-gray-800 pr-2">Ratings Overview by</h2>
          
          <Listbox value={selectedRole} onChange={setSelectedRole}>
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-default rounded-full border border-[#5b6f59] bg-transparent py-1 pl-4 pr-10 text-left text-sm font-medium text-[#5b6f59] focus:outline-none">
                <span className="block truncate">{selectedRole.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
                  <ChevronDown className="h-4 w-4 text-[#5b6f59]" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Transition
                as={React.Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg focus:outline-none focus:ring-0 sm:text-sm z-10">
                  {roles.map((role) => (
                    <Listbox.Option
                      key={role.id}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 px-4 ${
                          active ? 'bg-gray-100' : 'text-gray-900'
                        }`
                      }
                      value={role}
                    >
                      {({ selected }) => (
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {role.name}
                        </span>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>

        </div>
        
        <div className="flex items-center space-x-1 rounded-full border border-[#deefcf] bg-white p-1">
          {periods.map((period) => (
            <button
              key={period}
              className={`w-20 rounded-full py-1.5 text-sm font-medium transition-colors focus:outline-none ${
                activePeriod === period ? 'bg-[#ceffa3] text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          {ratings.map((rating) => (
            <div key={rating.stars} className="flex items-center">
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
    </>
  );
};

export default RatingsOverview;