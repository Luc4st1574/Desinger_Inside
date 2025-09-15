import { gql } from "@apollo/client";

export const GET_PLAN_BY_ID = gql`
  query GetPlanById($id: ID!) {
    findPlanById(id: $id) {
      id
      name
      slug
      description
      stripePriceId
      price
      creditsPerMonth
      brandsAllowed
      activeOrdersAllowed
      includedServices
      excludedServices
      active
      icon
      bg
        createdAt
        updatedAt
    }
  }
`;
