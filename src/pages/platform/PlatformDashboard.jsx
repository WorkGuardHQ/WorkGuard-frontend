// // src/pages/platform/PlatformDashboard.jsx
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getTenants } from '../../services/platform/platformTenants.service';
// import { getPlans }   from '../../services/platform/platformPlans.service';
// import PlatformLayout from '../../components/platform/PlatformLayout';

// /* ─── Stat Card ─────────────────────────────── */
// function StatCard({ icon, label, value, color, to }) {
//   const navigate = useNavigate();
//   const colors = {
//     blue:   { bg: '#1e3a5f', border: '#3b82f6', icon: '#60a5fa' },
//     green:  { bg: '#14532d', border: '#22c55e', icon: '#4ade80' },
//     red:    { bg: '#450a0a', border: '#ef4444', icon: '#f87171' },
//     yellow: { bg: '#422006', border: '#f59e0b', icon: '#fbbf24' },
//   };
//   const c = colors[color] || colors.blue;

//   return (
//     <div
//       onClick={() => to && navigate(to)}
//       style={{
//         background: c.bg, border: `1px solid ${c.border}`,
//         borderRadius: 12, padding: '1.25rem',
//         cursor: to ? 'pointer' : 'default',
//         transition: 'transform .15s',
//         flex: 1, minWidth: 160,
//       }}
//       onMouseEnter={e => to && (e.currentTarget.style.transform = 'translateY(-2px)')}
//       onMouseLeave={e => to && (e.currentTarget.style.transform = 'none')}
//     >
//       <div style={{ fontSize: '1.5rem', color: c.icon, marginBottom: 8 }}>
//         <i className={`fas ${icon}`} />
//       </div>
//       <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>
//         {value ?? <span className="spinner-border spinner-border-sm" />}
//       </div>
//       <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 4 }}>{label}</div>
//     </div>
//   );
// }

// /* ─── Recent Tenants Table ───────────────────── */
// function RecentTenants({ tenants }) {
//   const statusBadge = (s) => {
//     const map = { active: 'success', suspended: 'danger', inactive: 'secondary' };
//     return <span className={`badge bg-${map[s] || 'secondary'}`}>{s}</span>;
//   };

//   return (
//     <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: '1.25rem' }}>
//       <h6 style={{ color: '#f1f5f9', fontWeight: 600, marginBottom: '1rem' }}>
//         <i className="fas fa-clock me-2 text-primary" />
//         Recent Companies
//       </h6>
//       <table className="table table-sm mb-0" style={{ color: '#e2e8f0' }}>
//         <thead>
//           <tr style={{ borderColor: '#334155' }}>
//             <th style={{ color: '#64748b', fontWeight: 500, borderColor: '#334155' }}>Company</th>
//             <th style={{ color: '#64748b', fontWeight: 500, borderColor: '#334155' }}>Subdomain</th>
//             <th style={{ color: '#64748b', fontWeight: 500, borderColor: '#334155' }}>Plan</th>
//             <th style={{ color: '#64748b', fontWeight: 500, borderColor: '#334155' }}>Status</th>
//             <th style={{ color: '#64748b', fontWeight: 500, borderColor: '#334155' }}>Created</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tenants.map(t => (
//             <tr key={t._id} style={{ borderColor: '#1e293b' }}>
//               <td style={{ borderColor: '#334155', fontWeight: 600 }}>{t.companyName}</td>
//               <td style={{ borderColor: '#334155' }}>
//                 <code style={{ color: '#7dd3fc', fontSize: '0.78rem' }}>{t.subdomain}</code>
//               </td>
//               <td style={{ borderColor: '#334155', textTransform: 'capitalize' }}>{t.subscriptionPlan}</td>
//               <td style={{ borderColor: '#334155' }}>{statusBadge(t.status)}</td>
//               <td style={{ borderColor: '#334155', color: '#64748b', fontSize: '0.8rem' }}>
//                 {new Date(t.createdAt).toLocaleDateString('en-GB')}
//               </td>
//             </tr>
//           ))}
//           {!tenants.length && (
//             <tr><td colSpan={5} className="text-center" style={{ color: '#475569', padding: '1.5rem' }}>No companies yet</td></tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// /* ─── Main ───────────────────────────────────── */
// export default function PlatformDashboard() {
//   const [stats, setStats]     = useState({});
//   const [recent, setRecent]   = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     Promise.all([
//       getTenants({ limit: 1 }),
//       getTenants({ limit: 1, status: 'active' }),
//       getTenants({ limit: 1, status: 'suspended' }),
//       getTenants({ limit: 5 }),
//       getPlans({ activeOnly: 'false', limit: 1 }),
//     ]).then(([all, active, suspended, recent5, plans]) => {
//       setStats({
//         total:     all.data.pagination.total,
//         active:    active.data.pagination.total,
//         suspended: suspended.data.pagination.total,
//         plans:     plans.data.pagination.total,
//       });
//       setRecent(recent5.data.data);
//     }).finally(() => setLoading(false));
//   }, []);

