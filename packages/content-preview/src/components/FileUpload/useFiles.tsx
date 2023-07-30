import { useState, useEffect, useCallback } from "react";
import type { UploadedFile } from "./types";

const useFiles = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    const files = sessionStorage.getItem("files");
    if (files) {
      setFiles(JSON.parse(files));
    }
  }, []);

  const addFiles = useCallback(
    (newFiles: UploadedFile[]) => {
      setFiles((files) => [...files, ...newFiles]);
      sessionStorage.setItem("files", JSON.stringify([...files, ...newFiles]));
    },
    [files],
  );

  const deleteFile = useCallback(
    (id: string) => {
      const newFiles = files.filter((file) => file.id !== id);
      setFiles(newFiles);
      sessionStorage.setItem("files", JSON.stringify(newFiles));
    },
    [files],
  );

  return { files, addFiles, deleteFile };
};

export default useFiles;
