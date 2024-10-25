// This component is responsible for displaying the submit button. It will display a spinner if the form is loading
// Used in the signup and verify user pages
import { AuthSpinner } from "../common/SpinnerAnimations.tsx"

interface SubmitButtonProps {
  title: string;
  isLoading: boolean;
  message?: string;
}

export function SubmitButton({ title, isLoading, message }: SubmitButtonProps): JSX.Element {
  return ( 
    isLoading ? ( 
      <div className="w-full bg-snbluehero2 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200">
        <AuthSpinner />
        {message && <p className="text-center">{message}</p>}
      </div>
    ) : (
      <button 
        className="w-full bg-snbluehero2 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200" 
        type="submit" 
        disabled={isLoading}
      >
        {title}
      </button>
    )
  ) 
}