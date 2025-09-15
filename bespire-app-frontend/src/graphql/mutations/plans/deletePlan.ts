import { gql } from "@apollo/client";

export const DELETE_PLAN = gql`
  mutation RemovePlan($id: ID!) {
    removePlan(id: $id) {
      id
    }
  }
`;
