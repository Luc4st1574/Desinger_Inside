/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useEffect, useMemo, useState, useCallback } from "react";
import { X } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import {
  CreateRequestInput,
  createRequestSchema,
} from "@/schemas/createRequest.schema";
import { LinkInputList } from "../form/LinkInputList";
import FileUploader from "../inputs/FileUploader";
import { useQuery } from "@apollo/client";
// 1. USA LA NUEVA QUERY
import SpinnerSmall from "../ui/Spinner";
import { useRequests } from "@/hooks/useRequests";
import { useAppContext } from "@/context/AppContext";
import { GET_REQUEST_FORM_DATA } from "@/graphql/queries/requests/GetRequestFormData";
import { UploadedFile } from "./components/types";
import { useRequestById } from "@/hooks/requests/useRequestById";
import { useCreateRequest } from "@/hooks/requests/useCreateRequest";
import { useUpdateRequest } from "@/hooks/requests/useUpdateRequest";
import { usePermanentDeleteFile } from "@/hooks/files/usePermanentDeleteFile";
import { useClientsListAdmin } from "@/hooks/clients/useListClientsAdmin";

// Los datos de categorías frecuentes ahora son más robustos si los definimos por nombre
const frequentCategories = [
  {
    icon: "/assets/icons/logo_icon.svg",
    label: "Logo",
    categoryName: "Brand",
    serviceTitle: "Logo",
  },
  {
    icon: "/assets/icons/social_media_icon.svg",
    label: "Social Media",
    categoryName: "Graphic Design",
    serviceTitle: "Social Media Graphics",
  },
  {
    icon: "/assets/icons/presentation_icon.svg",
    label: "Presentation",
    categoryName: "Graphic Design",
    serviceTitle: "Slide or Presentation Deck",
  },
];

const priorities = ["high", "medium", "low", "none"];

