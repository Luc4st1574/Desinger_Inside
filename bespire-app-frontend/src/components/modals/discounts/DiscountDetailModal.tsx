/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { X, Edit, Link as LinkIcon, MoreHorizontal, Link } from "lucide-react";
import { Discount } from "@/mocks/discounts";
import ActionMenu, { ActionMenuItem } from "@/components/ui/ActionMenu";
import StatusBadge from "@/components/ui/StatusBadge";
import CheckPlus from "@/assets/icons/check+.svg";
import { formatDate } from "@/utils/utils";
interface DiscountDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  discount: Discount | null;
  onEdit?: (discount: Discount) => void;
  onDelete?: (discountId: string) => void;
}

const DiscountDetailModal: React.FC<DiscountDetailModalProps> = ({
  isOpen,
  onClose,
  discount,
  onEdit,
  onDelete,
}) => {
  if (!discount) return null;

  const progressPercentage = discount.usageTracking
    ? (discount.usageTracking.used / discount.usageTracking.total) * 100
    : 0;

  const menuActions: ActionMenuItem[] = [
    {
      label: "Edit",
      action: () => {
        if (onEdit) onEdit(discount);
      },
    },
    {
      label: "Delete",
      action: () => {
        if (onDelete) onDelete(discount.id);
      },
      isDanger: true,
      hasSeparator: true,
    },
  ];

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/20 backdrop-blur-sm" />

      <div className="fixed inset-0 flex justify-end px-2 py-2">
        <DialogPanel className="w-full max-w-2xl bg-white h-full overflow-hidden flex flex-col shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-start justify-between p-4 ">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold text-gray-900">
                {discount.code}
              </h3>
              <StatusBadge status={discount.status} />
            </div>
            <div className="flex items-start gap-4">
              <button
                type="button"
                title="Copy Link"
                className="hover:bg-gray-100 p-2 rounded-full cursor-pointer"
              >
                <Link className="w-5 h-5" />
              </button>
              {onEdit && (
                <button
                  onClick={() => onEdit(discount)}
                  className="hover:bg-gray-100 p-2 rounded-full cursor-pointer"
                >
                  <Edit className="w-5 h-5" />
                </button>
              )}
              <div
                title="More"
                onClick={(e) => e.stopPropagation()}
                className="hover:bg-gray-100 rounded-full cursor-pointer"
              >
                <ActionMenu items={menuActions} isHorizontal />
              </div>
              <button
                type="button"
                title="Close"
                className="hover:bg-gray-200 p-2 rounded-full cursor-pointer"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-[80vh] overflow-y-auto">
            {/* Notes */}
            {discount.notes && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Notes
                </h4>
                <p className="text-sm text-gray-600">{discount.notes}</p>
              </div>
            )}

            {/* Smart Insights */}
            {discount.smartInsights && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Smart Insights
                </h4>
                <div className="space-y-2">
                  {discount.smartInsights.commonUsageTimeframe && (
                    <div className="flex items-center gap-2">
                      <CheckPlus className="w-4 h-4 " />
                      <span className="text-sm text-gray-600">
                        Most common usage timeframe:{" "}
                        {discount.smartInsights.commonUsageTimeframe}
                      </span>
                    </div>
                  )}
                  {discount.smartInsights.renewalAfterDiscount && (
                    <div className="flex items-center gap-2">
                      <CheckPlus className="w-4 h-4 " />
                      <span className="text-sm text-gray-600">
                        Renewal After Discount:{" "}
                        {discount.smartInsights.renewalAfterDiscount}
                      </span>
                    </div>
                  )}
                  {discount.smartInsights.marketingCodeRedemptions && (
                    <div className="flex items-center gap-2">
                      <CheckPlus className="w-4 h-4 " />
                      <span className="text-sm text-gray-600">
                        Marketing Code Redemptions:{" "}
                        {discount.smartInsights.marketingCodeRedemptions}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Discount Code Key Figures */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-green-gray-500 capitalize ">
                  Discount Code Key Figures
                </h3>
              </div>

              {/* Contenedor principal con borde */}
              <div className="border border-green-gray-100 rounded-lg overflow-hidden bg-white p-2">
                <div className="grid grid-cols-2">
                  {/* Columna izquierda */}
                  <div className="space-y-2 p-4">
                    <div className="flex justify-between pb-3">
                      <span className="text-base text-green-gray-800">
                        Type
                      </span>
                      <span className="text-sm text-green-gray-500 font-medium">
                        {discount.type}
                      </span>
                    </div>
                    <div className="flex justify-between pb-3">
                      <span className="text-base text-green-gray-800">
                       Amount
                      </span>
                      <span className="text-sm text-green-gray-500 font-medium">
                        {discount.amount}
                      </span>
                    </div>

                    <div className="flex justify-between  pb-3">
                      <span className="text-base text-green-gray-800">
                     Limit/Customer
                      </span>
                      <span className="text-sm text-green-gray-500 font-medium">
                        {discount.limitPerCustomer}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base text-green-gray-800">
                     Total Limit
                      </span>
                      <span className="text-sm text-green-gray-500 font-medium">
                        {discount.totalLimit}
                      </span>
                    </div>
                  </div>

                  {/* Divisor vertical */}
                  <div className="border-l border-green-gray-100">
                    {/* Columna derecha */}
                    <div className="space-y-2 p-4">
                      <div className="flex justify-between pb-3">
                        <span className="text-base text-green-gray-800">
                          Assigned to
                        </span>
                        <span className="text-sm text-green-gray-500 font-medium">
                          {discount.assignedTo}
                        </span>
                      </div>
                      <div className="flex justify-between pb-3">
                        <span className="text-base text-green-gray-800">
                          Applies to
                        </span>
                        <span className="text-sm text-green-gray-500 font-medium">
                          {discount.appliesTo}
                        </span>
                      </div>
                      <div className="flex justify-between pb-3">
                        <span className="text-base text-green-gray-800">
                          Expiration Date
                        </span>
                        <span className="text-sm text-green-gray-500 font-medium">
                          {formatDate(discount.expirationDate as string)}
                        </span>
                      </div>
                      <div className="flex justify-between pb-3">
                        <span className="text-base text-green-gray-800">
                         Created on
                        </span>
                        <span className="text-sm text-green-gray-500 font-medium">
                          {formatDate(discount.createdOn as string)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Tracking */}
            {discount.usageTracking && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Usage Tracking
                </h4>
                <div className="mb-4">
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {discount.usageTracking.used}/{discount.usageTracking.total}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-pale-green-700 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Usage Details Table */}
                {discount.usageTracking.usageDetails &&
                  discount.usageTracking.usageDetails.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="grid grid-cols-3 gap-4 w-full text-sm font-medium text-gray-600">
                          <span className="flex items-center gap-1">
                            <span>Client Name </span>
                            <img src="/assets/icons/ChevronDown.svg" alt="" />
                          </span>
                          <span className="flex items-center gap-1">
                            <span>Discounted Price </span>
                            <img src="/assets/icons/ChevronDown.svg" alt="" />
                          </span>
                          <span className="flex items-center gap-1">
                            <span>Date Redeemed </span>
                            <img src="/assets/icons/ChevronDown.svg" alt="" />
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {discount.usageTracking.usageDetails.map(
                          (usage, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100 last:border-b-0"
                            >
                              <div>
                                <div className="font-medium text-gray-900">
                                  {usage.clientName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {usage.plan}
                                </div>
                              </div>
                              <div className="font-medium text-gray-900">
                                {usage.discountedPrice}
                              </div>
                              <div className="text-gray-600">
                                {usage.dateRedeemed}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default DiscountDetailModal;
