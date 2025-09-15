import { gql } from "@apollo/client";

export const DELETE_SERVICE = gql`
  mutation RemoveService($id: String!) {
    removeService(id: $id) {
      id
    }
  }
`;
