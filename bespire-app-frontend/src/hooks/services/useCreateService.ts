import { useMutation } from "@apollo/client";
import { CREATE_SERVICE } from "@/graphql/mutations/services/createService";
import { GET_SERVICES } from "@/graphql/queries/services/services";

export interface CreateServiceInput {
  title: string;
  categoryId: string;
  credits: number;
  inclusions?: string[];
  exclusions?: string[];
  description?: string;
}

export interface Service {
  id: string;
  title: string;
  description?: string;
  credits: number;
  status: "active" | "inactive";
  inclusions?: string[];
  exclusions?: string[];
  updatedAt?: string;
  category: {
    id: string;
    name: string;
  };
}

export function useCreateService() {
  const [createService, { loading, error }] = useMutation(CREATE_SERVICE);

  const create = async (input: CreateServiceInput) => {
    try {
      const { data } = await createService({
        variables: { input },
        refetchQueries: [{
            query: GET_SERVICES
        }],
      });
      return data?.createService;
    } catch (err) {
      throw err;
    }
  };

  return {
    create,
    loading,
    error,
  };
}
