/* eslint-disable @next/next/no-img-element */
"use client";

import ActionMenu, { ActionMenuItem } from "@/components/ui/ActionMenu";
import Dropdown from "@/components/ui/Dropdown";
import RatingCard, { Rating } from "@/components/ui/RatingCard";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  X,
  Loader2,
  ExternalLink,
  Edit,
  MoreHorizontal,
  Check,
  AlertCircle,
  Link,
  Bell,
} from "lucide-react";
import CheckPlus from "@/assets/icons/check+.svg";
import CheckNe from "@/assets/icons/check-.svg";
import { useState } from "react";
import { useService } from "@/hooks/services/useService";

interface DetailServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId?: string;
  onEdit?: (serviceId: string) => void;
  onDelete?: (serviceId: string) => void;
}

export default function DetailServiceModal({
  isOpen,
  onClose,
  serviceId,
  onEdit,
  onDelete,
}: DetailServiceModalProps) {
  const [period, setPeriod] = useState<string>("weekly");
  const { service, loading, error } = useService(serviceId || "");

 

  const mockRatings: Rating[] = [
    {
      id: "r1",
      text: "The Instagram ad campaign for the local coffee shop was a huge success, capturing its cozy vibe and delicious brews. The creative direction and targeting brought measurable ROI.",
      rating: 5.0,
      reviewerName: "Gerard Santos",
      reviewerCompany: "Spherule",
      reviewerAvatar: "https://i.pravatar.cc/80?img=32",
    },
    {
      id: "r2",
      text: "I had a great experience working on a UX project for a landing page SaaS, with smooth design processes and thoughtful implementation of feedback.",
      rating: 5.0,
      reviewerName: "Alex Rivera",
      reviewerCompany: "Nova Lane",
      reviewerAvatar: "https://i.pravatar.cc/80?img=12",
    },
  ];
  const menuActions: ActionMenuItem[] = [
    {
      label: "Edit Service",
      action: () => {
        if (serviceId && onEdit) {
          onEdit(serviceId);
        }
      },
    },
    {
      label: "Delete",
      action: () => {
        if (serviceId && onDelete) {
          onDelete(serviceId);
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
                <span>Loading service details...</span>
              </div>
            </div>
          ) : service ? (
            <>
              {/* Header */}
              <div className="flex items-start justify-between p-4 ">
                <div className="flex flex-col gap-4">
                  <h3 className="font-bold text-2xl ">{service.title}</h3>
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
                    {service.description}
                  </p>
                </div>

                {/* Inclusions & Exclusions */}
                <div className="grid grid-cols-2 gap-4 border border-green-gray-100 rounded-lg p-2">
                <div className="py-2 px-4 flex flex-col gap-3">
                    <h4 className="text-sm font-medium text-green-gray-500 ">
                      Inclusions:
                    </h4>
                    <div className="flex flex-col gap-3">
                      {service.inclusions.map((inclusion: string, index: number) => (
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
                      {service.exclusions.map((exclusion: string, index: number) => (
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

                {/* Key Work Statistics */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-green-gray-500 ">
                      Key Work Statistics
                    </h3>
                    <Dropdown
                      items={[
                        { value: "weekly", label: "Weekly" },
                        { value: "monthly", label: "Monthly" },
                        { value: "quarterly", label: "Quarterly" },
                      ]}
                      selectedValue={period}
                      onSelect={(item) => setPeriod(item.value)}
                      variant="outlineG"
                      size="sm"
                      className="border border-gray-200"
                      showChevron={true}
                    />
                  </div>

                  {/* Contenedor principal con borde */}
                  <div className="border border-green-gray-100 rounded-lg overflow-hidden bg-white p-2">
                    <div className="grid grid-cols-2">
                      {/* Columna izquierda */}
                      <div className="space-y-2 p-4">
                        <div className="flex justify-between pb-3">
                          <span className="text-base text-green-gray-800">Credits Required</span>
                          <span className="text-sm text-green-gray-500 font-medium">
                            {service.credits} Credits
                          </span>
                        </div>
                        <div className="flex justify-between pb-3">
                          <span className="text-base text-green-gray-800">Ave Rating</span>
                          <span className="text-sm text-green-gray-500 font-medium">
                            4.8 stars
                          </span>
                        </div>
                        <div className="flex justify-between pb-3">
                          <span className="text-base text-green-gray-800">Type</span>
                          <span className="text-sm text-green-gray-500 font-medium">
                            {service.category.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-base text-green-gray-800">Total Requests</span>
                          <span className="text-sm text-green-gray-500 font-medium">
                            21
                          </span>
                        </div>
                      </div>

                      {/* Divisor vertical */}
                      <div className="border-l border-green-gray-100">
                        {/* Columna derecha */}
                        <div className="space-y-2 p-4">
                          <div className="flex justify-between pb-3">
                            <span className="text-base text-green-gray-800">Last Updated</span>
                            <span className="text-sm text-green-gray-500 font-medium">
                              {new Date(service.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between pb-3">
                            <span className="text-base text-green-gray-800">
                              Avg. Delivery Time
                            </span>
                            <span className="text-sm text-green-gray-500 font-medium">
                              3 days
                            </span>
                          </div>
                          <div className="flex justify-between pb-3">
                            <span className="text-base text-green-gray-800">Status</span>
                            <span className="text-sm text-green-gray-500 font-medium">
                              {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-base text-green-gray-800">Revisions/Task</span>
                            <span className="text-sm text-green-gray-500 font-medium">
                              3 revisions
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ratings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-green-gray-500 ">
                    Ratings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
                    {mockRatings.map((r) => (
                      <RatingCard
                        key={r.id}
                        item={r}
                        onView={(id) => console.log("view", id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Service not found</p>
              </div>
            </div>
          )}
       
        </DialogPanel>
      </div>
    </Dialog>
  );
}
