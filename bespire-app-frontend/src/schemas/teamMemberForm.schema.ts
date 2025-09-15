// schemas/teamMemberForm.schema.ts
import { z } from "zod";

export const employmentTypes = ["full_time", "part_time", "contractor"] as const;
export type EmploymentType = typeof employmentTypes[number];

export const teamRoles = [
  "designer",
  "success_manager",
  "product_manager",
  "creative_director",
  "project_manager",
  "data_analyst",
  "marketing",
  "frontend_dev",
  "backend_dev",
  "qa",
] as const;
export type TeamRole = typeof teamRoles[number];
export const memberWorkspaceRoles = ["admin", "user", "viewer"] as const;
export const teamMemberFormSchema = z.object({
  mode: z.enum(["create", "edit"]).default("create"),
  // User basics
  email: z.string().email("Invalid email"),
  fullName: z.string().min(1, "Required"),
  teamRole: z.enum(teamRoles).optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),

  // Profile
  roleTitle: z.string().optional(),
  manager: z.string().optional().or(z.literal("")),             // userId
  employmentType: z.enum(employmentTypes).optional(),
  contractStart: z.string().optional(),
    workHours: z.coerce // <-- Le dices a Zod que intente convertir el tipo
    .number({ invalid_type_error: "Must be a number" }) // Mensaje de error si la conversión falla (ej. si escriben "abc")
    .min(0, "Cannot be negative")
    .optional()
    .or(z.literal("")), // Permite que el campo esté vacío

  contractEnd: z.string().optional(),
  timezone: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  birthday: z.string().optional(),
  tags: z.array(z.string()).default([]),
  description: z.string().optional(),
}).superRefine((val, ctx) => {
  // Si es full_time, contractEnd debe venir vacío
  if (val.employmentType === "full_time" && val.contractEnd) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["contractEnd"], message: "Full-time members shouldn't have Contract End" });
  }
  // Si hay start y end, end >= start
  if (val.contractStart && val.contractEnd && val.contractEnd < val.contractStart) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["contractEnd"], message: "Contract End must be after Start" });
  }
});

export type TeamMemberFormValues = z.infer<typeof teamMemberFormSchema>;
