import React from 'react';
import { FaTools } from 'react-icons/fa';

// Auth Spinner, small and white
export function AuthSpinner(): JSX.Element {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-white"></div>
      </div>
    );
}

// Spinner Component for our engagement tables
export const EngagementTableSpinner = (): JSX.Element => (
    <div className="flex justify-center items-center h-70vh mt-4 mb-4">
        <div className="relative">
            <div className="animate-spin rounded-full mt-12 h-24 w-24 border-b-4 border-gray-900"></div>
            {/* Arrow using an additional div */}
        </div>
    </div>
);

// Not finished yet component
interface UnderDevelopmentProps {
    message?: string;
}

export const UnderDevelopment: React.FC<UnderDevelopmentProps> = ({ message }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            <FaTools className="text-4xl mr-2 animate-pulse text-red-800" /> {/* Icon with a pulse animation*/}
            <span className="text-md font-bold text-gray-700 mt-2 text-center">This feature is still under development. Stay tuned!</span>
            <span className="text-sm text-gray-700 mt-2 text-center max-w-96">
            {message}
            </span>
        </div>
    );
};

// Generate Report Spinner
export const GenerateNielsenReportSpinner: React.FC = () => (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-white"></div>
    </div>
  );