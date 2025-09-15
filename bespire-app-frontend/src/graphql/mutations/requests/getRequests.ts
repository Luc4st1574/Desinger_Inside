import { gql } from '@apollo/client';

export const GET_REQUESTS = gql`
  query getRequestList($status: String) {
    getRequestList(status: $status) {
        id
    title
    createdAt
    category
    dueDate
    parentRequest
    assignees{
      id
      name
      avatarUrl
      teamRole
    }
    commentsCount
    attachmentsCount
    subtasksCount
    credits
    priority
    status
    
    }
  }
`;

export const GET_REQUESTS_BY_ADMIN = gql`
  query getRequestListByAdmin($userClientId: String!) {
    getRequestListByAdmin(userClientId: $userClientId) {
        id
        title
        createdAt
        category
        dueDate
        parentRequest
        assignees{
          id
          name
          avatarUrl
          teamRole
        }
        commentsCount
        attachmentsCount
        subtasksCount
        credits
        priority
        status
    }
  }
`;

