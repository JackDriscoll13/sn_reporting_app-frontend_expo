import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { backendUrl } from '../../config';
import { FaFileExcel, FaDownload, FaUpload } from 'react-icons/fa';
import { FileContent } from '../../types/nielsen_types';

const BenchmarkFileUpload: React.FC = () => {
  const [benchmark15min, setBenchmark15min] = useState<string | null>(null);
  const [benchmarkDayparts, setBenchmarkDayparts] = useState<string | null>(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  // State for the new benchmark files
  const [newBenchmarkFiles, setNewBenchmarkFiles] = useState<FileContent[]>([]);

  // Confirm State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [updateSuccess, setUpdateSuccess] = useState(false)

  useEffect(() => {
    fetchBenchmarkFileNames();
  }, []);

  // Fetch the current benchmark file names from the backend
  const fetchBenchmarkFileNames = async () => {
    try {
      const [response15min, responseDayparts] = await Promise.all([
        fetch(`${backendUrl}/api/nielsen/get_benchmark_15min_name`),
        fetch(`${backendUrl}/api/nielsen/get_benchmark_dayparts_name`)
      ]);

      if (!response15min.ok || !responseDayparts.ok) {
        throw new Error('Failed to fetch benchmark files');
      }
      const data15min = await response15min.json();
      const dataDayparts = await responseDayparts.json();
      setBenchmark15min(data15min.filename);
      setBenchmarkDayparts(dataDayparts.filename);
    } catch (error) {
      console.error('Error fetching benchmark files:', error);
    }
  };


  // When the user clicks the download button, we download the file from the backend
  const downloadFile = async (fileType: '15min' | 'dayparts') => {
    try {
      const endpoint = fileType === '15min' 
        ? '/api/nielsen/download_benchmark_15min' 
        : '/api/nielsen/download_benchmark_dayparts';
      
      const response = await fetch(`${backendUrl}${endpoint}`);
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
      // Download the file
      const blob = await response.blob();
      const filename = fileType === '15min' ? benchmark15min : benchmarkDayparts;
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename || `benchmark_${fileType}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const newFiles = await Promise.all(
      acceptedFiles.slice(0, 2).map(async (file) => {
        // Implement file verification logic here
        const [status, fileType] = await verifyBenchmarkFile(file);
        // Check if file type already exists
        const existingFileType = newBenchmarkFiles.find(existingFile => existingFile.type === fileType);
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

    setNewBenchmarkFiles(prevFiles => {
      const updatedFiles = [...prevFiles, ...newFiles];
      return updatedFiles.slice(0, 2); // Ensure we only keep up to 2 files
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 2 });

  // Verify the benchmark file
  const verifyBenchmarkFile = async (file: File): Promise<[boolean, string]> => {
    // Implement benchmark file verification logic here
    try {
        const formData = new FormData();
        formData.append('file', file);
  
        const response = await fetch(`${backendUrl}/api/nielsen/verify_benchmark_file`, {
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

  const handleUpdateClick = () => {
    setIsConfirmOpen(true);
  };


  const handleConfirmCancel = () => {
    setIsConfirmOpen(false);
  };


  const handleConfirmClick = () => {
    uploadBenchmarkFiles();
    setIsConfirmOpen(false);
  };

  const uploadBenchmarkFiles = async () => {
    if (newBenchmarkFiles.length !== 2) {
      console.error('Please upload 2 benchmark files');
      return;
    }
    setIsLoading(true)
    try {
      const formData = new FormData();
      newBenchmarkFiles.forEach(file => {
        formData.append('files', new Blob([file.content]), file.type + '.xlsx');
      });

      const response = await fetch(`${backendUrl}/api/nielsen/update_benchmark_files`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload benchmark files');
      }

      const result = await response.json();
      console.log('Upload successful:', result);

      // After successful upload, refresh the benchmark file names
      await fetchBenchmarkFileNames();
      setIsLoading(false)
      setUpdateSuccess(true)
      // Don't close the popup immediately
      // setIsUpdateOpen(false);
      setNewBenchmarkFiles([]);
      
    } catch (error) {
      console.error('Error uploading benchmark files:', error);
      // Handle error
      setError(true)
      setErrorMessage(error as string)
      
    }
  };

  // The display component for a benchmark file
  const renderFileDownload = (filename: string | null, label: string, fileType: '15min' | 'dayparts') => (
    <div className="flex items-center justify-between w-full mb-2">
      <div className="flex items-center space-x-2">
        <FaFileExcel className="text-green-600 text-lg" />
        <span className="font-semibold text-sm">{label}:</span>
        {filename ? (
          <span className="text-gray-700 text-sm">{filename}</span>
        ) : (
          <span className="text-gray-500 italic text-sm">Not available</span>
        )}
      </div>
      {filename && (
        <button
          onClick={() => downloadFile(fileType)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded flex items-center text-xs"
        >
          <FaDownload className="mr-1" /> Download
        </button>
      )}
    </div>
  );

  return (
    <div className="p-4 rounded-lg shadow-md">
      <div className="max-w-6xl mx-auto">
        {!isUpdateOpen ? (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-lg font-bold mb-4 text-left">Current Benchmark Files:</h2>
            <div className="mb-4 flex flex-col items-center">
              <div className="w-full">
                {renderFileDownload(benchmark15min, "Benchmark 15min", '15min')}
                {renderFileDownload(benchmarkDayparts, "Benchmark Dayparts", 'dayparts')}
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <div className="flex items-start space-x-4">
              <div className="w-2/3">
                <h2 className="text-lg font-bold mb-4 text-left">Update Benchmark Files:</h2>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 mb-4 text-center cursor-pointer ${
                    isDragActive ? 'bg-blue-100 border-blue-300' : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <input {...getInputProps()} />
                  {newBenchmarkFiles.length === 0 && (
                    <p className="text-sm text-gray-500 mb-4">
                      {isDragActive 
                        ? "Drop the benchmark files here..."
                        : "Drag 'n' drop two benchmark files here, or click to select files"}
                    </p>
                  )}
                  {newBenchmarkFiles.map((file) => (
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
                        {file.warn && (
                            <div className="group relative flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 cursor-help mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs text-yellow-500">File type already exists!</span>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                    {file.type || 'Unknown'}
                                </div>
                            </div>
                        )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setNewBenchmarkFiles(files => files.filter(f => f.name !== file.name));
                        }}
                        className="text-xs bg-gray-200 hover:bg-red-600 text-red-700 font-semibold py-1 px-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                {newBenchmarkFiles.length > 1 ? (
                  <button
                    onClick={handleUpdateClick}
                    className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded text-sm flex items-center justify-center w-full"
                  >
                    <FaUpload className="mr-2" /> Upload New Benchmark Files
                  </button>
                ) : (
                  <button
                    disabled
                    className="bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded text-sm flex items-center justify-center w-full cursor-not-allowed"
                  >
                    Please Upload 2 Benchmark Files
                  </button>
                )}
              </div>
              <div className="w-1/3">
                <h3 className="text-md font-semibold  mt-2 mb-4">Identified benchmark files:</h3>
                <div className="flex-grow flex flex-col justify-center mb-4">
                <ul className="space-y-2 text-sm">
                    {newBenchmarkFiles.filter(file => file.verified).map((file) => (
                        <li key={file.type} className="flex items-center bg-gray-100 rounded-lg p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">{file.type}</span>
                        </li>
                    ))}
                </ul>
                {newBenchmarkFiles.length === 0 && (
                    <p className="text-gray-500 italic text-center">No valid files uploaded yet.</p>
                )}
            </div>
              </div>
            </div>
          </div> 
        )}
        <div className="flex justify-center">
          <button
            className={`${isUpdateOpen ? 'bg-red-700 hover:bg-red-800' : 'bg-blue-700 hover:bg-blue-800'} text-white font-bold py-2 px-4 rounded text-sm`}
            onClick={() => setIsUpdateOpen(!isUpdateOpen)}
          >
            {isUpdateOpen ? 'Cancel Update' : 'Update Benchmark'}
          </button>
        </div>
      </div>
      {(isConfirmOpen || isLoading || error || updateSuccess) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            {isConfirmOpen && (
              <>
                <h3 className="text-lg font-semibold mb-4 text-center">Are you sure?</h3>
                <p className="font-semibold">To confrim, you will be replacing the existing benchmark files:</p>
                <ul className="list-none pl-4">
                    <li>{benchmark15min}</li>
                    <li>{benchmarkDayparts}</li>
                </ul>
                <p className="font-semibold">With the following files you have uploaded:</p>
                    <ul className="list-none pl-4">
                        {newBenchmarkFiles.map((file) => (
                            <li key={file.type}>{file.type}.xlsx</li>
                        ))}
                    </ul>
                <p className="text-sm italic mt-4">Note: this will update the benchmark files for all users.</p>
                <div className="flex justify-center space-x-4 mt-6">
                  <button
                    onClick={handleConfirmCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}
            {isLoading && <p className="text-center">Loading...</p>}
            {error && <p className="text-center text-red-600">Error: {errorMessage}</p>}
            {updateSuccess && (
              <div className="text-center p-6 w-full mx-auto">
                <svg className="w-24 h-16 mx-auto text-green-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-md font-semibold text-green-600 mb-6">Succesfully updated benchmark files!</p>
                <button
                  onClick={() => {
                    setUpdateSuccess(false);
                    setIsUpdateOpen(false);
                  }}
                  className="px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition duration-300 ease-in-out"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};



export default BenchmarkFileUpload;