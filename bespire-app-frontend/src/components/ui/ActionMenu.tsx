// ActionMenu.tsx
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { MoreHorizontal, MoreVertical } from "lucide-react";
import clsx from "clsx";
import Tooltip from "./Tooltip";

export interface ActionMenuItem {
  label: string;
  action: () => void;
  icon?: React.ReactNode;
  isDanger?: boolean;
  hasSeparator?: boolean;
  disabled?: boolean;
  tooltip?: string;
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  isHorizontal?: boolean;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  items,
  isHorizontal = false,
}) => {
  return (
    // Headless UI se encarga de todo el estado isOpen, refs, etc.
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300">
        {isHorizontal ? (
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        ) : (
          <MoreVertical className="h-5 w-5 text-gray-600" />
        )}
      </MenuButton>

      <MenuItems
        transition
        portal
        anchor="bottom end"
        className="z-50 mt-2 min-w-[180px] origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-green-gray-100 ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        {items.map((item, index) => (
          // Usamos un div con separador en lugar de una prop
          <div
            key={`${item.label}-${index}`}
            className={clsx(
              item.hasSeparator && "border-t border-gray-100 mt-1 pt-1"
            )}
          >
            <MenuItem>
              {item.tooltip ? (
                <Tooltip content={item.tooltip} placement="left" delay={80}>
                  <button
                    onClick={() => !item.disabled && item.action()}
                    disabled={item.disabled}
                    className={clsx(
                      "flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors data-[focus]:bg-gray-100",
                      item.isDanger && "text-red-600 data-[focus]:bg-red-50",
                      item.disabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                </Tooltip>
              ) : (
                <button
                  onClick={() => !item.disabled && item.action()}
                  disabled={item.disabled}
                  className={clsx(
                    "flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors data-[focus]:bg-gray-100",
                    item.isDanger && "text-red-600 data-[focus]:bg-red-50",
                    item.disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              )}
            </MenuItem>
          </div>
        ))}
      </MenuItems>
    </Menu>
  );
};

export default ActionMenu;
