/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { X, CheckCircle, Loader2, Download } from "lucide-react";
import clsx from "clsx";
import { uploadImageToBackend } from "@/services/imageService";
import { getFileIcon } from "@/utils/getFileIcon";

export interface UploadedFile {
  id?: string;
  file?: File;
  url?: string;
  progress: number;
  done: boolean;
  error?: boolean;
  name?: string;
  ext?: string;
  size?: number;
  uploadedBy?: string;
  uploadedAt?: string;
  fileId?: string;
}

type Props = {
  value?: UploadedFile[];
  onChange?: (files: UploadedFile[]) => void;
  name?: string;
  onDelete?: (file: UploadedFile) => void;
};

type LocalFile = UploadedFile & { tempId?: string };

const normalize = (list: UploadedFile[] = []): LocalFile[] =>
  list.map((f) => ({
    ...f,
    id: f.id ?? f.fileId,
    name: f.name ?? f.file?.name,
    size: f.size ?? f.file?.size,
    progress: f.progress ?? (f.url ? 100 : 0),
    done: f.done ?? !!f.url,
    error: f.error ?? false,
  }));

const shallowEqual = (a: LocalFile, b: LocalFile) =>
  a.url === b.url &&
  a.name === b.name &&
  a.fileId === b.fileId &&
  a.progress === b.progress &&
  a.done === b.done &&
  (a.error ?? false) === (b.error ?? false) &&
  (a.file?.name ?? null) === (b.file?.name ?? null) &&
  (a.file?.size ?? null) === (b.file?.size ?? null);

const makeId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

export default function FileUploader({
  value = [],
  onChange,
  name = "attachments",
  onDelete,
}: Props) {
  // Estado controlado-interno
  const [files, setFiles] = useState<LocalFile[]>(() => normalize(value));
  const syncingFromPropsRef = useRef(false);

  // 1) Sync props->state SOLO si cambió (para que al abrir en edit se vean los adjuntos)
  useEffect(() => {
    const next = normalize(value || []);
    const same =
      files.length === next.length &&
      files.every((f, i) => shallowEqual(f, next[i]));
    if (!same) {
      syncingFromPropsRef.current = true;
      setFiles(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // 2) Notificar al padre cuando cambia localmente (no cuando el cambio vino de props)
  useEffect(() => {
    if (syncingFromPropsRef.current) {
      syncingFromPropsRef.current = false;
      return;
    }
    onChange?.(files);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  // Animación "Done"
  const seenDoneRef = useRef<Set<string | number>>(new Set());
  const [showDone, setShowDone] = useState<(string | number)[]>([]);
  useEffect(() => {
    files.forEach((f, idx) => {
      const key = f.tempId ?? f.fileId ?? f.id ?? idx;
      if (f.done && !seenDoneRef.current.has(key)) {
        setShowDone((prev) => [...prev, key]);
        seenDoneRef.current.add(key);
        setTimeout(() => {
          setShowDone((prev) => prev.filter((k) => k !== key));
        }, 1000);
      }
      if (!f.done && seenDoneRef.current.has(key)) {
        seenDoneRef.current.delete(key);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files.map((f) => f.done).join("|")]);

  // Input file ref
  const inputRef = useRef<HTMLInputElement>(null);

  const humanFileSize = (bytes = 0) =>
    bytes < 1024
      ? `${bytes}b`
      : bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)}kb`
      : `${(bytes / 1024 / 1024).toFixed(1)}mb`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    // Staging con tempId (no índices)
    const staged: LocalFile[] = selected.map((f) => ({
      tempId: makeId(),
      file: f,
      progress: 0,
      done: false,
      error: false,
      url: "",
      name: f.name,
      size: f.size,
      id: undefined,
    }));

    setFiles((prev) => [...prev, ...staged]);

    // Subir por tempId
    for (const s of staged) {
      void uploadFile(s.tempId!, s.file!);
    }

    if (inputRef.current) inputRef.current.value = "";
  };

  async function uploadFile(tempId: string, file: File) {
    // progreso inicial
    setFiles((prev) =>
      prev.map((f) => (f.tempId === tempId ? { ...f, progress: 10 } : f))
    );

    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await uploadImageToBackend(formData);
      // éxito
      setFiles((prev) =>
        prev.map((f) =>
          f.tempId === tempId
            ? {
                ...f,
                progress: 100,
                done: true,
                url: res.url,
                id: res.fileId,
                fileId: res.fileId,
                  file: undefined, // 👈 esto oculta la barra y ahorra memoria
              }
            : f
        )
      );
    } catch (err) {
      // error
      setFiles((prev) =>
        prev.map((f) =>
          f.tempId === tempId
            ? { ...f, progress: 100, done: false, error: true }
            : f
        )
      );
    }
  }

  const handleRemove = async (idx: number) => {
    const toRemove = files[idx];
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    if (toRemove) {
      try {
        await onDelete?.(toRemove);
      } catch {
        // opcional: revertir si falla
        setFiles((prev) => {
          const cp = [...prev];
          cp.splice(idx, 0, toRemove);
          return cp;
        });
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="font-medium text-sm">Attachments</label>
        <button
          type="button"
          className="text-xs text-[#758C5D] mt-1 px-2 py-1 rounded border border-[#758C5D] hover:bg-[#F1F3EE]"
          onClick={() => inputRef.current?.click()}
        >
          Add +
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={handleFileChange}
        />
      </div>

      <div className="flex flex-col rounded-lg ">
        {files.map((f, idx) => {
          const fileName = f.file?.name ?? f.name ?? "Unknown file";
          const fileSize = f.file?.size ?? f.size ?? 0;
          const key = f.tempId ?? f.fileId ?? f.id ?? idx;

          return (
            <div
              key={key}
              className={clsx(
                "flex items-center gap-2 px-4 relative min-h-[64px] transition-all ",
                f.done && !showDone.includes(key)
                  ? "bg-white border border-gray-200 rounded-lg mb-2"
                  : "bg-[#F6F7F7]"
              )}
              style={{ minHeight: "64px" }}
            >
              <img src={getFileIcon(fileName)} className="w-8 h-8" alt="" />

              {/* INFO */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-base truncate">{fileName}</div>
                <div className="flex items-center gap-3 text-sm mt-1">
                  <span className="text-[#454D48]">
                    {humanFileSize(fileSize)}
                  </span>

                  {f.file && !f.done && !f.error && f.progress < 100 && (
                    <div className="h-2 rounded bg-[#DFE8DF] mt-2 overflow-hidden">
                      <div
                        className="h-2 rounded bg-[#6C8C68] transition-all"
                        style={{ width: `${f.progress}%` }}
                      />
                    </div>
                  )}

                  {f.done && showDone.includes(key) && (
                    <span className="flex items-center gap-1 text-[#56704B] ml-1 font-medium">
                      <CheckCircle className="w-5 h-5" /> Done
                    </span>
                  )}

                  {f.error && (
                    <span className="flex items-center gap-1 text-red-600 ml-1 font-medium">
                      Error uploading
                    </span>
                  )}
                </div>

                {f.file && (
                  <div className="h-2 rounded bg-[#DFE8DF] mt-2 overflow-hidden">
                    <div
                      className="h-2 rounded bg-[#6C8C68] transition-all"
                      style={{ width: `${f.progress}%` }}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {f.url && (
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600 ml-2"
                    title="Download"
                  >
                    <Download size={20} />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="text-gray-400 hover:text-red-600"
                  title="Remove"
                >
                  <X size={22} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
