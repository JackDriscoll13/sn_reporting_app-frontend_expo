import { useContext } from "react"
import { UserContext } from "../authentication/usercontext"
import ActiveUsersTable from "../components/userManagement/activeUsersTable"
import PreApprovedUsersTable from "../components/userManagement/preApprovedUsersTable"

// Not authorized to access page
import NotAuthorizedToAccess from "../components/common/notAuthorizedtoAccess"

function UserManagementHeader({ userName }: { userName: string }) {
    return (
        <section id='header' className='flex flex-row items-start justify-between'>
            <div className='flex flex-col items-start mt-4 mb-8'>
                <h1 className='text-2xl font-bold text-snbluehero2'>User Management</h1>
                <p className='text-sm text-gray-600 mt-1'>Manage users and their permissions</p>
            </div>
            <div className='flex flex-col items-end mt-4 mb-8 max-w-86'>
                <p className='text-sm  text-snbluehero2 text-right'>
                    Welcome {userName}!
                </p>
                <p className='text-sm text-gray-600 text-right'>
                    (You are an admin, so you have access to this page.)
                </p>

            </div>
        </section>
    )
}



function UserManagement({ isNavBarCollapsed }: { isNavBarCollapsed: boolean }) {
    // Styling for the page
    const pageStyle = {
        width: isNavBarCollapsed ? '94%' : '79%', 
        marginLeft: isNavBarCollapsed ? '5%' : '16%', 
        }
    const mainStyle ={ 
        width:  '96%', 
        marginLeft: '2%', 
    }

    const { userEmail, userRole } = useContext(UserContext);
    console.log("User context retrieved ->","userEmail: ", userEmail, "userRole: ", userRole);

    // If the user is not an admin, redirect to the home page
    if (userRole !== "admin") {
        return ( 
            <NotAuthorizedToAccess />
        )
    }

    // If the user is an admin, render the page, we can assume their name is in the userEmail
    const userName = userEmail
        ? userEmail.split(".")[0].charAt(0).toUpperCase() + userEmail.split(".")[0].slice(1)
        : "Admin";
    console.log("User name retrieved ->", userName);

    return (
<div style={pageStyle} className='flex flex-col justify-end w-full h-screen'>
    <main style={mainStyle} className='flex-grow'>
        <UserManagementHeader userName={userName} />
        <h1 className='text-2xl font-bold text-snbluehero2 text-left mt-10 mb-4'>Current Active Users:</h1>
        <ActiveUsersTable userContextEmail={userEmail} />
        <h1 className='text-2xl font-bold text-snbluehero2 text-left mt-16 mb-4'>Pre-Approved Users:</h1>
        <PreApprovedUsersTable />
    </main>
</div>
)   
} 

export default UserManagement;
