"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import { X, Link, Edit, MoreHorizontal, Download } from "lucide-react";
import { Template } from "@/mocks/templates";
import Image from "next/image";
import ActionMenu, { ActionMenuItem } from "../ui/ActionMenu";
import CheckPlus from "@/assets/icons/check+.svg";

interface TemplateDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: Template | null;
  onEdit?: (template: Template) => void;
}

export default function TemplateDetailsModal({
  isOpen,
  onClose,
  template,
  onEdit,
}: TemplateDetailsModalProps) {
  if (!template) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Draft":
        return "bg-gray-100 text-gray-800";
      case "Expired":
        return "bg-red-100 text-red-800";
      case "Inactive":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "General Templates":
        return "📝";
      case "Branding Templates":
        return "🎨";
      case "Marketing Templates":
        return "📊";
      case "UI/UX Templates":
        return "🎯";
      default:
        return "📄";
    }
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "docx":
        return "📄";
      case "pptx":
        return "📊";
      case "figma":
        return "🎨";
      case "sketch":
        return "✏️";
      case "html":
        return "🌐";
      default:
        return "📎";
    }
  };

  const menuActions: ActionMenuItem[] = [
    {
      label: "Edit",
      action: () => {
        if (onEdit) onEdit(template);
      },
    },
    {
      label: "Delete",
      action: () => {
        console.log("Delete action triggered");
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
                {template.title}
              </h3>
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
                  onClick={() => onEdit(template)}
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
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Description
              </h4>
              <p className="text-sm text-gray-600">{template.description}</p>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Created By
              </h4>
              <p className="text-sm text-gray-600">{template.createdBy.name}</p>
            </div>

            {/* Smart Insights */}
            {template.smartInsights && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Smart Insights
                </h4>
                <div className="space-y-2">
                  {template.smartInsights.map((insight, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckPlus className="w-4 h-4 " />
                      <span className="text-sm text-gray-600">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Discount Code Key Figures */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-green-gray-500 capitalize ">
                  Template Overview
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
                       {template.type.replace(' Templates', '')}
                      </span>
                    </div>
                    <div className="flex justify-between pb-3">
                      <span className="text-base text-green-gray-800">
                       Times Used
                      </span>
                      <span className="text-sm text-green-gray-500 font-medium">
                       {template.timesUsed}
                      </span>
                    </div>

                    <div className="flex justify-between  pb-3">
                      <span className="text-base text-green-gray-800">
                        Visibility
                      </span>
                      <span className="text-sm text-green-gray-500 font-medium">
                        {template.visibility}
                      </span>
                    </div>
                   
                  </div>

                  {/* Divisor vertical */}
                  <div className="border-l border-green-gray-100">
                    {/* Columna derecha */}
                    <div className="space-y-2 p-4">
                      <div className="flex justify-between pb-3">
                        <span className="text-base text-green-gray-800">
                          Status
                        </span>
                        <span className="text-sm text-green-gray-500 font-medium">
                       {template.status}
                        </span>
                      </div>
                      <div className="flex justify-between pb-3">
                        <span className="text-base text-green-gray-800">
                       Created on
                        </span>
                        <span className="text-sm text-green-gray-500 font-medium">
                     {template.createdOn}
                        </span>
                      </div>
                      <div className="flex justify-between pb-3">
                        <span className="text-base text-green-gray-800">
                        Last Updated
                        </span>
                        <span className="text-sm text-green-gray-500 font-medium">
                      {template.lastUpdated}
                        </span>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>

           {/* Template Files */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Template File</h4>
                  {template.files.map((file) => (
                    <div key={file.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getFileIcon(file.type)}</span>
                          <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-500">
                              {file.uploadedAt} by {file.uploadedBy}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Download className="h-5 w-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
