import { gql } from '@apollo/client';

export const GET_COMMENTS_FOR_ENTITY = gql`
  query GetCommentsForEntity($linkedToId: ID!) {
    getCommentsForEntity(linkedToId: $linkedToId) {
      id
      user {
        id
        name
        avatarUrl
      }
      createdAt
      updatedAt
      text
    }
  }
`;
