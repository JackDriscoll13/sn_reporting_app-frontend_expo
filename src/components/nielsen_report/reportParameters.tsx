import React, { useContext, useEffect } from 'react';
import { UserContext } from '../../authentication/usercontext';
import { backendUrl } from '../../config';

interface SetParametersProps {
  emailTo: string;
  setEmailTo: (value: string) => void;
  uploadToDb: boolean;
  setUploadToDb: (value: boolean) => void;
  autoDownloadReports: boolean;
  setAutoDownloadReports: (value: boolean) => void;
}

type BenchmarkDates = {
  startDate: string | null;
  endDate: string | null;
  status: 'valid' | 'invalid';
}

const SetParameters: React.FC<SetParametersProps> = ({
    emailTo,
    setEmailTo,
    uploadToDb,
    setUploadToDb,
    autoDownloadReports,
    setAutoDownloadReports
  }) => {
  // Get the user's email from the UserContext, set it in state
  const { userEmail } = useContext(UserContext);
  const [isCustomEmail, setIsCustomEmail] = React.useState(false);
  // State for the name of the current benchmark files
  const [currentBenchmarkDates, setCurrentBenchmarkDates] = React.useState<BenchmarkDates | null>(null);
  const [isRetrievingBenchmarkDates, setIsRetrievingBenchmarkDates] = React.useState(false);
  // Use Effects for the custom email feature
  // Set the email to the user's email if the user is not using a custom email
  useEffect(() => {
    if (!isCustomEmail && userEmail) {
      setEmailTo(userEmail);
    }
    if (isCustomEmail) {
      setEmailTo('');
    }
  }, [isCustomEmail, userEmail]);

  // Heres a hook to grab the current benchmark from the backend 
  useEffect(() => {
    fetchBenchmarkFileNames();
  }, []);

  // Fetch the current benchmark file names from the backend
  const fetchBenchmarkFileNames = async () => {
    setIsRetrievingBenchmarkDates(true);
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
      const benchmark15minName = data15min.filename;
      const benchmarkDaypartsName = dataDayparts.filename;

      const formattedDateRange: BenchmarkDates | null = extractAndFormatDateRange(benchmark15minName, benchmarkDaypartsName);
      setCurrentBenchmarkDates(formattedDateRange);
      setIsRetrievingBenchmarkDates(false);
      
    } catch (error) {
      console.error('Error fetching benchmark files:', error);
    }
  };

  const extractAndFormatDateRange = (filename15min: string, filenameDayparts: string): BenchmarkDates | null => {
    const dateRegex = /(\d{2})_(\d{2})_(\d{4})-(\d{2})_(\d{2})_(\d{4})/;
    const match15min = filename15min.match(dateRegex);
    const matchDayparts = filenameDayparts.match(dateRegex);
  
    if (match15min && matchDayparts && match15min[0] === matchDayparts[0]) {
      const [, startMonth, startDay, startYear, endMonth, endDay, endYear] = match15min;
      
      const startDate = `${startYear}/${startMonth}/${startDay}`;
      const endDate = `${endYear}/${endMonth}/${endDay}`;
  
      return {
        startDate,
        endDate,
        status: 'valid'
      };
    }
  
    console.error('Date ranges do not match or are invalid');
    return {
      startDate: '',
      endDate: '',
      status: 'invalid'
    };
  };


  return (
    <div className="mt-4 grid grid-cols-2 gap-4 p-8 border-2 rounded-lg">
      <div className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Email from:</h3>
        <div className="flex flex-col items-center w-full">
          {isCustomEmail ? (
            <input
              type="email"
              value={emailTo}
              onChange={(e) => setEmailTo(e.target.value)}
              className="w-2/3 px-3 py-2 text-base text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
              placeholder="Enter custom email"
            />
          ) : (
            <p className="text-base text-blue-600 font-medium mb-2 px-3 py-1 rounded-lg">
              {emailTo || 'No email available from context'}
            </p>
          )}
          <button
            onClick={() => setIsCustomEmail(!isCustomEmail)}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            {isCustomEmail ? 'Use default email' : 'Use custom email'}
          </button>
        </div>
      </div>

      {/* Whether to automatically download the reports or not */}
      <div className="bg-gray-100 p-3 rounded-lg flex flex-col items-center justify-center shadow-md">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Automatically Download Email Reports:</h3>
        <div className="flex items-center">
          <span className="text-sm mr-2">No</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={autoDownloadReports}
              onChange={() => setAutoDownloadReports(!autoDownloadReports)}
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
          <span className="text-sm ml-2">Yes</span>
        </div>
      </div>

      {/* Slider for uploading Nielsen data to DB -> currently disabled as not implemented*/}
      <div className="bg-gray-100 p-3 rounded-lg flex flex-col items-center justify-center shadow-md">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Upload Nielsen Data to DB:</h3>
        <div className="flex items-center opacity-50">
          <span className="text-sm mr-2">No</span>
          <label className="relative inline-flex items-center cursor-not-allowed">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={uploadToDb}
              onChange={() => setUploadToDb(!uploadToDb)}
              disabled
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-400"></div>
          </label>
          <span className="text-sm ml-2">Yes</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">This feature is not yet implemented</p>
      </div>

      {/* New div for benchmark information */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Benchmark Date Range:</h3>
        {isRetrievingBenchmarkDates ? (
          <p className="text-base text-blue-600">Loading benchmark dates...</p>
        ) : currentBenchmarkDates ? (
          currentBenchmarkDates.status === 'valid' ? (
            <p className="text-base text-charterdeepblue">
              {currentBenchmarkDates.startDate} &mdash; {currentBenchmarkDates.endDate}
            </p>
          ) : (
            <p className="text-base text-red-600">Warning: Benchmark date mismatch</p>
          )
        ) : (
          <p className="text-base text-gray-600">No benchmark information available</p>
        )}
      </div>
    </div> 
  );
};

export default SetParameters;
