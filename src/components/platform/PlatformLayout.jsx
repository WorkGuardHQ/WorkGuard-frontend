// src/components/platform/PlatformLayout.jsx
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

  const handleLogout = async () => {
    await logoutPlatform().catch(() => {});
    removePlatformToken();
    navigate('/platform/login');
  };

  const isActive = (path) => loc.pathname.startsWith(path);

  return (
    <div 
  className="d-flex w-100"
  style={{ 
    minHeight: '100vh',
    background: '#0f172a'
  }}
>

      {/* ── Sidebar ── */}
      <div style={{ width: 220, background: '#1e293b', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>

        {/* Brand */}
        <div style={{ padding: '1rem 1rem', borderBottom: '1px solid #334155' }}>
          <div style={{ fontWeight: 800, color: '#f1f5f9', fontSize: '1rem' }}>
                    <img
              src={logo}
              alt="WorkGuard HR"
              className="platform-login-logo"
            />
             {/* WorkGuard */}
          </div>
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