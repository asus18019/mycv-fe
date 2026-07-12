"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import Uppy from "@uppy/core";
import { UppyContextProvider, useDropzone, useFileInput, useUppyEvent, useUppyState } from "@uppy/react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_NUMBER_OF_FILES = 5;

function formatFileSize(bytes: number | null): string {
  if (bytes === null) return "";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(1)} ${units[unitIndex]}`;
}

function AttachmentsDropzone({ uppy }: { uppy: Uppy }) {
  const { getRootProps, getInputProps } = useDropzone();
  const { getInputProps: getFileInputProps, getButtonProps } = useFileInput();
  const files = useUppyState(uppy, (state) => Object.values(state.files));
  const [restrictionError, setRestrictionError] = useState<string | null>(null);
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

  useUppyEvent(uppy, "restriction-failed", (_file, error) => {
    setRestrictionError(error.message);
  });
  useUppyEvent(uppy, "files-added", (addedFiles) => {
    if (addedFiles.length === 0) return;
    setRestrictionError(null);
    setPreviewUrls((prev) => {
      const next = { ...prev };
      for (const file of addedFiles) {
        if (!file.isRemote && file.data && file.type.startsWith("image/")) {
          next[file.id] = URL.createObjectURL(file.data);
        }
      }
      return next;
    });
  });
  useUppyEvent(uppy, "file-removed", (file) => {
    setPreviewUrls((prev) => {
      if (!(file.id in prev)) return prev;
      const next = { ...prev };
      URL.revokeObjectURL(next[file.id]);
      delete next[file.id];
      return next;
    });
  });

  const previewUrlsRef = useRef(previewUrls);
  useEffect(() => {
    previewUrlsRef.current = previewUrls;
  });
  useEffect(() => {
    return () => {
      Object.values(previewUrlsRef.current).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-zinc-300 px-4 py-8 text-center hover:border-zinc-400 hover:bg-zinc-50"
      >
        <Upload className="mb-2 size-5 text-zinc-300" />
        <p className="text-sm text-zinc-500">
          Drag files here, or{" "}
          <button
            {...getButtonProps()}
            className="cursor-pointer font-medium text-zinc-900 underline underline-offset-2 hover:text-zinc-700"
          >
            browse
          </button>
        </p>
        <p className="mt-1 text-xs text-zinc-400">
          Images or PDF, up to {formatFileSize(MAX_FILE_SIZE)} each, 5 files max.
        </p>
        <input {...getInputProps()} className="hidden" />
        <input {...getFileInputProps()} className="hidden" />
      </div>

      {restrictionError && <p className="text-xs text-red-500">{restrictionError}</p>}

      {files.length > 0 && (
        <ul className="divide-y divide-zinc-200 rounded-md border border-zinc-200">
          {files.map((file) => (
            <li key={file.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
              <div className="flex min-w-0 items-center gap-3">
                {previewUrls[file.id] ? (
                  <img
                    src={previewUrls[file.id]}
                    alt=""
                    className="size-10 shrink-0 rounded object-cover"
                  />
                ) : (
                  <div className="flex size-10 shrink-0 items-center justify-center rounded bg-zinc-100 text-zinc-400">
                    <FileText className="size-4" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-zinc-700">{file.name}</p>
                  <p className="text-xs text-zinc-400">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => uppy.removeFile(file.id)}
                className="cursor-pointer p-1 text-zinc-400 hover:text-zinc-700"
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ReportAttachments() {
  const [uppy] = useState(() =>
    new Uppy({
      restrictions: {
        maxFileSize: MAX_FILE_SIZE,
        maxNumberOfFiles: MAX_NUMBER_OF_FILES,
        allowedFileTypes: ["image/*", ".pdf"],
      },
      autoProceed: false,
    })
    // TODO: add an upload plugin (e.g. @uppy/xhr-upload) once the backend
    // exposes an attachment upload endpoint for reports, then call
    // uppy.upload() after the report is created.
  );

  return (
    <UppyContextProvider uppy={uppy}>
      <AttachmentsDropzone uppy={uppy} />
    </UppyContextProvider>
  );
}