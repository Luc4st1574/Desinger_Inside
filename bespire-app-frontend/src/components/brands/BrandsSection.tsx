/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import Button from "../ui/Button";
import ModalBrands from "../modals/ModalBrands";
import { useBrands } from "@/hooks/useBrands";
import Spinner from "../Spinner";
import { showErrorToast, showSuccessToast } from "../ui/toast";
import Swal from "sweetalert2";
import { useAppContext } from "@/context/AppContext";
// Recibe workspaceId como prop
interface BrandsSectionProps {
  workspaceId?: string;
  allowCreate?: boolean;
  inlineModal?: boolean;
  isClientDetail?: boolean;
}

// Tipos mínimos para cumplir TypeScript estricto (evitan `any` en este archivo)
interface Logo {
  url: string;
  fileId?: string;
  name?: string;
}

interface Font {
  url: string;
  name?: string;
  category?: string;
  family?: string;
  fileId?: string;
}

interface Brand {
  _id: string;
  name: string;
  logos?: Logo[];
  fonts?: Font[];
  primaryColors?: string[];
  secondaryColors?: string[];
  archetype?: string;
  description?: string;
  buyer?: string;
  tone?: string;
  likes?: string;
  dislikes?: string;
}

type BrandFormData = Partial<Omit<Brand, "_id">> & {
  logos?: Logo[];
  fonts?: Font[];
};

