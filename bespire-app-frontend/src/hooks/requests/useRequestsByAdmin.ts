import { GET_REQUESTS_BY_ADMIN } from "@/graphql/mutations/requests/getRequests";
import { useQuery } from "@apollo/client";
/**
 * Hook para obtener las solicitudes por administrador
 * Utiliza la query GET_REQUESTS_BY_ADMIN para obtener la lista de solicitudes
 */
interface UseRequestsByAdminProps {
    userClientId: string;
}

/**
 * Hook para obtener las solicitudes por administrador
 * Utiliza la query GET_REQUESTS_BY_ADMIN para obtener la lista de solicitudes
 * Requiere el parámetro userClientId
 */
export function useRequestsByAdmin({ userClientId }: UseRequestsByAdminProps) {


    
    const { data, loading, error, refetch } = useQuery(GET_REQUESTS_BY_ADMIN, {
        variables: { userClientId },
        skip: !userClientId,
    });

    const requests = data?.getRequestListByAdmin || [];

    return {
        requests,
        loading,
        error,
        refetch,
    };
}
