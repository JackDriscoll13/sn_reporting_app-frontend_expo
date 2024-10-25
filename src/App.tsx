// React
import { useState,} from 'react';
import ReactDOM from 'react-dom/client';
// React Router
import {BrowserRouter, Routes, Route, useLocation} from "react-router-dom";
// Index
import './index.css';

// Custom imports
// Context
import { UserContext } from './authentication/usercontext.ts';
import AuthGuard from './authentication/authguard.tsx';
// Pages 
// Auth, these are public 
import LoginPage from './pages/Login.tsx';
import SignUpPage from './pages/Signup.tsx';
import VerificationPage from './pages/VerifyNewUser.tsx';
import RequestPasswordReset from './pages/ReqNewPassword.tsx';
import ResetPassword from './pages/ResetPassword.tsx';
// Private Pages 
import HomePage from './pages/Homepage.tsx';
import CoverageMap from './pages/CoverageMap.tsx';
import EngagementReport from './pages/Engagement.tsx';
import DataUploads from './pages/DataUploads.tsx';
import UserManagement from './pages/UserManagement.js';
import AppAnalytics from './pages/AppAnalytics.tsx';
import NielsenDaily from './pages/NielsenDaily.tsx';
import PRReport from './pages/prReport.tsx';
import AiMonthlyDashboard from './pages/aiMonthlyDashboard.tsx';
// Components
import Navbar from './components/common/Navbar.tsx';
import NotFoundPage from './components/common/NotFoundPage.tsx';




function AppContent() {
  // Purpose of this app content is that it puts the navbar on every page except for the login, signup, and verification pages. 
  const location = useLocation();
  const knownRoutes = [
     '/login', '/signup', '/validate_new_user', '/request_password_reset', '/reset_password',
     '/', '/homepage', '/coveragemap', '/monthly_dashboard',
     '/engagement', '/nielsen_daily', '/pr_monthly',
     '/data_uploads', '/user_management', '/app_analytics', 

  ];
  const pathsWithoutNavbar = ['/login', '/signup', '/validate_new_user', '/request_password_reset','/reset_password','/docs'];

  // Check if the current route is known
  const isKnownRoute = knownRoutes.includes(location.pathname);
  // Determine if navbar should be displayed
  const shouldDisplayNavbar = isKnownRoute && !pathsWithoutNavbar.includes(location.pathname);



  // Navbar state
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const toggleNavBar = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };
  return (
    <div className="m-0 p-0 bg-custom-gray-background z-0">
      {shouldDisplayNavbar && <Navbar isCollapsed={isNavCollapsed} onToggle={toggleNavBar}   />}
      <Routes>
        {/* Login and Signup Routes (public) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/validate_new_user" element={<VerificationPage />} />
        <Route path="/request_password_reset" element={<RequestPasswordReset/>} />
        <Route path="/reset_password" element={<ResetPassword/>} />
        {/* Private Routes */}
        <Route path="/" element= {<AuthGuard><HomePage isNavBarCollapsed={isNavCollapsed}></HomePage></AuthGuard>}/>
        <Route path="/homepage" element={<AuthGuard><HomePage isNavBarCollapsed={isNavCollapsed}></HomePage></AuthGuard>} />
        <Route path="/coveragemap" element={<AuthGuard><CoverageMap isNavBarCollapsed={isNavCollapsed}></CoverageMap></AuthGuard>} />
        <Route path="/monthly_dashboard" element={<AuthGuard><AiMonthlyDashboard isNavBarCollapsed={isNavCollapsed}></AiMonthlyDashboard></AuthGuard>} />
        <Route path="/engagement" element={<AuthGuard><EngagementReport isNavBarCollapsed={isNavCollapsed}></EngagementReport></AuthGuard>} />
        <Route path="/pr_monthly" element={<AuthGuard><PRReport isNavBarCollapsed={isNavCollapsed}></PRReport></AuthGuard>} />
        <Route path="/nielsen_daily" element={<AuthGuard><NielsenDaily isNavBarCollapsed={isNavCollapsed}></NielsenDaily></AuthGuard>} /> 
        <Route path="/data_uploads" element={<AuthGuard><DataUploads isNavBarCollapsed={isNavCollapsed}></DataUploads></AuthGuard>} />
        <Route path="/user_management" element={<AuthGuard><UserManagement isNavBarCollapsed={isNavCollapsed}></UserManagement></AuthGuard>} />
        <Route path="/app_analytics" element={<AuthGuard><AppAnalytics isNavBarCollapsed={isNavCollapsed}></AppAnalytics></AuthGuard>} />
    
         {/* 404 Page */}
         <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}
function App() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  return (
      <UserContext.Provider value={{ userEmail, setUserEmail, userRole, setUserRole }}>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </UserContext.Provider>
  );
}



ReactDOM.createRoot(document.getElementById('root')!).render(<App/>)
