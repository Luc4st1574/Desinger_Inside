/* eslint-disable @typescript-eslint/no-explicit-any */
import CommonRequestBadge from '@/components/ui/CommonRequestBadge';
import Dropdown from '@/components/ui/Dropdown';
import useClientFavoriteMembers from '@/hooks/clients/useClientFavoriteMembers';
import useClientStats from '@/hooks/clients/useClientStats';
import React, { useState, useEffect } from 'react';
import HobbiesBadge from '@/components/ui/HobbiesBadge';
import RatingCard from '@/components/ui/RatingCard';



interface TeamDetailsTabProps {
  member: any; // Tipado más específico desde el hook
}
interface Rating {
  id: string;
  text: string;
  rating: number; // 0-5
  reviewerName: string;
  reviewerCompany?: string;
  reviewerAvatar?: string;
}
const TeamDetailsTab: React.FC<TeamDetailsTabProps> = ({ member }) => {

   const [period, setPeriod] = useState<string>('weekly');
 const mockRatings: Rating[] = [
  {
    id: 'r1',
    text:
      'The Instagram ad campaign for the local coffee shop was a huge success, capturing its cozy vibe and delicious brews. The creative direction and targeting brought measurable ROI.',
    rating: 5.0,
    reviewerName: 'Gerard Santos',
    reviewerCompany: 'Spherule',
    reviewerAvatar: 'https://i.pravatar.cc/80?img=32',
  },
  {
    id: 'r2',
    text:
      'I had a great experience working on a UX project for a landing page SaaS, with smooth design processes and thoughtful implementation of feedback.',
    rating: 5.0,
    reviewerName: 'Alex Rivera',
    reviewerCompany: 'Nova Lane',
    reviewerAvatar: 'https://i.pravatar.cc/80?img=12',
  },
];
   // Hooks para stats y favorite members — cargan por separado
   const { stats, loading: loadingStats, refetch: refetchStats } = useClientStats(member?.id, period, { enabled: !!member?.id });
   const { members, loading: loadingMembers, error: errorMembers, refetch: refetchMembers } = useClientFavoriteMembers(member?.id, { enabled: !!member?.id });
 
   useEffect(() => {
     if (member?.id) {
       refetchStats?.();
       refetchMembers?.();
     }
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [member?.id, period]);

  return (
    <div className="flex flex-col gap-6 ">
      <div className="space-y-4">
        <h3 className="font-medium text-base text-gray-700">Description</h3>
        <p className="text-base text-gray-600">{member?.description}</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(member?.tags ?? []).map((hobbie: string, index: number) => (
            <HobbiesBadge 
             key={index}
              requestName={hobbie}
              variant="outlined"
              size="sm"
              withIcon={true}
            />
          ))}
        </div>
      </div>


      
      <div className="space-y-4">
        <h3 className="font-medium text-gray-700">Current with {member?.firstName}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          <div className="bg-green-bg-400 p-2 md:p-4 rounded-md">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg md:text-2xl font-bold">{member?.currentStats?.newTasks ?? 0}</h4>
            </div>
            <div className="text-xs md:text-sm">New Tasks</div>
          </div>
          
          <div className="bg-orange-200 p-2 md:p-4 rounded-md">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg md:text-2xl font-bold">{member?.currentStats?.pending ?? 0}</h4>
            </div>
            <div className="text-xs md:text-sm ">Pending Review</div>
          </div>
          
          <div className="bg-pale-green-500 p-2 md:p-4 rounded-md">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg md:text-2xl font-bold">{member?.currentStats?.completed ?? 0}</h4>
            </div>
            <div className="text-xs md:text-sm ">Completed (Week)</div>
          </div>
          
          <div className="bg-red-red-100 p-2 md:p-4 rounded-md">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg md:text-2xl font-bold">{member?.currentStats?.credits ?? '—'}</h4>
            </div>
            <div className="text-xs md:text-sm ">Running Credits</div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-700">Key Work Statistics</h3>
          <Dropdown 
            items={[
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'quarterly', label: 'Quarterly' }
            ]}
            selectedValue={period}
            onSelect={(item) => setPeriod(item.value)}
            variant="outlineG"
            size="sm"
            className="border border-gray-200"
            showChevron={true}
          />
        </div>
        
        {/* Contenedor principal con borde */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white p-2">
          <div className="grid grid-cols-2">
            {/* Columna izquierda */}
            <div className="space-y-2 p-4">
              <div className="flex justify-between pb-3">
                <span className="text-base ">Hours Logged</span>
                <span className="text-sm text-green-gray-800 font-medium">{loadingStats ? '—' : stats?.hoursLogged ?? member?.stats?.hoursLogged}</span>
              </div>
              <div className="flex justify-between pb-3">
                <span className="text-base ">Credit Consumption</span>
                <span className="text-sm text-green-gray-800 font-medium">{loadingStats ? '—' : stats?.credits ?? member?.stats?.credits}</span>
              </div>
              <div className="flex justify-between pb-3">
                <span className="text-base ">Time per Request</span>
                <span className="text-sm text-green-gray-800 font-medium">{loadingStats ? '—' : stats?.timePerRequest ?? member?.stats?.timePerRequest}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base ">Avg. Response Time</span>
                <span className="text-sm text-green-gray-800 font-medium">{loadingStats ? '—' : stats?.responseTime ?? member?.stats?.responseTime}</span>
              </div>
            </div>
            
            {/* Divisor vertical */}
            <div className="border-l border-gray-200">
              {/* Columna derecha */}
              <div className="space-y-2 p-4">
                <div className="flex justify-between pb-3">
                  <span className="text-base ">Task Volume</span>
                  <span className="text-sm text-green-gray-800 font-medium">{loadingStats ? '—' : stats?.taskVolume ?? member?.stats?.taskVolume}</span>
                </div>
                <div className="flex justify-between pb-3">
                  <span className="text-base ">Revisions per Task</span>
                  <span className="text-sm text-green-gray-800 font-medium">{loadingStats ? '—' : stats?.revisionsPerTask ?? member?.stats?.revisionsPerTask}</span>
                </div>
                <div className="flex justify-between pb-3">
                  <span className="text-base">Avg. Client Rating</span>
                  <span className="text-sm text-green-gray-800 font-medium">{loadingStats ? '—' : stats?.rating ?? member?.stats?.rating}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base ">Last Session</span>
                  <span className="text-sm text-green-gray-800 font-medium">{loadingStats ? '—' : stats?.lastSession ?? member?.stats?.lastSession}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
     
         <div className="space-y-4">
        <h3 className="font-medium text-gray-700">Rating</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
             {mockRatings.map((r) => (
            <RatingCard key={r.id} item={r} onView={(id) => console.log('view', id)} />
          ))}
        </div>
      </div>
      
     </div>
   );
 };
 
 export default TeamDetailsTab;
