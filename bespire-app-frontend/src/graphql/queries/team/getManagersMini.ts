import { gql } from "@apollo/client";

export const GET_MANAGERS_MINI = gql`
query GetTeamManagersMini {
  teamMembersMini {
    _id
    firstName
    lastName
    email
  }
}

`;
