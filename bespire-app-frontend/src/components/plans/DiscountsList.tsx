/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import DataTable, { Column } from "../ui/DataTable";
import ActionMenu, { ActionMenuItem } from "../ui/ActionMenu";
import { Edit, Trash } from "lucide-react";
import { useDiscounts } from "@/hooks/discounts/useDiscounts";
import { Discount } from "@/mocks/discounts";
import AddDiscountModal from "../modals/discounts/AddDiscountModal";
import DiscountDetailModal from "../modals/discounts/DiscountDetailModal";
import StatusBadge from "../ui/StatusBadge";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";
import ConfirmModal from "../modals/ConfirmModal";

export default function DiscountsList() {
  const { discounts, loading, error, refetch, createDiscount, updateDiscount, deleteDiscount } = useDiscounts();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | undefined>(undefined);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [discountToDelete, setDiscountToDelete] = useState<string | null>(null);
  // Opciones para el dropdown de filtro
  const statusFilterOptions = [
    { value: "all", label: "Filter" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "expired", label: "Expired" },
    { value: "draft", label: "Draft" },
  ];

  const handleRowClick = (discount: Discount) => {
    setSelectedDiscount(discount);
    setIsDetailModalOpen(true);
  };

  const handleEditDiscount = (discount: Discount) => {
    setEditingDiscount(discount);
    setOpenEdit(true);
    setIsDetailModalOpen(false);
  };

  const handleDeleteDiscount = async (discountId: string) => {
    setDiscountToDelete(discountId);
    setConfirmDeleteOpen(true);

  };
  const handleConfirmDelete = async () => {
    if (!discountToDelete) return;

    try {
      await deleteDiscount(discountToDelete);
      showSuccessToast("Discount deleted successfully!");
      refetch();
      setConfirmDeleteOpen(false);
      setDiscountToDelete(null);
      setIsDetailModalOpen(false);
    } catch (err: unknown) {
      showErrorToast((err as Error)?.message || "Failed to delete discount");
    }
  }

  // Definición de las columnas para la tabla de descuentos
  const columns: Column<Discount>[] = [
    {
      header: "Discount Code",
      accessor: "code",
      minWidth: "120px",
      maxWidth: "150px",
      render: (discount) => (
        <div className="text-sm font-medium text-[#353B38]">
          {discount.code}
        </div>
      ),
    },
    {
      header: "Type",
      accessor: "type",
      minWidth: "100px",
      maxWidth: "120px",
      render: (discount) => (
        <div className="text-sm text-[#353B38]">
          {discount.type}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      minWidth: "90px",
      maxWidth: "110px",
      render: (discount) => (
        <StatusBadge status={discount.status} />
      ),
    },
    {
      header: "Amount",
      accessor: "amount",
      minWidth: "80px",
      maxWidth: "100px",
      render: (discount) => (
        <div className="text-sm text-[#353B38]">
          {discount.amount}
        </div>
      ),
    },
    {
      header: "Usage Limit",
      accessor: "usageLimit",
      minWidth: "90px",
      maxWidth: "110px",
      render: (discount) => (
        <div className="text-sm text-[#353B38]">
          {discount.usageLimit}
        </div>
      ),
    },
    {
      header: "Assigned to",
      accessor: "assignedTo",
      minWidth: "120px",
      maxWidth: "150px",
      render: (discount) => (
        <div className="text-sm text-[#353B38]">
          {discount.assignedTo}
        </div>
      ),
    },
    {
      header: "Created by",
      accessor: "createdBy",
      minWidth: "140px",
      maxWidth: "180px",
      render: (discount) => (
        <div className="flex items-center">
          <img
            className="w-8 h-8 rounded-full flex-shrink-0"
            src={
              discount.createdBy.avatar
                ? discount.createdBy.avatar
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    discount.createdBy.name
                  )}&background=e5e7eb&color=374151`
            }
            alt={discount.createdBy.name}
          />
          <div className="ml-3 min-w-0">
            <div className="text-sm font-medium text-[#353B38] truncate">
              {discount.createdBy.name}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {discount.createdBy.role}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Expiration Date",
      accessor: "expirationDate",
      minWidth: "110px",
      maxWidth: "130px",
      render: (discount) => (
        <div className="text-sm text-[#353B38]">
          {discount.expirationDate || "None"}
        </div>
      ),
    },
    {
      header: "Created on",
      accessor: "createdOn",
      minWidth: "100px",
      maxWidth: "120px",
      render: (discount) => (
        <div className="text-sm text-[#353B38]">
          {discount.createdOn}
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      minWidth: "60px",
      maxWidth: "80px",
      sticky: "right",
      render: (discount) => {
        const menuItems: ActionMenuItem[] = [
          {
            label: "Edit",
            icon: <Edit size={14} />,
            action: () => handleEditDiscount(discount)
          },
          {
            label: "Delete",
            icon: <Trash size={14} />,
            action: () => handleDeleteDiscount(discount.id),
            isDanger: true,
            hasSeparator: true,
          },
        ];

        return (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex justify-center"
          >
            <ActionMenu items={menuItems} />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        title="Discounts"
        data={discounts}
        columns={columns}
        isLoading={loading}
        error={error ? { message: error } : null}
        itemCount={discounts.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search a discount"
        filterOptions={statusFilterOptions}
        selectedFilter={statusFilter}
        onFilterChange={setStatusFilter}
        onAddButtonClick={() => setOpenCreate(true)}
        onRowClick={handleRowClick}
        onRetry={refetch}
      />

      {/* Create Modal */}
      <AddDiscountModal
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        onSave={createDiscount}
        mode="create"
      />

      {/* Edit Modal */}
      <AddDiscountModal
        isOpen={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setEditingDiscount(undefined);
        }}
        onSave={createDiscount}
        onUpdate={updateDiscount}
        discount={editingDiscount}
        mode="edit"
      />

      {/* Detail Modal */}
      <DiscountDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        discount={selectedDiscount}
        onEdit={handleEditDiscount}
        onDelete={handleDeleteDiscount}
      />

        <ConfirmModal
              open={confirmDeleteOpen}
              title="Delete Service"
              description="Are you sure you want to delete this service? This action cannot be undone."
              confirmText="Delete"
              cancelText="Cancel"
              loading={false}
              onClose={() => setConfirmDeleteOpen(false)}
              onConfirm={handleConfirmDelete}
            />
    </>
  );
}
