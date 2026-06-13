
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apiGet } from './helpers/api';
import Login from './pages/Login';
import Attendance from './pages/Attendance';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import AppFooter from './components/AppFooter';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import AdminBranches from './pages/AdminBranches';
import ErrorBoundary from './components/ErrorBoundary';
import ActivateAccount from './components/ActivateAccount';
import AddEmployee from './pages/AddEmployee';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';
// import LeaveManagement from './pages/LeaveManagement';
// import LeaveRequestForm from './pages/LeaveRequestForm';
import EmployeeAttendancePage from './pages/AdminEmployeeAttendance/EmployeeAttendancePage';
import AdminDeviceControl from './pages/AdminDeviceControl';
// Leave Pages
import LeavesAdminPage from './pages/leave/LeavesAdminPage';
import MyLeavesPage from './pages/leave/MyLeavesPage';
import DetailsLeavePage from './pages/leave/DetailsLeavePage';
import SubmitLeavePage from './pages/leave/SubmitLeavePage';
import LeavePoliciesPage from "./pages/LeavePoliciesPage";
import EditLeavePolicyPage from "./components/leave/policy/EditLeavePolicyPage";
import CreateLeavePolicyPage from "./components/leave/policy/CreateLeavePolicyPage";
import AttendancePoliciesPage from './pages/AttendancePolicies/AttendancePoliciesPage';

import PayrollPreviewPage from "./pages/payroll/PayrollPreviewPage";
import PayrollRunDetailsPage from "./pages/payroll/PayrollRunDetailsPage";

import PayrollRunsListPage from "./pages/payroll/PayrollRunsListPage";
import EmployeeLeaveProfile from "./pages/leave/EmployeeLeaveProfile";
import './index.css';
import './style/table-responsive.css';

import "bootstrap/dist/js/bootstrap.bundle.min.js";

import DashboardPage from './pages/Dashboard/DashboardPage';
import HolidaysPage from './pages/Holidays/HolidaysPage';
import DepartmentsPage from './pages/Departments/DepartmentsPage';
import RemotePermission from "./pages/RemotePermission";
import EditEmployee from './pages/EditEmployee';
import EmployeeDirectory from './pages/EmployeeDirectory';
import OvertimePoliciesPage from "./pages/Overtimepoliciespage";
import BonusPoliciesPage from "./pages/BonusPoliciesPage";
import OvertimeEntriesPage from "./pages/OvertimeEntriesPage";
import ReportPage from "./pages/ReportsPage";
import TenantEmailSettingsPage from './pages/TenantEmailSettingsPage';
import AttendanceRepairPage from './pages/AdminEmployeeAttendance/attendance-repair/AttendanceRepairPage';
import RecalculateDayCard from "./pages/AdminEmployeeAttendance/attendance-repair/RecalculateDayCard";
import CloseOpenAttendancesCard from "./pages/AdminEmployeeAttendance/attendance-repair/CloseOpenAttendancesCard";

import SystemAdminDashboard from "./pages/systemAdmin/SystemAdminDashboard"

import PlatformLogin from "./pages/platform/PlatformLogin"
// import PlatformProtectedRoute from './components/platform/PlatformProtectedRoute';
// import PlatformPublicRoute    from './components/platform/PlatformPublicRoute';
import PlatformDashboard from './pages/platform/PlatformDashboard';
import PlatformTenants   from './pages/platform/PlatformTenants';
import PlatformPlans     from './pages/platform/PlatformPlans';
import { PlatformProtectedRoute, PlatformPublicRoute } from './components/platform/PlatformRoutes';

import ActivateCompanyAccount from './pages/platform/ActivateCompanyAccount'
import PlatformTenantDetails from './pages/platform/PlatformTenantDetails';



// ProtectedRoute for admin-only pages
function ProtectedRoute({ children }) {
  const [isAdmin, setIsAdmin] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await apiGet('/users/profile');
        setIsAdmin(res.data.role === 'admin');
      } catch (err) {
        console.error('Auth check error:', err);
        setError(err.response?.data?.message || 'Authentication failed');
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  if (isAdmin === null) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/not-found" replace />;
  }

  return error ? <div className="alert alert-danger">{error}</div> : children;
}

// For protected pages (non-admin) - redirect to / if no token
function AuthenticatedRoute({ children }) {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  return children;
}

// For public pages like login and activation - redirect to /dashboard if token exists
function PublicRoute({ children, isActivation = false, isResetPassword = false }) {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // لا تعيد التوجيه إذا كانت صفحة إعادة تعيين كلمة المرور أو تفعيل الحساب
    if (token && !isActivation && !isResetPassword) {
      navigate('/attendance');
    }
  }, [navigate, isActivation, isResetPassword]);

  return children;
}

