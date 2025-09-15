import { gql } from '@apollo/client';

export const FIND_REQUEST_BY_ID = gql`
  query findRequestById($id: String!) {
    findRequestById(id: $id) {
      title
      details
      brand
      workspace
      service {
        id
        title
        category {
          id
          name
        }
      }
      dueDate
      priority
      links {
        url
        title
        favicon
      }
      attachments {
        id
        name
        url
        ext
        size
        uploadedBy
        uploadedAt
      }
      parentRequest
    }
  }
`;
