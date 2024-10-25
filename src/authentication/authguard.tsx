import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { jwtDecode } from 'jwt-decode';
import { UserContext } from './usercontext';

const TOKEN_KEY = 'token';

// This is a custom hook that checks if a token exists in local storage. If no token exists, it redirects to the login page.
// If it does, it decodes the token and checks if it has expired before letting the user access the page.

interface DecodedToken {
    email: string;
    role: string;
    exp: number;
  }

function AuthGuard({ children }: { children: React.ReactNode }) {
    const token = localStorage.getItem(TOKEN_KEY);
    const navigate = useNavigate();
    const { setUserEmail, setUserRole } = useContext(UserContext);
  
    useEffect(() => {
      if (!token) {
        // If a token does not exist, redirect to the login page
        navigate('/login');
        return;
      }

      try {
        const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token); 
        // Check if the token has expired
        const currentUnixTimestamp = Math.floor(Date.now() / 1000);
        //console.log(decodedToken.exp, currentUnixTimestamp);
        if (decodedToken.exp < currentUnixTimestamp) {
            // If the token has expired, redirect to the login page
            console.log('Token expired');
            localStorage.removeItem(TOKEN_KEY);
            navigate('/login?message=session_expired');
        } else {
            setUserEmail(decodedToken.email);
            setUserRole(decodedToken.role);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem(TOKEN_KEY);
        navigate('/login?message=invalid_token');
      }
    }, [token, navigate, setUserEmail, setUserRole]);
  
    // If a token exists, render the children
    return token ? children : null;
  }
  
  export default AuthGuard;