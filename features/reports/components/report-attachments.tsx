"use client";

import { forwardRef, useEffect, useEffectEvent, useImperativeHandle, useState } from "react";
import { Check, FileText, Upload, X } from "lucide-react";
import Uppy from "@uppy/core";
import AwsS3Multipart from "@uppy/aws-s3";
import { UppyContextProvider, useDropzone, useFileInput, useUppyEvent, useUppyState } from "@uppy/react";
import { reportsApi } from "@/features/reports/api/reports.api";
import { formatFileSize } from "@/lib/format";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_NUMBER_OF_FILES = 5;

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

  // release object URLs to avoid leaking memory
  const revokePreviewUrls = useEffectEvent(() => {
    Object.values(previewUrls).forEach((url) => URL.revokeObjectURL(url));
  });
  useEffect(() => {
    return () => revokePreviewUrls();
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
                <div className="relative shrink-0">
                  {previewUrls[file.id] ? (
                    <img
                      src={previewUrls[file.id]}
                      alt=""
                      className="size-10 rounded object-cover"
                    />
                  ) : (
                    <div className="flex size-10 items-center justify-center rounded bg-zinc-100 text-zinc-400">
                      <FileText className="size-4" />
                    </div>
                  )}
                  {file.progress.uploadComplete && (
                    <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
                      <Check className="size-2.5 text-white" strokeWidth={3} />
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-zinc-700">{file.name}</p>
                  <p className="text-xs text-zinc-400">{formatFileSize(file.size)}</p>
                  {file.progress.uploadStarted && !file.progress.uploadComplete && (
                    <div className="mt-1.5 h-1 max-w-48 overflow-hidden rounded-full bg-zinc-100">
                      <div
                        className="h-full bg-zinc-900"
                        style={{ width: `${file.progress.percentage ?? 0}%` }}
                      />
                    </div>
                  )}
                  {file.error && <p className="mt-1 text-xs text-red-500">{file.error}</p>}
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

export interface ReportAttachmentsHandle {
  upload: (reportId: number) => Promise<void>;
}

function createUppy() {
  return new Uppy({
    restrictions: {
      maxFileSize: MAX_FILE_SIZE,
      maxNumberOfFiles: MAX_NUMBER_OF_FILES,
      allowedFileTypes: ["image/*", ".pdf"],
    },
    autoProceed: false,
  }).use(AwsS3Multipart, {
    shouldUseMultipart: false,
    getUploadParameters: () => {
      throw new Error("Upload target requested before it was configured.");
    },
  });
}

export const ReportAttachments = forwardRef<ReportAttachmentsHandle>(function ReportAttachments(_props, ref) {
  const [uppy] = useState(createUppy);

  useImperativeHandle(
    ref,
    () => ({
      upload: async (reportId: number) => {
        const pendingFiles = uppy.getFiles();
        if (pendingFiles.length === 0) return;

        const uploadTargets = await reportsApi.getUploadUrls(
          reportId,
          pendingFiles.map((file) => ({
            filename: file.name,
            contentType: file.type,
            size: file.size ?? 0,
          }))
        );
        const targetByFileId = new Map(pendingFiles.map((file, index) => [file.id, uploadTargets[index]]));

        uppy.getPlugin("AwsS3Multipart")?.setOptions({
          getUploadParameters: (file) => {
            const target = targetByFileId.get(file.id);
            if (!target) throw new Error(`No upload URL for file "${file.name}".`);
            return {
              method: "PUT",
              url: target.uploadUrl,
            };
          },
        });

        await uppy.upload();

        const fileIdByKey = new Map(Array.from(targetByFileId, ([fileId, target]) => [target.key, fileId]));
        const { failed } = await reportsApi.confirmFiles(
          reportId,
          Array.from(fileIdByKey.keys())
        );

        if (failed.length > 0) {
          for (const key of failed) {
            const fileId = fileIdByKey.get(key);
            if (fileId) {
              uppy.setFileState(fileId, { error: "Upload could not be verified." });
            }
          }
          throw new Error(`${failed.length} file(s) failed verification.`);
        }
      },
    }),
    [uppy]
  );

  return (
    <UppyContextProvider uppy={uppy}>
      <AttachmentsDropzone uppy={uppy} />
    </UppyContextProvider>
  );
});