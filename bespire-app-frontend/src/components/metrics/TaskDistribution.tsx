import React, { useState, useMemo, Fragment } from 'react';
import type { RawTask } from '@/types/metrics';
import { ChevronRight, X } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';

interface TaskDistributionProps {
  tasks: RawTask[];
}

type Period = 'Day' | 'Week' | 'Month' | 'Year';
const periods: Period[] = ['Day', 'Week', 'Month', 'Year'];

const CLIENT_COLORS = ['#5C6C67', '#F5A623', '#A4E8A5', '#87A6F5', '#E8A4D9', '#E86452', '#47A8BD'];

// --- SVG HELPER FUNCTIONS ---

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeRoundedArcSegment(
  centerX: number,
  centerY: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number,
  cornerRadius: number,
) {
  const cornerAngleOuter = (Math.asin(cornerRadius / outerRadius) * 180) / Math.PI;
  const cornerAngleInner = (Math.asin(cornerRadius / innerRadius) * 180) / Math.PI;

  if (endAngle - startAngle < 2 * cornerAngleOuter) {
    const startOuter = polarToCartesian(centerX, centerY, outerRadius, startAngle);
    const endOuter = polarToCartesian(centerX, centerY, outerRadius, endAngle);
    const startInner = polarToCartesian(centerX, centerY, innerRadius, startAngle);
    const endInner = polarToCartesian(centerX, centerY, innerRadius, endAngle);
    return [
      'M', startOuter.x, startOuter.y,
      'A', outerRadius, outerRadius, 0, 0, 1, endOuter.x, endOuter.y,
      'L', endInner.x, endInner.y,
      'A', innerRadius, innerRadius, 0, 0, 0, startInner.x, startInner.y,
      'Z',
    ].join(' ');
  }

  const p = {
    outer: {
      start: polarToCartesian(centerX, centerY, outerRadius, startAngle + cornerAngleOuter),
      end: polarToCartesian(centerX, centerY, outerRadius, endAngle - cornerAngleOuter),
    },
    inner: {
      start: polarToCartesian(centerX, centerY, innerRadius, startAngle + cornerAngleInner),
      end: polarToCartesian(centerX, centerY, innerRadius, endAngle - cornerAngleInner),
    },
    radial: {
      startOuter: polarToCartesian(centerX, centerY, outerRadius - cornerRadius, startAngle),
      startInner: polarToCartesian(centerX, centerY, innerRadius + cornerRadius, startAngle),
      endOuter: polarToCartesian(centerX, centerY, outerRadius - cornerRadius, endAngle),
      endInner: polarToCartesian(centerX, centerY, innerRadius + cornerRadius, endAngle),
    }
  };

  const largeArcFlagOuter = (endAngle - startAngle - 2 * cornerAngleOuter) > 180 ? 1 : 0;
  const largeArcFlagInner = (endAngle - startAngle - 2 * cornerAngleInner) > 180 ? 1 : 0;

  const path = [
    'M', p.inner.start.x, p.inner.start.y,
    'A', cornerRadius, cornerRadius, 0, 0, 1, p.radial.startInner.x, p.radial.startInner.y,
    'L', p.radial.startOuter.x, p.radial.startOuter.y,
    'A', cornerRadius, cornerRadius, 0, 0, 1, p.outer.start.x, p.outer.start.y,
    'A', outerRadius, outerRadius, 0, largeArcFlagOuter, 1, p.outer.end.x, p.outer.end.y,
    'A', cornerRadius, cornerRadius, 0, 0, 1, p.radial.endOuter.x, p.radial.endOuter.y,
    'L', p.radial.endInner.x, p.radial.endInner.y,
    'A', cornerRadius, cornerRadius, 0, 0, 1, p.inner.end.x, p.inner.end.y,
    'A', innerRadius, innerRadius, 0, largeArcFlagInner, 0, p.inner.start.x, p.inner.start.y,
    'Z',
  ].join(' ');

  return path;
}


// --- MAIN COMPONENT ---

