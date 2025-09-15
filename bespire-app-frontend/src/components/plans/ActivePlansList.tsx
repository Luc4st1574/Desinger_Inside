/* eslint-disable @next/next/no-img-element */
// src/components/clients/ClientList.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
// Importa el nuevo componente de tabla
import DataTable, { Column } from "../ui/DataTable";

import { usePlans, Plan } from "@/hooks/plans/usePlans";
import { useDeletePlan } from "@/hooks/plans/useDeletePlan";
import AddPlanModal from "../modals/plans/addPlanModal";
import DetailPlanModal from "../modals/plans/detailPlanModal";
import ConfirmModal from "../modals/ConfirmModal";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";

export default function ActivePlansList() {
  const { plans, loading, error, refetch } = usePlans();
  const { remove: deletePlan, loading: deleteLoading } = useDeletePlan();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planId, setPlanId] = useState<string | null>(null);
  const [openAddPlan, setOpenAddPlan] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editMode, setEditMode] = useState<"create" | "edit">("create");
  const [planIdToEdit, setPlanIdToEdit] = useState<string | undefined>();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  // Opciones para el dropdown de filtro
  const statusFilterOptions = [
    { value: "all", label: "Filter" },
    { value: "new", label: "New" },
    { value: "recurring", label: "Recurring" },
  ];

  const handleEditPlan = (planId: string | number) => {
    setPlanIdToEdit(planId.toString());
    setEditMode("edit");
    setOpenAddPlan(true);
  };

  const handleDeletePlan = (planId: string | number) => {
    setPlanToDelete(planId.toString());
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!planToDelete) return;

    try {
      await deletePlan(planToDelete);
      showSuccessToast("Plan deleted successfully!");
      refetch();
      setConfirmDeleteOpen(false);
      setPlanToDelete(null);
      setIsDetailModalOpen(false);
    } catch (err: unknown) {
      showErrorToast((err as Error)?.message || "Failed to delete plan");
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

  // Definición de las columnas para la tabla de planes
const columns: Column<any>[] = [
  {
    header: "Plans",
    accessor: "name",
    minWidth: "180px",
    maxWidth: "250px",
    render: (p) => (
      <div className="flex items-center gap-3">
        {p.icon && (
          <img src={p.icon} alt={p.name} className="w-6 h-6 rounded" />
        )}
        <div className="text-sm font-semibold text-[#353B38] truncate" title={p.name}>
          {p.name}
        </div>
      </div>
    ),
  },
  {
    header: "Status",
    accessor: "active", 
    minWidth: "100px",
    maxWidth: "120px",
    render: (p) => (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${p.active ? 'bg-green-500' : 'bg-gray-400'}`} />
        <span className="text-sm text-[#353B38]">
          {p.active ? "Active" : "Inactive"}
        </span>
      </div>
    ),
  },
  {
    header: "Credits",
    accessor: "creditsPerMonth",
    minWidth: "120px",
    maxWidth: "150px",
    render: (p) => (
      <div className="text-sm font-medium text-green-bg-700">
        {p.creditsPerMonth} Credits
      </div>
    ),
  },
  {
    header: "Active Order",
    accessor: "activeOrdersAllowed",
    minWidth: "120px",
    maxWidth: "150px",
    render: (p) => (
      <div className="text-sm text-[#353B38]">
        {p.activeOrdersAllowed} Active Order
      </div>
    ),
  },
  {
    header: "Brands",
    accessor: "brandsAllowed",
    minWidth: "100px",
    maxWidth: "120px",
    render: (p) => (
      <div className="text-sm text-[#353B38]">
        {p.brandsAllowed} Brand{p.brandsAllowed !== 1 ? 's' : ''}
      </div>
    ),
  },
  {
    header: "Release Date",
    accessor: "createdAt",
    minWidth: "120px",
    maxWidth: "150px",
    render: (p) => (
      <div className="text-xs text-[#7A8882]">
        {formatDate(p.createdAt)}
      </div>
    ),
  },
  {
    header: "Last Updated",
    accessor: "updatedAt",
    minWidth: "120px",
    maxWidth: "150px",
    render: (p) => (
      <div className="text-xs text-[#7A8882]">
        {formatDate(p.updatedAt)}
      </div>
    ),
  },
];
  const handleRowClick = (plan: Plan) => {
    console.log("Plan clicked:", plan);
    setPlanId(plan.id);
    setIsDetailModalOpen(true);
  };

  return (
    <>
      <DataTable
        title="Active Plans"
        data={plans}
        columns={columns}
        isLoading={loading}
        error={error}
        itemCount={plans.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search a plan"
        filterOptions={statusFilterOptions}
        selectedFilter={statusFilter}
        onFilterChange={setStatusFilter}
        onAddButtonClick={() => setOpenAddPlan(true)}
        onRowClick={handleRowClick}
        onRetry={refetch}
      />
      <AddPlanModal
        isOpen={openAddPlan}
        onClose={() => {
          setOpenAddPlan(false);
          setEditMode("create");
          setPlanIdToEdit(undefined);
        }}
        mode={editMode}
        planIdToEdit={planIdToEdit}
        onDone={() => {
          refetch();
          setEditMode("create");
          setPlanIdToEdit(undefined);
        }}
      />

      <DetailPlanModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        planId={planId ?? undefined}
        onEdit={handleEditPlan}
        onDelete={handleDeletePlan}
      />

      <ConfirmModal
        open={confirmDeleteOpen}
        title="Delete Plan"
        description="Are you sure you want to delete this plan? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteLoading}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
