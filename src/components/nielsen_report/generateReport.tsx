import React, { useState, useEffect } from 'react';
import { backendUrl } from '../../config';
import JSZip from 'jszip';

import { GenerateNielsenReportSpinner } from '../common/SpinnerAnimations';

// Add this type definition at the top of the file
type FileContent = {
    name: string;
    content: ArrayBuffer;
    type: string;
    verified: boolean;
    warn: boolean;
};

type GenerateReportProps = {
    emailTo: string;
    uploadToDb: boolean;
    autoDownloadReports: boolean;
    files: FileContent[];
    isGeneratingReport: boolean;
    setIsGeneratingReport: (isGeneratingReport: boolean) => void;
}

const GenerateNielsenReport: React.FC<GenerateReportProps> = ({
    emailTo,
    uploadToDb,
    autoDownloadReports, 
    files,
    isGeneratingReport,
    setIsGeneratingReport

}) => {
    // State for validating the files (on input)
    const [isValidFileSet, setIsValidFileSet] = useState(false);
    const [validationMessage, setValidationMessage] = useState('');
    // State for the modal (pop up window when report is generated, if autoDownloadReports is false)
    const [showModal, setShowModal] = useState(false);
    const [reportFiles, setReportFiles] = useState<string[]>([]);
    

    const handleGenerateNielsenReport = async () => {
        console.log('Sending the following data to the backend to generate a Nielsen report:');
        console.log('emailTo:', emailTo);
        console.log('uploadToDb:', uploadToDb);
        console.log('autoDownloadReports:', autoDownloadReports);
        console.log('files:', files);
    
        setIsGeneratingReport(true);
        try {
            const formData = new FormData();
            formData.append('toEmail', emailTo);
            formData.append('uploadToDb', uploadToDb.toString());
            formData.append('autoDownload', autoDownloadReports.toString());

            // Append files to formData
            files.forEach((file, index) => {
                const blob = new Blob([file.content], { type: 'application/octet-stream' });
                formData.append(`file${index}`, blob, file.type); // Here I append the file type (classified name), as the file name
            });

            const response = await fetch(`${backendUrl}/api/nielsen/generate_nielsen_report`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            if (autoDownloadReports) {
                // Convert the response to a blob
                const blob = await response.blob();

                // Use JSZip to unzip the contents
                const zip = new JSZip();
                const contents = await zip.loadAsync(blob);

                // Iterate through the files in the zip
                for (const [fileName, file] of Object.entries(contents.files)) {
                    if (!file.dir) {
                        const content = await file.async('blob');
                        
                        // Create a temporary URL for the blob
                        const url = window.URL.createObjectURL(content);

                        // Create a temporary anchor element and trigger the download
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = fileName;
                        document.body.appendChild(a);
                        a.click();

                        // Clean up
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                    }
                }
                setIsGeneratingReport(false);

            
            } else {
                const responseData = await response.json();
                console.log('Report generated successfully:', responseData);
                const filenames = responseData.data
                setReportFiles(filenames);
                setShowModal(true);
            }
            setIsGeneratingReport(false);
        } catch (error) {
            console.error('Error generating report:', error);
            // Handle the error (e.g., show an error message to the user)
            setIsGeneratingReport(false);
        }
    };

    // Called when the user clicks on a file download in the modal
    const handleFileDownload = async (filePath: string) => {
        console.log('Downloading file:', JSON.stringify({ file_path: filePath }));
        try {
            const response = await fetch(`${backendUrl}/api/nielsen/download_daily_eml_report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ file_path: filePath })
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            // Extract filename from Content-Disposition header
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = filePath.split('/').pop() || 'download'; // Default to 'download' if extraction fails
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            }
    
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename; // Use the extracted filename here
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading file:', error);
            // Handle the error (e.g., show an error message to the user)
        }
    };

    // Functions for validating the input files
    useEffect(() => {
        if (files.length === 2) {
            const [file1, file2] = files;
            const typesMatch = areFileTypesMatching(file1.type, file2.type);
            setIsValidFileSet(typesMatch);
            setValidationMessage(typesMatch ? '' : 'Files date range do not match');
        } else {
            setIsValidFileSet(false);
            setValidationMessage('Please upload 2 nielsen data files');
        }
    }, [files]);

    const areFileTypesMatching = (file1: string, file2: string): boolean => {
        const getFileType = (fileName: string) => fileName.split('-')[1];
        return getFileType(file1) === getFileType(file2);
    };

    // Function for stripping the fileName from the full file path
    const stripFileNameFromPath = (filePath: string): string => {
        return filePath.split('/').pop() || filePath;
    };

    return (
        <div className="flex justify-center items-center mt-12 flex-col gap-4">
            {!isValidFileSet && (
                <p className="text-red-500 text-center text-sm">{validationMessage}</p>
            )}
            <button
                className={`
                    bg-charterdeepblue  text-white font-bold py-3 px-6 rounded-lg text-xl shadow-lg
                    ${(!isGeneratingReport && isValidFileSet) ? 'hover:scale-105 hover:bg-snbluehero1  transition duration-300 ease-in-out' : ''}
                    w-1/2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center 
                `}
                onClick={handleGenerateNielsenReport}
                disabled={isGeneratingReport || !isValidFileSet}
            >
                {isGeneratingReport ? (
                    <>
                        <GenerateNielsenReportSpinner />
                        <span className="ml-2">Generating...</span>
                    </>
                ) : (
                    'Generate Report'
                )}
            </button>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4 text-center text-charterdeepblue">
                            Nielsen Email Reports Ready
                        </h2>
                        <div className="space-y-4">
                            {reportFiles.map((fileName, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <p className="mb-2 text-sm font-medium">{stripFileNameFromPath(fileName)}</p>
                                    <button
                                        onClick={() => handleFileDownload(fileName)}
                                        className="bg-charterdeepblue text-white font-bold py-2 px-4 rounded hover:bg-snbluehero1 transition duration-300 ease-in-out"
                                    >
                                        Download
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-6 w-full bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-700 transition duration-300 ease-in-out"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GenerateNielsenReport;
