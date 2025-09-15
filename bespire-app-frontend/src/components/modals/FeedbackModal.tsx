/* eslint-disable @next/next/no-img-element */
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useEffect } from "react";
import { Loader2, X } from "lucide-react";
import clsx from "clsx";
import { useForm } from "react-hook-form";

import { useFeedbackCategories } from "@/hooks/feedback/useFeedbackCategories";
import { useCreateFeedback } from "@/hooks/feedback/useCreateFeedback";
import { showErrorToast, showSuccessToast } from "../ui/toast";

const frequentCategories = [
  {
    icon: "/assets/icons/paper_feedback.svg",
    label: "Feedback",
  },
  {
    icon: "/assets/icons/bug.svg",
    label: "Bug",
  },
  {
    icon: "/assets/icons/service.svg",
    label: "Service",
  },
];

interface FeedbackFormData {
  title: string;
  details: string;
  category: string;
  sendCopy: boolean;
}

export default function FeedbackModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { categories, loading: categoriesLoading } = useFeedbackCategories();
  const { createFeedback, loading: createLoading } = useCreateFeedback();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<FeedbackFormData>({
    defaultValues: {
      title: "",
      details: "",
      category: "",
      sendCopy: true,
    },
    mode: "onChange",
  });

  const selectedCategory = watch("category");

  // Función para encontrar categoría por nombre
  const findCategoryByName = (name: string) => {
    return categories.find(cat => 
      cat.name.toLowerCase() === name.toLowerCase()
    );
  };

  // Función para manejar click en categorías frecuentes
  const handleFrequentCategoryClick = (categoryName: string) => {
    const foundCategory = findCategoryByName(categoryName);
    if (foundCategory) {
      setValue("category", foundCategory.id);
    }
  };

  const onSubmit = async (data: FeedbackFormData) => {
    try {
      await createFeedback({
        title: data.title,
        details: data.details,
        category: data.category,
        sendCopy: data.sendCopy,
      });
showSuccessToast("Feedback submitted successfully!");
      reset();
      onClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      const msg = error instanceof Error ? error.message : "An unknown error occurred";
      showErrorToast(msg);
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50 p-4">
      <DialogBackdrop className="fixed inset-0 bg-black/20 backdrop-blur-sm" />

      <div className="fixed inset-0 flex justify-end">
        <DialogPanel className="w-full text-sm max-w-xl m-2 bg-white overflow-hidden 
        rounded-xl flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start p-6 pb-4 border-b border-gray-100">
            <div>
              <DialogTitle className="text-xl font-semibold">
                Submit Your Feedback!
              </DialogTitle>
            </div>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-black"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 pt-4">
      <form onSubmit={handleSubmit(onSubmit)} id="feedback-form">
            {/* Frequent Categories */}
            <div>
              <p className="font-medium text-sm text-gray-700 mb-2">
                Frequent Categories
              </p>
              <div className="flex gap-2 mb-6">
                {frequentCategories.map((cat) => {
                  const matchingCategory = findCategoryByName(cat.label);
                  const isSelected = matchingCategory && selectedCategory === matchingCategory.id;
                  
                  return (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => handleFrequentCategoryClick(cat.label)}
                      disabled={!matchingCategory}
                      className={clsx(
                        "w-full py-2 px-3 border rounded-md text-sm flex flex-col items-start gap-2 transition",
                        isSelected
                          ? "bg-[#F1F3EE] border-[#758C5D] text-[#181B1A]"
                          : matchingCategory
                          ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                          : "border-gray-200 text-gray-400 cursor-not-allowed"
                      )}
                    >
                      <img src={cat.icon} alt={cat.label} className="w-4 h-4" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="mb-6">
              <label htmlFor="category-select" className="font-medium text-sm text-gray-700 mb-1 block">
                Category
              </label>
              <select
                {...register("category", { required: "Please select a category" })}
                id="category-select"
                className={clsx(
                  "w-full border p-2 rounded-md text-sm",
                  errors.category ? "border-red-500" : "border-gray-300"
                )}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
              )}
            </div>

            {/* Title */}
            <div className="mb-4">
              <label htmlFor="title" className="font-medium text-sm text-gray-700 mb-1 block">
                Title
              </label>
              <input
                {...register("title", { 
                  required: "Title is required",
                  minLength: { value: 3, message: "Title must be at least 3 characters" }
                })}
                id="title"
                placeholder="Enter Title"
                className={clsx(
                  "w-full border p-2 rounded-md text-sm",
                  errors.title ? "border-red-500" : "border-gray-300"
                )}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Details */}
            <div className="mb-4">
              <label htmlFor="details" className="font-medium text-sm text-gray-700 mb-1 block">
                Details
              </label>
              <textarea
                {...register("details", { 
                  required: "Details are required",
                  minLength: { value: 10, message: "Details must be at least 10 characters" }
                })}
                id="details"
                rows={4}
                placeholder="Enter Details"
                className={clsx(
                  "w-full border p-2 rounded-md text-sm",
                  errors.details ? "border-red-500" : "border-gray-300"
                )}
              />
              {errors.details && (
                <p className="text-red-500 text-xs mt-1">{errors.details.message}</p>
              )}
            </div>

            {/* Checkbox */}
            <label className="flex items-center text-sm mb-6">
              <input
                {...register("sendCopy")}
                type="checkbox"
                className="mr-2"
              />
              Send copy and confirmation on email
            </label>

            
          </form>

          </div>

           {/* Footer */}
                    <div className=" p-6 border-t border-gray-100 bg-white">
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
                          form="feedback-form"
                           disabled={!isValid || createLoading || categoriesLoading}
                          className={clsx(
                            "flex-1 px-6 py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2 transition-colors",
                            "bg-[#5E6B66] text-white hover:bg-[#4b5a52]",
                            createLoading && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          {createLoading && (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          )}
                          {createLoading ? "Sending..." : "Submit"}
                        </button>
                      </div>
                    </div>

        
        </DialogPanel>
      </div>
    </Dialog>
  );
}
