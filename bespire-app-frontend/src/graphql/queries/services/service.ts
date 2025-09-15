import { gql } from "@apollo/client";

export const GET_SERVICE = gql`
  query GetService($id: String!) {
    service(id: $id) {
      id
      title
      description
      credits
      status
      updatedAt
      category {
        id
        name
      }
      inclusions
      exclusions
    }
  }
`;