export default function CreateRequestModal({
  isOpen,
  onClose,
  requestId = null,
  isEdit = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  requestId?: string | null;
  isEdit?: boolean;
}) {
  const methods = useForm<CreateRequestInput>({
    resolver: zodResolver(createRequestSchema),
    // 2. CAMPOS DEL FORMULARIO ACTUALIZADOS: usamos IDs para más claridad
    defaultValues: {
      title: "",
      details: "",
      categoryId: "", // Antes 'mainType'
      serviceId: "", // Antes 'subType'
      brand: "",
      priority: "high",
      dueDate: "",
      links: [],
      attachments: [],
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = methods;

  const { workspace, setIsEditRequest, setRequestForEdit, role } =
    useAppContext();
  const { clients, loading: loadingClients } = useClientsListAdmin(role);

  const [createMode, setCreateMode] = useState<"self" | "for_client">("self");
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  // Hook para obtener datos del request en modo edición
  const {
    request: requestData,
    loading: loadingRequest,
    error: errorRequest,
    refetch: refetchRequest,
  } = useRequestById(requestId);
  console.log("requestData:", requestData);

  const workspaceId = useMemo(() => {
    if (isEdit && requestData?.workspace) return requestData.workspace;
    if (
      role === "admin" &&
      createMode === "for_client" &&
      selectedClient?.workspaceId
    )
      return selectedClient.workspaceId;
    return workspace?._id;
  }, [
    role,
    isEdit,
    requestData?.workspace,
    workspace?._id,
    createMode,
    selectedClient?.workspaceId,
  ]);

  const {
    data,
    loading: loadingFormData,
    refetch: refetchFormData,
  } = useQuery(GET_REQUEST_FORM_DATA, {
    variables: { workspaceId },
    skip: !workspaceId,
    fetchPolicy: "cache-and-network",
  });

  // refetch de form-data al cambiar de cliente/workspace
  useEffect(() => {
    if (isOpen && workspaceId) {
      refetchFormData();
    }
  }, [isOpen, workspaceId, refetchFormData]);

  useEffect(() => {
    if (!isOpen) {
      setCreateMode("self");
      setSelectedClient(null);
    }
  }, [isOpen]);

  // Hooks para mutaciones
  const { createRequest, loading: loadingCreate } = useCreateRequest();
  const { updateRequest, loading: loadingUpdate } = useUpdateRequest(requestId);
  const { permanentlyDeleteFiles } = usePermanentDeleteFile(
    requestId || undefined
  );

  // 4. MEMOIZAR DATOS PARA ESTABILIDAD Y EFICIENCIA
  const categories = useMemo(() => data?.serviceCategories || [], [data]);
  const services = useMemo(() => data?.services || [], [data]);
  const brands = useMemo(() => data?.brandsForWorkspace || [], [data]);

  // 5. ESTADO PARA LOS SERVICIOS FILTRADOS (antes subTypes)
  const [filteredServices, setFilteredServices] = useState<any[]>([]);

  // Función para actualizar la lista de servicios cuando cambia la categoría
  const updateServicesForCategory = useCallback(
    (categoryId: string) => {
      if (!categoryId) {
        setFilteredServices([]);
        return;
      }
      const filtered = services.filter(
        (s: any) => s.category.id === categoryId
      );
      setFilteredServices(filtered);
    },
    [services]
  );

  // Handler para el cambio de categoría
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategoryId = e.target.value;
    setValue("categoryId", newCategoryId);
    setValue("serviceId", ""); // Resetea el servicio al cambiar de categoría
    updateServicesForCategory(newCategoryId);
  };

  // Handler para categorías frecuentes (lógica adaptada)
  const handleFrequentCategorySelect = useCallback(
    (freqCat: (typeof frequentCategories)[0]) => {
      console.log("Frequent category selected:", freqCat);
      console.log("categories:", categories);
      const targetCategory = categories.find(
        (c: any) => c.name === freqCat.categoryName
      );
      if (!targetCategory) return;
      console.log("Found category:", targetCategory);
      console.log("services:", services);
      const targetService = services.find(
        (s: any) =>
          s.category.id === targetCategory.id &&
          s.title === freqCat.serviceTitle
      );
      if (!targetService) return;
      console.log("Found service:", targetService);

      setValue("categoryId", targetCategory.id);
      updateServicesForCategory(targetCategory.id);
      setValue("serviceId", targetService.id); // Establece el servicio directamente
    },
    [categories, services, setValue, updateServicesForCategory]
  );

  // Efecto para inicializar el formulario en modo edición o creación
  useEffect(() => {
    if (!isOpen) {
      console.log("Modal closed, resetting form.");
      // Limpia el formulario y estado al cerrar el modal
      reset();
      setFilteredServices([]);
      if (isEdit) {
        setRequestForEdit(null);
        setIsEditRequest(false);
      }
      return;
    }

    if (isEdit && requestId) {
      // Refresca los datos del request cada vez que se abre en modo edición
      if (refetchRequest) {
        refetchRequest(); // Fuerza una nueva consulta al servidor
      }
    }

    if (isEdit && requestData && services.length > 0) {
      console.log("Initializing form for editing request:", requestData);
      // En modo edición, poblamos con los datos del 'requestData'
      const categoryId = requestData.service?.category?.id || "";
      const serviceId = requestData.service?.id || "";

      reset({
        title: requestData.title || "",
        details: requestData.details || "",
        categoryId: categoryId,
        serviceId: serviceId,
        brand: requestData.brand,
        priority: requestData.priority || "high",
        dueDate: requestData.dueDate
          ? new Date(requestData.dueDate).toISOString().split("T")[0]
          : "",
        links: requestData.links || [],
        attachments: requestData.attachments || [],
      });

      // Asegúrate de que la lista de servicios para esa categoría esté poblada
      updateServicesForCategory(categoryId);
    } else {
      // En modo creación, reseteamos a valores por defecto
      reset();
      setFilteredServices([]);
    }
  }, [
    isOpen,
    isEdit,
    requestId,
    requestData,
    services,
    reset,
    updateServicesForCategory,
    refetchRequest,
  ]);

  useEffect(() => {
    if (isOpen) {
      refetchFormData();
    }
  }, [isOpen, refetchFormData]);

  const attachments = watch("attachments") as any[];
  const onSubmit = async (data: CreateRequestInput) => {
    if (loadingRequest) return; // No enviar si está cargando datos
    const asUserId =
      role === "admin" &&
      !isEdit &&
      createMode === "for_client" &&
      selectedClient?.id
        ? selectedClient.id
        : undefined;

    const payload = {
      title: data.title,
      details: data.details,
      brand: data.brand || null,
      service: data.serviceId, // <-- El ID del servicio es lo que importa
      priority: data.priority.toLowerCase(),
      dueDate: data.dueDate || null,
      links: data.links?.map((l) => ({
        url: l.url,
        title: l.title,
        favicon: l.favicon,
      })),
      attachments: attachments
        .filter((a) => a.url)
        .map((a) => ({
          name: a.file?.name || a.name,
          url: a.url,
          ext: a.file?.name?.split(".").pop() || a.ext || "",
          size: a.file?.size || a.size || 0,
          uploadedAt: new Date().toISOString(), // Fecha actual
          fileId: a.fileId,
          id: a.id, // Incluye el ID si está disponible
        })),
      workspace: workspaceId,
      asUserId,
    };

    try {
      if (isEdit && requestId) {
        await updateRequest(requestId, payload);
        // Refetch el detalle de la request editada
        // Asumiendo que tienes un hook para refetch FIND_REQUEST_BY_ID
      } else {
        await createRequest(payload);
      }
      onClose();
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const selectedCategoryId = watch("categoryId");
  const selectedServiceId = watch("serviceId");

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50 p-4">
      <DialogBackdrop className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
      <div className="fixed inset-0 flex justify-end">
        <DialogPanel
          className="w-full text-sm max-w-md m-2 bg-white p-8 
        overflow-y-auto rounded-xl flex flex-col gap-4"
        >
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <DialogTitle className="text-xl font-semibold">
                  {isEdit ? "Edit Request" : "Create Request"}
                </DialogTitle>
                <button
                  onClick={onClose}
                  type="button"
                  className="text-gray-600 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {loadingRequest && (
                <div className="flex justify-center items-center py-4">
                  <SpinnerSmall />
                  <span className="ml-2">Loading request data...</span>
                </div>
              )}

              {errorRequest && (
                <div className="text-red-500 text-center py-4">
                  Error loading request: {errorRequest.message}
                </div>
              )}

              {/* Choose from options for admin */}
              {/* NEW: Opciones de creación (solo admin y no edit) */}
              {!isEdit && role === "admin" && (
                <div>
                  <p className="font-medium text-sm text-gray-700 mb-2">
                    Choose from options
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className={clsx(
                        "p-3 rounded-md border text-left flex flex-col gap-3",
                        createMode === "for_client"
                          ? "border-[#758C5D] bg-[#F1F3EE]"
                          : "border-gray-300 hover:bg-gray-50"
                      )}
                      onClick={() => setCreateMode("for_client")}
                    >
                      <img
                        src="/assets/icons/paper-plane_2.svg"
                        className="w-4 h-4"
                      />
                      <span> Create a Request for Client</span>
                    </button>
                    <button
                      type="button"
                      className={clsx(
                        "p-3 rounded-md border text-left flex flex-col gap-3",
                        createMode === "self"
                          ? "border-[#758C5D] bg-[#F1F3EE]"
                          : "border-gray-300 hover:bg-gray-50"
                      )}
                      onClick={() => setCreateMode("self")}
                    >
                      <img
                        src="/assets/icons/paper-plane_3.svg"
                        className="w-4 h-4"
                      />
                      <span> Create a One-Time Project Request</span>
                    </button>
                  </div>

                  {/* Selector de cliente cuando corresponde */}
                  {createMode === "for_client" && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Client
                      </label>
                      <select
                        value={selectedClient?.id || ""}
                        onChange={(e) => {
                          const c =
                            clients.find((x: any) => x.id === e.target.value) ||
                            null;
                          setSelectedClient(c);
                          // Nota: workspaceId se recalcula por useMemo y dispara refetchFormData
                        }}
                        disabled={loadingClients}
                        className="w-full border border-gray-300 p-2 rounded-md text-sm"
                      >
                        <option value="">
                          {loadingClients
                            ? "Loading clients..."
                            : "Select a client"}
                        </option>
                        {clients.map((c: any) => (
                          <option key={c.id} value={c.id}>
                            {c.name} {c.companyName ? `(${c.companyName})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Frequent Categories */}
              <div>
                <p className="font-medium text-sm text-gray-700">
                  Frequently requested
                </p>
                <div className="flex gap-2">
                  {frequentCategories.map((cat) => (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => handleFrequentCategorySelect(cat)}
                      className={clsx(
                        "w-full py-2 px-3 border rounded-md text-sm flex flex-col items-start gap-2 transition",
                        // Lógica de selección actualizada
                        categories.find((c: any) => c.id === selectedCategoryId)
                          ?.name === cat.categoryName &&
                          services.find((s: any) => s.id === selectedServiceId)
                            ?.title === cat.serviceTitle
                          ? "bg-[#F1F3EE] border-[#758C5D]"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      <img src={cat.icon} alt={cat.label} className="w-4 h-4" />
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category & Service Dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Category</label>
                  <select
                    {...register("categoryId")}
                    value={selectedCategoryId || ""}
                    onChange={handleCategoryChange}
                    className="w-full border border-gray-300 p-2 rounded-md text-sm"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <span className="text-red-500">
                      {errors.categoryId.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700">Service</label>
                  <select
                    {...register("serviceId")}
                    disabled={
                      !selectedCategoryId || filteredServices.length === 0
                    }
                    value={selectedServiceId || ""}
                    className="w-full border border-gray-300 p-2 rounded-md text-sm"
                  >
                    <option value="">Select service</option>
                    {filteredServices.map((service: any) => (
                      <option key={service.id} value={service.id}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                  {errors.serviceId && (
                    <span className="text-red-500">
                      {errors.serviceId.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="font-medium">Title</label>
                <input
                  {...register("title")}
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
                {errors.title && (
                  <span className="text-red-500">{errors.title.message}</span>
                )}
              </div>

              {/* Brand */}
              <div>
                <label className="font-medium">Brand</label>
                <select
                  {...register("brand")}
                  className="w-full border border-gray-300 p-2 rounded-md"
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand: any) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority y Due Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium">Priority</label>
                  <select
                    {...register("priority")}
                    className="w-full border border-gray-300 p-2 rounded-md text-sm outline-none focus:ring-2 focus:ring-[#758C5D] focus:border-transparent"
                  >
                    {priorities.map((pr) => (
                      <option key={pr} value={pr} className="capitalize">
                        {pr}
                      </option>
                    ))}
                  </select>
                  {errors.priority && (
                    <span className="text-red-500">
                      {errors.priority.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="font-medium">Date Needed</label>
                  <input
                    type="date"
                    {...register("dueDate")}
                    className="w-full border border-gray-300 p-2 rounded-md text-sm outline-none focus:ring-2 focus:ring-[#758C5D] focus:border-transparent"
                  />
                  {errors.dueDate && (
                    <span className="text-red-500">
                      {errors.dueDate.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Details */}
              <div>
                <label className="font-medium">Request Details</label>
                <textarea
                  {...register("details")}
                  placeholder="Enter details here"
                  rows={3}
                  className="w-full border border-gray-300 p-2 rounded-md text-sm outline-none focus:ring-2 focus:ring-[#758C5D] focus:border-transparent"
                />
                {errors.details && (
                  <span className="text-red-500">{errors.details.message}</span>
                )}
              </div>

              {/* Links (Preview Only) */}
              <LinkInputList name="links" />

              {/* Attachments (Placeholder) */}
              <FileUploader
                value={attachments}
                onChange={(files) => setValue("attachments", files as any)}
                onDelete={async (f: any) => {
                  if (f.fileId) await permanentlyDeleteFiles([f.fileId]);
                }}
              />

              {/* Botones */}
              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 rounded-full border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingCreate || loadingUpdate || loadingRequest}
                  className="px-6 py-2 rounded-full bg-[#5E6B66] text-white"
                >
                  {loadingCreate || loadingUpdate ? (
                    <SpinnerSmall />
                  ) : isEdit ? (
                    "Update Request"
                  ) : (
                    "Create Request"
                  )}
                </button>
              </div>
            </form>
          </FormProvider>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
