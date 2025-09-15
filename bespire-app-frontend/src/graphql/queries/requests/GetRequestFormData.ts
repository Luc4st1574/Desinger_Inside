import { gql } from "@apollo/client";

export const GET_REQUEST_FORM_DATA = gql`
  query GetRequestFormData($workspaceId: String!) {
    serviceCategories {
      id
      name
      description
    }

    services {
      id
      title
      credits
      category {
        id
        name
      }
    }

    brandsForWorkspace(workspaceId: $workspaceId) {
      _id
      name
    }
  }
`;
