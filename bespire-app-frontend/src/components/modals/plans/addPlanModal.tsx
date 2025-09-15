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
import { useCreatePlan } from "@/hooks/plans/useCreatePlan";
import { useUpdatePlan } from "@/hooks/plans/useUpdatePlan";
import { usePlan } from "@/hooks/plans/usePlan";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";

// Schema para validación del formulario de planes
const planFormSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  stripePriceId: z.string().min(1, "Stripe Price ID is required"),
  price: z.coerce.number().min(0, "Price must be at least 0"),
  creditsPerMonth: z.coerce.number().min(1, "Credits per month must be at least 1"),
  brandsAllowed: z.coerce.number().min(1, "Brands allowed must be at least 1"),
  activeOrdersAllowed: z.coerce.number().min(1, "Active orders allowed must be at least 1"),
  active: z.boolean().optional(),
  icon: z.string().optional(),
  bg: z.string().optional(),
});

type PlanFormValues = z.infer<typeof planFormSchema>;

type Mode = "create" | "edit";

interface AddPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: Mode;
  planIdToEdit?: string;
  onDone?: () => void;
}

export default function AddPlanModal({
  isOpen,
  onClose,
  mode = "create",
  planIdToEdit,
  onDone,
}: AddPlanModalProps) {
  const { create, loading: creating } = useCreatePlan();
  const { update, loading: updating } = useUpdatePlan();
  const { plan: planToEdit, loading: loadingPlan } = usePlan(planIdToEdit || "");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      stripePriceId: "",
      price: 0,
      creditsPerMonth: 100,
      brandsAllowed: 1,
      activeOrdersAllowed: 1,
      active: true,
      icon: "",
      bg: "",
    },
  });

  // Estado para manejar las inclusiones e exclusiones como texto separado por comas
  const [includedServicesInput, setIncludedServicesInput] = useState("");
  const [excludedServicesInput, setExcludedServicesInput] = useState("");

  // Cargar datos en modo edición
  useEffect(() => {
    if (mode === "edit" && planToEdit && isOpen) {
      const formData = {
        name: planToEdit.name,
        slug: planToEdit.slug,
        description: planToEdit.description,
        stripePriceId: planToEdit.stripePriceId,
        price: planToEdit.price,
        creditsPerMonth: planToEdit.creditsPerMonth,
        brandsAllowed: planToEdit.brandsAllowed,
        activeOrdersAllowed: planToEdit.activeOrdersAllowed,
        active: planToEdit.active,
        icon: planToEdit.icon || "",
        bg: planToEdit.bg || "",
      };

      reset(formData);
      setIncludedServicesInput(planToEdit.includedServices?.join(", ") || "");
      setExcludedServicesInput(planToEdit.excludedServices?.join(", ") || "");
    }
  }, [mode, planToEdit, isOpen, reset]);

  // Limpiar form cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      reset();
      setIncludedServicesInput("");
      setExcludedServicesInput("");
    }
  }, [isOpen, reset]);

  function beforeSubmit(values: PlanFormValues) {
    return {
      name: values.name,
      slug: values.slug,
      description: values.description,
      stripePriceId: values.stripePriceId,
      price: values.price,
      creditsPerMonth: values.creditsPerMonth,
      brandsAllowed: values.brandsAllowed,
      activeOrdersAllowed: values.activeOrdersAllowed,
      active: values.active,
      icon: values.icon || undefined,
      bg: values.bg || undefined,
      includedServices: includedServicesInput ? includedServicesInput.split(",").map(s => s.trim()).filter(Boolean) : [],
      excludedServices: excludedServicesInput ? excludedServicesInput.split(",").map(s => s.trim()).filter(Boolean) : [],
    };
  }

  const titleText = mode === "create" ? "Add Plan" : "Edit Plan";

  const onSubmitForm = async (values: PlanFormValues) => {
    try {
      const planData = beforeSubmit(values);

      if (mode === "edit" && planIdToEdit) {
        await update({ id: planIdToEdit, ...planData });
      } else {
        await create(planData);
      }

      showSuccessToast(
        mode === "create" ? "Plan created successfully!" : "Plan updated successfully!"
      );

      reset();
      setIncludedServicesInput("");
      setExcludedServicesInput("");
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
            {mode === "edit" && loadingPlan ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading plan data...</span>
                </div>
              </div>
            ) : (
              <form
                id="plan-form"
                onSubmit={handleSubmit(onSubmitForm)}
                className="space-y-5"
              >
                {/* Plan Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Name
                  </label>
                  <input
                    {...register("name")}
                    placeholder="Starter Plan"
                    className="w-full border border-gray-300 px-3 py-3 rounded-lg text-sm outline-none
                     focus:ring-2 focus:ring-[#758C5D] focus:border-transparent transition-colors"
                  />
                  {errors.name && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {errors.name.message}
                    </span>
                  )}
                </div>

                {/* Slug and Stripe Price ID Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug
                    </label>
                    <input
                      {...register("slug")}
                      placeholder="starter"
                      className="w-full border border-gray-300 px-3 py-3 rounded-lg text-sm outline-none
                       focus:ring-2 focus:ring-[#758C5D] focus:border-transparent transition-colors"
                    />
                    {errors.slug && (
                      <span className="text-red-500 text-xs mt-1 block">
                        {errors.slug.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stripe Price ID
                    </label>
                    <input
                      {...register("stripePriceId")}
                      placeholder="price_..."
                      className="w-full border border-gray-300 px-3 py-3 rounded-lg text-sm outline-none
                       focus:ring-2 focus:ring-[#758C5D] focus:border-transparent transition-colors"
                    />
                    {errors.stripePriceId && (
                      <span className="text-red-500 text-xs mt-1 block">
                        {errors.stripePriceId.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    {...register("description")}
                    placeholder="Perfect for smaller projects or assistance..."
                    className="w-full border border-gray-300 px-3 py-3 rounded-lg text-sm outline-none
                     focus:ring-2 focus:ring-[#758C5D] focus:border-transparent transition-colors resize-none"
                  />
                  {errors.description && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {errors.description.message}
                    </span>
                  )}
                </div>

                {/* Price and Credits Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (in cents)
                    </label>
                    <input
                      type="number"
                      min="0"
                      {...register("price", { valueAsNumber: true })}
                      placeholder="695"
                      className="w-full border border-gray-300 px-3 py-3 rounded-lg text-sm outline-none
                       focus:ring-2 focus:ring-[#758C5D] focus:border-transparent transition-colors"
                    />
                    {errors.price && (
                      <span className="text-red-500 text-xs mt-1 block">
                        {errors.price.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credits per Month
                    </label>
                    <input
                      type="number"
                      min="1"
                      {...register("creditsPerMonth", { valueAsNumber: true })}
                      placeholder="100"
                      className="w-full border border-gray-300 px-3 py-3 rounded-lg text-sm outline-none
                       focus:ring-2 focus:ring-[#758C5D] focus:border-transparent transition-colors"
                    />
                    {errors.creditsPerMonth && (
                      <span className="text-red-500 text-xs mt-1 block">
                        {errors.creditsPerMonth.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Brands and Active Orders Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brands Allowed
                    </label>
                    <input
                      type="number"
                      min="1"
                      {...register("brandsAllowed", { valueAsNumber: true })}
                      placeholder="1"
                      className="w-full border border-gray-300 px-3 py-3 rounded-lg text-sm outline-none
                       focus:ring-2 focus:ring-[#758C5D] focus:border-transparent transition-colors"
                    />
                    {errors.brandsAllowed && (
                      <span className="text-red-500 text-xs mt-1 block">
                        {errors.brandsAllowed.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Active Orders Allowed
                    </label>
                    <input
                      type="number"
                      min="1"
                      {...register("activeOrdersAllowed", { valueAsNumber: true })}
                      placeholder="1"
                      className="w-full border border-gray-300 px-3 py-3 rounded-lg text-sm outline-none
                       focus:ring-2 focus:ring-[#758C5D] focus:border-transparent transition-colors"
                    />
                    {errors.activeOrdersAllowed && (
                      <span className="text-red-500 text-xs mt-1 block">
                        {errors.activeOrdersAllowed.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Icon and Background URLs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon URL (optional)
                    </label>
                    <input
                      {...register("icon")}
                      placeholder="https://..."
                      className="w-full border border-gray-300 px-3 py-3 rounded-lg text-sm outline-none
                       focus:ring-2 focus:ring-[#758C5D] focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background URL (optional)
                    </label>
                    <input
                      {...register("bg")}
                      placeholder="https://..."
                      className="w-full border border-gray-300 px-3 py-3 rounded-lg text-sm outline-none
                       focus:ring-2 focus:ring-[#758C5D] focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                {/* Included Services */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Included Services (Separate by comma)
                  </label>
                  <textarea
                    rows={3}
                    value={includedServicesInput}
                    onChange={(e) => setIncludedServicesInput(e.target.value)}
                    placeholder="UI/UX Design, Web Development, SEO"
                    className="w-full border border-gray-300 px-3 py-3 rounded-lg text-sm outline-none
                     focus:ring-2 focus:ring-[#758C5D] focus:border-transparent transition-colors resize-none"
                  />
                </div>

                {/* Excluded Services */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excluded Services (Separate by comma)
                  </label>
                  <textarea
                    rows={3}
                    value={excludedServicesInput}
                    onChange={(e) => setExcludedServicesInput(e.target.value)}
                    placeholder="Advanced Video Editing, Custom Development"
                    className="w-full border border-gray-300 px-3 py-3 rounded-lg text-sm outline-none
                     focus:ring-2 focus:ring-[#758C5D] focus:border-transparent transition-colors resize-none"
                  />
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("active")}
                    id="active"
                    className="h-4 w-4 text-[#758C5D] focus:ring-[#758C5D] border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                    Plan is active
                  </label>
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
                disabled={loadingPlan || creating || updating}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="plan-form"
                disabled={loadingPlan || creating || updating}
                className={clsx(
                  "flex-1 px-6 py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2 transition-colors",
                  "bg-[#5E6B66] text-white hover:bg-[#4b5a52]",
                  (loadingPlan || creating || updating) && "opacity-50 cursor-not-allowed"
                )}
              >
                {(loadingPlan || creating || updating) && (
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
