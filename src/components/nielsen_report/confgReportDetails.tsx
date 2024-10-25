import React, { useState, useEffect } from 'react';
import { backendUrl } from '../../config';

type Subject = {
  id: number;
  subject: string;
};

type RecipientEmails = {
    [key: string]: string[];
  };

type ReportNotes = {
  [key: string]: string;
};

type DmaList = {
  [key: string]: string[];
};


const ConfigReportDetails: React.FC = () => {
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  // State for subject lines, one for the original data and one for data being edited
  const [subjectData, setSubjectData] = useState<Subject[]>([]);
  const [editedSubjectData, setEditedSubjectData] = useState<Subject[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // State for recipient emails
  const [recipientEmails, setRecipientEmails] = useState<RecipientEmails>({});
  const [editedRecipientEmails, setEditedRecipientEmails] = useState<RecipientEmails>({});
  const [isEditingRecipients, setIsEditingRecipients] = useState(false);
  const [isSavingRecipients, setIsSavingRecipients] = useState(false);
  const [invalidEmails, setInvalidEmails] = useState<Record<string, number[]>>({});
  // State for report notes
  const [reportNotes, setReportNotes] = useState<ReportNotes>({});
  const [editedReportNotes, setEditedReportNotes] = useState<ReportNotes>({});
  const [isEditingReportNotes, setIsEditingReportNotes] = useState(false);
  const [isSavingReportNotes, setIsSavingReportNotes] = useState(false);
  // State for DMA list 
  const [dmaList, setDmaList] = useState<DmaList>({});

// THE SUBJECT LINES: 
////////////////////////////////////////////////////////////
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/nielsen/get_subject_lines`);  // Adjust the endpoint URL as needed
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        const subjects = responseData.data
        console.log(subjects)
        setSubjectData(subjects);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  useEffect(() => {
    setEditedSubjectData(subjectData);
  }, [subjectData]);



  const handleSave = async () => {
    setIsSaving(true)
    setSubjectData(editedSubjectData)
    try {
      console.log('sending data:', editedSubjectData)
      console.log(JSON.stringify(editedSubjectData))
      const response = await fetch(`${backendUrl}/api/nielsen/update_subject_lines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedSubjectData),
      });

      if (!response.ok) {
        throw new Error('Failed to save subjects');
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving subjects:', error);
      // Optionally, add error handling UI here
    }
    setIsSaving(false)
  };


// THE RECIPIENT EMAILS: 
////////////////////////////////////////////////////////////
    useEffect(() => {
        const fetchRecipientEmails = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/nielsen/get_email_recipients`);
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            const responseData = await response.json();
            const recipientEmails: RecipientEmails = responseData.data;
            console.log(JSON.stringify(recipientEmails));
            setRecipientEmails(recipientEmails);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching recipient emails:', error);
            setIsLoading(false);
        }
        };
  
      fetchRecipientEmails();
    }, []);

    useEffect(() => {
        setEditedRecipientEmails(recipientEmails);
      }, [recipientEmails]);
    

      // Modify handleAddRecipient to add an email for a specific subject
      const handleAddRecipient = (subjectId: string) => {
        setEditedRecipientEmails(prev => ({
          ...prev,
          [subjectId]: [...(prev[subjectId] || []), '']
        }));
      };

      // Modify handleRecipientChange to update a specific email
      const handleRecipientChange = (subjectId: string, rowIndex: number, value: string) => {
        setEditedRecipientEmails(prev => ({
          ...prev,
          [subjectId]: prev[subjectId].map((email, index) => index === rowIndex ? value : email)
        }));
      };

      // Add a new function to remove a recipient for a specific subject
      const handleRemoveRecipient = (subjectId: string, rowIndex: number) => {
        setEditedRecipientEmails(prev => ({
          ...prev,
          [subjectId]: prev[subjectId].filter((_, index) => index !== rowIndex)
        }));
      };

      // When saving, we need to make sure that each of the editedEmailRecipaints passes basic validation
      const validateEmail = (email: string) => {
        return email !== '' && email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      };

      const handleSaveRecipients = async () => {
        setIsSavingRecipients(true);
        const cleanedRecipientEmails: RecipientEmails = {};
        const newInvalidEmails: Record<string, number[]> = {};
      
        Object.entries(editedRecipientEmails).forEach(([subjectId, emails]) => {
          cleanedRecipientEmails[subjectId] = [];
          newInvalidEmails[subjectId] = [];
      
          emails.forEach((email, index) => {
            const cleanedEmail = email.replace(/\s/g, '');
            if (validateEmail(cleanedEmail)) {
              cleanedRecipientEmails[subjectId].push(cleanedEmail);
            } else {
              newInvalidEmails[subjectId].push(index);
            }
          });
        });
      
        setInvalidEmails(newInvalidEmails);
      
        if (Object.values(newInvalidEmails).some(arr => arr.length > 0)) {
          setIsSavingRecipients(false);
          return; // Don't save if there are invalid emails
        }

        // Now we can save the cleaned and validatedemails
        try {
            console.log('sending emails to backend:')
            console.log(JSON.stringify(cleanedRecipientEmails))
            const response = await fetch(`${backendUrl}/api/nielsen/update_email_recipients`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(cleanedRecipientEmails),
            });
      
            if (!response.ok) {
              throw new Error('Failed to save recipient emails');
            }
            setIsEditingRecipients(false);
          } catch (error) {
            console.error('Error saving recipient emails:', error);
            // Optionally, add error handling UI here
          }
      
        // Proceed with saving valid emails
        setRecipientEmails(cleanedRecipientEmails);
        setIsSavingRecipients(false);
        // TODO: Add API call to save emails to the backend
      };

////////////////////////////////////////////////////////////
// THE REPORT NOTES: 
////////////////////////////////////////////////////////////
useEffect(() => {
    const fetchReportNotes = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/nielsen/get_report_notes`);
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        const reportNotes: ReportNotes = responseData.data;
        console.log('report notes:')
        console.log(JSON.stringify(reportNotes));
        setReportNotes(reportNotes);
        setIsLoading(false);
    } catch (error) {
        console.error('Error fetching report notes:', error);
        setIsLoading(false);
    }
    };

  fetchReportNotes();
}, []);


