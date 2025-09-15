import { gql } from '@apollo/client';

export const GET_REQUEST_CHANGE_LOG = gql`
  query GetRequestChangeLog($requestId: ID!) {
    requestChangeLog(requestId: $requestId) {
      request
      createdAt
      updatedBy {
        firstName
        lastName
        avatarUrl
      }
      changedFields
      actionType
      snapshot {
        title
        details
        priority
        status
        dueDate
        internalDueDate
        assignees {
          firstName
          lastName
          avatarUrl
        }
        brand
        service
      }
    }
  }
`;
