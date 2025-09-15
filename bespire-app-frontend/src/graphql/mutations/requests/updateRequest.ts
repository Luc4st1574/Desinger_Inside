import { gql } from '@apollo/client';

export const UPDATE_REQUEST = gql`
  mutation updateRequest($requestId: String!, $input: UpdateRequestInput!) {
    updateRequest(requestId: $requestId, input: $input)
  }
`;
