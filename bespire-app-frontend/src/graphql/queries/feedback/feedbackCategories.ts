import { gql } from "@apollo/client";

export const GET_FEEDBACK_CATEGORIES = gql`
  query FindAllFeedbackCategories {
    findAllFeedbackCategories {
      id
      name
      description
      status
    }
  }
`;
