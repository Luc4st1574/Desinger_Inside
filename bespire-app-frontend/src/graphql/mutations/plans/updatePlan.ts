import { gql } from "@apollo/client";

export const UPDATE_PLAN = gql`
  mutation UpdatePlan($updatePlanInput: UpdatePlanInput!) {
    updatePlan(updatePlanInput: $updatePlanInput) {
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
