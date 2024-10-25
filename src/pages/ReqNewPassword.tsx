import { useState, FormEvent } from 'react';
import { backendUrl }  from '../config.js';
import { Link } from 'react-router-dom';
import { SubmitButton } from '../components/loginSignup/SubmitButton.js';
import { AuthResponse } from '../types/backend_responses.ts';

function RequestPasswordReset() {
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);

    const validateUserInput = () => {
        setError('');
        if (!email) {
            setError('Please enter an email');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        setError('');
        e.preventDefault();
        if (validateUserInput()) {
            try {
                setIsLoading(true);
                setMessage('Sending request...');
                const response = await fetch(`${backendUrl}/api/auth/request_password_reset`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ "email": email }),
                });
                const responsedata: AuthResponse = await response.json();
                if (responsedata.success) {
                    alert('Password reset email sent! Check your email for instructions.');
                    
                    setSuccess(true);
                }
                else if (responsedata.message === 'user_not_found'){ 
                    setError('User not found. Please check your email and try again.');
                }
                else {
                    alert('Error sending password reset email. Please try again.');
                    setError('Error sending password reset email. Please try again.');
                }
            } catch (error) {
                alert('Error sending password reset email');
            } finally {
                setIsLoading(false);
                setMessage('');
            }
        }
    };

    if (success) {
        return ( 
        // If the verification is successfuul, we display a success message
        <div className="h-screen bg-snbluehero2 flex items-center justify-center">
            <img src="/SN_APP_LOGO_2023.png" alt="Logo" className="absolute top-0 right-0 mt-4 mr-4 w-20 h-18" />
            <div className="bg-snbluelight1 p-10 rounded-lg shadow-lg w-84 border-4 border-green-600">
                <h2 className="text-snblue-dark1 text-2xl mb-2 text-center font-semibold bottom-0">We sent you an email.</h2>
                <p className="text-snbluehero2 text-xs text-center mt-1 mb-10">
                    Please check your inbox and follow the link we sent you to reset your password. 
                    Please note that emails can take a few minutes to arrive.</p>
                <div className="flex justify-center">
                    <Link to='/login' className="underline cursor-pointer text-sm text-blue-500">back to login</Link>
                </div>
            </div>
        </div>
        )
    }
    
    return (
        <div className="h-screen bg-snbluehero2 flex items-center justify-center">
            <div className="bg-snbluelight1 p-10 rounded-lg shadow-lg w-80">
                <img src="/SN_APP_LOGO_2023.png" alt="Logo" className="absolute top-0 right-0 mt-4 mr-4 w-20 h-18" />
                <h2 className="text-snblue-dark1 text-xl mb-6 text-center font-semibold">Forgot your Password?</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        className="w-full p-2 mb-6 rounded border border-gray-300 focus:border-blue-500 focus:outline-none"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                    {error && <p className="text-red-500 text-sm text-center mt-2 mb-2">{error}</p>}
                    <SubmitButton isLoading={isLoading} message={message} title={'Request Password Reset'} />
                </form>
                <p className="text-gray-700 text-center text-sm mt-4">
                    <Link to="/login" className="underline cursor-pointer text-sm text-blue-500">
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default RequestPasswordReset;