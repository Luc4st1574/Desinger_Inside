import React, { useState, useEffect, useCallback, useRef } from "react";
import CompanyAvatarUploader from "@/utils/CompanyAvatarUploader";
import useUpdateClientCompany from '../../../hooks/clients/useUpdateClientCompany';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface CompanyData {
  _id?: string; // corresponde al _id del schema
  name: string;
  website?: string;
  industry?: string;
  size?: string; // "1-10", "11-50", etc.
  logoUrl?: string;
  location?: string;
  brandArchetype?: string;
  communicationStyle?: string;
  elevatorPitch?: string;
  mission?: string;
  vision?: string;
  valuePropositions?: string; // string o JSON si se desea múltiples
  notes?: string;
  contactNumber?: string; // phone -> contactNumber
  countryCode?: string;
  email?: string; // opcional, si la UI la necesita
  createdBy?: string;
}

// Props ahora reciben `company` con el shape de CompanyData
interface ClientAboutTabProps {
  company: CompanyData;
  clientId?: string | number; // id del cliente para refetch
  onSave?: (updatedCompany: CompanyData) => void; // Callback para guardar los cambios
}

const ClientAboutTab: React.FC<ClientAboutTabProps> = ({ company, clientId, onSave }) => {

  

  const [formData, setFormData] = useState<CompanyData>(company);
  // Mantener una referencia con la data original para comparar y evitar guardados innecesarios
  const originalDataRef = useRef<CompanyData>(company);
  // Si la prop company cambia desde fuera, sincronizamos el estado y la referencia
  useEffect(() => {
    originalDataRef.current = company;
    setFormData(company);
  }, [company]);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [saveTimeout, setSaveTimeout] = useState<number | null>(null);
  const { updateClientCompany, loading: updating } = useUpdateClientCompany();

  // Función para guardar con debounce
  const debouncedSave = useCallback(
    (data: CompanyData) => {
      if (saveTimeout) {
        window.clearTimeout(saveTimeout);
      }

      console.log("Debounced save triggered with data:", data);

      const timeout = window.setTimeout(async () => {
        setSaveStatus("saving");
        try {
          const targetCompanyId = company._id;
          if (targetCompanyId) {
            console.log("Saving client company data:", data);
            await updateClientCompany(
              targetCompanyId,
              data as unknown as Record<string, unknown>,
              clientId
            );
            // después de guardar con éxito, actualizamos la referencia original
            originalDataRef.current = data;
          }
          if (onSave) onSave(data);
          setSaveStatus("saved");
          window.setTimeout(() => setSaveStatus("idle"), 2000);
        } catch {
          setSaveStatus("error");
        }
      }, 1000); // Esperar 1 segundo después de dejar de escribir

      setSaveTimeout(timeout);
    },
    [saveTimeout, onSave, updateClientCompany, company, clientId]
  );

  // Manejar cambios en los campos
  const handleFieldChange = (field: keyof CompanyData, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    debouncedSave(updatedData);
  };

  // Guardar al perder el foco
  const handleBlur = () => {
    if (saveTimeout) {
      window.clearTimeout(saveTimeout);
      setSaveTimeout(null);
    }
    // Evitar guardar si los datos no han cambiado respecto a la versión original
    try {
      const originalJson = JSON.stringify(originalDataRef.current || {});
      const currentJson = JSON.stringify(formData || {});
      if (originalJson === currentJson) {
        // nada que guardar
        setSaveStatus("idle");
        return;
      }
    } catch {
      // si stringify falla por alguna razón, continuamos y dejamos que el intento de guardar ocurra
    }
    setSaveStatus("saving");
    (async () => {
      try {
        const targetCompanyId = company._id;
        if (targetCompanyId) {
          await updateClientCompany(
            targetCompanyId,
            formData as unknown as Record<string, unknown>,
            clientId
          );
          // actualizar referencia original tras guardado exitoso
          originalDataRef.current = formData;
        }
        if (onSave) onSave(formData);
        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
      } finally {
        window.setTimeout(() => setSaveStatus("idle"), 2000);
      }
    })();
  };

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        window.clearTimeout(saveTimeout);
      }
    };
  }, [saveTimeout]);

  // Componente para mostrar el estado de guardado
  const SaveStatusIndicator = () => {
    if (saveStatus === "idle") return null;

    const statusConfig = {
      saving: { text: "Saving...", color: "text-blue-500" },
      saved: { text: "Saved", color: "text-green-500" },
      error: { text: "Error saving", color: "text-red-500" },
    } as const;

    const config = statusConfig[saveStatus as keyof typeof statusConfig];

    return (
      <div className={`text-sm ${config.color} flex items-center gap-1`}>
        {(saveStatus === "saving" || updating) && (
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
        )}
        {saveStatus === "saved" && <span>✓</span>}
        {saveStatus === "error" && <span>⚠</span>}
        {config.text}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end ">
        <SaveStatusIndicator />
      </div>
      {/* Header with save status */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-4">
          <CompanyAvatarUploader
            avatarUrl={formData?.logoUrl || ""}
            setAvatarUrl={(url) => handleFieldChange("logoUrl", url)}
            showLabel={false}
            centered={true}
          />
          <div>
            <h2 className="text-xl font-semibold">{formData?.name}</h2>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            value={formData?.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            onBlur={handleBlur}
            className="w-full border border-gray-300 rounded-md p-2  outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Website
          </label>
          <input
            type="text"
            value={formData?.website}
            onChange={(e) => handleFieldChange("website", e.target.value)}
            onBlur={handleBlur}
            className="w-full border border-gray-300 rounded-md p-2  outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Number
          </label>
          <PhoneInput
            placeholder="Enter phone number"
            value={formData?.contactNumber || ""}
            onChange={(value: string) => handleFieldChange("contactNumber", value ?? "")}
            country="us"
            inputClass="input-phone"
            inputProps={{
              onBlur: handleBlur,
            }}
          />
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Industry
          </label>
          <select
            value={formData?.industry || ""}
            onChange={(e) => handleFieldChange("industry", e.target.value)}
            onBlur={handleBlur}
            className="w-full border border-gray-300 rounded-md p-2  outline-none"
          >
            <option value="">Select Industry</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Education">Education</option>
            <option value="Retail">Retail</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Size
          </label>
          <select
            value={formData?.size || ""}
            onChange={(e) => handleFieldChange("size", e.target.value)}
            onBlur={handleBlur}
            className="w-full border border-gray-300 rounded-md p-2  outline-none"
          >
            <option value="">Select Size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="501+">501+ employees</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            value={formData?.location}
            onChange={(e) => handleFieldChange("location", e.target.value)}
            onBlur={handleBlur}
            className="w-full border border-gray-300 rounded-md p-2  outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Brand Archetype
          </label>
          <select
            value={formData?.brandArchetype || ""}
            onChange={(e) =>
              handleFieldChange("brandArchetype", e.target.value)
            }
            onBlur={handleBlur}
            className="w-full border border-gray-300 rounded-md p-2  outline-none"
          >
            <option value="">Select Archetype</option>
            <option value="The Innocent">The Innocent</option>
            <option value="The Explorer">The Explorer</option>
            <option value="The Sage">The Sage</option>
            <option value="The Hero">The Hero</option>
            <option value="The Outlaw">The Outlaw</option>
            <option value="The Magician">The Magician</option>
            <option value="The Regular Guy">The Regular Guy</option>
            <option value="The Lover">The Lover</option>
            <option value="The Jester">The Jester</option>
            <option value="The Caregiver">The Caregiver</option>
            <option value="The Creator">The Creator</option>
            <option value="The Ruler">The Ruler</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Communication Style
          </label>
          <textarea
            value={formData?.communicationStyle || ""}
            onChange={(e) =>
              handleFieldChange("communicationStyle", e.target.value)
            }
            onBlur={handleBlur}
            className="w-full border border-gray-300 rounded-md p-2 h-24  resize-none outline-none"
            placeholder="Describe the preferred communication style..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Elevator Pitch
          </label>
          <textarea
            value={formData?.elevatorPitch || ""}
            onChange={(e) => handleFieldChange("elevatorPitch", e.target.value)}
            onBlur={handleBlur}
            className="w-full border border-gray-300 rounded-md p-2 h-24  resize-none outline-none"
            placeholder="Brief elevator pitch..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mission
          </label>
          <textarea
            value={formData?.mission || ""}
            onChange={(e) => handleFieldChange("mission", e.target.value)}
            onBlur={handleBlur}
            className="w-full border border-gray-300 rounded-md p-2 h-24  resize-none outline-none"
            placeholder="Company mission statement..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vision
          </label>
          <textarea
            value={formData?.vision || ""}
            onChange={(e) => handleFieldChange("vision", e.target.value)}
            onBlur={handleBlur}
            className="w-full border border-gray-300 rounded-md p-2 h-24  resize-none outline-none"
            placeholder="Company vision statement..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Value Proposition(s)
          </label>
          <textarea
            value={formData?.valuePropositions || ""}
            onChange={(e) => handleFieldChange('valuePropositions', e.target.value)}
            onBlur={handleBlur}
            className="w-full border border-gray-300 rounded-md p-2 h-36  resize-none outline-none"
            placeholder="Key value propositions..."
          />
        </div>
      </div>
    </div>
  );
};

export default ClientAboutTab;
