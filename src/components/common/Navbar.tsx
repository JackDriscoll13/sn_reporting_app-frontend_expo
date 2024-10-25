// React imports 
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
// Context
import { UserContext } from '../../authentication/usercontext';
// Icons
import { RiMenu2Line } from 'react-icons/ri';
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from 'react-icons/md';
import { FiLogOut } from 'react-icons/fi';



// This is the smallest component in the navbar, essentially a link
function NavChild({ label, link }: { label: string; link: string }) { 
  return (
    <Link to={link} className='w-full hover:bg-snbluelight2 block'>
      <li className='text-white no-underline transition-colors duration-300 ease-in-out pl-5 mt-1.5 text-sm '>
        {label}
      </li>
    </Link>
  );
}

// Within the navbar, we hold nav items that can be expanded or collapsed. 
// These nav items represent 3 subsections (Home, Viewerhip Dashboards, Recurring Reports) 
function NavItem({ children, label }: { children: React.ReactNode; label: string }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
  
    const handleToggle = (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      setIsCollapsed(!isCollapsed);
    };
  
    return (
      <li>
        <a href="/"  className="font-bold text-white no-underline pl-1 mt-2 w-full flex items-center justify-between transition-all duration-300 ease-in-out" 
         onClick={handleToggle}>
        <span>{label}</span>
        <span className="mr-10">
            {isCollapsed ? <MdKeyboardArrowRight /> : <MdKeyboardArrowDown />}
        </span>
        </a>
        {!isCollapsed && <ul>{children}</ul>}
      </li>
    );
  }

// This is a compnenet that holds the username and the logout button 
function UserMenu() {

  // Grab the userEmail directly from the context
  const { userEmail, setUserEmail, setUserRole } = useContext(UserContext);
  console.log('set context with email:', userEmail);

  const handleClick = async () => {
    // Remove the token from local storage
    localStorage.removeItem('token');

    // Clear the user context (best practice)
    setUserEmail(null);
    setUserRole(null);

    window.location.href = '/login';
  };

  return (
    <div className="absolute bottom-0 mb-2 w-full user-menu">
      <span className="text-white ml-1">{userEmail}</span>
      <div onClick={handleClick} className="cursor-pointer w-full flex justify-between  hover:bg-snbluelight2">
        <button className="text-white ml-1">Sign Out</button>
        <span className="text-white mr-10">
          <FiLogOut />
        </span>
      </div>
    </div>
  );
}


// The main navigation bar component that holds the nav items
function NavBar({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) {

  return (
    // Use the state of the navbar to determine the width of the navbar
    <nav className={`fixed top-0 left-0 h-screen overflow-auto transition-all duration-800 ease-in-out shadow-lg z-10 rounded-r-lg overflow-x-hidden ${isCollapsed ? 'w-5vw' : 'w-16vw'} bg-snbluehero2`}>
      <button className={`text-4xl h-16 w-16 ml-1 mt-5 mb-5 text-snbluehero1 bg-custom-gray-background rounded-full shadow-lg flex items-center justify-center transition-transform duration-500 ease-in-out ${isCollapsed ? 'transform rotate-180' : ''}`} 
       onClick={onToggle}><RiMenu2Line /></button>
      {!isCollapsed && (
        <>
          <ul className='w-full'>
            <li><Link className="font-bold text-white no-underline pl-1 mt-2 w-full flex items-center justify-between transition-all duration-300 ease-in-out" to="/homepage">Home</Link></li>
            <NavItem label="Viewerhip Dashboards" >
                <NavChild label="Coverage Map" link="/coveragemap"/>
                <NavChild label="Audience Monthly Dashboard" link="/monthly_dashboard"/>
              {/* Add more dashboards as needed */}
            </NavItem>
            <NavItem label="Recurring Reports">
                <NavChild label="Nielsen Dailys" link="/nielsen_daily"/>
                <NavChild label="Engagement Monthly" link="/engagement"/>
                <NavChild label="PR Monthly" link="/pr_monthly"/>
              {/* Add more reports as needed */}
            </NavItem> 
            <NavItem label="App Admin">
                <NavChild label="Data Uploads" link="/data_uploads"/>
                <NavChild label="User Management" link="/user_management"/>
                <NavChild label="App Analytics" link="/app_analytics"/>

                

            </NavItem>
            {/* Add more navigation links as needed */}
          </ul>
          <UserMenu/>
        </>
      )}
    </nav>
  );
}

export default NavBar;