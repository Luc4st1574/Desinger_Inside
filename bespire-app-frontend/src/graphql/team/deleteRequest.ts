import { gql } from '@apollo/client';

export const DELETE_REQUEST = gql`
  mutation deleteRequest($id: String!) {
    deleteRequest(id: $id)
  }
`;

export default DELETE_REQUEST;
