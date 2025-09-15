import { gql } from "@apollo/client";

export const GET_PLANS = gql`
  query GetPlans {
    findAllPlans {
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
