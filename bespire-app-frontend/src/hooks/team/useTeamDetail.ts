import { GET_TEAM_MEMBER_BY_ID } from "@/graphql/queries/team/GetTeamMemberById";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";

export interface TeamMemberDetail {
  id: string;
  email: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  teamRole?: string;
  //role
  roleMember?: string;
  //titleRole
  title?: string;
  //avatarUrl
  avatarUrl?: string;
  description?: string;
  //avatarUrl
  manager?: TeamMemberDetail;
  contractStart?: Date;
  contractEnd?: Date;
  employmentType?: string;
  timezone?: string; // “America/Los_Angeles”
  location?: string;
  phone?: string; // si no quieres mezclar con User.contactNumber
  birthday?: Date;
  isActive?: boolean;
  tags?: string[]; // chips
}

export const useTeamDetail = (
  teamId?: string | number,
  options?: { enabled?: boolean }
) => {
  const enabled = options?.enabled ?? true;

  const { data, loading, error, refetch } = useQuery(GET_TEAM_MEMBER_BY_ID, {
    variables: { id: teamId },
    skip: !enabled || !teamId,
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  useEffect(() => {
    if (enabled && teamId) {
      refetch?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, enabled]);

  const client: TeamMemberDetail | undefined = data?.getTeamMemberDetail;

  return { client, loading, error, refetch };
};

export default useTeamDetail;
