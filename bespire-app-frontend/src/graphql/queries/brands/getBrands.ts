import { gql } from "@apollo/client";
export const GET_BRANDS = gql`
  query GetAllBrands($workspace: String!) {
    getAllBrands(workspace: $workspace) {
      _id
      name
      slug
      user
      workspace
      logos {
        url
        fileId
        name
      }
      fonts {
        name
        url
        category
        family
        fileId
      }
      primaryColors
      secondaryColors
      archetype
      description
      buyer
      tone
      likes
      dislikes
      createdAt
      updatedAt
    }
  }
`;
