import { useContext } from "react"
// Custom imports
import { UnderDevelopment } from "../components/common/SpinnerAnimations"
import NotAuthorizedToAccess from "../components/common/notAuthorizedtoAccess"
import { UserContext } from "../authentication/usercontext"
function UploadsHeader(){

    return (
    <section id='header' className='flex flex-row justify-center items-center'>     
    <div className=''>
        <h1 className='text-3xl font-bold text-snbluehero2 text-center'>Data Uploads</h1>
        <p className='text-md text-center'>This page will serve as a place manually upload and validate data for the app.</p>
    </div>
    </section>
    ) 
}

function DataUploads({ isNavBarCollapsed }: { isNavBarCollapsed: boolean }) {
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
        <UploadsHeader />
        <UnderDevelopment />

        {/* TODO: Add back in the tabs for the different data uploads, 
        need to standardize time functionality and whether or not we want to use react-tabs or build our own (p easy) */}
        {/* <Tabs>
            <TabList className='mt-16 font-bold border-b-2 border-gray-200 text-center text-xl'>
                <Tab>Current Data Status</Tab>
                <Tab>Nielsen Daily Upload</Tab>
                <Tab>Engagement Monthly Upload</Tab>
                <Tab>STBR / PR Uploads</Tab>
                <Tab>15m Seg Uploads</Tab>
            </TabList>
        </Tabs> */}
    </main>
</div>
)   
} 

export default DataUploads;