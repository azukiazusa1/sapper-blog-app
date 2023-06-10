import * as Dialog from "@radix-ui/react-dialog";
import useFiles from "./useFiles";
import FileUpload from "./FileUploader";
import FileRow from "./FileRow";

const FileUploadDialog = () => {
  const { files, addFiles, deleteFile } = useFiles();

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="mouse fixed bottom-10 right-10 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-700 p-0 text-white shadow-2xl transition duration-200 ease-in hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-900">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed z-50 flex w-full max-w-4xl flex-col gap-8 rounded-lg bg-white p-6">
            <div className="flex items-center justify-center">
              <FileUpload addFiles={addFiles} />
            </div>
            <FileRow files={files} deleteFile={deleteFile} />
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default FileUploadDialog;
