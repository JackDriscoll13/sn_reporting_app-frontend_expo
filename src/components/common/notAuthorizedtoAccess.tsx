import React from 'react';

const NotAuthorizedToAccess: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-xl text-gray-700">
          You do not have permission to access this page.
        </p>
      </div>
    </div>
  );
};

export default NotAuthorizedToAccess;

