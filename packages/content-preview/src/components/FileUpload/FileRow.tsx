import type { UploadedFile } from './types'
import { Popover, PopoverContent, PopoverTrigger } from './Popover'

type Props = {
  files: UploadedFile[]
  deleteFile: (id: string) => void
}

const readablizeBytes = (bytes: number) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let l = 0
  let n = parseInt(String(bytes), 10) || 0

  while (n >= 1024 && ++l) {
    n = n / 1024
  }

  return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`
}

const FileRow: React.FC<Props> = ({ files, deleteFile }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }
  return (
    <div className="w-10/12 mx-auto">
      {files.map((file) => (
        <div
          className="flex items-center justify-between mb-4
        "
          key={file.id}
        >
          <div className="flex items-center gap-4">
            <img width={40} height={40} className="w-10 h-10 rounded-md object-cover" src={file.url} />
            <div className="flex flex-col">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-gray-500">{readablizeBytes(file.size)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="p-2 text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-900 rounded-full mouse shadow-2xl transition ease-in duration-200 focus:outline-none"
                  onClick={() => copyToClipboard(file.url)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
                    />
                  </svg>
                </button>
              </PopoverTrigger>
              <PopoverContent>
                <p className="text-sm">Copied to clipboard</p>
              </PopoverContent>
            </Popover>
            <button
              className="p-2 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900 rounded-full mouse shadow-2xl transition ease-in duration-200 focus:outline-none"
              onClick={() => deleteFile(file.id)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default FileRow
