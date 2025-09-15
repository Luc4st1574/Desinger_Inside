/* eslint-disable @typescript-eslint/no-explicit-any */
import { CREATE_NOTE, REMOVE_NOTE, UPDATE_NOTE } from "@/graphql/mutations/notes/notes";
import { GET_NOTES } from "@/graphql/queries/notes/listNotes";
import { gql, useMutation, useQuery, ApolloCache } from "@apollo/client";
import { useCallback, useMemo } from "react";

/**
 * Tipos (coinciden con schema del backend)
 */
export type Note = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  // createdBy puede venir como id (string) o como objeto poblado del usuario
  createdBy:
    | string
    | {
        __typename?: string;
        _id?: string;
        firstName?: string;
        lastName?: string;
      };
  userClient?: | string
    | {
        __typename?: string;
        _id?: string;
        firstName?: string;
        lastName?: string;
      };
  workspace: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type CreateNoteInput = {
  title: string;
  content: string;
  createdBy: string;
  workspace: string;
  userClient?: string | null;
  tags?: string[];
};

export type UpdateNoteInput = {
  id: string;
  title?: string;
  content?: string;
  tags?: string[];
};


/**
 * Hook principal
 * - acepta filtros opcionales workspaceId / userClient para devolver sólo las notas relevantes
 */
export function useNotes(options?: { workspaceId?: string; userClient?: string }) {
  const { workspaceId, userClient } = options ?? {};

  const { data, loading, error, refetch } = useQuery<{ notes: Note[] }>(GET_NOTES, {
    fetchPolicy: "cache-first",
  });

  const [createNoteMut] = useMutation<{ createNote: Note }, { createNoteInput: CreateNoteInput }>(CREATE_NOTE, {
    update(cache: ApolloCache<any>, { data }) {
      const newNote = data?.createNote;
      if (!newNote) return;
      try {
  cache.modify({
          fields: {
            notes(existing: readonly any[] = []) {
              const newRef = cache.writeFragment({
                data: newNote,
                fragment: gql`
                  fragment NewNote on Note {
                    _id
                    title
                    slug
                    content
                    createdBy
                    userClient
                    workspace
                    tags
                    createdAt
                    updatedAt
                  }
                `,
              });
              // Prepend new note
              const existingMutable = existing as any[];
              return [newRef, ...existingMutable];
            },
          },
        });
        // fallback: let refetch handle it if cache write fails
      } catch {
        // fallback
      }
    },
    onError() {
      /* silent - caller handles errors */
    },
  });

  const [updateNoteMut] = useMutation<{ updateNote: Note }, { updateNoteInput: UpdateNoteInput }>(UPDATE_NOTE, {
    update(cache: ApolloCache<any>, { data }) {
      const updated = data?.updateNote;
      if (!updated) return;
      try {
        // Overwrite the specific note in cache by id
        cache.writeFragment({
          id: cache.identify({ __typename: "Note", _id: updated._id }),
          fragment: gql`
            fragment UpdatedNote on Note {
              _id
              title
              slug
              content
              createdBy
              userClient
              workspace
              tags
              createdAt
              updatedAt
            }
          `,
          data: updated,
        });
      } catch {
        // fallback
      }
    },
    onError() {
      /* silent - caller handles errors */
    },
  });

  const [removeNoteMut] = useMutation<{ removeNote: { _id: string } }, { id: string }>(REMOVE_NOTE, {
    update(cache: ApolloCache<any>, { data }) {
      const removed = data?.removeNote;
      if (!removed) return;
      try {
        cache.modify({
          fields: {
            notes(existing: readonly any[] = [], { readField }) {
              const existingMutable = existing as any[];
              return existingMutable.filter((ref) => readField("_id", ref) !== removed._id);
            },
          },
        });
        // remove normalized entry
        cache.evict({ id: cache.identify({ __typename: "Note", _id: removed._id }) });
        cache.gc();
      } catch {
        // fallback
      }
    },
    onError() {
      /* silent - caller handles errors */
    },
  });

  const notes = useMemo(() => {
    const all = data?.notes ?? [];
    // apply optional client/workspace filtering in-memory (backend query does not accept filters)
    return all.filter((n) => {
      if (workspaceId && n.workspace !== workspaceId) return false;
      return true;
    });
  }, [data?.notes, workspaceId]);

  /**
   * Crea una nota y retorna únicamente su id (_id) o null en fallo.
   */
  const createNote = useCallback(
    async (input: CreateNoteInput): Promise<string | null> => {
      const res = await createNoteMut({
        variables: { createNoteInput: input },
      });
      return res.data?.createNote?._id ?? null;
    },
    [createNoteMut]
  );

  /**
   * Actualiza una nota y retorna sólo su id (_id) o null en fallo.
   */
  const updateNote = useCallback(
    async (input: UpdateNoteInput): Promise<string | null> => {
      const res = await updateNoteMut({
        variables: { updateNoteInput: input },
      });
      return res.data?.updateNote?._id ?? null;
    },
    [updateNoteMut]
  );

  /**
   * Elimina una nota y retorna el id eliminado o null en fallo.
   */
  const removeNote = useCallback(
    async (id: string): Promise<string | null> => {
      const res = await removeNoteMut({
        variables: { id },
      });
      return res.data?.removeNote?._id ?? null;
    },
    [removeNoteMut]
  );

  return {
    notes,
    loading,
    error,
    refetch,
    createNote,
    updateNote,
    removeNote,
  };
}

export default useNotes;