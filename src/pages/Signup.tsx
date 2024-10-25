import { useState } from 'react';

import { useNavigate, Link } from 'react-router-dom';
import { SubmitButton } from '../components/loginSignup/SubmitButton.tsx';
import { backendUrl } from '../config.ts';
import { AuthResponse } from '../types/backend_responses.ts';

export default function SignUpPage() {
    const [team, setTeam] = useState<string>('');
    const [useremail, setUseremail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    // Display loading spinner when the form is submitted
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    const navigate = useNavigate();

    const validateUserInput = (): boolean => {
        setError('');
        // This function checks the user input and validates each field. If there is in an error
        // Checks if email are valid
        if (!useremail) {
            setError('Please enter an email');
            return false;
        }

        // Check if email is in valid format using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(useremail)) {
            setError('Please enter a valid email');
            return false;
        } 

        // Validate team
        if (!team) {
            setError('Please select a team');
            return false;
        }
        
        // Validate passwords
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        // Validate password length and complexity using regex
        if (!/(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+){8,}/.test(password)) {
            setError('Password must be 8 characters or longer and contain at least one alphanumeric character');
            return false;
        }
        return true;
    };

    // This function is called when the signup form is submitted
    const handleSubmit = async (formEvent: React.FormEvent<HTMLFormElement>) => {
        formEvent.preventDefault();

        if (validateUserInput()) {
            setIsLoading(true);
            const response = await fetch(`${backendUrl}/api/auth/check_email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "email": useremail }),
            });

            const responseData: AuthResponse = await response.json();

        
            if (responseData.data.is_preapproved && !responseData.data.is_existing) {
                console.log('Email is pre-approved and not an existing user');
                setMessage('Sending verification email...');
                const response1 = await fetch(`${backendUrl}/api/auth/send_verification_code`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({"email": useremail, "password": password, "team": team}),
                });
                const data1 = await response1.json();

                if (response1.ok) {
                    setMessage('Verification email sent. Redirecting...');
                    setIsLoading(false);
                    navigate(`/validate_new_user?email=${encodeURIComponent(useremail)}`);
                } else {
                    setError(data1.message || 'Failed to send verification email. Please try again.');
                    setIsLoading(false);
                }
            } else {
                setError(responseData.message);
                setIsLoading(false);
            }
        }
    };
            
    return (
        <div className="h-screen bg-snbluehero2 flex items-center justify-center">
        <img src="/SN_APP_LOGO_2023.png" alt="Logo" className="absolute top-0 right-0 mt-4 mr-4 w-20 h-18" />
            <div className="bg-snbluelight1 p-10 rounded-lg shadow-lg w-84">
                <h2 className="text-snblue-dark1 text-2xl mb-1 text-center font-semibold bottom-0">Sign Up</h2>
                <p className="text-snbluehero2 text-xs text-center mt-1 mb-4"> Heads up! Sign-up is only available for emails that are pre-approved by the audience insights team.</p>
                <form onSubmit={handleSubmit}>
                    <input className="w-full p-2 mb-6 rounded border border-gray-300 focus:border-blue-500 focus:outline-none" type="text" placeholder="Charter Email" value={useremail} onChange={(e) => setUseremail(e.target.value)} />
                    <input className="w-full p-2 mb-6 rounded border border-gray-300 focus:border-blue-500 focus:outline-none" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <input className="w-full p-2 mb-6 rounded border border-gray-300 focus:border-blue-500 focus:outline-none" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <p className="text-snbluehero2 text-xs text-left mt-0 mb-0 ">Select Your Team:</p>
                    <select className="w-full text-snblue-dark1 font-semibold  mb-6 rounded border border-gray-300 focus:border-blue-500 focus:outline-none" value={team} onChange={(e) => setTeam(e.target.value)}>
                        <option value="">Select Team</option>
                        <option value="sn-ai">SN - Audience Insights</option>
                        <option value="other-sn">Other - Spectrum News</option>
                        <option value="other-charter">Other - (Not Spectrum News)</option>
                    </select>
                    {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
                    <SubmitButton isLoading={isLoading} message={message} title={'Send Verification Email'} />
                </form>
                <p className="text-gray-700 text-center mt-4">Already have an account? <Link to='/login' className="underline cursor-pointer text-blue-500">Login</Link></p>
            </div>
        </div>
    )
}; 