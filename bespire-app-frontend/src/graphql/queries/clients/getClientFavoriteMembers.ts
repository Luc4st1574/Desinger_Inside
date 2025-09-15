import { gql } from '@apollo/client';

export const GET_CLIENT_FAVORITE_MEMBERS = gql`
  query GetClientFavoriteMembers($id: String!) {
    GetClientFavoriteMembers(clientId: $id) {
    id
      name
      role
      rating
      services
      avatar
    }
  }
`;
