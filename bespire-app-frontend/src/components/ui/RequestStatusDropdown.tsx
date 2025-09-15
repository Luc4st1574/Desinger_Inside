// components/RequestStatusDropdown.tsx
import { Menu } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { STATUS_OPTIONS, STATUS_OPTIONS_BY_ROLE } from "@/utils/utils";

type StatusOption = typeof STATUS_OPTIONS[0];

export default function RequestStatusDropdown({
  status,
  loading,
  onChange,
  role,
}: {
  /** Estado actual del request */
  status: string;
  /** Flag mientras la mutación está en curso */
  loading: boolean;
  /** Callback para cambiar el estado */
  onChange: (newStatus: string) => void;
  /** Rol del usuario (para filtrar opciones) */
  role: string;
}) {
  const options =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (STATUS_OPTIONS_BY_ROLE as any)[role] || STATUS_OPTIONS_BY_ROLE.default;
  const current = (() => {
    if (role === "client" && ["needs_info", "for_review"].includes(status)) {
      return STATUS_OPTIONS.find((s) => s.value === "in_progress")!;
    }
    return STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
  })();
  
  // Para clientes, solo permitir cambiar a "revision" y "completed"
  const selectable = role === "client" 
    ? STATUS_OPTIONS.filter((o: StatusOption) => ["revision", "completed"].includes(o.value) && o.value !== status)
    : options.filter((o: StatusOption) => o.value !== status);
  
  // Deshabilitar dropdown si status es "completed" y role no es "admin", o si status es "queued" y role es "client"
  const isDisabled = loading || (status === "completed" && role !== "admin") || (status === "queued" && role === "client");
  console.log("isDisabled:", isDisabled, "role:", role, "status:", status);

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <Menu.Button
            disabled={isDisabled}
            className={`
              inline-flex items-center px-4 py-1 ${current.bg} ${
              current.colorInSelected
            }
              rounded-full text-md font-semibold gap-2 min-w-[150px] transition
              ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <current.Icon className={`w-5 h-5 ${current.colorInSelected}`} />
            <span className={`font-medium ${current.colorInSelected}`}>
              {current.label}
            </span>
            {!isDisabled && (
              <>
                <span className="mx-2 text-gray-300 select-none text-lg font-thin">
                  |
                </span>
                <ChevronDown
                  className={`w-4 h-4 ml-1 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </>
            )}
          </Menu.Button>
          <Menu.Items className="absolute left-0 z-20 mt-2 w-60 origin-top-left rounded-lg bg-white shadow-xl ring-1 ring-[#E2E6E4] focus:outline-none">
            {selectable.map((opt: StatusOption) => (
              <Menu.Item key={opt.value}>
                {({ active }: { active: boolean }) => (
                  <button
                    disabled={isDisabled}
                    onClick={() => onChange(opt.value)}
                    className={`
                      flex items-center w-full gap-3 px-5 py-3 text-base font-medium
                      ${opt.color}
                      ${active ? "bg-gray-50" : ""}
                      transition
                      ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    <opt.Icon className={`w-5 h-5 ${opt.color}`} />
                    <span className={opt.color}>{opt.label}</span>
                  </button>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </>
      )}
    </Menu>
  );
}