//   return (
//     <PlatformLayout>
//       <div style={{ maxWidth: 1100 }}>
//         <h4 style={{ color: '#f1f5f9', fontWeight: 700, marginBottom: '1.5rem' }}>
//           <i className="fas fa-chart-line me-2 text-primary" />
//           Overview
//         </h4>

//         {/* Stats */}
//         <div className="d-flex flex-wrap gap-3 mb-4">
//           <StatCard icon="fa-building"   label="Total Companies"   value={stats.total}     color="blue"   to="/platform/tenants" />
//           <StatCard icon="fa-check-circle" label="Active"          value={stats.active}    color="green"  to="/platform/tenants?status=active" />
//           <StatCard icon="fa-ban"         label="Suspended"        value={stats.suspended} color="red"    to="/platform/tenants?status=suspended" />
//           <StatCard icon="fa-box"         label="Plans"            value={stats.plans}     color="yellow" to="/platform/plans" />
//         </div>

//         {/* Recent */}
//         {loading
//           ? <div className="text-center py-5"><span className="spinner-border" style={{ color: '#3b82f6' }} /></div>
//           : <RecentTenants tenants={recent} />
//         }
//       </div>
//     </PlatformLayout>
//   );
// }


// src/pages/platform/PlatformDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import platformApi from '../../helpers/platformApi';
import PlatformLayout from '../../components/platform/PlatformLayout';
import logo from '../../assets/workguard-logo.png';
/* ─── Stat Card ─────────────────────────────── */
function StatCard({ icon, label, value, color, to }) {
  const navigate = useNavigate();
  const colors   = {
    blue:   'border-primary text-primary',
    green:  'border-success text-success',
    red:    'border-danger  text-danger',
    yellow: 'border-warning text-warning',
  };

  return (
    <div
      className={`card border ${colors[color] || 'border-secondary'} h-100`}
      style={{ background: '#1e293b', cursor: to ? 'pointer' : 'default', transition: 'transform .15s' }}
      onClick={() => to && navigate(to)}
      onMouseEnter={e => to && (e.currentTarget.style.transform = 'translateY(-3px)')}
      onMouseLeave={e => to && (e.currentTarget.style.transform = 'none')}
    >
      <div className="card-body">
        <div className={`fs-4 mb-2 ${colors[color]?.split(' ')[1]}`}>
          <i className={`fas ${icon}`} />
        </div>
        <div className="fs-2 fw-bold" style={{ color: '#f1f5f9', lineHeight: 1 }}>
          {value ?? <span className="spinner-border spinner-border-sm" />}
        </div>
        <div className="small mt-1" style={{ color: '#94a3b8' }}>{label}</div>
      </div>
    </div>
  );
}

