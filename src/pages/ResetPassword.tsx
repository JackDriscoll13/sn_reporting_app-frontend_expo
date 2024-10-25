import { useState, FormEvent } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { backendUrl } from '../config.js';
import { AuthResponse } from '../types/backend_responses.ts';
// ... other imports from RequestNewPassword and Signup pages ...

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ResetPassword() {
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    // Query for token
    const query = useQuery();
    const token = query.get('token');
    console.log(token);
    const validateUserInput = (): boolean => {
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (!/(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+){8,}/.test(newPassword)) {
            setError('Password must be 8 characters or longer and contain at least one alphanumeric character');
            return false;
        }
        return true;
    }
  
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateUserInput()) { 
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${backendUrl}/api/auth/reset_password`, {
                method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                },
                    body: JSON.stringify({token: token, newpassword: newPassword }),
                });
                const responsedata: AuthResponse = await response.json();
                if (responsedata.success) {
                    alert('Password reset successful!');
                    setSuccess(true);
                }
                else if (responsedata.message === 'new_password_same_as_old'){
                    setError('New password cannot be the same as old password.');
                }
                else{
                    setError(`Error!: ${responsedata.message}`);
                    console.log(responsedata);
                }
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };
        setLoading(false);
    }

    if (success) {
        return ( 
        // If the password reset is successful, we display a success message
        <div className="h-screen bg-snbluehero2 flex items-center justify-center">
            <img src="/SN_APP_LOGO_2023.png" alt="Logo" className="absolute top-0 right-0 mt-4 mr-4 w-20 h-18" />
            <div className="bg-snbluelight1 p-10 rounded-lg shadow-lg w-84 border-4 border-green-600">
                <h2 className="text-snblue-dark1 text-2xl mb-2 text-center font-semibold bottom-0">Success!</h2>
                <p className="text-snbluehero2 text-xs text-center mt-1 mb-10">
                    You have successfully reset your password. Please navigate to the login page and login with your new password.</p>
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
          <h2 className="text-snblue-dark1 text-xl mb-6 text-center font-semibold">Reset Password</h2>
          <form onSubmit={handleSubmit}>
            <input
              className="w-full p-2 mb-6 rounded border border-gray-300 focus:border-blue-500 focus:outline-none"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              required
            />
            <input
              className="w-full p-2 mb-6 rounded border border-gray-300 focus:border-blue-500 focus:outline-none"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              required
            />
            <button className="w-full bg-snbluehero2 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200" type="submit" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            {error && <p className="text-red-500 text-sm text-center mt-2 mb-2">{error}</p>}
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

export default ResetPassword;