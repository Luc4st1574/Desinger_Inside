/* eslint-disable @typescript-eslint/no-explicit-any */
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from 'lucide-react';

// --- Step 1: Import SVG icons as components ---
import ProspectingIcon from '@/assets/icons/prospecting_sales.svg';
import MeetingIcon from '@/assets/icons/meeting_sales.svg';
import ProposalIcon from '@/assets/icons/proposal_sales.svg';
import DealIcon from '@/assets/icons/deal_sales.svg';
import LostIcon from '@/assets/icons/lost_sales.svg'; // FIX: Added LostIcon import

// --- Step 2: Consolidate config mapping ---
const STAGE_CONFIG: { [key: string]: { color: string; icon: any } } = {
  Prospecting: { color: 'bg-[#defcbd]', icon: ProspectingIcon },
  Meeting: { color: 'bg-[#c8d8ff]', icon: MeetingIcon },
  Proposal: { color: 'bg-purple-100', icon: ProposalIcon },
  Deal: { color: 'bg-green-200', icon: DealIcon },
  Lost: { color: 'bg-gray-100', icon: LostIcon }, // FIX: Added Lost stage config
  default: { color: 'bg-gray-100', icon: null },
};

type SalesStageDropdownProps = {
  status: string;
  loading: boolean;
  onChange: (newStatus: string) => void;
  statuses: string[];
};

export default function SalesStageDropdown({
  status,
  loading,
  onChange,
  statuses,
}: SalesStageDropdownProps) {
  const config = STAGE_CONFIG[status] || STAGE_CONFIG.default;
  const Icon = config.icon;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton
          disabled={loading}
          className={`inline-flex w-full items-center justify-between gap-2 rounded-md px-3 py-1.5 text-sm font-semibold text-black shadow-sm ${config.color} ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80'
          }`}
        >
          <span className="inline-flex items-center gap-2">
            {loading ? (
              'Updating...'
            ) : (
              <>
                {Icon && <Icon className="h-4 w-4" />}
                {status}
              </>
            )}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-px bg-black opacity-30" aria-hidden="true" />
            <ChevronDownIcon
              aria-hidden="true"
              className="h-5 w-5 text-black"
            />
          </span>
        </MenuButton>
      </div>
      <MenuItems
        transition
        className="absolute left-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">
          {statuses.map((stageOption) => {
             const optionConfig = STAGE_CONFIG[stageOption] || STAGE_CONFIG.default;
             const OptionIcon = optionConfig.icon;
             
             return (
              <MenuItem key={stageOption}>
                <button
                  onClick={() => onChange(stageOption)}
                  className="group flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-black data-[focus]:bg-gray-100"
                >
                  {OptionIcon && <OptionIcon className="h-4 w-4" />}
                  {stageOption}
                </button>
              </MenuItem>
            );
          })}
        </div>
      </MenuItems>
    </Menu>
  );
}