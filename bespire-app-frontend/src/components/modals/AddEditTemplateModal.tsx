"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import {
  Template,
  TemplateType,
  TemplateStatus,
  TemplateVisibility,
} from "@/mocks/templates";
import { useForm } from "react-hook-form";
import clsx from "clsx";

import GeneralIcon from "@/assets/icons/requests.svg";
import BrandingIcon from "@/assets/icons/branding.svg";
import MarketingIcon from "@/assets/icons/completed.svg";
import UiUxIcon from "@/assets/icons/focus6.svg";

interface TemplateFormData {
  title: string;
  type: TemplateType;
  description: string;
  visibility: TemplateVisibility;
  status: TemplateStatus;
  file?: FileList;
  link?: string;
}

interface AddEditTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template?: Template | null;
  onSubmit: (data: TemplateFormData) => void;
}


const visibilityOptions: { value: TemplateVisibility; label: string }[] = [
  { value: "Public", label: "Public" },
  { value: "Team Only", label: "Team Only" },
  { value: "Custom", label: "Custom" },
];

const statusOptions: { value: TemplateStatus; label: string }[] = [
  { value: "Active", label: "Active" },
  { value: "Draft", label: "Draft" },
  { value: "Inactive", label: "Inactive" },
];

export default function AddEditTemplateModal({
  isOpen,
  onClose,
  template,
  onSubmit,
}: AddEditTemplateModalProps) {
  const [selectedType, setSelectedType] = useState<TemplateType | null>(
    template?.type || null
  );
  const [uploadMethod, setUploadMethod] = useState<"file" | "link">("file");

  const isEditing = !!template;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TemplateFormData>({
    defaultValues: template
      ? {
          title: template.title,
          type: template.type,
          description: template.description || "",
          visibility: template.visibility,
          status: template.status,
        }
      : {
          type: "General Templates",
          visibility: "Public",
          status: "Draft",
        },
  });

  const handleFormSubmit = async (data: TemplateFormData) => {
    try {
      await onSubmit({ ...data, type: selectedType || data.type });
      reset();
      setSelectedType(null);
      onClose();
    } catch (error) {
      console.error("Error submitting template:", error);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedType(template?.type || null);
    onClose();
  };

const templateTypes = [
  {
    value: "General Templates",
    label: "General Template",
    icon: <GeneralIcon className="h-6 w-6 text-pale-green-700" />,
  },
  {
    value: "Branding Templates",
    label: "Branding Template",
    icon: <BrandingIcon className="h-6 w-6 text-pale-green-700" />,
  },
  {
    value: "Marketing Templates",
    label: "Marketing Template",
    icon: <MarketingIcon className="h-6 w-6 text-pale-green-700" />,
  },
  {
    value: "UI/UX Templates",
    label: "UI/UX Template",
    icon: <UiUxIcon className="h-6 w-6 text-pale-green-700" />,
  },
];
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50 p-4">
      <DialogBackdrop className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
      <div className="fixed inset-0 flex justify-end">
        <DialogPanel className="w-full text-sm max-w-xl m-2 bg-white overflow-hidden rounded-xl flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start p-6 pb-4 border-b border-gray-100">
            <DialogTitle className="text-xl font-semibold">
              {isEditing ? "Edit Template" : "Add New Template"}
            </DialogTitle>
            <button
              onClick={onClose}
              type="button"
              className="text-gray-600 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 pt-4">
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-6"
              id="template-form"
            >
              {/* Template Type Selection */}
              {!isEditing && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Choose from options
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {templateTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setSelectedType(type.value)}
                        className={`p-4 rounded-lg border-2 transition-colors text-left ${
                          selectedType === type.value
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex flex-col items-start text-left space-y-2">
                          {type.icon}
                          <span className="text-sm font-medium text-gray-900">
                            {type.label}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Template Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Template Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter Template Title"
                  {...register("title", {
                    required: "Template title is required",
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Short Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Short Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  placeholder="Intended for all subscribers. Retarget via remarketing list on expiration."
                  {...register("description")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Visibility and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="visibility"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Visibility
                  </label>
                  <select
                    id="visibility"
                    {...register("visibility", {
                      required: "Visibility is required",
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select One</option>
                    {visibilityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.visibility && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.visibility.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    {...register("status", { required: "Status is required" })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select Status</option>
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.status.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Template File/Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template File
                </label>

                {uploadMethod === "file" ? (
                  <div>
                    <div className="flex items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="text-center">
                        <Plus className="mx-auto h-8 w-8 text-gray-400" />
                        <div className="mt-2">
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer"
                          >
                            <span className="text-sm font-medium text-green-600 hover:text-green-500">
                              Upload
                            </span>
                            <input
                              id="file-upload"
                              type="file"
                              className="sr-only"
                              accept=".pdf,.docx,.pptx,.figma,.sketch,.html"
                              {...register("file")}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Upload your PDF, DOCX, PPTX files. See all{" "}
                      <span className="text-green-600 underline cursor-pointer">
                        supported formats
                      </span>
                    </p>

                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => setUploadMethod("link")}
                        className="text-sm font-medium text-gray-700"
                      >
                        Or add the link
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      placeholder="Paste the link here"
                      {...register("link")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => setUploadMethod("file")}
                        className="text-sm font-medium text-gray-700"
                      >
                        Or upload a file
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-white">
            <div className="flex justify-between items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="template-form"
                disabled={isSubmitting || (!isEditing && !selectedType)}
                className={clsx(
                  "flex-1 px-6 py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2 transition-colors",
                  "bg-[#5E6B66] text-white hover:bg-[#4b5a52]",
                  isSubmitting && "opacity-50 cursor-not-allowed"
                )}
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isEditing ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
