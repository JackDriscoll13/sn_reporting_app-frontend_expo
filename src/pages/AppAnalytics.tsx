import { useContext } from "react"
// Custom imports
import { UnderDevelopment } from "../components/common/SpinnerAnimations"
import { UserContext } from "../authentication/usercontext"
import NotAuthorizedToAccess from "../components/common/notAuthorizedtoAccess"

function AnalyticsHeader(){

    return (
    <section id='header' className='flex flex-row justify-center items-center'>     
    <div className=''>
        <h1 className='text-3xl font-bold text-snbluehero2 text-center'>App Analytics</h1>
        <p className='text-md text-center'>This page will hold important content on app usage, and other logs, and potential problems.</p>
    </div>
    </section>
    ) 
}

function AppAnalytics({ isNavBarCollapsed }: { isNavBarCollapsed: boolean }) {
    // Styling for the page
    const pageStyle = {
        width: isNavBarCollapsed ? '94%' : '79%', 
        marginLeft: isNavBarCollapsed ? '5%' : '16%', 
        }
    const mainStyle ={ 
        width:  '96%', 
        marginLeft: '2%', 
    }
    // State for the range of engagement data available (oldest month, most recent month)
    const { userRole } = useContext(UserContext);
    if (userRole !== 'admin') {
        return <NotAuthorizedToAccess />;
    }

    return (
<div style={pageStyle} className='flex flex-col justify-end w-full pt-24 h-screen'>
    <main style={mainStyle} className='flex-grow'>
        <AnalyticsHeader />
        <UnderDevelopment />
    </main>
</div>
)   
} 

export default AppAnalytics;