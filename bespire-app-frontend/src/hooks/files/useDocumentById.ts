import { GET_FILE_BY_ID } from "@/graphql/queries/files/getFolderInfo";
import { useQuery } from "@apollo/client";

export function useDocumentById(fileId?: string) {
    const { data, loading, error } = useQuery(GET_FILE_BY_ID, {
        variables: { fileId },
        skip: !fileId,
    });
    return {
        document: data?.getFileById,
        loading,
        error,
    };
}
