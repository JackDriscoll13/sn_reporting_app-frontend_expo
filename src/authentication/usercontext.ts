import React from 'react';


// Before the user logs in, the userEmail and userRole are null.
// After the user logs in, the userEmail and userRole are set.
interface UserContextType {
  userEmail: string | null;
  setUserEmail: React.Dispatch<React.SetStateAction<string | null>>;
  userRole: string | null;
  setUserRole: React.Dispatch<React.SetStateAction<string | null>>;
}

export const UserContext = React.createContext<UserContextType>({
  userEmail: null,
  setUserEmail: () => {},
  userRole: null,
  setUserRole: () => {},
});

// The approach here is correct and follows good practices 
//for managing user authentication state in a React application using context.