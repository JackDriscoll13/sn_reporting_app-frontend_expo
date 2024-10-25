import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { useLocation, Link } from 'react-router-dom';

import { SubmitButton } from '../components/loginSignup/SubmitButton.js';
import { backendUrl }  from '../config.js';


interface DisplayMessageProps {
  handleFormSubmit: (e: FormEvent<HTMLFormElement>) => void;
  email: string | null;
  verifcode: string;
  setVerifCode: React.Dispatch<React.SetStateAction<string>>;
  error: string;
  display: string;
  requestNewCode: (e: FormEvent<HTMLFormElement>) => void;
  newcode: boolean;
  isLoading: boolean;
  message: string;
}


function DisplayMessage({handleFormSubmit, email, verifcode, setVerifCode, error, display, requestNewCode, newcode, isLoading, message}: DisplayMessageProps) {

  // Changing the title based on if a new code was sent or if it is the first time
  let title = "Verify Your Email";
  if (newcode) {
    title = "New Code Sent!";
  }

  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (display === 'user_created_successfully') {
      (nodeRef.current as HTMLElement)?.classList.remove('opacity-0');
    }
  }, [display]);
  // This component is responsible for displaying the correct message to the user based on the display state
  if (display === 'verification_email_sent') {
    // Default case, we display the form to enter the verification code
    return (
      <div className="bg-snbluelight1 pt-10 pr-10 pl-10 pb-5 rounded-lg shadow-lg w-84 border-4 border-orange-500">
      <h2 className="text-snblue-dark1 text-2xl mb-2 text-center font-semibold bottom-0">{title}</h2>
      <p className="text-snbluehero2 text-xs text-center mt-1 mb-10">We sent you an email! Please check your inbox and your <span className="underline">junk mail</span> for your 6-Digit verification code. Note that emails can take up to 5 minutes to arrive.</p>
      <p className="text-snbluehero2 text-xs text-left mt-0 mb-0 ">Enter the code sent to {email}:</p>
        <form onSubmit={handleFormSubmit}>
          <input className="w-full p-2 mb-6 rounded border border-gray-300 focus:border-blue-500 focus:outline-none" type="text" placeholder="Verification Code" value={verifcode} onChange={(e) => setVerifCode(e.target.value)}/>
          <SubmitButton isLoading={isLoading} message={message} title={'Verify and Sign Up'} />
          {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
        </form>
        <form onSubmit={requestNewCode} className='bg-center flex justify-center'>
          <div className="flex flex-col items-center mt-10 mb-1">
            <p className="text-snblue-medium1 text-sm text-center">Need a new code?</p>
            <button className="w-auto bg-snblue-medium1 text-white text-center py-0.3 px-1 rounded hover:bg-red-700 transition duration-200 mt-0 mb-0" type="submit">Get New Code</button>
        </div>
        </form>
      </div>
     )
    } else if (display === 'user_created_successfully') {
      return (
        // If the verification is successfuul, we display a success message
        <div ref={nodeRef} className="transition duration-500 ease-in opacity-0 transform bg-snbluelight1 p-10 rounded-lg shadow-lg w-84 border-4 border-green-600">
          <h2 className="text-snblue-dark1 text-2xl mb-2 text-center font-semibold bottom-0">Success!</h2>
          <p className="text-snbluehero2 text-xs text-center mt-1 mb-10">You have successfully verified your email. Please click the link below to login.</p>
          <div className="flex justify-center">
            <Link to='/login' className="w-full bg-snbluehero2 text-center text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200">Login</Link>
          </div>
        </div>
      )
    }
      else if (display === 'verification_code_incorrect') {
        // If the verification code is incorrect, we display an error message letting them know to try again
      return (
        <div className="bg-snbluelight1 p-10 rounded-lg shadow-lg w-84 border-4 border-red-600">
        <h2 className="text-snblue-dark1 text-2xl mb-2 text-center font-semibold bottom-0">Incorrect Verification Code</h2>
        <p className="text-snbluehero2 text-xs text-center mt-1 mb-10">That code didn't work. Please try again.</p>
        <form onSubmit={handleFormSubmit}>
          <input className="w-full p-2 mb-6 rounded border border-gray-300 focus:border-blue-500 focus:outline-none" type="text" placeholder="Verification Code" value={verifcode} onChange={(e) => setVerifCode(e.target.value)}/>
          <SubmitButton isLoading={isLoading} message={message} title={'Verify and Sign Up'} />
          {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
        </form>
        <form onSubmit={requestNewCode} className='bg-center flex justify-center'>
          <div className="flex flex-col items-center mt-10 mb-1">
            <p className="text-snblue-medium1 text-sm text-center">Need a new code?</p>
            <button className="w-auto bg-snblue-medium1 text-white text-center py-0.3 px-1 rounded hover:bg-red-700 transition duration-200 mt-0 mb-0" type="submit">Get New Code</button>
        </div>
        </form>
        </div>
      )
    }
    else if (display === 'verification_code_expired') {
      return ( 
        // If the verification code is expired, we display an error message letting them know to try again
        <div className="bg-snbluelight1 p-10 rounded-lg shadow-lg w-84 border-4 border-red-600">
        <h2 className="text-snblue-dark1 text-2xl mb-2 text-center font-semibold bottom-0">Verification Code Expired</h2>
        <p className="text-snbluehero2 text-xs text-center mt-1 mb-10">That code has expired. Please request a new code try again.</p>
        <form onSubmit={requestNewCode}>
          <button className="w-full bg-snbluehero2 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200" type="submit">Get a New Code.</button>
        </form>
        </div>
      )
    }
    else { 
      // If the display state is not recognized, we display a generic error message
      return (
        <div className="bg-snbluelight1 p-10 rounded-lg shadow-lg w-84 border-4 border-red-600">
        <h2 className="text-snblue-dark1 text-2xl mb-2 text-center font-semibold bottom-0">Error!</h2>
        <p className="text-snbluehero2 text-xs text-center mt-1 mb-10">An internal error occurred while trying to verify your email. Please return to sign up, and try signing up again.</p>
        <Link to='/signup' className="w-full bg-snbluehero2 text-center text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200">Sign Up</Link>
        </div>
      )
    }

  }


function VerificationPage() {
  // Grab the email from the url query string
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const email = params.get('email');
  // Define the verification code and error in state
  const [verifcode, setVerifCode] = useState<string>('');
  const [display, setDisplay] = useState<string>('verification_email_sent');
  const [error, setError] = useState<string>('');
  const [newcode, setNewCode] = useState<boolean>(false);

  // Define the isloading state for the form
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // First I want to ensure the verification code is 6 digits long
    if (!/^\d{6}$/.test(verifcode)) {
      setError('Verification code must be 6 digits');
      return;
    }
    // If the verification code is a valid 6 digits, we can submit the form and email to the backend
    try {
      setIsLoading(true);
      setMessage('Verifying...');
      const response = await fetch(`${backendUrl}/api/auth/verify_signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"email": email, "verification_code": verifcode}),
      });
  
      if (!response.ok) {
        throw new Error('Internal Server Error');
      }
      const data = await response.json();
      console.log(data);
      setDisplay(data.message);

    } catch (error) {
      console.error(error);
      setError('An error occurred while submitting the form');
    }
    setMessage('');
    setIsLoading(false);
  };

  // In the case we want to request a new verification code, we can call this function: 
  const requestNewCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('Generating New Code...');
    const response = await fetch(`${backendUrl}/api/auth/refresh_verification_code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"email": email}),
      });
  
      const data = await response.json();
      setDisplay(data.message);
      setIsLoading(false);
      setMessage('');
      setNewCode(true);
  }

  return (
    <div className="h-screen bg-snbluehero2 flex items-center justify-center">
    <img src="/SN_APP_LOGO_2023.png" alt="Logo" className="absolute top-0 right-0 mt-4 mr-4 w-20 h-18" />
    <DisplayMessage handleFormSubmit={handleSubmit} email={email} verifcode={verifcode} setVerifCode ={setVerifCode}
     error={error} display={display} requestNewCode={requestNewCode} newcode={newcode} isLoading={isLoading} message={message} />
    </div>
  );
}

export default VerificationPage;