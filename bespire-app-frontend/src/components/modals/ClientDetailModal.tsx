"use client";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import ClientSidebar from "../clients/ClientSidebar";
import ClientMainContent from "../clients/ClientMainContent";
import useClientDetail from "../../hooks/clients/useClientDetail";

interface ClientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string | number;
}

export default function ClientDetailModal({
  isOpen,
  onClose,
  clientId,
}: ClientDetailModalProps) {
  // Hook para obtener la data del cliente por id (se ejecuta solo si hay clientId y el modal está abierto)
  const {
    client: fetchedClient,
    loading,
    error,
    refetch,
  } = useClientDetail(clientId, { enabled: isOpen });
  console.log(
    "Client Detail Modal - Fetched Client:",
    fetchedClient,
    "Loading:",
    loading,
    "Error:",
    error
  );
  // Si llegó la data del backend la usamos; si no, usamos el mock como fallback
  const displayedClient = fetchedClient;

  const handleRetry = () => {
    refetch?.();
  };

  // Si ocurre un error mostramos un panel simple con opción de reintentar
  if (error) {
    return (
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
        <div className="fixed inset-0 flex justify-center items-center p-2 sm:p-4 md:justify-end">
          <DialogPanel className="w-full max-w-md bg-white overflow-hidden rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">
              Error al cargar cliente
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {String(error.message)}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleRetry}
                className="px-3 py-2 bg-green-600 text-white rounded"
              >
                Reintentar
              </button>
              <button onClick={onClose} className="px-3 py-2 border rounded">
                Cerrar
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
      <div className="fixed inset-0 flex justify-center items-center p-2 sm:p-4 md:justify-end">
        <DialogPanel className="w-full max-w-5xl bg-white overflow-hidden flex flex-col md:flex-row h-full md:h-[95vh] md:w-[1200px] rounded-none md:rounded-lg shadow-lg relative">
          {/* Overlay de carga si está fetching */}
          {loading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60">
              <div className="text-gray-700">Cargando cliente...</div>
            </div>
          )}
          {/* Componentes modularizados */}
          <ClientSidebar client={displayedClient} onClose={onClose} />
          <ClientMainContent client={displayedClient} onClose={onClose} />
        </DialogPanel>
      </div>
    </Dialog>
  );
}
