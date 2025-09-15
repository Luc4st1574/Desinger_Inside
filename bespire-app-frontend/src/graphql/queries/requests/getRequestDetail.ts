import { gql } from "@apollo/client";

export const GET_REQUEST_DETAIL = gql`
  query GetRequestDetail($id: String!) {
    requestDetail(id: $id) {
      id
      title
      details
      priority
      status
      parentRequest
      client {
        id
        name
        avatar
      }
      requester {
        id
        name
        avatarUrl
        teamRole
      }
      assignees {
        id
        name
        avatarUrl
        teamRole
      }
      createdAt
      dueDate
      internalDueDate
      timeSpent {
        hours
        minutes
      }
      service {
        id
        title
        category {
          id
          name
        }
      }
      credits
      links {
        title
        favicon
        url
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
      subtasks {
        id
        title
        status
        dueDate
        assignees {
          id
          name
          avatarUrl
          teamRole
        }
      }
     
    }
  }
`;
