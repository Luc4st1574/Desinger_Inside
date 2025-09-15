/* eslint-disable @next/next/no-img-element */
// components/modals/ChangeLogModal.tsx

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ArrowLeft, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import Button from "../ui/Button";
import { useRequestChangeLog } from "../../hooks/requests/useRequestChangeLog";

// Interfaces para tipos
interface ChangeLogItem {
  request: string;
  createdAt: string;
  updatedBy: {
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  changedFields: string[];
  snapshot: {
    title?: string;
    details?: string;
    priority?: string | null;
    status?: string | null;
    dueDate?: string | null;
    internalDueDate?: string | null;
    assignees?: { firstName: string; lastName: string; avatarUrl: string | null }[];
    brand?: string | null;
    service?: string | null;
  };
}

interface Version {
  id: string;
  createdAt: string;
  updatedBy: {
    name: string;
    avatarUrl: string;
  };
  changedFields: string[];
  snapshot: {
    title?: string;
    description?: string;
    priority?: string | null;
    status?: string | null;
    dueDate?: string | null;
    internalDueDate?: string | null;
    assignees?: { firstName: string; lastName: string; avatarUrl: string | null }[];
    brand?: string | null;
    service?: string | null;
  };
}

// Helper para formatear fechas de manera legible
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export default function ChangeLogModal({
  isOpen,
  onClose,
  requestId,
}: {
  isOpen: boolean;
  onClose: () => void;
  requestId: string | null;
}) {
  const { changeLog, loading, error } = useRequestChangeLog(requestId);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);

  // Transformar los datos del backend para que coincidan con el formato esperado
  const versions: Version[] = useMemo(() => {
    if (!changeLog) return [];
    return changeLog.map((item: ChangeLogItem, index: number) => ({
      id: `version_${index}`, // Generar ID único basado en índice
      createdAt: item.createdAt,
      updatedBy: {
        name: `${item.updatedBy.firstName} ${item.updatedBy.lastName}`,
        avatarUrl: item.updatedBy.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(
              item.updatedBy.firstName + " " + item.updatedBy.lastName
            )}&background=e5e7eb&color=374151`, // Fallback para avatar
      },
      changedFields: item.changedFields,
      snapshot: {
        ...item.snapshot,
      },
    }));
  }, [changeLog]);

  // Cuando el modal se abre, selecciona automáticamente la versión más reciente.
  useEffect(() => {
    if (isOpen && versions.length > 0) {
      setSelectedVersionId(versions[0].id);
    }
  }, [isOpen, versions]);

  // Encuentra el objeto de la versión seleccionada para mostrar sus detalles.
  const selectedVersion = useMemo(() => {
    if (!selectedVersionId) return null;
    return versions.find((v: Version) => v.id === selectedVersionId);
  }, [selectedVersionId, versions]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

      <div className="fixed inset-0 flex justify-end p-4">
        <DialogPanel className="bg-white rounded-xl shadow-2xl flex w-full max-w-4xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-lg">Loading...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-lg text-red-500">Error loading change log: {error.message}</p>
            </div>
          ) : (
            <>
              {/* Columna Izquierda: Detalles del Cambio */}
              <div className="flex-1 flex flex-col p-8 overflow-y-auto">
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-900"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <DialogTitle className="text-2xl font-medium text-gray-800">
                    Change Log
                  </DialogTitle>
                </div>

                {/* Contenido dinámico basado en la versión seleccionada */}
                {selectedVersion ? (
                  <div className="space-y-6">
                    {/* Metadatos de la versión */}
                    <div className="flex items-start gap-3">
                      <img
                        src={selectedVersion.updatedBy.avatarUrl}
                        alt={selectedVersion.updatedBy.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex flex-col gap-4">
                        <p className="text-xs text-gray-500">
                          {formatDate(selectedVersion.createdAt)}
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          {selectedVersion.updatedBy.name} updated the following:
                        </p>

                        {/* Lista de campos cambiados */}
                        <ul className="list-disc list-inside text-sm text-gray-600 pl-2 space-y-1">
                          {selectedVersion.changedFields.map((field: string) => (
                            <li key={field}>{field}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Snapshot de los datos */}
                    <div className="space-y-4 text-xs">
                      {Object.entries(selectedVersion.snapshot)
                        .filter(([key, value]) => {
                          // Excluir campos internos de GraphQL y campos vacíos
                          if (key === "__typename" || key === "SnapshotDataOut") return false;
                          if (value === null || value === undefined) return false;
                          if (Array.isArray(value) && value.length === 0) return false;
                          return true;
                        })
                        .map(([key, value]) => {
                          // Capitaliza el nombre del campo para mostrarlo
                          const displayKey =
                            key.charAt(0).toUpperCase() + key.slice(1);

                          // Formatea el valor según el tipo
                          let displayValue: string;
                          if (key === "dueDate" && typeof value === "string") {
                            // Si es una fecha, formátala
                            displayValue = formatDate(value);
                          } else if (typeof value === "string") {
                            // Para strings, muestra directamente
                            displayValue = value;
                          } else if (Array.isArray(value)) {
                            // Para arrays (e.g., assignees), formatea como lista de nombres
                            displayValue = value.map((assignee: { firstName: string; lastName: string; avatarUrl: string | null }) => `${assignee.firstName} ${assignee.lastName}`).join(", ");
                          } else {
                            // Para otros tipos (e.g., números, objetos), conviértelos a string
                            displayValue = JSON.stringify(value);
                          }

                          // Determina si aplicar whitespace-pre-wrap (útil para textos largos como description)
                          const isLongText =
                            key.toLowerCase().includes("description") ||
                            displayValue.length > 100;

                          return (
                            <div key={key}>
                              <h3 className="text-sm font-medium text-green-gray-500 capitalize">
                                {displayKey}
                              </h3>
                              <p
                                className={clsx(
                                  "text-gray-800",
                                  isLongText && "whitespace-pre-wrap"
                                )}
                              >
                                {displayValue}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ) : (
                  <p>Select a version from the overview to see details.</p>
                )}
              </div>

              {/* Columna Derecha: Overview / Timeline */}
              <div className="w-72 bg-white border-l border-green-gray-100 p-6 overflow-y-auto">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Overview
                </h2>
                <div className="space-y-2">
                  {versions.map((version: Version, index: number) => (
                    <div
                      key={version.id}
                      onClick={() => setSelectedVersionId(version.id)}
                      className={clsx(
                        "w-full text-left p-3 rounded-lg transition-colors cursor-pointer",
                        selectedVersionId === version.id
                          ? "bg-[#F6F7F7]"
                          : "hover:bg-[#F6F7F7]"
                      )}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-gray-500">
                          {formatDate(version.createdAt)}
                        </p>
                        {index === 0 && (
                          <Button size="xs" variant="outline" type="button">
                            Latest
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <img
                          src={version.updatedBy.avatarUrl}
                          alt={version.updatedBy.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {version.updatedBy.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