useEffect(() => {
    setEditedReportNotes(reportNotes);
  }, [reportNotes]);


  const handleSaveReportNotes = async () => {
    setIsSavingReportNotes(true);
    console.log('sending report notes to backend:')
    console.log(JSON.stringify(editedReportNotes))
    try {
      const response = await fetch(`${backendUrl}/api/nielsen/update_report_notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedReportNotes),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save report notes');
      }
      setReportNotes(editedReportNotes);
      setIsEditingReportNotes(false);
    } catch (error) {
      console.error('Error saving report notes:', error);
      // Optionally, add error handling UI here
    }
    setIsSavingReportNotes(false);
  };

////////////////////////////////////////////////////////////
// THE DMA LIST:    
////////////////////////////////////////////////////////////

useEffect(() => {
    const fetchDmaList = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/nielsen/get_dma_list`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        const dmaList: DmaList = responseData.data;
        console.log('DMA list:');
        console.log(JSON.stringify(dmaList));
        setDmaList(dmaList);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching DMA list:', error);
        setIsLoading(false);
      }
    };

    fetchDmaList();
  }, []);

////////////////////////////////////////////////////////////
// Rendering 
////////////////////////////////////////////////////////////


  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 p-4 gap-y-12">
    <div className="relative">
      <h2 className="text-lg font-semibold mb-2 text-center">Report Subject Lines</h2>
      {isSaving && (
        <div className="absolute inset-0 bg-gray-400 bg-opacity-75 flex items-center justify-center z-10">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="text-center text-sm text-gray-700">Saving subject lines...</div>
          </div>
        </div>
      )}
      <div className="mb-2 overflow-x-auto">
        <table className="w-full border-collapse border-2 border-gray-300 text-sm">
          <thead>
            <tr>
              <th className="border-2 border-gray-300 p-1 bg-gray-100 text-left">
                Subject Lines:
              </th>
            </tr>
          </thead>
          <tbody>
            {subjectData.map((subject, index) => (
              <tr key={subject.id} className="border-b border-gray-300 last:border-b-0">
                <td className="p-1">
                  {isEditing ? (
                    <input
                      value={editedSubjectData[index].subject}
                      onChange={e => {
                        const newData = [...editedSubjectData];
                        newData[index] = {...newData[index], subject: e.target.value};
                        setEditedSubjectData(newData);
                      }}
                      className="w-full p-0.5 border border-gray-300 rounded text-sm"
                    />
                  ) : (
                    <span >{subject.subject}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center space-x-2 mt-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-700 text-white text-sm py-1 px-2 rounded"
            >
              Save
            </button>
            <button
              disabled
              className="bg-gray-400 text-white text-sm py-1 px-2 rounded cursor-not-allowed"
              title="Currently, you are not able to add new emails to this report"
            >
              Add New
            </button>
            <button
              onClick={() => {setIsEditing(false); setEditedSubjectData(subjectData)}}
              className="bg-red-700 hover:bg-red-900 text-white text-sm py-1 px-2 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white text-sm py-1 px-2 rounded"
          >
            Edit Subject Lines
          </button>
        )}
      </div>
    </div>
    {/* Third div (report notes) */}
    <div className="relative">
      <h2 className="text-lg font-semibold mb-2 text-center">Report Notes</h2>
      {isSavingReportNotes && (
        <div className="absolute inset-0 bg-gray-400 bg-opacity-75 flex items-center justify-center z-10">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="text-center text-sm text-gray-700">Saving Report Notes...</div>
          </div>
        </div>
      )}
      <div className="mb-2 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr>
              {subjectData.map(subject => (
                <th key={subject.id} className="border border-gray-300 p-1 bg-gray-100 text-left">
                  {subject.subject}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {subjectData.map(subject => (
                <td key={subject.id} className="border border-gray-300 p-1 align-top">
                  {isEditingReportNotes ? (
                    <textarea
                      value={editedReportNotes[subject.id.toString()] || ''}
                      onChange={(e) => setEditedReportNotes(prev => ({
                        ...prev,
                        [subject.id.toString()]: e.target.value
                      }))}
                      className="w-full p-1 border border-gray-300 rounded text-sm"
                      rows={4}
                    />
                  ) : (
                    <p className="whitespace-pre-wrap">{reportNotes[subject.id.toString()] || ''}</p>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex justify-center space-x-2 mt-4">
        {isEditingReportNotes ? (
          <>
            <button
              onClick={handleSaveReportNotes}
              className="bg-green-500 hover:bg-green-700 text-white text-sm py-1 px-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => {setIsEditingReportNotes(false); setEditedReportNotes(reportNotes);}}
              className="bg-red-700 hover:bg-red-900 text-white text-sm py-1 px-2 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditingReportNotes(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white text-sm py-1 px-2 rounded"
          >
            Edit Report Notes
          </button>
        )}
      </div>
    </div>

       {/* Second div (recipient emails table) */}
       <div className="relative">
      <h2 className="text-lg font-semibold mb-2 text-center">Report Recipient Emails</h2>
      {isSavingRecipients && (
        <div className="absolute inset-0 bg-gray-400 bg-opacity-75 flex items-center justify-center z-10">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="text-center text-sm text-gray-700">Saving Recipient Emails...</div>
          </div>
        </div>
      )}
      <div className="mb-2 overflow-x-auto">
        <table className="w-full border-collapse border-2 border-gray-300 text-sm">
          <thead>
            <tr>
              {subjectData.map(subject => (
                <th key={subject.id} className="border-2 border-gray-300 p-1 bg-gray-100 text-left">
                  {subject.subject}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {subjectData.map(subject => (
                <td key={subject.id} className="border-2 border-gray-300 align-top">
                  <div className="flex flex-col space-y-2">
                    {editedRecipientEmails[subject.id.toString()]?.map((email, rowIndex) => (
                      <div key={rowIndex} className="flex flex-col border-b border-gray-300 last:border-b-0">
                        <div className="flex items-center justify-between">
                          {isEditingRecipients ? (
                            <input
                              value={email}
                              onChange={(e) => handleRecipientChange(subject.id.toString(), rowIndex, e.target.value)}
                              className={`w-full p-1 border rounded text-sm ${
                                invalidEmails[subject.id.toString()]?.includes(rowIndex)
                                ? 'border-red-500'
                                : 'border-gray-300'
                              }`}
                            />
                          ) : (
                            <span className="">{email}</span>
                          )}
                          {isEditingRecipients && (
                            <button
                              onClick={() => handleRemoveRecipient(subject.id.toString(), rowIndex)}
                              className="text-red-500 hover:text-red-700 ml-2"
                            >
                              &#10005;
                            </button>
                          )}
                        </div>
                        {isEditingRecipients && invalidEmails[subject.id.toString()]?.includes(rowIndex) && (
                          <span className="text-red-500 text-xs mt-1">Invalid email format</span>
                        )}
                      </div>
                    ))}
                    {isEditingRecipients && (
                      <button
                        onClick={() => handleAddRecipient(subject.id.toString())}
                        className="flex items-center justify-center w-2/3 mx-auto bg-green-500 hover:bg-green-700 text-white text-xs py-0.5 px-2 rounded mt-2"
                      >
                        <span className="mr-1">+</span>
                        <span>Add Recipient</span>
                      </button>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex justify-center space-x-2 mt-4">
        {isEditingRecipients ? (
          <>
            <button
              onClick={handleSaveRecipients}
              className="bg-green-500 hover:bg-green-700 text-white text-sm py-1 px-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => {setIsEditingRecipients(false); setRecipientEmails(recipientEmails); setEditedRecipientEmails(recipientEmails)}}
              className="bg-red-700 hover:bg-red-900 text-white text-sm py-1 px-2 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditingRecipients(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white text-sm py-1 px-2 rounded"
          >
            Edit Recipient Emails
          </button>
        )}
      </div>
    </div>


    {/* Fourth div (DMA List) */}
    <div className="relative">
        <h2 className="text-lg font-semibold mb-2 text-center">DMA List</h2>
        <div className="mb-2 overflow-x-auto">
            <table className="w-full border-collapse border-2 border-gray-300 text-sm">
                <thead>
                    <tr>
                        {subjectData.map(subject => (
                            <th key={subject.id} className="border-2 border-gray-300 bg-gray-100 text-left">
                                {subject.subject}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {subjectData.map(subject => (
                            <td key={subject.id} className="align-top border-2 border-gray-300">
                                <ul className="list-none">
                                    {dmaList[subject.id.toString()]?.map((dma, index) => (
                                        <li key={index} className="border-b-2 border-gray-300 last:border-b-0">
                                            {dma}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
        <div className="flex justify-center mt-4">
            <div className="relative group">
                <button
                    className="bg-gray-300 text-gray-500 text-sm py-1 px-2 rounded cursor-not-allowed"
                    disabled
                >
                    Edit DMA List
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    Currently, this DMA list is not editable
                </div>
            </div>
        </div>
    </div>
    


  </div>
  );
};

export default ConfigReportDetails;