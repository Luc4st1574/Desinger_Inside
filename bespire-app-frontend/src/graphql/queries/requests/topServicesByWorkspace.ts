import { gql } from "@apollo/client";

export const GET_TOP_SERVICES_BY_WORKSPACE = gql`
  query TopServicesByWorkspace($workspaceId: String!) {
    topServicesByWorkspace(workspaceId: $workspaceId) {
      _id
      Type
      count
    }
  }
`;
