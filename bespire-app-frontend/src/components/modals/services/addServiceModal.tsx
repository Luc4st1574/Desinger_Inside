/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { X, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useServiceCategories } from "@/hooks/services/useServiceCategories";
import { useCreateService } from "@/hooks/services/useCreateService";
import { useUpdateService } from "@/hooks/services/useUpdateService";
import { useService } from "@/hooks/services/useService";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";

// Schema para validación del formulario de servicios
const serviceFormSchema = z.object({
  serviceTitle: z.string().min(1, "Service title is required"),
  categoryId: z.string().min(1, "Category is required"),
  credits: z.coerce.number().min(1, "Credits must be at least 1"),
  description: z.string().optional(),
  inclusions: z.string().optional(),
  exclusions: z.string().optional(),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

// Tipos de servicio disponibles (eliminado, ahora usamos categorías dinámicas)



type Mode = "create" | "edit";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: Mode;
  serviceIdToEdit?: string;
  onDone?: () => void;
}

export default function AddServiceModal({
  isOpen,
  onClose,
  mode = "create",
  serviceIdToEdit,
  onDone,
}: AddServiceModalProps) {
  const { categories, loading: loadingCategories } = useServiceCategories();
  const { create, loading: creating } = useCreateService();
  const { update, loading: updating } = useUpdateService();
  const { service: serviceToEdit, loading: loadingService } = useService(serviceIdToEdit || "");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      serviceTitle: "",
      categoryId: "",
      credits: 1,
      description: "",
      inclusions: "",
      exclusions: "",
    },
  });

  // Estado para manejar la descripción
  const [descriptionInput, setDescriptionInput] = useState("");
  // Estado para manejar las inclusiones e exclusiones como texto separado por comas
  const [inclusionsInput, setInclusionsInput] = useState("");
  const [exclusionsInput, setExclusionsInput] = useState("");

  // Cargar datos en modo edición
  useEffect(() => {
    if (mode === "edit" && serviceToEdit && isOpen) {
      const formData = {
        serviceTitle: serviceToEdit.title,
        categoryId: serviceToEdit.category.id,
        credits: serviceToEdit.credits,
        description: serviceToEdit.description || "",
        inclusions: serviceToEdit.inclusions?.join(", ") || "",
        exclusions: serviceToEdit.exclusions?.join(", ") || "",
      };

      reset(formData);
      setDescriptionInput(serviceToEdit.description || "");
      setInclusionsInput(serviceToEdit.inclusions?.join(", ") || "");
      setExclusionsInput(serviceToEdit.exclusions?.join(", ") || "");
    }
  }, [mode, serviceToEdit, isOpen, reset]);

  // Limpiar form cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      reset();
      setDescriptionInput("");
      setInclusionsInput("");
      setExclusionsInput("");
    }
  }, [isOpen, reset]);

  function beforeSubmit(values: ServiceFormValues) {
    return {
      title: values.serviceTitle,
      categoryId: values.categoryId,
      credits: values.credits,
      description: descriptionInput || undefined,
      inclusions: inclusionsInput ? inclusionsInput.split(",").map(s => s.trim()).filter(Boolean) : [],
      exclusions: exclusionsInput ? exclusionsInput.split(",").map(s => s.trim()).filter(Boolean) : [],
    };
  }

  const titleText = mode === "create" ? "Add Service" : "Edit Service";

  const onSubmitForm = async (values: ServiceFormValues) => {
    try {
      const serviceData = beforeSubmit(values);

      if (mode === "edit" && serviceIdToEdit) {
        await update({ id: serviceIdToEdit, ...serviceData });
      } else {
        await create(serviceData);
      }

      showSuccessToast(
        mode === "create" ? "Service created successfully!" : "Service updated successfully!"
      );

      reset();
      setDescriptionInput("");
      setInclusionsInput("");
      setExclusionsInput("");
      onClose();
      onDone?.();
    } catch (err: unknown) {
      showErrorToast((err as Error)?.message || "Operation failed");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50 p-4">
      <DialogBackdrop className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
      <div className="fixed inset-0 flex justify-end py-2">
        <DialogPanel className="w-full max-w-lg mx-4 bg-white overflow-hidden rounded-2xl flex flex-col shadow-xl">
          {/* Header */}
          <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-100">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {titleText}
            </DialogTitle>
            <button
              onClick={onClose}
              type="button"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 pt-4">
            {mode === "edit" && loadingService ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading service data...</span>
                </div>
              </div>
            ) : (
              <form
                id="service-form"
                onSubmit={handleSubmit(onSubmitForm)}
                className="space-y-5"
              >
                {/* Service Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Title
                  </label>
                  <input
                    {...register("serviceTitle")}
                    placeholder="Animated Typography"
                    className="w-full border border-gray-300 px-3 py-3 rounded-lg text-sm outline-none
                     focus:ring-2 focus:ring-[#758C5D] focus:border-transparent transition-colors"
                  />
                  {errors.serviceTitle && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {errors.serviceTitle.message}
                    </span>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={descriptionInput}
                    onChange={(e) => setDescriptionInput(e.target.value)}
                    placeholder="Brief description of the service"
                    className="w-full border border-gray-300 px-3 py-3 rounded-lg text-sm outline-none
                     focus:ring-2 focus:ring-[#758C5D] focus:border-transparent transition-colors resize-none"
                  />
                </div>

                {/* Credits and Type Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credits
                    </label>
                    <input
                      type="number"
                      min="1"
                      {...register("credits", { valueAsNumber: true })}
                      placeholder="12"
                      className="w-full border border-gray-300 px-3 py-3 rounded-lg text-sm outline-none
                       focus:ring-2 focus:ring-[#758C5D] focus:border-transparent transition-colors"
                    />
                    {errors.credits && (
                      <span className="text-red-500 text-xs mt-1 block">
                        {errors.credits.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      {...register("categoryId")}
                      className="w-full border border-gray-300 px-3 py-3 rounded-lg text-sm outline-none
                       focus:ring-2 focus:ring-[#758C5D] focus:border-transparent transition-colors bg-white"
                      disabled={loadingCategories}
                    >
                      <option value="">
                        {loadingCategories ? "Loading categories..." : "Select category"}
                      </option>
                      {categories.map((category: { id: string; name: string }) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <span className="text-red-500 text-xs mt-1 block">
                        {errors.categoryId.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Inclusions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inclusions (Separate it by comma)
                  </label>
                  <textarea
                    rows={3}
                    value={inclusionsInput}
                    onChange={(e) => setInclusionsInput(e.target.value)}
                    placeholder="Smooth kinetic typography, Custom fonts & styles, Optimized for social media"
                    className="w-full border border-gray-300 px-3 py-3 rounded-lg text-sm outline-none
                     focus:ring-2 focus:ring-[#758C5D] focus:border-transparent transition-colors resize-none"
                  />
                </div>

                {/* Exclusions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exclusions (Separate it by comma)
                  </label>
                  <textarea
                    rows={3}
                    value={exclusionsInput}
                    onChange={(e) => setExclusionsInput(e.target.value)}
                    placeholder="No voiceover sync, No 3D animation, No custom illustrations"
                    className="w-full border border-gray-300 px-3 py-3 rounded-lg text-sm outline-none
                     focus:ring-2 focus:ring-[#758C5D] focus:border-transparent transition-colors resize-none"
                  />
                </div>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-full border border-gray-300 text-sm font-medium 
                 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                disabled={loadingService || creating || updating}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="service-form"
                disabled={loadingService || creating || updating}
                className={clsx(
                  "flex-1 px-6 py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2 transition-colors",
                  "bg-[#5E6B66] text-white hover:bg-[#4b5a52]",
                  (loadingService || creating || updating) && "opacity-50 cursor-not-allowed"
                )}
              >
                {(loadingService || creating || updating) && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {mode === "create" ? "Save" : "Save Changes"}
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}