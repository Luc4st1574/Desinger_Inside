/* eslint-disable @next/next/no-img-element */
"use client";

import ActionMenu, { ActionMenuItem } from "@/components/ui/ActionMenu";
import Dropdown from "@/components/ui/Dropdown";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { X, Loader2, AlertCircle, Link } from "lucide-react";
import { useState } from "react";
import { usePlan } from "@/hooks/plans/usePlan";
import { formatDate } from "@/utils/utils";
import CheckPlus from "@/assets/icons/check+.svg";
import CheckNe from "@/assets/icons/check-.svg";
import ClientsSection from "../../ui/ClientsSection";
import { mockClientsForCard } from "@/mocks/clients";
interface DetailPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId?: string;
  onEdit?: (planId: string) => void;
  onDelete?: (planId: string) => void;
}

export default function DetailPlanModal({
  isOpen,
  onClose,
  planId,
  onEdit,
  onDelete,
}: DetailPlanModalProps) {
  const [period, setPeriod] = useState<string>("weekly");
  const { plan, loading, error } = usePlan(planId || "");

  const menuActions: ActionMenuItem[] = [
    {
      label: "Edit Plan",
      action: () => {
        if (planId && onEdit) {
          onEdit(planId);
        }
      },
    },
    //delete
    {
      label: "Delete",
      action: () => {
        if (planId && onDelete) {
          onDelete(planId);
        }
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
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading plan details...</span>
              </div>
            </div>
          ) : plan ? (
            <>
              {/* Header */}
              <div className="flex items-start justify-between p-4 ">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    {plan.icon && (
                      <img
                        src={plan.icon}
                        alt={plan.name}
                        className="w-8 h-8"
                      />
                    )}
                    <h3 className="font-bold text-2xl ">{plan.name}</h3>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <button
                    type="button"
                    title="Copy Link"
                    className="hover:bg-gray-100 p-2 rounded-full cursor-pointer"
                  >
                    <Link className="w-5 h-5" />
                  </button>
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
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Description */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-medium text-green-gray-500 ">
                    Description
                  </h3>
                  <p className="text-sm text-green-gray-950 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                    {/* Inclusions & Exclusions */}
                <div className="grid grid-cols-2 gap-4 border border-green-gray-100 rounded-lg p-2">
                <div className="py-2 px-4 flex flex-col gap-3">
                    <h4 className="text-sm font-medium text-green-gray-500 ">
                      Inclusions:
                    </h4>
                    <div className="flex flex-col gap-3">
                      {plan.includedServices.map((inclusion: string, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckPlus className="w-4 h-4 " />
                          <span className="text-sm text-gray-600">
                            {inclusion}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-l border-green-gray-100">
                    <div className="py-2 px-4 flex flex-col gap-3">
                      <h4 className="text-sm font-medium text-green-gray-500 ">
                      Exclusions:
                    </h4>
                    <div className="flex flex-col gap-3">
                      {plan.excludedServices.map((exclusion: string, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckNe className="w-4 h-4 " />
                          <span className="text-sm text-gray-500">
                            {exclusion}
                          </span>
                        </div>
                      ))}
                    </div>
                    </div>
                  </div>
                </div>

                {/* Plan Key Figures */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-green-gray-500 capitalize ">
                     {plan.name} Plan Key Figures
                    </h3>
                
                  </div>

                

                  {/* Contenedor principal con borde */}
                  <div className="border border-green-gray-100 rounded-lg overflow-hidden bg-white p-2">
                    <div className="grid grid-cols-2">
                      {/* Columna izquierda */}
                      <div className="space-y-2 p-4">
                        <div className="flex justify-between pb-3">
                          <span className="text-base text-green-gray-800">
                            Price
                          </span>
                          <span className="text-sm text-green-gray-500 font-medium">
                            ${(plan.price / 100).toFixed(2)}/mo
                          </span>
                        </div>
                        <div className="flex justify-between pb-3">
                          <span className="text-base text-green-gray-800">
                            Credits per Month
                          </span>
                          <span className="text-sm text-green-gray-500 font-medium">
                            {plan.creditsPerMonth}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-base text-green-gray-800">
                            Active Orders
                          </span>
                          <span className="text-sm text-green-gray-500 font-medium">
                            {plan.activeOrdersAllowed}
                          </span>
                        </div>
                      </div>

                      {/* Divisor vertical */}
                      <div className="border-l border-green-gray-100">
                        {/* Columna derecha */}
                        <div className="space-y-2 p-4">
                            <div className="flex justify-between pb-3">
                          <span className="text-base text-green-gray-800">
                            Brands
                          </span>
                          <span className="text-sm text-green-gray-500 font-medium">
                            {plan.brandsAllowed}
                          </span>
                        </div>
                          <div className="flex justify-between pb-3">
                            <span className="text-base text-green-gray-800">
                              Release Date
                            </span>
                            <span className="text-sm text-green-gray-500 font-medium">
                              {formatDate(plan.createdAt)}
                            </span>
                          </div>
                          <div className="flex justify-between pb-3">
                            <span className="text-base text-green-gray-800">
                              Last Updated
                            </span>
                            <span className="text-sm text-green-gray-500 font-medium">
                              {formatDate(plan.updatedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clients */}
                <div className="mb-8">
                  <ClientsSection 
                    clients={mockClientsForCard.slice(0, 3)} 
                    count={21}
                    showViewAll={true}
                  />
                </div>
              </div>
            </>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-500">
                  Error loading plan: {error?.message || "Unknown error"}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Plan not found</p>
              </div>
            </div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