const TaskDistribution = ({ tasks }: TaskDistributionProps) => {
  const [activePeriod, setActivePeriod] = useState<Period>('Month');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const now = useMemo(() => new Date('2025-09-18T14:17:04-05:00'), []);

  const periodTasks = useMemo(() => {
    const endDate = new Date(now);
    let startDate = new Date(now);

    switch (activePeriod) {
      case 'Day':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'Week':
        startDate.setDate(startDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'Month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'Year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }
    return tasks.filter(task => {
      const completedDate = new Date(task.completedAt);
      return completedDate >= startDate && completedDate <= endDate;
    });
  }, [tasks, activePeriod, now]);

  const clientDistribution = useMemo(() => {
    if (periodTasks.length === 0) return [];
    const counts: { [name: string]: number } = {};
    periodTasks.forEach(task => {
      const clientName = task.client.name;
      counts[clientName] = (counts[clientName] || 0) + 1;
    });
    const totalTasks = periodTasks.length;
    return Object.entries(counts)
      .map(([name, count], index) => ({
        name,
        count,
        percentage: (count / totalTasks) * 100,
        color: CLIENT_COLORS[index % CLIENT_COLORS.length],
      }))
      .sort((a, b) => b.count - a.count);
  }, [periodTasks]);
  
  const outerRadius = 90;
  const innerRadius = 50;
  const cornerRadius = 8; 
  const gapDegrees = 10;
  
  const ChartView = ({ isModal = false }: { isModal?: boolean }) => {
    const chartSize = isModal ? 'w-96 h-96' : 'w-48 h-48';
    
    return (
      <>
        <div className={`flex items-center justify-center ${isModal ? 'my-8' : 'mt-8 mb-10'}`}>
          {clientDistribution.length > 0 ? (
            <svg viewBox="0 0 200 200" className={chartSize}>
              {(() => {
                let cumulativeAngle = 0;
                const segments = clientDistribution.filter(c => c.percentage > 0);
                const totalPercentage = segments.reduce((sum, c) => sum + c.percentage, 0) || 1;
                const totalGapDegrees = segments.length * gapDegrees;
                const totalSegmentDegreesAvailable = Math.max(0, 360 - totalGapDegrees);

                return segments.map((client) => {
                  const segmentPercentageOfAvailable = client.percentage / totalPercentage;
                  const angleExtent = segmentPercentageOfAvailable * totalSegmentDegreesAvailable;
                  const startAngle = cumulativeAngle;
                  const endAngle = startAngle + angleExtent;
                  cumulativeAngle = endAngle + gapDegrees;

                  return (
                    <path
                      key={client.name}
                      d={describeRoundedArcSegment(100, 100, outerRadius, innerRadius, startAngle, endAngle, cornerRadius)}
                      fill={client.color}
                    />
                  );
                });
              })()}
            </svg>
          ) : (
            <p className="text-gray-500 py-16">No task data for this period.</p>
          )}
        </div>

        <div className={`space-y-3 ${isModal ? 'max-h-80 overflow-y-auto pr-4' : 'mb-4'}`}>
          {(isModal ? clientDistribution : clientDistribution.slice(0, 4)).map(client => (
            <div key={client.name} className="flex justify-between items-center text-sm">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-3" 
                  style={{ backgroundColor: client.color }}
                ></div>
                <span className="text-gray-600">{client.name}</span>
              </div>
              <span className="font-semibold text-gray-800">{client.percentage.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </>
    );
  };
  
  return (
    <Fragment>
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg flex flex-col">
        <div className="flex flex-col mb-4 leading-tight">
          <span className="text-xl font-base text-gray-900">Overall Clients&apos;</span>
          <span className="text-xl font-base text-gray-900">Task Distribution</span>
        </div>
        
        <div className="flex items-center justify-center space-x-1 rounded-full border border-[#deefcf] bg-white p-1">
          {periods.map((period) => (
            <button 
              key={period} 
              onClick={() => setActivePeriod(period)}
              className={`w-20 rounded-full py-2 text-sm font-medium transition-colors focus:outline-none ${activePeriod === period ? 'bg-[#ceffa3] text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              {period}
            </button>
          ))}
        </div>

        <ChartView />

        <div className="text-center mt-6">
          <button onClick={() => setIsModalOpen(true)} className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center justify-center w-full">
              View all <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-2xl transition-all">
                  <Dialog.Title as="div" className="flex justify-between items-center mb-4">
                    <div className="flex flex-col leading-tight">
                      <span className="text-xl font-base text-gray-900">Overall Clients&apos;</span>
                      <span className="text-xl font-base text-gray-900">Task Distribution</span>
                    </div>
                    {/* --- FIXED: Added aria-label for accessibility --- */}
                    <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 focus:outline-none rounded-full p-1" aria-label="Close">
                      <X className="h-6 w-6" />
                    </button>
                  </Dialog.Title>
                  
                  <div className="flex items-center justify-center space-x-1 rounded-full border border-[#deefcf] bg-white p-1 mb-4">
                      {periods.map((period) => (
                        <button 
                          key={`modal-${period}`} 
                          onClick={() => setActivePeriod(period)}
                          className={`w-20 rounded-full py-2 text-sm font-medium transition-colors focus:outline-none ${activePeriod === period ? 'bg-[#ceffa3] text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                          {period}
                        </button>
                      ))}
                  </div>

                  <ChartView isModal={true} />

                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </Fragment>
  );
};

export default TaskDistribution;