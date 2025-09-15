import React from "react";
import { Trash2 } from "lucide-react";
import type { SidebarItem, BrandPayload } from "./types";
import Button from "../../ui/Button";

export default function BrandSidebar({
  items,
  activeIndex,
  onNavigate,
  onClose,
  onDelete,
  editingBrand,
  deleting,
}: {
  items: SidebarItem[];
  activeIndex: number;
  onNavigate: (id: string, idx: number) => void;
  onClose: () => void;
  onDelete?: () => Promise<void> | void;
  editingBrand?: Partial<BrandPayload> | null;
  deleting?: boolean;
}) {
  return (
    <aside className="w-50  flex flex-col  border-r border-green-gray-100  h-full gap-2">
      <div className="flex items-center justify-center  border-b border-green-gray-100  py-4">
        <button
          onClick={onClose}
          type="button"
          className="flex items-center gap-2 font-medium cursor-pointer "
        >
          <img src="/assets/icons/menorq.svg" alt="" />
          <span>Back to Brands</span>
        </button>
      </div>

      <div className="px-3 flex flex-col justify-start h-full">
        <div className="flex justify-start">
          <nav className="flex flex-col gap-2 max-w-[160px]">
            {items.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id, idx)}
                className={`flex items-start gap-3 px-3 py-2 rounded text-left  transition-colors ${
                  activeIndex === idx
                    ? "bg-white text-black font-semibold"
                    : "text-green-gray-400 hover:bg-white/60"
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {editingBrand && (
          <div className="pb-6 h-full flex flex-col justify-end ">
            <Button
              type="button"
              //@ts-ignore
              variant="ghost"
              size="md"
              className="flex gap-2 items-center w-full"
              onClick={async () => {
                if (onDelete) await onDelete();
              }}
              disabled={!!deleting}
            >
              <div className="flex items-center gap-2 text-green-gray-800">
                <Trash2 className="w-5 h-5" />
                <span>Delete Brand</span>
              </div>
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
