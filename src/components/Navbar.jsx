
// import React, { useState, useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import { Link, useNavigate } from "react-router-dom";
// import { apiGet } from "../helpers/api";
// import logo from "../assets/logo.png";

// function Navbar() {
//   const { t, i18n } = useTranslation();
//   const [lang, setLang] = useState(localStorage.getItem("lang") || "ar");
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   // تغيير اللغة وتخزينها
//   const handleLanguageChange = (newLang) => {
//     setLang(newLang);
//     i18n.changeLanguage(newLang);
//     localStorage.setItem("lang", newLang);
//     document.documentElement.setAttribute("lang", newLang);
//   };

//   // أول ما الصفحة تفتح، طبق اللغة المخزنة
//   useEffect(() => {
//     i18n.changeLanguage(lang);
//     document.documentElement.setAttribute("lang", lang);
//   }, [lang, i18n]);

//   // التشيك على صلاحية الأدمن
//   useEffect(() => {
//     const checkRole = async () => {
//       try {
//         const res = await apiGet("/auth/profile");
//         setIsAdmin(res.data.role === "admin");
//       } catch (err) {
//         setError(t("error") || "Error");
//         navigate("/");
//       }
//     };
//     checkRole();
//   }, [t, navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
//       <div className="container-fluid">
//         <img src={logo} alt="WorkGuard " className="logo-img  me-4" />

//                  {/* glow-effect */}

//         {/* <h2 className="navbar-brand me-2">WorkGuard </h2> */}

//         {error && <div className="alert alert-danger mb-0">{error}</div>}

//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//           aria-controls="navbarNav"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav me-auto">
//             <li className="nav-item">
//               <Link className="nav-link" to="/attendance">{t("attendance")}</Link>
//             </li>
           
//             {isAdmin && (
//               <>
//               <li className="nav-item">
//                   <Link className="nav-link" to="/admin/dashboardx">{t("adminDashboardx")}</Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/admin/dashboard">{t("adminDashboard")}</Link>
//                 </li>
//                  <li className="nav-item">
//               <Link className="nav-link" to="/employee-attendance">{t("emp.attendance")}</Link>
//             </li>
            
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/adminbranches">{t("branches")}</Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/admin/devices">{t("deviceManagement")}</Link> </li>
                  

//                   <li className="nav-item">
//   <Link className="nav-link" to="/admin/leaves">
//     {t("leaveManagement")}
//   </Link>
// </li>

//               </>
//             )}
//             <li className="nav-item">
//               <Link className="nav-link" to="/profile/me">{t("profile")}</Link>
//             </li>
//             <li className="nav-item">
//   <Link className="nav-link" to="/leaves">
//     <i className="fa-solid fa-calendar-plus me-1" />
//     {t('leave.Leaves')}
//   </Link>
// </li>

//           </ul>

//           <div className="d-flex">
//             <select
//               className="form-select me-2"
//               value={lang}
//               onChange={(e) => handleLanguageChange(e.target.value)}
//             >
//               <option value="en">English</option>
//               <option value="ar">العربية</option>
//             </select>
//             <button className="btn btn-outline-danger" onClick={handleLogout}>
//               {t("logout")}
//             </button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { apiGet } from "../helpers/api";
import { isGlobalAdmin } from '../helpers/auth';
import Toast from "./ui/Toast";


import logo from "../assets/logolgoin - nav.png";
import "../style/navbar-modern.css";

