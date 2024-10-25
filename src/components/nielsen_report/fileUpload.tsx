import React from 'react';
import { useDropzone } from 'react-dropzone';
import { backendUrl } from '../../config';

type FileContent = {
  name: string;
  content: ArrayBuffer;
  type: string;
  verified: boolean;
  warn: boolean;
};

interface NielsenUploadProps {
  files: FileContent[];
  setFiles: React.Dispatch<React.SetStateAction<FileContent[]>>;
}

const NielsenUpload: React.FC<NielsenUploadProps> = ({ files, setFiles }) => {
  // Hook that verifies and classifies file
  const verifyFile = async (file: File): Promise<[boolean, string ]> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${backendUrl}/api/nielsen/verify_upload_file`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log(result)
      if (result.success) {
        return [true, result.message];
      } else {
        return [false, result.message];
      }
    } catch (error) {
      console.error('Error verifying file:', error);
      return [false, 'unknown error'];
      
    }
  };


  const onDrop = async (acceptedFiles: File[]) => {
    const newFiles = await Promise.all(
      acceptedFiles.slice(0, 2).map(async (file) => {
        console.log('Verifying file:', file.name);
        const [status, fileType] = await verifyFile(file);
        console.log('File verified:', file.name, status, fileType);
        // Check if file type already exists
        const existingFileType = files.find(existingFile => existingFile.type === fileType);
        let warning = false
        if (existingFileType) {
          console.log(`File type ${fileType} already exists.`);
          warning = true
        }
        // Save the file content in memory
        const content = await file.arrayBuffer();
        return { name: file.name, content, type: fileType, verified: status, warn: warning};
      })
    );

    setFiles(prevFiles => {
      const updatedFiles = [...prevFiles];
      newFiles.forEach(newFile => {
        const existingIndex = updatedFiles.findIndex(f => f.name === newFile.name);
        if (existingIndex !== -1) {
          updatedFiles[existingIndex] = newFile;
        } else {
          updatedFiles.push(newFile);
        }
      });
      return updatedFiles.slice(0, 2); // Ensure we only keep up to 2 files
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 2 });

  return (
    <div className="p-4 flex flex-row justify-between">
        <div className="w-2/3 border-2">
            <h2 className="text-md font-bold mb-4 text-center">File Upload</h2>
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center cursor-pointer ${
                isDragActive ? 'bg-blue-100 border-blue-300' : 'bg-gray-50 border-gray-300'
                }`}
            >
                <input {...getInputProps()} />
                {files.length === 0 && (
                    <p className="text-sm text-gray-500 mb-4">
                    
                    {isDragActive 
                        ? "Drop the files here..."
                        : "Drag 'n' drop two Nielsen files here, or click to select files"}
                    </p>
                )}
                {files.map((file) => (
                    <div key={file.name} className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm mb-2">
                        <span className="text-sm text-gray-700 truncate max-w-xs">{file.name}</span>
                        {!file.verified && (
                            <div className="group relative flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 cursor-help mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs text-red-500">File not recognized!</span>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                    {file.type || 'Unknown'}
                                </div>
                            </div>
                        )}
                        <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setFiles(files.filter(f => f.name !== file.name));
                        }}
                        className="text-xs bg-gray-200 hover:bg-red-600 text-red-700 font-semibold py-1 px-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        >
                        Remove
                    </button>
                </div>
                ))}
            </div>
        </div>
        <div className="w-1/3 pl-4 border-2 flex flex-col">
            <h2 className="text-md font-bold mb-4 text-center">Identified Valid Files</h2>
            <div className="flex-grow flex flex-col justify-center mb-4">
                <ul className="space-y-2 text-sm">
                    {files.filter(file => file.verified).map((file) => (
                        <li key={file.type} className="flex items-center bg-gray-100 rounded-lg p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">{file.type}</span>
                        </li>
                    ))}
                </ul>
                {files.length === 0 && (
                    <p className="text-gray-500 italic text-center">No valid files uploaded yet.</p>
                )}
            </div>
        </div>
    </div>
  );
};

export default NielsenUpload;