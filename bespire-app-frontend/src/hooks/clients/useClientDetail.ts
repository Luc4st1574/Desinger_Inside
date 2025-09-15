/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@apollo/client';
import { GET_CLIENT_BY_ID } from '../../graphql/queries/clients/getClientById';
import { useEffect } from 'react';

export interface ClientDetail {
  id: string | number;
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  location?: string;
  timezone?: string;
  role?: string;
  organization?: string;
  plan?: { name?: string; icon?: string };
  contractStart?: string;
  contractRenew?: string;
  successManager?: string;
  companyId?: string
  companyData?: any;
  workspaceId?: string;
  phrases?: string[];

}

export const useClientDetail = (clientId?: string | number, options?: { enabled?: boolean }) => {
  const enabled = options?.enabled ?? true;

  const { data, loading, error, refetch } = useQuery(GET_CLIENT_BY_ID, {
    variables: { id: clientId },
    skip: !enabled || !clientId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  useEffect(() => {
    if (enabled && clientId) {
      refetch?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId, enabled]);

  const client: ClientDetail | undefined = data?.getClient;

  return { client, loading, error, refetch };
};

export default useClientDetail;
