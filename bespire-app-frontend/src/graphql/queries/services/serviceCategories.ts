import { gql } from "@apollo/client";

export const GET_SERVICE_CATEGORIES = gql`
  query GetServiceCategories {
    serviceCategories {
      id
      name
    }
  }
`;