/* ─── Recent Tenants ─────────────────────────── */
function RecentTable({ tenants }) {
  const badge = (s) => {
    const map = { active: 'success', suspended: 'danger', inactive: 'secondary' };
    return <span className={`badge bg-${map[s] || 'secondary'}`}>{s}</span>;
  };

  return (
    <div className="card" style={{ background: '#1e293b', border: '1px solid #334155' }}>
      <div className="card-header" style={{ background: '#0f172a', borderColor: '#334155' }}>
        <span style={{ color: '#f1f5f9', fontWeight: 600 }}>
          <i className="fas fa-clock me-2 text-primary" />Recent Companies
        </span>
      </div>
      {/* <div className="table-responsive"> */}
      <div className="table-responsive rounded-3">
        <table className="table table-sm mb-0" style={{ color: '#e2e8f0' }}>
          <thead>
            <tr style={{ borderColor: '#334155' }}>
              {['Company', 'Subdomain', 'Plan', 'Status', 'Created'].map(h => (
                <th key={h} style={{ color: '#64748b', borderColor: '#334155', fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tenants.map(t => (
              <tr key={t._id} style={{ borderColor: '#334155' }}>
                <td style={{ borderColor: '#334155', fontWeight: 600 }}>{t.companyName}</td>
                <td style={{ borderColor: '#334155' }}>
                  <code style={{ color: '#7dd3fc', fontSize: '0.78rem' }}>{t.subdomain}</code>
                </td>
                <td style={{ borderColor: '#334155', textTransform: 'capitalize' }}>{t.subscriptionPlan || '—'}</td>
                <td style={{ borderColor: '#334155' }}>{badge(t.status)}</td>
                <td style={{ borderColor: '#334155', color: '#64748b', fontSize: '0.8rem' }}>
                  {new Date(t.createdAt).toLocaleDateString('en-GB')}
                </td>
              </tr>
            ))}
            {!tenants.length && (
              <tr>
                <td colSpan={5} className="text-center py-4" style={{ color: '#475569', borderColor: '#334155' }}>
                  No companies yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


function HealthItem({
  color,
  label,
  value,
}) {
  return (

    <div
      className="d-flex justify-content-between align-items-center mb-3"
    >

      <div>

        <div
          style={{
            color: "#94a3b8",
            fontSize: 13,
          }}
        >
          {label}
        </div>

      </div>

      <span
        className={`badge bg-${color}`}
        style={{
          fontSize: 13,
          minWidth: 42,
        }}
      >
        {value}
      </span>

    </div>

  );
}

// SubscriptionHealthCard
function SubscriptionHealthCard({
  companies,
}) {

  return (

    <div
      className="card mb-4"
      style={{
        background: "#1e293b",
        border: "1px solid #334155",
      }}
    >

      <div
        className="card-header"
        style={{
          background: "#0f172a",
          borderColor: "#334155",
        }}
      >

        <span
          style={{
            color: "#f1f5f9",
            fontWeight: 600,
          }}
        >

          <i className="fas fa-heartbeat me-2 text-primary"/>

          Subscription Health

        </span>

      </div>

      <div className="card-body">

        <HealthItem
          color="success"
          label="Active"
          value={companies.active}
        />

        <HealthItem
          color="info"
          label="Trial"
          value={companies.trial}
        />

        <HealthItem
          color="danger"
          label="Expired"
          value={companies.expired}
        />

        <HealthItem
          color="warning"
          label="Expiring Soon"
          value={companies.expiringSoon}
        />

        <HealthItem
          color="secondary"
          label="Suspended"
          value={companies.suspended}
        />

      </div>

    </div>

  );

}


// BillingCard
function BillingCard({
    billing,
}) {

    return (

        <div
            className="card mb-4"
            style={{
                background: "#1e293b",
                border: "1px solid #334155",
            }}
        >

            <div
                className="card-header"
                style={{
                    background: "#0f172a",
                    borderColor: "#334155",
                }}
            >

                <span
                    style={{
                        color: "#f1f5f9",
                        fontWeight: 600,
                    }}
                >
                    <i className="fas fa-wallet me-2 text-success" />

                    Billing Summary

                </span>

            </div>

            <div className="card-body">

                <div className="row g-3">

                    <div className="col-md-3">

                        <div
                            style={{
                                background: "#0f172a",
                                padding: 18,
                                borderRadius: 10,
                                border: "1px solid #334155",
                            }}
                        >

                            <div
                                style={{
                                    color: "#94a3b8",
                                    fontSize: 13,
                                }}
                            >
                                Revenue This Month
                            </div>

                            <div
                                style={{
                                    fontSize: 24,
                                    color: "#22c55e",
                                    fontWeight: 700,
                                }}
                            >
                                {billing.monthlyRevenue} EGP
                            </div>

                        </div>

                    </div>

                    <div className="col-md-3">

                        <div
                            style={{
                                background: "#0f172a",
                                padding: 18,
                                borderRadius: 10,
                                border: "1px solid #334155",
                            }}
                        >

                            <div
                                style={{
                                    color: "#94a3b8",
                                    fontSize: 13,
                                }}
                            >
                                Renewals
                            </div>

                            <div
                                style={{
                                    fontSize: 24,
                                    color: "#3b82f6",
                                    fontWeight: 700,
                                }}
                            >
                                {billing.renewalsThisMonth}
                            </div>

                        </div>

                    </div>

                    <div className="col-md-3">

                        <div
                            style={{
                                background: "#0f172a",
                                padding: 18,
                                borderRadius: 10,
                                border: "1px solid #334155",
                            }}
                        >

                            <div
                                style={{
                                    color: "#94a3b8",
                                    fontSize: 13,
                                }}
                            >
                                Pending Charges
                            </div>

                            <div
                                style={{
                                    fontSize: 24,
                                    color: "#f59e0b",
                                    fontWeight: 700,
                                }}
                            >
                                {billing.pendingAmount} EGP
                            </div>

                        </div>

                    </div>

                    <div className="col-md-3">

                        <div
                            style={{
                                background: "#0f172a",
                                padding: 18,
                                borderRadius: 10,
                                border: "1px solid #334155",
                            }}
                        >

                            <div
                                style={{
                                    color: "#94a3b8",
                                    fontSize: 13,
                                }}
                            >
                                Pending Invoices
                            </div>

                            <div
                                style={{
                                    fontSize: 24,
                                    color: "#ef4444",
                                    fontWeight: 700,
                                }}
                            >
                                {billing.pendingInvoices}
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}
/* ─── Main ───────────────────────────────────── */
export default function PlatformDashboard() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    // ✅ Single request — stats endpoint handles everything
    platformApi.get('/tenants/stats')
      .then(r => setStats(r.data))
      .catch(() => setError('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PlatformLayout>
      {/* <div style={{ maxWidth: 1100 }}> */}
      <div style={{ width: '100%',
    maxWidth: '1600px',}}>
        <h4 style={{ color: '#f1f5f9', fontWeight: 700, marginBottom: '1.5rem' }}>
          <i className="fas fa-chart-line me-2 text-primary" />Overview
        </h4>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading
          ? <div className="text-center py-5"><span className="spinner-border" style={{ color: '#3b82f6' }} /></div>
          : (
            <>
              {/* Stats row */}
              {/* <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                  <StatCard icon="fa-building"    label="Total Companies" value={stats.companies.total}     color="blue"   to="/platform/tenants" />
                </div>
                <div className="col-6 col-md-3">
                  <StatCard icon="fa-check-circle" label="Active"         value={stats.companies.active}    color="green"  to="/platform/tenants?status=active" />
                </div>
                <div className="col-6 col-md-3">
                  <StatCard icon="fa-ban"          label="Suspended"      value={stats.companies.suspended} color="red"    to="/platform/tenants?status=suspended" />
                </div>
                <div className="col-6 col-md-3">
                  <StatCard icon="fa-box"          label="Active Plans"   value={stats.plans}     color="yellow" to="/platform/plans" />
                </div>
              </div> */}

<div className="row g-3 mb-4">

  <div className="col-6 col-md-3">
    <StatCard
      icon="fa-building"
      label="Total Companies"
      value={stats.companies.total}
      color="blue"
      to="/platform/tenants"
    />
  </div>

  <div className="col-6 col-md-3">
    <StatCard
      icon="fa-check-circle"
      label="Active Companies"
      value={stats.companies.active}
      color="green"
      to="/platform/tenants?status=active"
    />
  </div>

  <div className="col-6 col-md-3">
    <StatCard
      icon="fa-hourglass-half"
      label="Expiring Soon"
      value={stats.companies.expiringSoon}
      color="red"
    />
  </div>

  <div className="col-6 col-md-3">
    <StatCard
      icon="fa-money-bill-wave"
      label="Monthly Revenue"
      value={`${stats.billing.monthlyRevenue} EGP`}
      color="yellow"
    />
  </div>

</div>

{/* SubscriptionHealthCard */}
<SubscriptionHealthCard
    companies={stats.companies}
/>
{/* BillingCard */}
<BillingCard
    billing={stats.billing}
/>
              {/* Recent */}
             <RecentTable
    tenants={stats.recentCompanies || []}
/>
            </>
          )
        }
      </div>
    </PlatformLayout>
  );
}