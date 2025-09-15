import { gql } from "@apollo/client";

export const CREATE_PLAN = gql`
  mutation CreatePlan($createPlanInput: CreatePlanInput!) {
    createPlan(createPlanInput: $createPlanInput) {
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
    }
  }
`;