function Navbar() {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
const [showLangMenu, setShowLangMenu] = useState(false);
const [showLogoutToast, setShowLogoutToast] = useState(false);
  // تغيير اللغة وتخزينها
  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
    document.documentElement.setAttribute("lang", newLang);
    document.documentElement.setAttribute("dir", newLang === "ar" ? "rtl" : "ltr");
  };

  // أول ما الصفحة تفتح، طبق اللغة المخزنة
  useEffect(() => {
    i18n.changeLanguage(lang);
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  }, [lang, i18n]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // التشيك على صلاحية الأدمن
  useEffect(() => {
    const checkRole = async () => {
      try {
        const res = await apiGet("/users/profile");
        setIsAdmin(res.data.role === "admin");
      } catch (err) {
        setError(t("error") || "Error");
        setTimeout(() => setError(""), 3000);
      }
    };
    checkRole();
  }, [t]);

  // Close navbar on route change (mobile)
  useEffect(() => {
    setIsCollapsed(true);
  }, [location.pathname]);

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   navigate("/");
  // };

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Check if link is active
  const isActiveLink = (path) => {
    return location.pathname === path;
  };


  return (
    <>
    <nav className={`navbar navbar-expand-lg fixed-top modern-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container-fluid navbar-container">
        {/* Logo & Brand */}
        <div className="navbar-logo-wrapper">
          <img src={logo} alt="WorkGuard" className="navbar-logo" />
          {/* <h2 className="navbar-brand-text">WorkGuard </h2> */}
        </div>

        {/* Error Display */}
        {error && (
          <div className="navbar-error">
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        {/* Toggler for Mobile */}
        <button
          className="navbar-toggler modern-navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarNav"
          aria-expanded={!isCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon-custom"></span>
        </button>

        {/* Navbar Content */}
        <div 
          className={`collapse navbar-collapse navbar-collapse-modern ${!isCollapsed ? 'show' : ''}`} 
          id="navbarNav"
        >
          {/* Navigation Links */}
          <ul className="navbar-nav me-auto navbar-nav-modern">
            {/* Attendance */}
            <li className="nav-item nav-item-modern">
              <Link 
                className={`nav-link nav-link-modern ${isActiveLink('/attendance') ? 'active' : ''}`} 
                to="/attendance"
              >
               
                <i className="fa-solid fa-user-check"></i>
                {/* <i className="fa-solid fa-business-time"></i> */}
                {/* <i className="fas fa-clock"></i> */}
                {t("attendance.attendance")}
              </Link>
            </li>

            {/* Admin Links */}
            {isAdmin && (
              <>
                {/* Dashboard X */}
                <li className="nav-item nav-item-modern">
                  <Link 
                    className={`nav-link nav-link-modern ${isActiveLink('/admin/dashboard') ? 'active' : ''}`} 
                    to="/admin/dashboard"
                  >
                    {/* <i className="fas fa-chart-line"></i> */}

                    <i className="fa-solid fa-gauge-high"></i>
                    {t("Dashboard")}
                  </Link>
                </li>

                {/* Dashboard */}
                {/* <li className="nav-item nav-item-modern">
                  <Link 
                    className={`nav-link nav-link-modern ${isActiveLink('/admin/dashboardx') ? 'active' : ''}`} 
                    to="/admin/dashboardx"
                  >
                    <i className="fas fa-tachometer-alt"></i>
                    {t("adminDashboard")}
                  </Link>
                </li> */}

                {/* Employee Attendance */}
                <li className="nav-item nav-item-modern">
                  <Link 
                    className={`nav-link nav-link-modern ${isActiveLink('/employee-attendance') ? 'active' : ''}`} 
                    to="/employee-attendance"
                  >
                    {/* <i className="fas fa-users-clock"></i> */}

                    <i className="fa-solid fa-clipboard-check"></i>
                    {/* <i className="fa-solid fa-calendar-check"></i> */}
{/* <i className="fa-solid fa-users-viewfinder"></i> */}

                    {t("emp.attendance")}
                  </Link>
                </li>

                {/* Branches */}
                {/* <li className="nav-item nav-item-modern">
                  <Link 
                    className={`nav-link nav-link-modern ${isActiveLink('/adminbranches') ? 'active' : ''}`} 
                    to="/adminbranches"
                  >
                    <i className="fas fa-building"></i>
                    {t("branches")}
                  </Link>
                </li> */}

                {/* Devices */}
                {/* <li className="nav-item nav-item-modern">
                  <Link 
                    className={`nav-link nav-link-modern ${isActiveLink('/admin/devices') ? 'active' : ''}`} 
                    to="/admin/devices"
                  >
                    <i className="fas fa-mobile-alt"></i>
                    {t("deviceManagement")}
                  </Link>
                </li> */}

                {/* Leave Management */}
                {/* <li className="nav-item nav-item-modern">
                  <Link 
                    className={`nav-link nav-link-modern ${isActiveLink('/admin/leaves') ? 'active' : ''}`} 
                    to="/admin/leaves"
                  >
                    <i className="fas fa-calendar-check"></i>
                    {t("leaveManagement")}
                  </Link>
                </li> */}
              </>
            )}

            {/* Profile */}
            <li className="nav-item nav-item-modern">
              <Link 
                className={`nav-link nav-link-modern ${isActiveLink('/profile/me') ? 'active' : ''}`} 
                to="/profile/me"
              >
                {/* <i className="fas fa-user"></i> */}
                <i className="fa-solid fa-circle-user"></i>
                
                {t("profile")}
              </Link>
            </li>

            {/* Leaves */}
            <li className="nav-item nav-item-modern">
              <Link 
                className={`nav-link nav-link-modern ${isActiveLink('/my-leaves') ? 'active' : ''}`} 
                to="/my-leaves"
              >
                <i className="fas fa-calendar-plus"></i>
                {t('leave.MyLeaves')}
              </Link>
            </li>
          </ul>

          {/* Right Section - Language & Logout */}
          <div className="navbar-actions">
            {/* Language Selector */}
            {/* <select
              className="form-select language-selector"
              value={lang}
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              <option value="en">🇬🇧 English</option>
              <option value="ar">🇸🇦 العربية</option>
            </select> */}
{/* Language Switcher */}
<div className="lang-switcher-pro">
  <button
    className="lang-trigger"
    onClick={() => setShowLangMenu(!showLangMenu)}
    aria-label="Change language"
  >
    <i className="fas fa-globe"></i>
  </button>

  {showLangMenu && (
    <div className="lang-menu">
      <button
        className={`lang-item ${lang === "en" ? "active" : ""}`}
        onClick={() => {
          handleLanguageChange("en");
          setShowLangMenu(false);
        }}
      >
        <span>🇬🇧 English</span>
        {lang === "en" && <i className="fas fa-check"></i>}
      </button>

      <button
        className={`lang-item ${lang === "ar" ? "active" : ""}`}
        onClick={() => {
          handleLanguageChange("ar");
          setShowLangMenu(false);
        }}
      >
        <span>🇸🇦 العربية</span>
        {lang === "ar" && <i className="fas fa-check"></i>}
      </button>
    </div>
  )}
</div>

{/* Settings — Global Admin Only */}
{isGlobalAdmin() && (
  <Link
    to="/settings/email"
    className={`nav-link-icon-btn ${isActiveLink('/settings/email') ? 'active' : ''}`}
    title={t('emailSettings')}
  >
    <i className="fas fa-gear" />
  </Link>
)}
            {/* Logout Button */}
            {/* <button className="btn logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              {t("logout")}
            </button> */}
<button
  className="btn logout-btn"
  onClick={() => setShowLogoutToast(true)}
>
  <i className="fas fa-sign-out-alt"></i>
  <span className="logout-text">{t("logout")}</span>
</button>
            {/* <button className="btn logout-btn " onClick={handleLogout} >
  <i className="fas fa-sign-out-alt"></i>
 
  <span className="logout-text">
    {t("logout")}
    </span>
</button> */}

          </div>
        </div>
      </div>
    </nav>

      <Toast
  show={showLogoutToast}
  type="warning"
  message={t("logoutConfirm") || "Are you sure you want to logout?"}
  confirmText={t("yes") || "Yes"}
  cancelText={t("cancel") || "Cancel"}
  onClose={() => setShowLogoutToast(false)}
  onConfirm={async () => {
    localStorage.removeItem("token");
    navigate("/");
  }}
/> 
</>
  );
}

export default Navbar;