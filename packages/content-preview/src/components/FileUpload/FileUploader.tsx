import Dropzone from "react-dropzone";
import { useState } from "react";
import { uploadFile } from "../../services/Asset";
import type { UploadedFile } from "./types";

type Props = {
  addFiles: (files: UploadedFile[]) => void;
};

const FileUpload: React.FC<Props> = ({ addFiles }) => {
  const [loading, setLoading] = useState(false);
  const onDrop = async (acceptedFiles: File[]) => {
    setLoading(true);
    const newFiles = await Promise.all(
      acceptedFiles.map(async (file) => {
        const result = await uploadFile({
          fileName: file.name,
          contentType: file.type,
          file: await file.arrayBuffer(),
        });
        return {
          id: result.sys.id,
          name: file.name,
          size: file.size,
          url: "https:" + result.fields.file["en-US"].url || "",
        } satisfies UploadedFile;
      })
    );
    addFiles(newFiles);
    setLoading(false);
  };

  return (
    <Dropzone onDrop={onDrop} accept={{ "image/*": [] }}>
      {({ getRootProps, getInputProps, isDragAccept, isDragReject }) => (
        <div
          {...getRootProps()}
          className={`flex h-44 w-11/12 items-center justify-center bg-gray-100
          ${isDragAccept ? "border-4 border-teal-400" : ""}
          ${isDragReject ? "border-4 border-red-600" : ""}
          `}
        >
          <input {...getInputProps()} />
          <p>
            {loading ? (
              <svg
                className="h-5 w-5 animate-spin text-indigo-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              `Drag 'n' drop some files here, or click to select files`
            )}
          </p>
        </div>
      )}
    </Dropzone>
  );
};

export default FileUpload;
