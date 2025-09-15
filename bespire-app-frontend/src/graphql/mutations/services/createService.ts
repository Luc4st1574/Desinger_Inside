import { gql } from "@apollo/client";

export const CREATE_SERVICE = gql`
  mutation CreateService($input: CreateServiceInput!) {
    createService(input: $input) {
      id
      title
      description
      credits
      status
      inclusions
      exclusions
      updatedAt
      category {
        id
        name
      }
    }
  }
`;
