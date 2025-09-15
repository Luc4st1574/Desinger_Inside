import { gql } from "@apollo/client";

export const GET_TEAM_MEMBER_BY_ID = gql`
  query getTeamMemberDetail($id: String!) {
    getTeamMemberDetail(id: $id) {
      id
      fullName
      firstName
      lastName
      email
      teamRole
      roleMember
      title
      avatarUrl
      description
      manager {
        id
        fullName
        email
        avatarUrl
      }
      contractStart
      contractEnd
      employmentType
      timezone
      country
      state
      city
      workHours
      phone
      birthday
      isActive
      tags
    }
  }
`;
