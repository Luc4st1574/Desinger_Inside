/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// src/components/clients/ClientList.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
// Importa el nuevo componente de tabla
import DataTable, { Column } from "../ui/DataTable";

import { useServices, Service } from "@/hooks/services/useServices";
import { useDeleteService } from "@/hooks/services/useDeleteService";
import AddServiceModal from "../modals/services/addServiceModal";
import DetailServiceModal from "../modals/services/detailServiceModal";
import ConfirmModal from "../modals/ConfirmModal";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";
import { set } from "date-fns";

export default function ServicesList() {
  const { services, loading, error, refetch } = useServices();
  const { remove, loading: deleting } = useDeleteService();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [openAddService, setOpenAddService] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editMode, setEditMode] = useState<"create" | "edit">("create");
  const [serviceIdToEdit, setServiceIdToEdit] = useState<string | undefined>();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  // Opciones para el dropdown de filtro
  const statusFilterOptions = [
    { value: "all", label: "Filter" },
    { value: "new", label: "New" },
    { value: "recurring", label: "Recurring" },
  ];

  const handleEditService = (serviceId: string | number) => {
    setServiceIdToEdit(serviceId.toString());
    setEditMode("edit");
    setOpenAddService(true);
  };

  const handleDeleteService = (serviceId: string | number) => {
    setServiceToDelete(serviceId.toString());
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;

    try {
      await remove(serviceToDelete);
      showSuccessToast("Service deleted successfully!");
      refetch();
      setConfirmDeleteOpen(false);
      setServiceToDelete(null);
      setIsDetailModalOpen(false);
    } catch (err: unknown) {
      showErrorToast((err as Error)?.message || "Failed to delete service");
    }
  };

  const formatDate = (dateString?: string | null): string | null => {
    if (!dateString) return null;
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Definición de las columnas para la tabla de clientes
const columns: Column<any>[] = [
  {
    header: "Title",
    accessor: "title",
    minWidth: "180px",
    maxWidth: "250px",
    render: (s) => (
      <div className="text-sm font-semibold text-[#353B38] truncate" title={s.title}>
        {s.title}
      </div>
    ),
  },
  {
    header: "Description",
    accessor: "description", 
    minWidth: "200px",
    maxWidth: "320px", // Más espacio para descripción
    render: (s) => (
      <div className="text-sm font-medium text-[#353B38] truncate" title={s.description}>
        {s.description}
      </div>
    ),
  },
  {
    header: "Credits",
    accessor: "credits",
    minWidth: "90px",
    maxWidth: "120px",
    render: (r) => (
      <div className="text-sm font-medium text-green-bg-700">
        {r.credits} Credits
      </div>
    ),
  },
  {
    header: "Type",
    accessor: "category",
    minWidth: "100px",
    maxWidth: "140px",
    render: (s) => (
      <div className="text-sm text-[#353B38] truncate" title={s.category?.name}>
        {s.category?.name || "N/A"}
      </div>
    ),
  },
  {
    header: "Status", 
    accessor: "status",
    minWidth: "90px",
    maxWidth: "120px",
    render: (s) => (
      <div className="text-sm text-[#353B38]">
        {s.status}
      </div>
    ),
  },
  {
    header: "Last Updated",
    accessor: "updatedAt",
    minWidth: "120px",
    maxWidth: "150px",
    render: (s) => (
      <div className="text-xs text-[#7A8882]">
        {formatDate(s.updatedAt)}
      </div>
    ),
  },
];
  const handleRowClick = (service: Service) => {
    console.log("Service clicked:", service);
    // Aquí puedes abrir un modal de detalles o navegar a otra página
    setServiceId(service.id);
    setIsDetailModalOpen(true);
  };

  return (
    <>
      <DataTable
        title="All Services"
        data={services}
        columns={columns}
        isLoading={loading}
        error={error}
        itemCount={services.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search a service"
        filterOptions={statusFilterOptions}
        selectedFilter={statusFilter}
        onFilterChange={setStatusFilter}
        onAddButtonClick={() => setOpenAddService(true)}
        onRowClick={handleRowClick}
        onRetry={refetch}
      />
      <AddServiceModal
        isOpen={openAddService}
        onClose={() => {
          setOpenAddService(false);
          setEditMode("create");
          setServiceIdToEdit(undefined);
        }}
        mode={editMode}
        serviceIdToEdit={serviceIdToEdit}
        onDone={() => {
          refetch();
          setEditMode("create");
          setServiceIdToEdit(undefined);
        }}
      />

      <DetailServiceModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        serviceId={serviceId ?? undefined}
        onEdit={handleEditService}
        onDelete={handleDeleteService}
      />

      <ConfirmModal
        open={confirmDeleteOpen}
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleting}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
