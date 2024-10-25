import React, { useState } from 'react';
import { backendUrl } from '../../config';

import { FaFileExcel } from 'react-icons/fa';

const ConfigReportMappingDownload: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${backendUrl}/api/nielsen/get_4_additional_mapping_file`);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'nielsen_mappings.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
            // Handle error (e.g., show an error message to the user)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <p className="text-sm mb-2">
                In addition to the report details above, the nielsen daily report relies on 4 additional data mappings. These include:
            </p> 
            <ul className="list-disc pl-4 mb-4">
                <li className="text-sm ml-2">Station Name &rarr; Network</li>
                <li className="text-sm ml-2">Station Abbreviation &rarr; Spectrum Station Name</li>
                <li className="text-sm ml-2">Daypart &rarr; Order of Daypart</li>
                <li className="text-sm ml-2">15min Time Slot &rarr; Order of 15min Time Slot</li>
            </ul>
            <p className="text-sm mb-4">
                These mappings sit within our Nielsen Database and are not editable through this page. If you need to update them, please contact the dev team.
                You can download a snapshot of the current state of these 4 additional mappings in the format of a read only excel file below:
            </p>
            <button
                onClick={handleDownload}
                disabled={isLoading}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <FaFileExcel className="mr-2" />
                {isLoading ? 'Downloading...' : 'Download Mappings'}
            </button>
        </div>
    )
}

export default ConfigReportMappingDownload;