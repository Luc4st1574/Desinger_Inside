import { gql } from "@apollo/client";

export const GET_CLIENT_BY_ID = gql`
  query GetClientById($id: String!) {
    getClient(id: $id) {
      id
      name
      email
      phone
      website
      location
      timezone
      role
      organization
      workspaceId
      plan {
        name
        icon
      }
      contractStart
      contractRenew
      successManager
      companyId
      companyData {
        _id
        name
        website
        industry
        size
        logoUrl
        location
        brandArchetype
        communicationStyle
        elevatorPitch
        mission
        vision
        valuePropositions
        notes
        contactNumber
        countryCode
      }
        phrases
    }
  }
`;
