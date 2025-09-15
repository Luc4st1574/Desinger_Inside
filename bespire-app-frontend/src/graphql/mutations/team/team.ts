import { gql } from "@apollo/client";

export const CREATE_TEAM_MEMBER = gql`
  mutation CreateTeamMember($input: CreateTeamMemberByAdmin!) {
    createTeamMember(input: $input) {
      _id
      email
      fullName
    }
  }
`;

export const UPSERT_TEAM_MEMBER_PROFILE = gql`
  mutation UpsertTeamMemberProfile($input: UpsertTeamMemberProfileInput!) {
    upsertTeamMemberProfile(input: $input) {
      _id
      user
      manager
      employmentType
      contractStart
      contractEnd
      timezone
      country
      state
      city
      phone
      birthday
      workHours
      tags
      description
    }
  }
`;

export const GET_TEAM_MEMBER_FOR_EDIT = gql`
  query GetUserTeamMember($userId: ID!) {
    GetUserTeamMember(userId: $userId) {
      id
      email
      fullName
      teamRole
      title
      avatarUrl
    }
    teamMemberProfileByUser(userId: $userId) {
      _id
      user
      manager
      employmentType
      contractStart
      contractEnd
      timezone
      country
      state
      city
      phone
      birthday
      workHours
      tags
      description
    }
  }
`;

//UPDATE_USER_BASIC

export const UPDATE_USER_BASIC = gql`
  mutation UpdateUserBasicByAdmin($userId: ID!, $input: UpdateUserBasicInput!) {
    updateUserBasicByAdmin(userId: $userId, input: $input) {
      _id
    }
  }
`;