// مكون خاص لصفحات إعادة تعيين كلمة المرور (لا يحتاج auth)
function ResetPasswordRoute({ children }) {
  // لا نفعل أي شيء، فقط نعرض الأطفال
  return children;
}

// function App() {
//   const changeLanguage = (lang) => {
//     document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
//     document.documentElement.setAttribute('lang', lang);
//   };

//   document.documentElement.setAttribute('dir', 'rtl');
//   document.documentElement.setAttribute('lang', 'ar');
function App() {
  const changeLanguage = (lang) => {
    document.documentElement.setAttribute(
      'dir',
      lang === 'ar' ? 'rtl' : 'ltr'
    );
    document.documentElement.setAttribute('lang', lang);
  };

  useEffect(() => {
    const lang = localStorage.getItem('lang') || 'en';

    document.documentElement.setAttribute(
      'dir',
      lang === 'ar' ? 'rtl' : 'ltr'
    );

    document.documentElement.setAttribute('lang', lang);
  }, []);
  
  function Layout() {
    const location = useLocation();
    const isPlatformRoute = location.pathname.startsWith('/platform');
useEffect(() => {
  if (isPlatformRoute) {
    document.body.classList.add('platform-page');
  } else {
    document.body.classList.remove('platform-page');
  }
}, [isPlatformRoute]);

    const noNavbarRoutes = [
      '/', 
      '/not-found', 
      '/forgot-password', 
      '/reset-password',
      '/platform/login',      // ✅
 

'/platform/dashboard', 
  '/platform/tenants', 
  '/platform/plans',
  '/platform/tenants/:id',
 
      
    ];
    const noFooterRoutes = [
    '/',
    '/forgot-password',
    '/not-found',
    '/platform/login', 

    '/platform/dashboard', 
  '/platform/tenants', 
  '/platform/plans',
  '/platform/tenants/:id'
    

    
  ];
//     const isNoNavbarRoute = noNavbarRoutes.includes(location.pathname) || 
//                            location.pathname.startsWith('/activate/') ||
//                            location.pathname.startsWith('/reset-password/')||
//                                                   location.pathname.startsWith('/platform/activate/'); 
// ;
const isNoNavbarRoute =
  noNavbarRoutes.includes(location.pathname) ||
  location.pathname.startsWith('/activate/') ||
  location.pathname.startsWith('/reset-password/') ||
  location.pathname.startsWith('/platform/activate/') ||
  location.pathname.startsWith('/platform/tenants/'); // ✅ الحل هنا
                             const isNoFooterRoute =
    noFooterRoutes.includes(location.pathname) ||
    location.pathname.startsWith('/activate/') ||
    location.pathname.startsWith('/reset-password/')||
 location.pathname.startsWith('/platform/activate/')||location.pathname.startsWith('/platform/');


    return (
      <>
        {!isNoNavbarRoute && <Navbar changeLanguage={changeLanguage} />}
        {/* <div className="container mt-4"> */}
      <div style={{
    paddingTop: isPlatformRoute ? 0 : undefined,
    paddingBottom: isPlatformRoute ? 0 : undefined,
  }}>
          <Routes>
            {/* الصفحات العامة */}
            <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            
            {/* صفحات خاصة (لا تحتاج auth ولا تعيد توجيه) */}
            <Route 
              path="/activate/:token" 
              element={
                <PublicRoute isActivation={true}>
                  <ActivateAccount />
                </PublicRoute>
              } 
            />
            
            <Route 
              path="/reset-password/:token" 
              element={
                <ResetPasswordRoute>
                  <ResetPassword />
                </ResetPasswordRoute>
              } 
            />
            
            {/* الصفحات المحمية للمستخدمين العاديين */}
            <Route
  path="/admin/employees/:id/edit"
  element={
    <ProtectedRoute>
      <EditEmployee />
    </ProtectedRoute>
  }
/>
<Route path="/admin/employees" element={<ProtectedRoute>
  <EmployeeDirectory/>
  </ProtectedRoute>} />


            <Route path="/attendance" element={<AuthenticatedRoute><Attendance /></AuthenticatedRoute>} />
            <Route path="/profile/:id" element={<AuthenticatedRoute><UserProfile /></AuthenticatedRoute>} />
            {/* <Route path="/request-leave" element={<AuthenticatedRoute><LeaveRequestForm /></AuthenticatedRoute>} />          الصفحات المحمية للمديرين فقط */}
            <Route
              path="/adminbranches"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <AdminBranches />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route
  path="/employee-attendance"
  element={<ProtectedRoute>
  <EmployeeAttendancePage />
   </ProtectedRoute>}
/>
<Route
  path="/admin/attendance-repair"
  element={
    <ProtectedRoute>
      <AttendanceRepairPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/attendance-repair"
  element={
    <ProtectedRoute>
      <RecalculateDayCard />
    </ProtectedRoute>
  }
/><Route
  path="/admin/attendance-repair"
  element={
    <ProtectedRoute>
      <CloseOpenAttendancesCard />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/devices"
  element={
    <ProtectedRoute>
      <AdminDeviceControl />
    </ProtectedRoute>
  }
/>

<Route
path="/admin/RemotePermission"
element={ <ProtectedRoute>
      <RemotePermission />
    </ProtectedRoute>}/>


            <Route
              path="/admin/dashboardx"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <AdminDashboard />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route path="/admin/departments" element={<ProtectedRoute><DepartmentsPage /></ProtectedRoute>} />

              {/* <Route
              path="/leave-management"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <LeaveManagement />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            /> */}
            <Route
              path="/add-employee"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <AddEmployee />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
        
      {/* ================= Employee ================= */}
      <Route path="/my-leaves" element={
  <AuthenticatedRoute>
    <MyLeavesPage />
  </AuthenticatedRoute>
} />



      <Route path="/leaves/:id" element={
  <AuthenticatedRoute>
    <DetailsLeavePage />
  </AuthenticatedRoute>
} />



{/* // ✅ أي يوزر logged in يقدر يدخل */}
<Route
  path="/admin/employees/:userId/leave-profile"
  element={
    <AuthenticatedRoute>
      <EmployeeLeaveProfile />
    </AuthenticatedRoute>
  }
/>

{/* <Route
  path="/admin/employees/:userId/leave-profile"
  element={
    <ProtectedRoute>
      <EmployeeLeaveProfile />
    </ProtectedRoute>
  }
/> */}

      {/* ================= Admin ================= */}
      
<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
<Route
path="/admin/overtime-policies"
element={ <ProtectedRoute>
      <OvertimePoliciesPage />
    </ProtectedRoute>}/>

    <Route
  path="/admin/bonus-policies"
  element={
    <ProtectedRoute>
      <BonusPoliciesPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/overtime-entries"
  element={
    <ProtectedRoute>
      <OvertimeEntriesPage />
    </ProtectedRoute>
  }
/>

<Route path="/settings/email" element={
  <ProtectedRoute>
    <TenantEmailSettingsPage />
</ProtectedRoute>
} />



<Route
path="/admin/reports"
element={
 <ProtectedRoute>
      <ReportPage/>
    </ProtectedRoute>
}
/>



{/* Holidays - Admin Only */}
<Route
  path="/admin/holidays"
  element={
    <ProtectedRoute>
      <HolidaysPage />
    </ProtectedRoute>
  }
/>

{/* // Leave Management - Admin Only */}
     <Route
  path="/admin/leaves"
  element={
    <ProtectedRoute>
      <LeavesAdminPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/leave-policies"
  element={<LeavePoliciesPage />}
/>

<Route
  path="/admin/leave-policies/create"
  element={<CreateLeavePolicyPage />}
/>

<Route
  path="/admin/leave-policies/:id/edit"
  element={<EditLeavePolicyPage />}
/>
<Route path="/admin/attendance-policies">
  <Route index element={<AttendancePoliciesPage />} />
</Route>
<Route
  path="/employees/:userId/payroll/preview"
  element={<PayrollPreviewPage />}
/>
<Route path="/payroll/:id" element={<PayrollRunDetailsPage />} />

<Route path="/payroll" element={<PayrollRunsListPage />} />

{/* // ================= Submit Leave ================= */}
<Route
  path="/request-leave"
  element={
    <AuthenticatedRoute>
      <SubmitLeavePage />
    </AuthenticatedRoute>
  }
/>



    <Route
  path="/admin/system"
  element={
    <ProtectedRoute>
      <SystemAdminDashboard/>
    </ProtectedRoute>
  }
/>




<Route path="/platform/login"
  element={<PlatformPublicRoute>
    <PlatformLogin /></PlatformPublicRoute>}
/>


<Route
  path="/platform/activate/:token"
  element={
    <ResetPasswordRoute>
      <ActivateCompanyAccount />
    </ResetPasswordRoute>
  }
/>


<Route path="/platform/dashboard"
  element={<PlatformProtectedRoute>
    <PlatformDashboard />
    </PlatformProtectedRoute>}
/>
<Route path="/platform/tenants"
  element={<PlatformProtectedRoute>
    <PlatformTenants /></PlatformProtectedRoute>}
/>
<Route path="/platform/plans"
  element={<PlatformProtectedRoute>
    <PlatformPlans /></PlatformProtectedRoute>}
/>
<Route path="/platform/tenants/:id" element={<PlatformProtectedRoute><PlatformTenantDetails /></PlatformProtectedRoute>} />

            {/* صفحات الخطأ */}
            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
         {!isNoFooterRoute && <AppFooter />}
      </>
    );
  }

  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;