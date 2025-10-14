import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from 'lucide-react';

// A mapping for colors, which you can customize
const STAGE_COLORS: { [key: string]: string } = {
  Prospecting: 'bg-blue-100 text-blue-800',
  Meeting: 'bg-yellow-100 text-yellow-800',
  Proposal: 'bg-purple-100 text-purple-800',
  Deal: 'bg-green-100 text-green-800',
  default: 'bg-gray-100 text-gray-800',
};

type SalesStageDropdownProps = {
  status: string;
  loading: boolean;
  onChange: (newStatus: string) => void;
  statuses: string[]; // This prop makes the component reusable
};

export default function SalesStageDropdown({
  status,
  loading,
  onChange,
  statuses,
}: SalesStageDropdownProps) {
  const color = STAGE_COLORS[status] || STAGE_COLORS.default;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton
          disabled={loading}
          className={`inline-flex w-full justify-center items-center gap-2 rounded-md px-3 py-1 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 ${color} ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80'
          }`}
        >
          {loading ? 'Updating...' : status}
          <ChevronDownIcon
            aria-hidden="true"
            className="-mr-1 h-5 w-5 text-gray-600"
          />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute left-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">
          {statuses.map((stageOption) => (
            <MenuItem key={stageOption}>
              <button
                onClick={() => onChange(stageOption)}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
              >
                {stageOption}
              </button>
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
}