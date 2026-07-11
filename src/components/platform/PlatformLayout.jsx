// // src/components/platform/PlatformLayout.jsx
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { logoutPlatform } from '../../services/platform/platformAuth.service';
// import { removePlatformToken, getPlatformPayload } from '../../helpers/platformAuth';
// import logo from '../../assets/platform.png';
// const NAV = [
//   { path: '/platform/dashboard', icon: 'fa-chart-line',   label: 'Overview'   },
//   { path: '/platform/tenants',   icon: 'fa-building',     label: 'Companies'  },
//   { path: '/platform/plans',     icon: 'fa-box',          label: 'Plans'      },
// ];

// export default function PlatformLayout({ children }) {
//   const loc      = useLocation();
//   const navigate = useNavigate();
//   const user     = getPlatformPayload();

//   const handleLogout = async () => {
//     await logoutPlatform().catch(() => {});
//     removePlatformToken();
//     navigate('/platform/login');
//   };

//   const isActive = (path) => loc.pathname.startsWith(path);

//   return (
//     <div 
//   className="d-flex w-100"
//   style={{ 
//     minHeight: '100vh',
//     background: '#0f172a'
//   }}
// >

//       {/* ── Sidebar ── */}
//       <div style={{ width: 220, background: '#1e293b', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>

//         {/* Brand */}
//         <div style={{ padding: '1rem 1rem', borderBottom: '1px solid #334155' }}>
//           <div style={{ fontWeight: 800, color: '#f1f5f9', fontSize: '1rem' }}>
//                     <img
//               src={logo}
//               alt="WorkGuard HR"
//               className="platform-login-logo"
//             />
//              {/* WorkGuard */}
//           </div>
//           {/* <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>
//             Platform Admin
//           </div> */}
//         </div>

//         {/* Nav */}
//         <nav className="py-2 flex-grow-1">
//           {NAV.map(n => (
//             <Link
//               key={n.path}
//               to={n.path}
//               style={{
//                 display: 'flex', alignItems: 'center', gap: 10,
//                 padding: '0.6rem 1.25rem',
//                 color:      isActive(n.path) ? '#f1f5f9' : '#94a3b8',
//                 background: isActive(n.path) ? '#334155' : 'transparent',
//                 borderLeft: isActive(n.path) ? '3px solid #3b82f6' : '3px solid transparent',
//                 textDecoration: 'none', fontSize: '0.875rem',
//                 fontWeight: isActive(n.path) ? 600 : 400,
//                 transition: 'all .15s',
//               }}
//             >
//               <i className={`fas ${n.icon}`} style={{ width: 16 }} />
//               {n.label}
//             </Link>
//           ))}
//         </nav>

//         {/* User + Logout */}
//         <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #334155' }}>
//           <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: 8 }}>
//             <div style={{ color: '#94a3b8', fontWeight: 600 }}>{user?.name || 'Admin'}</div>
//             <div style={{ textTransform: 'capitalize' }}>{user?.role?.replace('_', ' ')}</div>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="btn btn-sm w-100"
//             style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8', fontSize: '0.8rem' }}
//           >
//             <i className="fas fa-sign-out-alt me-2" /> Logout
//           </button>
//         </div>
//       </div>

//       {/* ── Main content ── */}
//  <main
//   style={{
//     flex: 1,
//     width: '100%',
//     maxWidth: 'none',
//     overflow: 'auto',
//     padding: '1.5rem',
//     color: '#e2e8f0',
//   }}
// >
//         {children}
//       </main>

//     </div>
//   );
// }




// src/components/platform/PlatformLayout.jsx
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logoutPlatform } from '../../services/platform/platformAuth.service';
import { removePlatformToken, getPlatformPayload } from '../../helpers/platformAuth';
import logo from '../../assets/platform.png';
const NAV = [
  { path: '/platform/dashboard', icon: 'fa-chart-line',   label: 'Overview'   },
  { path: '/platform/tenants',   icon: 'fa-building',     label: 'Companies'  },
  { path: '/platform/plans',     icon: 'fa-box',          label: 'Plans'      },
];

