import { gql } from "@apollo/client";

export const GET_TEAM_LIST_ADMIN = gql`
  query getTeamListAdmin {
    getTeamListAdmin {
      id
      name
      email
      avatarUrl
      roleTitle
      rating
      kpi
      tasks
      workHours
      timeRequest
      acceptTime
      response
      revisions
      lateRate
    }
  }
`;
