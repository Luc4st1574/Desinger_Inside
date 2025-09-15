import { gql } from '@apollo/client';

export const GET_CLIENTS_LIST_ADMIN = gql`
  query getClientListAdmin {
    getClientListAdmin {
      id
      name
      email
      avatarUrl
      roleTitle
      workspaceId
      workspaceName
      companyId
      companyName
      plan {
        name
        icon
        bg
      }
      rating
      timeRequest
      revisions
      lastSession
      contractStart
      status
      workspaceRole
      isWorkspaceOwner
    }
  }
`;