export default function BrandsSection({
  workspaceId: workspaceIdProp,
  allowCreate = true,
  inlineModal = true,
  isClientDetail = false,
}: BrandsSectionProps) {
  console.log("Workspace ID:", workspaceIdProp);
  const { workspace } = useAppContext();
  // Prefer explicit prop, otherwise fallback to context workspace
  const workspaceId = workspaceIdProp ?? workspace?._id ?? "";
  const {
    brands,
    loading,
    createBrand,
    updateBrand,
    createState,
    updateState,
    removeBrand,
    removeState: deleteState,
    refetch,
  } = useBrands(workspaceId);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const handleOpenCreate = () => {
    setEditingBrand(null);
    setShowModal(true);
  };

  const handleOpenEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setShowModal(true);
  };
  const handleSubmit = async (formData: BrandFormData) => {
    try {
      if (editingBrand) {
        // editingBrand es Brand | null; aquí está definido
        await updateBrand({
          variables: {
            updateBrandInput: {
              id: editingBrand!._id,
              name: formData.name,
              workspace: workspaceId,
              logos:
                formData.logos?.map((l: Logo) => ({
                  url: l.url,
                  fileId: l.fileId,
                })) || [],
              fonts:
                formData.fonts?.map((f: Font) => ({
                  url: f.url,
                  name: f.name,
                  category: f.category,
                  family: f.family,
                  fileId: f.fileId,
                })) || [],
              primaryColors: formData.primaryColors || [],
              secondaryColors: formData.secondaryColors || [],
              archetype: formData.archetype,
              description: formData.description,
              buyer: formData.buyer,
              tone: formData.tone,
              likes: formData.likes,
              dislikes: formData.dislikes,
            },
          },
        });
      } else {
        console.log("Creating brand with data:", formData);
        const objSend = {
          name: formData.name,
          workspace: workspaceId,
          logos:
            formData.logos?.map((l: Logo) => ({
              url: l.url,
              fileId: l.fileId,
            })) || [],
          fonts:
            formData.fonts?.map((f: Font) => ({
              url: f.url,
              name: f.name,
              category: f.category,
              family: f.family,
              fileId: f.fileId,
            })) || [],
          primaryColors: formData.primaryColors || [],
          secondaryColors: formData.secondaryColors || [],
          archetype: formData.archetype,
          description: formData.description,
          buyer: formData.buyer,
          tone: formData.tone,
          likes: formData.likes,
          dislikes: formData.dislikes,
        };
        console.log(objSend);

        await createBrand({
          variables: {
            createBrandInput: objSend,
          },
        });
      }
      refetch();
      showSuccessToast("Brands Updated!");
      setShowModal(false);
    } catch (error: unknown) {
      // SweetAlert2 para errores
      // Primero buscamos si viene error.graphQLErrors
      let message = "Ocurrió un error inesperado.";
      const err = error as {
        graphQLErrors?: Array<{ message?: string }>;
        message?: string;
      };
      if (err?.graphQLErrors && err.graphQLErrors.length > 0) {
        message = err.graphQLErrors.map((e) => e.message || "").join("\n");
      } else if (err?.message) {
        message = err.message;
      }
      showErrorToast(message);
    }
  };

  const handleDeleteBrand = async (brandId: string) => {
    console.log("handleDeleteBrand", brandId);
    try {
      await removeBrand({
        variables: { id: brandId, workspaceId },
      });
      setShowModal(false);
      showSuccessToast("Brand deleted successfully!");
      refetch();
    } catch (error: unknown) {
      let message = "Ocurrió un error al eliminar la marca.";
      const err = error as {
        graphQLErrors?: Array<{ message?: string }>;
        message?: string;
      };
      if (err?.graphQLErrors && err.graphQLErrors.length > 0) {
        message = err.graphQLErrors.map((e) => e.message || "").join("\n");
      } else if (err?.message) {
        message = err.message;
      }
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
      });
    }
  };

  if (loading) {
    return <Spinner />;
  }

  console.log("BrandsSection rendered", brands);

  return (
    <section className="w-full max-w-6xl mx-auto">
      {/* Banner aquí si lo necesitas */}
      {!isClientDetail && (
        <img
          src="/assets/brands/brand_mock.webp"
          alt=""
          className="rounded-lg mb-6"
        />
      )}

      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl">Your Brands</h3>
          {allowCreate && (
            <Button
              type="button"
              variant="green2"
              size="md"
              onClick={handleOpenCreate}
            >
              Add Brand +
            </Button>
          )}
        </div>
        <div className={inlineModal ? "flex flex-wrap gap-4" : "grid grid-cols-3 gap-4"}>
          {loading ? (
            <div>Cargando...</div>
          ) : (
            <>
              {brands.map((brand: Brand) => (
          <div
            key={brand._id}
            className="bg-white rounded-xl border flex flex-col items-start gap-3
             px-4 py-4 min-h-[200px] min-w-[220px] max-w-[220px] border-2 border-[#E2E6E4]
              hover:shadow transition cursor-pointer"
            onClick={() => handleOpenEdit(brand)}
          >
            {/* Top: logo or initials */}
            <div className=" flex items-center justify-center overflow-hidden w-full h-[140px]">
              {brand.logos && brand.logos.length > 0 ? (
                <img
            src={brand.logos[0].url}
            alt={`${brand.name} logo`}
            className="w-full h-full object-contain p-2"
                />
              ) : (
                <span className="font-bold text-xl text-gray-600">
            {(brand.name || "").slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="w-full flex justify-between">
              <div className="font-medium text-lg">{brand.name}</div>
              <img src="/assets/icons/arrow-l.svg" alt="open" />
            </div>
          </div>
              ))}
              {/* Add brand card */}
              {!isClientDetail && (
          <button
            className="flex flex-col cursor-pointer items-center justify-center 
            bg-white border-2  border-[#E2E6E4] rounded-xl min-w-[320px] max-w-xs px-8 py-8 text-gray-500 hover:bg-gray-50 transition"
            onClick={handleOpenCreate}
          >
            <span className="text-4xl mb-3">+</span>
            <span className="font-medium text-lg">Add a Brand</span>
          </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal para crear/editar brand */}
      {inlineModal && (
        <ModalBrands
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          editingBrand={editingBrand}
          loading={createState.loading || updateState.loading}
          onDelete={async () => {
            if (editingBrand) {
              const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
              });
              if (result.isConfirmed) {
                await handleDeleteBrand(editingBrand!._id);
              }
            }
          }}
          deleting={deleteState.loading}
        />
      )}
    </section>
  );
}
