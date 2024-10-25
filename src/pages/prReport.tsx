import { UnderDevelopment } from "../components/common/SpinnerAnimations"


function PRReport({ isNavBarCollapsed }: { isNavBarCollapsed: boolean }) {
    const pageStyle = {
        width: isNavBarCollapsed ? '94%' : '79%', 
        marginLeft: isNavBarCollapsed ? '5%' : '16%', 
        }
    const mainStyle ={ 
        width:  '96%', 
        marginLeft: '2%', 
    }
    // State for the range of engagement data available (oldest month, most recent month)
    return (
<div style={pageStyle} className='flex flex-col justify-end w-full pt-24 h-screen'>
    <main style={mainStyle} className='flex-grow'>
        <h1 className='text-3xl font-bold text-snbluehero2 text-center mb-4'>PR Report</h1>
        <p className='text-md text-center mb-10'>This page will serve as a place to view and download the PR report.</p>
        <UnderDevelopment />
    </main>
</div>
)   
} 
export default PRReport;