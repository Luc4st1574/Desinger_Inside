/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/team/useTeamMember.ts
import { useMutation, useQuery } from "@apollo/client";
import { useMemo } from "react";
import { TeamMemberFormValues } from "@/schemas/teamMemberForm.schema";
import { GET_MANAGERS_MINI } from "@/graphql/queries/team/getManagersMini";
import { CREATE_TEAM_MEMBER, GET_TEAM_MEMBER_FOR_EDIT, UPDATE_USER_BASIC, UPSERT_TEAM_MEMBER_PROFILE } from "@/graphql/mutations/team/team";

export function useTeamMember(userId?: string) {
  const { data: managersData, loading: loadingManagers } = useQuery(GET_MANAGERS_MINI, {
    fetchPolicy: "cache-and-network",
  });

  const { data: editData, loading: loadingEdit } = useQuery(GET_TEAM_MEMBER_FOR_EDIT, {
    skip: !userId,
    variables: { userId },
    fetchPolicy: "cache-and-network",
  });

  const [createUser, { loading: creating }] = useMutation(CREATE_TEAM_MEMBER);
  const [upsertProfile, { loading: savingProfile }] = useMutation(UPSERT_TEAM_MEMBER_PROFILE);
  const [updateUserBasic, { loading: updatingUser }] = useMutation(UPDATE_USER_BASIC);

  const managers = useMemo(() => {
    const list = managersData?.teamMembersMini ?? [];
    // No te pongas como tu propio manager en edición
    return userId ? list.filter((m: any) => m._id !== userId) : list;
  }, [managersData, userId]);

  const defaults = useMemo(() => {
    if (!editData) return null;
    const u = editData.GetUserTeamMember ?? {};
    const p = editData.teamMemberProfileByUser ?? {};
    return {
      email: u.email ?? "",
      fullName: u.fullName ?? "",
      teamRole: u.teamRole ?? undefined,
      avatarUrl: u.avatarUrl ?? "",
      roleTitle: u.title ?? "",
      manager: p.manager ?? "",
      employmentType: p.employmentType ?? undefined,
      contractStart: p.contractStart ? new Date(p.contractStart).toISOString().slice(0,10) : "",
      contractEnd: p.contractEnd ? new Date(p.contractEnd).toISOString().slice(0,10) : "",
      timezone: p.timezone ?? "",
      country: p.country ?? "",
      state: p.state ?? "",
      city: p.city ?? "",
      phone: p.phone ?? "",
      birthday: p.birthday ? new Date(p.birthday).toISOString().slice(0,10) : "",
      workHours: p.workHours ?? 0,
      tags: p.tags ?? [],
      description: p.description ?? "",
    };
  }, [editData]);

  async function submit(values: TeamMemberFormValues) {
    // Normalizar arrays desde inputs de texto (si hiciste chips, ya serán arrays)
    const tags = (values.tags || []).map(t => t.trim()).filter(Boolean);

    let effectiveUserId = userId;

    if (values.mode === "create") {
      const res = await createUser({
        variables: {
          input: {
            email: values.email,
            fullName: values.fullName,
            teamRole: values.teamRole,
            titleRole: values.roleTitle,
            avatarUrl: values.avatarUrl || null,
          },
        },
      });
      effectiveUserId = res?.data?.createTeamMember?._id;
    } else {
      await updateUserBasic({
        variables: {
          userId,
          input: {
            email: values.email,
            fullName: values.fullName,
            teamRole: values.teamRole,
            titleRole: values.roleTitle,
            avatarUrl: values.avatarUrl || null,
          },
        },
      });
    }

    if (!effectiveUserId) throw new Error("UserId not available after create/update");

    await upsertProfile({
      variables: {
        input: {
          user: effectiveUserId,
          manager: values.manager || null,
          employmentType: values.employmentType || null,
          contractStart: values.contractStart || null,
          contractEnd: values.contractEnd || null,
          timezone: values.timezone || null,
          country: values.country || null,
          state: values.state || null,
          city: values.city || null,
          phone: values.phone || null,
          birthday: values.birthday || null,
          workHours: values.workHours || 0,
          tags,
          description: values.description || null,
        },
      },
    });

    return effectiveUserId;
  }

  return {
    managers,
    loadingManagers,
    loadingEdit,
    defaults,
    submit,
    busy: creating || savingProfile || updatingUser,
  };
}
