/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { X, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  teamMemberFormSchema,
  TeamMemberFormValues,
  employmentTypes,
  teamRoles,
} from "@/schemas/teamMemberForm.schema";
import { useTeamMember } from "@/hooks/team/useTeamMember";
import { useLocationData } from "@/hooks/useLocationData";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";

type Mode = "create" | "edit";

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: Mode;
  userIdToEdit?: string;
  onDone?: () => void;
}

export default function AddTeamMemberModal({
  isOpen,
  onClose,
  mode = "create",
  userIdToEdit,
  onDone,
}: AddTeamMemberModalProps) {
  const { managers, loadingManagers, defaults, loadingEdit, submit, busy } =
    useTeamMember(mode === "edit" ? userIdToEdit : undefined);

  const {
    countries,
    states,
    cities,
    loadingCountries,
    loadingStates,
    loadingCities,
    loadStates,
    loadCities,
  } = useLocationData();

  // Lista de zonas horarias (IANA). Si el runtime soporta Intl.supportedValuesOf, úsala.
  const TIMEZONES: string[] = useMemo(() => {
    if (typeof Intl !== "undefined" && Intl.supportedValuesOf) {
      return Intl.supportedValuesOf("timeZone");
    }
    return [
      "UTC",
      "America/Los_Angeles",
      "America/New_York",
      "America/Mexico_City",
      "America/Lima",
      "America/Bogota",
      "America/Santiago",
      "Europe/London",
      "Europe/Madrid",
      "Europe/Paris",
      "Europe/Berlin",
      "Africa/Johannesburg",
      "Asia/Dubai",
      "Asia/Kolkata",
      "Asia/Bangkok",
      "Asia/Singapore",
      "Asia/Tokyo",
      "Australia/Sydney",
      "Pacific/Auckland",
    ];
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    watch,
  } = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: {
      mode,
      email: "",
      fullName: "",
      teamRole: undefined,
      avatarUrl: "",
      roleTitle: "",
      manager: "",
      employmentType: undefined,
      workHours: null,
      contractStart: "",
      contractEnd: "",
      timezone: "",
      country: "",
      state: "",
      city: "",
      phone: "",
      birthday: "",
      tags: [],
      description: "",
    },
  });

  // watchers
  const employmentType = watch("employmentType");
  const selectedCountry = watch("country");
  const selectedState = watch("state");

  // limpiar contractEnd si pasa a full_time
  useEffect(() => {
    if (employmentType === "full_time") {
      setValue("contractEnd", "", { shouldValidate: true });
    }
  }, [employmentType, setValue]);

  // Cargar estados cuando cambie el país
  useEffect(() => {
    if (selectedCountry) {
      setValue("state", ""); // Resetea el estado
      setValue("city", ""); // Resetea la ciudad
      loadStates(selectedCountry);
    }
  }, [selectedCountry, loadStates, setValue]);

  // Cargar ciudades cuando cambie el estado (y tengamos un país)
  useEffect(() => {
    if (selectedCountry && selectedState) {
      setValue("city", ""); // Resetea la ciudad
      loadCities(selectedCountry, selectedState);
    }
  }, [selectedCountry, selectedState, loadCities, setValue]);

  // Cargar defaults en modo edición
  useEffect(() => {
    if (mode === "edit" && defaults) {
      reset({ mode, ...defaults }); // roleMember solo UI
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaults, mode]);

  // Hobbies como input separado por comas
  const [tagsInput, setTagsInput] = useState("");
  useEffect(() => {
    if (defaults?.tags?.length) setTagsInput(defaults.tags.join(", "));
  }, [defaults]);

  function beforeSubmit(values: TeamMemberFormValues) {
    const toList = (s: string) =>
      s
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    return {
      ...values,
      tags: toList(tagsInput), // hobbies
    } as TeamMemberFormValues;
  }

  const titleText = mode === "create" ? "Add Team Member" : "Edit Team Member";

  const onSubmitForm = async (values: TeamMemberFormValues) => {
    try {
      const val = beforeSubmit(values);
      await submit(val);
      showSuccessToast(
        mode === "create" ? "Team member created!" : "Team member updated!"
      );
      reset();
      onClose();
      onDone?.();
    } catch (err: unknown) {
      showErrorToast((err as Error)?.message || "Operation failed");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50 p-4">
      <DialogBackdrop className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
      <div className="fixed inset-0 flex justify-end">
        <DialogPanel className="w-full text-sm max-w-xl m-2 bg-white overflow-hidden rounded-xl flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start p-6 pb-4 border-b border-gray-100">
            <DialogTitle className="text-xl font-semibold">
              {titleText}
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
            {mode === "edit" && loadingEdit ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading…
              </div>
            ) : (
              <form
                id="team-form"
                onSubmit={handleSubmit(onSubmitForm)}
                onError={(errors) => {
                  console.error("Form errors:", errors);
                }}
                className="flex flex-col gap-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      {...register("fullName")}
                      placeholder="Enter full name"
                      className="w-full border border-gray-300 p-3 rounded-md text-sm outline-none
                       focus:ring-2 focus:ring-[#758C5D]"
                    />
                    {errors.fullName && (
                      <span className="text-red-500 text-xs">
                        {errors.fullName.message}
                      </span>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-medium text-gray-700 mb-1">
                      Team Role
                    </label>
                    <select
                      {...register("teamRole")}
                      className="w-full border border-gray-300 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-[#758C5D]"
                    >
                      <option value="">Select role</option>
                      {teamRoles.map((r) => (
                        <option key={r} value={r}>
                          {r.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      {...register("roleTitle")}
                      className="w-full border border-gray-300 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-[#758C5D]"
                      placeholder="Senior UX Designer"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-medium text-gray-700 mb-1">
                      Manager (Reports To)
                    </label>
                    <select
                      {...register("manager")}
                      className="w-full border border-gray-300 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-[#758C5D]"
                    >
                      <option value="">
                        {loadingManagers ? "Loading…" : "Select manager"}
                      </option>
                      {managers?.map(
                        (m: {
                          _id: string;
                          firstName?: string;
                          lastName?: string;
                          email: string;
                        }) => (
                          <option key={m._id} value={m._id}>
                            {(m.firstName || "") + " " + (m.lastName || "")} —{" "}
                            {m.email}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-medium text-gray-700 mb-1">
                      Employment Type
                    </label>
                    <select
                      {...register("employmentType")}
                      className="w-full border border-gray-300 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-[#758C5D]"
                    >
                      <option value="">Select type</option>
                      {employmentTypes.map((e) => (
                        <option key={e} value={e}>
                          {e.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-1">
                      Work Hours
                    </label>
                    <input
                      type="number"
                    {...register("workHours", { valueAsNumber: true })} // <-- AÑADE ESTO
                      className="w-full border border-gray-300 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-[#758C5D]"
                      placeholder="40"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-1">
                      Contract Start
                    </label>
                    <input
                      type="date"
                      {...register("contractStart")}
                      className="w-full border border-gray-300 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-[#758C5D]"
                    />
                  </div>

                  {/* Contract End oculto/deshabilitado cuando es full_time */}
                  {employmentType !== "full_time" && (
                    <div className="md:col-span-2">
                      <label className="block font-medium text-gray-700 mb-1">
                        Contract End
                      </label>
                      <input
                        type="date"
                        {...register("contractEnd")}
                        className="w-full border border-gray-300 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-[#758C5D]"
                      />
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className="block font-medium text-gray-700 mb-1">
                      Work Email
                    </label>
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="Enter email"
                      className="w-full border border-gray-300 p-2 rounded-md text-sm outline-none focus:ring-2 focus:ring-[#758C5D]"
                    />
                    {errors.email && (
                      <span className="text-red-500 text-xs">
                        {errors.email.message}
                      </span>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-medium text-gray-700 mb-1">
                      Contact Number
                    </label>
                    <input
                      {...register("phone")}
                      placeholder="+1 555-555-5555"
                      className="w-full border border-gray-300 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-[#758C5D]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <select
                      {...register("country")}
                      disabled={loadingCountries}
                      className="w-full border border-gray-300 p-2 rounded-md text-sm outline-none focus:ring-2 focus:ring-[#758C5D]"
                    >
                      <option value="">
                        {loadingCountries ? "Loading..." : "Select country"}
                      </option>
                      {countries.map((c) => (
                        <option key={c.iso2} value={c.country}>
                          {c.country}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <select
                      {...register("state")}
                      className="w-full border border-gray-300 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-[#758C5D]"
                      disabled={!selectedCountry || loadingStates}
                    >
                      <option value="">
                        {loadingStates ? "Loading..." : "Select state"}
                      </option>
                      {states.map((s) => (
                        // Usa state.name para el valor, ya que es lo que espera la API de ciudades
                        <option key={s.state_code} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <select
                      {...register("city")}
                      disabled={!selectedState || loadingCities}
                      className="w-full border border-gray-300 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-[#758C5D]"
                    >
                      <option value="">
                        {loadingCities ? "Loading..." : "Select city"}
                      </option>
                      {cities.map((cityName) => (
                        <option key={cityName} value={cityName}>
                          {cityName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 mb-1">
                      Timezone
                    </label>
                    <select
                      {...register("timezone")}
                      className="w-full border border-gray-300 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-[#758C5D]"
                    >
                      <option value="">Select timezone</option>
                      {TIMEZONES.map((tz) => (
                        <option key={tz} value={tz}>
                          {tz}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-medium text-gray-700 mb-1">
                      Birthday
                    </label>
                    <input
                      type="date"
                      {...register("birthday")}
                      className="w-full border border-gray-300 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-[#758C5D]"
                    />
                  </div>

                  {/* Hobbies (antes tags) */}
                  <div className="md:col-span-2">
                    <label className="block font-medium text-gray-700 mb-1">
                      Hobbies (comma separated)
                    </label>
                    <input
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      className="w-full border border-gray-300 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-[#758C5D]"
                      placeholder="Surfing, Yoga, Painting"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-medium text-gray-700 mb-1">
                      Internal Notes
                    </label>
                    <textarea
                      rows={3}
                      {...register("description")}
                      className="w-full border border-gray-300 p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-[#758C5D]"
                    />
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-white">
            <div className="flex justify-between items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={busy || loadingEdit}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="team-form"
                disabled={busy || loadingEdit}
                className={clsx(
                  "flex-1 px-6 py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2 transition-colors",
                  "bg-[#5E6B66] text-white hover:bg-[#4b5a52]",
                  (busy || loadingEdit) && "opacity-50 cursor-not-allowed"
                )}
              >
                {(busy || loadingEdit) && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {mode === "create" ? "Save & Send Invite" : "Save Changes"}
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
