import React, { useState, useEffect } from 'react';
import { backendUrl } from '../../config';


type DmaName = {
    nielsen_dma_name: string;
    sn_dma_name: string;
    penetration_percent: string;
}



const ConfigReportAdjustableMappings: React.FC = () => {
    // Loading State
    const [isLoading, setIsLoading] = useState(true);
    // State for DMA Names
    const [dmaNames, setDmaNames] = useState<DmaName[]>([]);
    const [editedDmaNames, setEditedDmaNames] = useState<DmaName[]>([]);
    const [isEditingDmaNames, setIsEditingDmaNames] = useState(false);
    const [editingRows, setEditingRows] = useState<Set<number>>(new Set());
    const [newRow, setNewRow] = useState<DmaName>({ nielsen_dma_name: '', sn_dma_name: '', penetration_percent: '' });
    const [isSavingDmaNames, setIsSavingDmaNames] = useState(false);
    // Confirmation for Changing DMA Names Mapping
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    


    // DMA NAME FUNCTIONS
    useEffect(() => {
        const fetchDmaNames = async () => {
          try {
            const response = await fetch(`${backendUrl}/api/nielsen/get_dma_name_mapping`);  // Adjust the endpoint URL as needed
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const responseData = await response.json();
            const dmaNames = responseData.data
            console.log(dmaNames)
            setDmaNames(dmaNames);
            setIsLoading(false);
          } catch (error) {
            console.error('Error fetching subjects:', error);
            setIsLoading(false);
          }
        };
    
        fetchDmaNames();
      }, []);

      const handleEdit = () => {
        setIsEditingDmaNames(true);
        setEditedDmaNames([...dmaNames]);
        setEditingRows(new Set());
    };

    const handleCancel = () => {
        setIsEditingDmaNames(false);
        setEditedDmaNames([]);
        setEditingRows(new Set());
    };

    const handleRowEdit = (index: number) => {
        setEditingRows(prev => {
            const newSet = new Set(prev);
            newSet.add(index);
            return newSet;
        });
    };


    const handleAddRow = () => {
        if (newRow.nielsen_dma_name && newRow.sn_dma_name) {
            setEditedDmaNames([...editedDmaNames, newRow]);
            setNewRow({ nielsen_dma_name: '', sn_dma_name: '', penetration_percent: '' });
        }
    };

    const handleInputChange = (index: number, field: keyof DmaName, value: string) => {
        const updatedNames = [...editedDmaNames];
        updatedNames[index][field] = value;
        setEditedDmaNames(updatedNames);
    };
    
    const handleNewRowChange = (field: keyof DmaName, value: string) => {
        setNewRow(prev => ({ ...prev, [field]: value }));
    };


    const handleDeleteRow = (index: number) => {
        const updatedNames = editedDmaNames.filter((_, i) => i !== index);
        setEditedDmaNames(updatedNames);
    };

    // CONFIRMATION MODAL FUNCTIONS
    const confirmSave = async () => {
        setIsSavingDmaNames(true);
        console.log('Sending the following dma names to the backend: ')
        console.log(JSON.stringify(editedDmaNames))
        // Remove trailing and preceding whitespace from editedDmaNames
        const trimmedDmaNames = editedDmaNames.map(dma => ({
            nielsen_dma_name: dma.nielsen_dma_name.trim(),
            sn_dma_name: dma.sn_dma_name.trim(),
            penetration_percent: dma.penetration_percent.trim()
        }));

        // Update editedDmaNames with trimmed values
        setEditedDmaNames(trimmedDmaNames);             

        // Save the dmaNames to the database
        console.log('Sending the following trimmed dma names to the backend: ');
        console.log(JSON.stringify(trimmedDmaNames));
        try {
            const response = await fetch(`${backendUrl}/api/nielsen/update_dma_name_mapping`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(editedDmaNames),
            });
      
            if (!response.ok) {
              throw new Error('Failed to save subjects');
            }
            setIsEditingDmaNames(false);
          } catch (error) {
            console.error('Error saving dma names:', error);
          }

        setDmaNames(editedDmaNames);
        setIsSavingDmaNames(false);
        setIsEditingDmaNames(false);
        setShowConfirmModal(false);
    };

    // RENDERING
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <div className="p-4 w-full">
            <p className="text-sm">There are rare cases where the DMA name mapping and DMA penetration % may need to be updated. 
                If this is the case, you can update them below. 
            </p>
            <p className="text-sm mt-2 text-red-800">Note: Please be extremley cautious when updating this mapping, as unknown values can cause errors in the Nielsen report generation process.</p>
        </div>
        <div className="p-4 w-full">
        <div className="relative">
                {isSavingDmaNames && (
                    <div className="absolute inset-0 bg-gray-400 bg-opacity-75 flex items-center justify-center z-10">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <div className="text-center text-sm text-gray-700">Saving dma names...</div>
                    </div>
                    </div>
                )}
                <div className="mb-2 overflow-x-auto">
                <table className="w-full border-collapse border-2 border-gray-300 text-sm">
                    <thead>
                        <tr>
                            <th className="border-2 border-gray-300 p-1 bg-gray-100 text-left">Nielsen DMA Name</th>
                            <th className="border-2 border-gray-300 p-1 bg-gray-100 text-left">SN DMA Name</th>
                            <th className="border-2 border-gray-300 p-1 bg-gray-100 text-left">DMA Penetration %</th>
                            {isEditingDmaNames && <th className="border-2 border-gray-300 p-1 bg-gray-100 text-left">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {(isEditingDmaNames ? editedDmaNames : dmaNames).map((dmaName, index) => (
                            <tr key={index} className="border-b border-gray-300 last:border-b-0">
                                {/* Nielsen DMA Name cell */}
                                <td className="border-2 border-gray-300 p-1">
                                    {isEditingDmaNames && editingRows.has(index) ? (
                                        <input
                                            type="text"
                                            value={dmaName.nielsen_dma_name}
                                            onChange={(e) => handleInputChange(index, 'nielsen_dma_name', e.target.value)}
                                            className="w-full p-1 border border-gray-300 rounded"
                                        />
                                    ) : (
                                        dmaName.nielsen_dma_name
                                    )}
                                </td>
                                {/* SN DMA Name cell */}
                                <td className="border-2 border-gray-300 p-1">
                                    {isEditingDmaNames && editingRows.has(index) ? (
                                        <input
                                            type="text"
                                            value={dmaName.sn_dma_name}
                                            onChange={(e) => handleInputChange(index, 'sn_dma_name', e.target.value)}
                                            className="w-full p-1 border border-gray-300 rounded"
                                        />
                                    ) : (
                                        dmaName.sn_dma_name
                                    )}
                                </td>
                                {/* DMA Penetration % cell */}
                                <td className="border-2 border-gray-300 p-1">
                                    {isEditingDmaNames && editingRows.has(index) ? (
                                        <input
                                            type="text"
                                            value={dmaName.penetration_percent}
                                            onChange={(e) => handleInputChange(index, 'penetration_percent', e.target.value)}
                                            className="w-full p-1 border border-gray-300 rounded"
                                        />
                                    ) : (
                                        `${dmaName.penetration_percent}%`
                                    )}
                                </td>
                                {/* Action buttons */}
                                {isEditingDmaNames && !editingRows.has(index) && (
                                    <td className="border-2 border-gray-300 p-1">
                                        <button
                                            onClick={() => handleRowEdit(index)}
                                            className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteRow(index)}
                                            className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                        >
                                            ×
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                    {isEditingDmaNames && (
                        <tfoot>
                            <tr className="border-t-2 border-gray-300">
                                <td className="border-2 border-gray-300 p-1">
                                    <input
                                        type="text"
                                        value={newRow.nielsen_dma_name}
                                        onChange={(e) => handleNewRowChange('nielsen_dma_name', e.target.value)}
                                        placeholder="New Nielsen DMA Name"
                                        className="w-full p-1 border border-gray-300 rounded"
                                    />
                                </td>
                                <td className="border-2 border-gray-300 p-1">
                                    <input
                                        type="text"
                                        value={newRow.sn_dma_name}
                                        onChange={(e) => handleNewRowChange('sn_dma_name', e.target.value)}
                                        placeholder="New SN DMA Name"
                                        className="w-full p-1 border border-gray-300 rounded"
                                    />
                                </td>
                                <td className="border-2 border-gray-300 p-1">
                                    <input
                                        type="text"
                                        value={newRow.penetration_percent}
                                        onChange={(e) => handleNewRowChange('penetration_percent', e.target.value)}
                                        placeholder="New DMA Penetration %"
                                        className="w-full p-1 border border-gray-300 rounded"
                                    />
                                </td>
                                <td className="border-2 border-gray-300 p-1">
                                    <button
                                        onClick={handleAddRow}
                                        className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                    >
                                        Add Row
                                    </button>
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
            <div className="mt-4 flex justify-center space-x-2">
                {!isEditingDmaNames && (
                        <button
                            onClick={handleEdit}
                            className="px-4 py-2 bg-charterdeepblue text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-1/2"
                        >
                            Edit DMA Name Mapping
                        </button>
                    )}
                    {isEditingDmaNames && (
                        <>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowConfirmModal(true)}
                                disabled={isSavingDmaNames}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
                            >
                                {isSavingDmaNames ? 'Saving...' : 'Save'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
        {showConfirmModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                {isSavingDmaNames && (
                    <div className="absolute inset-0 bg-gray-400 bg-opacity-75 flex items-center justify-center z-10">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <div className="text-center text-sm text-gray-700">Saving dma names...</div>
                    </div>
                    </div>
                )}
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                    <h3 className="text-lg font-semibold mb-4">Confirm Changes</h3>
                    <p className="mb-4 text-md text-red-800 text-center">Are you sure you want to save the following changes? This will update the DMA names and DMA penetration % for all reports. This cannot be undone.</p>
                    <p className="mb-4 text-md text-red-800 text-center">Please be sure you know what you are doing and review any of the following changes:</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold mb-2">Current DMA Names:</h4>
                            <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
                                {JSON.stringify(dmaNames, null, 2)}
                            </pre>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Updated DMA Names:</h4>
                            <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
                                {JSON.stringify(editedDmaNames, null, 2)}
                            </pre>
                        </div>                    </div>
                    <div className="mt-6 flex justify-center space-x-4">
                        <button
                            onClick={() => setShowConfirmModal(false)}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmSave}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                        >
                            Confirm Save
                        </button>
                    </div>
                </div>
            </div>
            )}


        </>
    )
}

export default ConfigReportAdjustableMappings; 

