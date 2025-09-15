/* eslint-disable @typescript-eslint/no-explicit-any */
import { UPDATE_CLIENT_COMPANY } from '@/graphql/mutations/clients/updateClientCompany';
import { GET_CLIENT_BY_ID } from '@/graphql/queries/clients/getClientById';
import { useMutation } from '@apollo/client';

export const useUpdateClientCompany = () => {
  const [updateClientMutation, { loading, error, data }] = useMutation(UPDATE_CLIENT_COMPANY, {
    errorPolicy: 'all',
  });

  // ahora acepta companyId (id de la compañía que se actualiza) y opcionalmente clientId
  // (id del cliente/usuario para hacer refetch del query GET_CLIENT_BY_ID)
  const updateClientCompany = async (
    companyId: string | number,
    input: Record<string, unknown>,
    clientId?: string | number
  ): Promise<string | null> => {
    //limpiar el input por si viene conn el campo _id 
    if ((input as any)._id) {
      delete (input as any)._id;
    }
    if ((input as any).__typename) {
      delete (input as any).__typename;
    }
    const variables = { id: companyId, input };
    // Ejecutar la mutación. Si nos pasaron clientId, forzamos refetch de GET_CLIENT_BY_ID con ese id
    const mutationOptions: any = { variables };
    if (clientId) {
      mutationOptions.refetchQueries = [
        { query: GET_CLIENT_BY_ID, variables: { id: clientId } },
      ];
      mutationOptions.awaitRefetchQueries = true;
    }
    const res = await updateClientMutation(mutationOptions);
    return res?.data?.updateCompany ?? null;
  };

  const result: string | null = data?.updateCompany ?? null;

  return { updateClientCompany, loading, error, result };
};

export default useUpdateClientCompany;
