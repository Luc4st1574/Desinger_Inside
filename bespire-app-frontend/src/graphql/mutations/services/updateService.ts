import { gql } from "@apollo/client";

export const UPDATE_SERVICE = gql`
  mutation UpdateService($input: UpdateServiceInput!) {
    updateService(input: $input) {
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
