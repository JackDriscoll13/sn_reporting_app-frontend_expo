import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SubmitButton } from '../components/loginSignup/SubmitButton.tsx';
import { UserContext } from '../authentication/usercontext.ts';
import { backendUrl } from '../config.ts';
import { AuthResponse } from '../types/backend_responses.ts';


export default function LoginPage() {
    // Regular state variables
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    // Display loading spinner when the form is submitted
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    // Context and navigation
    const navigate = useNavigate();
    const { setUserEmail } = useContext(UserContext);

    // Check for any query parameters in the URL, change the title based on the query
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const pagetitle = params.get('message') === 'session_expired' ? 'Session Expired, Please Login Again' : 'Login';


    const validateUserInput = (): boolean => {
        setError('');
        // This function checks the user input and validates each field. If there is in an error
        // Checks if email not empty
        if (!email) {
            setError('Please enter an email');
            return false;
        }
        // Check if email is in valid format using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email');
            return false;
        } 
        // Validate password not empty
        if (!password) {
            setError('Please enter a password');
            return false;
        }
        return true;
    };
        

    const handleLogin = async (formEvent: React.FormEvent<HTMLFormElement>) => {
        formEvent.preventDefault();
        if (validateUserInput()) {
            // Wrapping the response in a try statement to catch any unkown errors
            try {
                setIsLoading(true);
                setMessage('Verifying...');
                const response = await fetch(`${backendUrl}/api/auth/login`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({"email": email, "password": password}),
                });
              
                const responsedata: AuthResponse = await response.json();
              
                if ((responsedata.message) === 'login_successful') {
                    localStorage.setItem('token', responsedata.data);
                    // Redirect to the homepage
                    setMessage('Redirecting...')
                    setUserEmail(email);
                    navigate('/homepage');
                } else if (responsedata.message === 'incorrect_password') {
                    setError('Password is incorrect. Please try again');
                } else if (responsedata.message === 'user_not_found') {
                    setError('User not found. Please double check you entered the correct email');
                }
              } catch (error) {
                // Handle the error
                    setMessage('');
                    setIsLoading(false);
                    console.error('An error occurred:', error);
                    setError('An unkown error occurred. Please try again.');
              }
        };
        setMessage('');
        setIsLoading(false);
    };

    return (
        <div className="h-screen bg-snbluehero2 flex items-center justify-center">
            
            <div className="bg-snbluelight1 p-10 rounded-lg shadow-lg w-80">
                <img src="/SN_APP_LOGO_2023.png" alt="Logo" className="absolute top-0 right-0 mt-4 mr-4 w-20 h-18" />
                <h1 className="text-snblue-dark1 text-2xl mb-6 text-center font-semibold">{pagetitle}</h1>
                <form onSubmit={handleLogin}>
                    <input className="w-full p-2 mb-6 rounded border border-gray-300 focus:border-blue-500 focus:outline-none" type="text" placeholder="Charter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input className="w-full p-2 mb-2 rounded border border-gray-300 focus:border-blue-500 focus:outline-none" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {error && <p className="text-red-500 text-sm text-center mt-2 mb-2">{error}</p>}
                    <SubmitButton isLoading={isLoading} message={message} title={'Login'} />
                </form>
                <p className="text-gray-700 text-center text-sm mt-8">
                {"Don't have an account?"}{' '}
                    <Link to="/signup" className="underline cursor-pointer text-sm text-blue-500">
                        Sign Up
                    </Link>
                </p>
                <p className="text-gray-700 text-center text-sm mt-4 mb-1">
                    {"Forgot password?"}{' '}
                    <Link to="/request_password_reset" className="underline cursor-pointer text-blue-500 text-center text-sm">
                        Reset it here
                    </Link>
                </p>


            </div>
        </div>
    )
};