export default function PlatformLayout({ children }) {
  const loc      = useLocation();
  const navigate = useNavigate();
  const user     = getPlatformPayload();

  // ✅ جديد — حالة فتح/قفل السايدبار في الشاشات الصغيرة (منطق إضافي بس، مفيش تعديل على القديم)
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logoutPlatform().catch(() => {});
    removePlatformToken();
    navigate('/platform/login');
  };

  const isActive = (path) => loc.pathname.startsWith(path);

  return (
    <div
      className="d-flex w-100 platform-shell"
      style={{
        minHeight: '100vh',
        background: '#0f172a'
      }}
    >
      {/* ✅ Media queries عن طريق style tag لأن الاستايلز الأصلية inline ومش عايزين نلمسها */}
      <style>{`
        .platform-topbar { display: none; }
        .platform-overlay { display: none; }

        @media (max-width: 900px) {
          .platform-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            z-index: 1050;
            transform: translateX(-100%);
            transition: transform .25s ease;
          }
          .platform-sidebar.open {
            transform: translateX(0);
          }
          .platform-topbar {
            display: flex;
          }
          .platform-overlay.open {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,.55);
            z-index: 1040;
          }
          .platform-main {
            padding-top: 4.25rem !important;
          }
        }
      `}</style>

      {/* ── Mobile Topbar (نافبار للشاشات الصغيرة) ── */}
      <div
        className="platform-topbar"
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          height: '3.75rem',
          background: '#1e293b',
          borderBottom: '1px solid #334155',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
          zIndex: 1060,
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={() => setMobileOpen(true)}
            className="btn btn-sm"
            style={{ background: 'transparent', border: '1px solid #334155', color: '#f1f5f9' }}
          >
            <i className="fas fa-bars" />
          </button>
          <img
            src={logo}
            alt="WorkGuard HR"
            style={{ height: 28 }}
          />
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-sm"
          style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8' }}
        >
          <i className="fas fa-sign-out-alt" />
        </button>
      </div>

      {/* ── Overlay خلف السايدبار في الموبايل ── */}
      <div
        className={`platform-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── Sidebar ── */}
      <div
        className={`platform-sidebar ${mobileOpen ? 'open' : ''}`}
        style={{ width: 220, background: '#1e293b', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', flexShrink: 0 }}
      >

        {/* Brand */}
        <div style={{ padding: '1rem 1rem', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 800, color: '#f1f5f9', fontSize: '1rem' }}>
                    <img
              src={logo}
              alt="WorkGuard HR"
              className="platform-login-logo"
            />
             {/* WorkGuard */}
          </div>
          {/* ✅ زرار قفل السايدبار في الموبايل بس */}
          <button
            onClick={() => setMobileOpen(false)}
            className="btn btn-sm d-md-none"
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', display: mobileOpen ? undefined : 'none' }}
          >
            <i className="fas fa-times" />
          </button>
          {/* <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>
            Platform Admin
          </div> */}
        </div>

        {/* Nav */}
        <nav className="py-2 flex-grow-1">
          {NAV.map(n => (
            <Link
              key={n.path}
              to={n.path}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '0.6rem 1.25rem',
                color:      isActive(n.path) ? '#f1f5f9' : '#94a3b8',
                background: isActive(n.path) ? '#334155' : 'transparent',
                borderLeft: isActive(n.path) ? '3px solid #3b82f6' : '3px solid transparent',
                textDecoration: 'none', fontSize: '0.875rem',
                fontWeight: isActive(n.path) ? 600 : 400,
                transition: 'all .15s',
              }}
            >
              <i className={`fas ${n.icon}`} style={{ width: 16 }} />
              {n.label}
            </Link>
          ))}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #334155' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: 8 }}>
            <div style={{ color: '#94a3b8', fontWeight: 600 }}>{user?.name || 'Admin'}</div>
            <div style={{ textTransform: 'capitalize' }}>{user?.role?.replace('_', ' ')}</div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-sm w-100"
            style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8', fontSize: '0.8rem' }}
          >
            <i className="fas fa-sign-out-alt me-2" /> Logout
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
 <main
  className="platform-main"
  style={{
    flex: 1,
    width: '100%',
    maxWidth: 'none',
    overflow: 'auto',
    padding: '1.5rem',
    color: '#e2e8f0',
  }}
>
        {children}
      </main>

    </div>
  );
}