// components/SalesOverviewSidebar.tsx
import Image from 'next/image';
import PriorityBadge from "../../ui/PriorityBadge";
import CustomDatePicker from "../../ui/CustomDatePicker";
import salesData from "@/data/salesData.json";

type Prospect = (typeof salesData.prospects.list)[0];

// FIX 1: Define the Priority type with lowercase values to match the component's expectation.
type Priority = 'high' | 'medium' | 'low';

type SalesOverviewSidebarProps = {
  prospect: Prospect;
};

export default function SalesOverviewSidebar({ prospect }: SalesOverviewSidebarProps) {
  return (
    <aside className="w-70 min-w-[260px] p-6 border-r border-[#E2E6E4] flex flex-col gap-2 overflow-y-auto">
      <h1 className="font-medium text-xl">Overview</h1>
      
      {/* Priority */}
      <div className="flex flex-col items-start gap-2">
        <div className="text-base text-[#5E6B66]">Priority</div>
        <PriorityBadge
            // FIX 2: Convert the numeric 'id' to a string.
            requestId={prospect.id.toString()}
            // FIX 3: Convert the priority from the JSON ('High') to lowercase ('high') before casting.
            priority={prospect.priority.toLowerCase() as Priority}
            editable={false}
        />
      </div>

      {/* Contact */}
      <div className="flex flex-col items-start gap-2">
        <div className="text-base text-[#5E6B66]">Contact</div>
        <div className="flex items-center gap-2">
          <Image
            src={prospect.contactAvatar}
            alt={prospect.contact}
            width={28}
            height={28}
            className="w-7 h-7 rounded-full"
          />
          <span className="font-medium">{prospect.contact}</span>
        </div>
      </div>

      {/* Assigned To */}
      <div className="flex flex-col items-start gap-2">
        <div className="text-base text-[#5E6B66]">Assigned To</div>
        <ul className="flex flex-col gap-1">
          {prospect.assigned.map(member => (
             <li key={member.name} className="flex items-center gap-2">
                <Image
                    src={member.avatar}
                    alt={member.name}
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-full"
                />
                <span className="font-medium text-sm">{member.name}</span>
             </li>
          ))}
        </ul>
      </div>

      {/* Dates */}
      <div className="flex flex-col ">
        <div className="text-base text-[#5E6B66]">Created On</div>
        <div className="flex items-center ">
          <CustomDatePicker 
            value={new Date(prospect.since)} 
            disabled={true} 
            onChange={() => {}}
          />
        </div>
        <div className="text-base text-[#5E6B66]">Next Follow-up</div>
        <CustomDatePicker
            value={prospect.followUps.length > 0 ? new Date(prospect.followUps[0]) : null}
            disabled={true}
            onChange={() => {}}
        />
      </div>

      {/* Industry */}
      <div className="flex flex-col gap-1 mt-2">
        <div className="text-base text-[#5E6B66]">Industry</div>
        <div className="font-medium text-[#181B1A]">{prospect.industry}</div>
      </div>

      {/* Deal Value */}
      <div className="flex flex-col gap-2 mt-2">
        <div className="text-base text-[#5E6B66]">Deal Value</div>
        <span className="font-medium text-[#181B1A]">
            ${prospect.value.toLocaleString()}
        </span>
      </div>

       {/* Target Plan */}
      <div className="flex flex-col gap-2 mt-2">
        <div className="text-base text-[#5E6B66]">Target Plan</div>
        <span className="font-medium text-[#181B1A]">{prospect.targetPlan}</span>
      </div>
    </aside>
  );
}