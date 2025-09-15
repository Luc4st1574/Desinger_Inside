"use client";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import SidebarModal from "./SidebarModal";
import MainContentModalDetail from "./MainContentModalDetail";
import useTeamDetail from "@/hooks/team/useTeamDetail";

interface TeamDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string | number;
}

export default function TeamDetailModal({
  isOpen,
  onClose,
  memberId,
}: TeamDetailModalProps) {
  const {
    client: fetchedClient,
    loading,
    error,
    refetch,
  } = useTeamDetail(memberId, { enabled: isOpen });
  console.log(
    "Client Detail Modal - Fetched Client:",
    fetchedClient,
    "Loading:",
    loading,
    "Error:",
    error
  );
  const displayedClient = fetchedClient;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
      <div className="fixed inset-0 flex justify-center items-center p-2 sm:p-4 md:justify-end">
        <DialogPanel className="w-full max-w-5xl bg-white overflow-hidden flex flex-col md:flex-row h-full md:h-[95vh] md:w-[1200px] rounded-none md:rounded-lg shadow-lg relative">
          {/* Overlay de carga si está fetching */}

          {/* Componentes modularizados */}

          {loading ? (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60">
              <div className="text-gray-700">
                Cargando miembro del equipo...
              </div>
            </div>
          ) : (
            <>
              <SidebarModal member={displayedClient} onClose={onClose} />
              <MainContentModalDetail
                member={displayedClient}
                onClose={onClose}
              />
            </>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
