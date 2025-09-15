import { gql } from '@apollo/client';

export const UPDATE_CLIENT_COMPANY = gql`
  mutation updateCompany($id: String!, $input: UpdateCompanyInput!) {
    updateCompany(id: $id, input: $input)
  }
`;
