import { gql } from '@apollo/client';

export const GET_CLIENT_STATS_BY_PERIOD = gql`
  query GetClientStatsByPeriod($id: ID!, $period: String!) {
    getClientStats(id: $id, period: $period) {
      hoursLogged
      credits
      timePerRequest
      responseTime
      taskVolume
      revisionsPerTask
      rating
      lastSession
    }
  }
`;
