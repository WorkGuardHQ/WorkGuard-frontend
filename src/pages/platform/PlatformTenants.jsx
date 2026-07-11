// // src/pages/platform/PlatformTenants.jsx
// import { useNavigate } from 'react-router-dom';
// import { useState, useEffect, useCallback } from 'react';
// import { getTenants, createTenant, updateTenantStatus } from '../../services/platform/platformTenants.service';
// import { getPlans } from '../../services/platform/platformPlans.service';
// import PlatformLayout from '../../components/platform/PlatformLayout';
// import Toast from '../../components/ui/Toast';

// /* ─── Create Modal ───────────────────────────── */
// function CreateTenantModal({ show, plans, onClose, onSuccess }) {
  
//   const [form, setForm]       = useState({ companyName: '', adminName: '', adminEmail: '', planSlug: '' ,timezone: 'UTC'});
//   const [loading, setLoading] = useState(false);
//   const [error, setError]     = useState('');


// // ── 2. ضيف قائمة الـ timezones
// const TIMEZONES = [
//   { value: 'UTC',                  label: 'UTC (Universal)' },
//   { value: 'Africa/Cairo',         label: 'Cairo (UTC+2/+3)' },
//   { value: 'Asia/Riyadh',          label: 'Riyadh (UTC+3)' },
//   { value: 'Asia/Dubai',           label: 'Dubai (UTC+4)' },
//   { value: 'Asia/Kuwait',          label: 'Kuwait (UTC+3)' },
//   { value: 'Asia/Beirut',          label: 'Beirut (UTC+2/+3)' },
//   { value: 'Asia/Amman',           label: 'Amman (UTC+2/+3)' },
//   { value: 'Asia/Baghdad',         label: 'Baghdad (UTC+3)' },
//   { value: 'Europe/London',        label: 'London (UTC+0/+1)' },
//   { value: 'Europe/Paris',         label: 'Paris (UTC+1/+2)' },
//   { value: 'America/New_York',     label: 'New York (UTC-5/-4)' },
//   { value: 'America/Los_Angeles',  label: 'Los Angeles (UTC-8/-7)' },
//   { value: 'Asia/Karachi',         label: 'Karachi (UTC+5)' },
//   { value: 'Asia/Kolkata',         label: 'India (UTC+5:30)' },
//   { value: 'Asia/Singapore',       label: 'Singapore (UTC+8)' },
// ];


//   useEffect(() => {
//     if (show && plans.length) setForm(p => ({ ...p, planSlug: plans[0].slug }));
//     if (!show) setError('');
//   }, [show, plans]);

//   if (!show) return null;

//   const submit = async (e) => {
//     e.preventDefault();
//     setLoading(true); setError('');
//     try {
//       await createTenant(form);
//       onSuccess();
//      setForm({ companyName: '', adminName: '', adminEmail: '', planSlug: plans[0]?.slug || '', timezone: 'UTC' });

//     } catch (err) {
//       setError(err.response?.data?.errors?.join(' · ') || err.response?.data?.message || 'Failed');
//     } finally { setLoading(false); }
//   };

//   return (
//     <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,.65)' }}>
//       <div className="modal-dialog modal-dialog-centered">
//         <div className="modal-content" style={{ background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0' }}>

//           <div className="modal-header" style={{ borderColor: '#334155' }}>
//             <h5 className="modal-title" style={{ color: '#f1f5f9' }}>
//               <i className="fas fa-plus-circle me-2 text-primary" />
//               Create New Company
//             </h5>
//             <button className="btn-close btn-close-white" onClick={onClose} />
//           </div>

//           <form onSubmit={submit}>
//             <div className="modal-body">
//               {error && (
//                 <div className="alert alert-danger py-2 small">{error}</div>
//               )}


//               <div className="mb-3">
//                 <label className="form-label small" style={{ color: '#94a3b8' }}>Company Name *</label>
//                 <input className="form-control" style={{ background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9' }}
//                   value={form.companyName} onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))} required />
//               </div><div className="mb-3">
//   <label className="form-label small" style={{ color: '#94a3b8' }}>
//     🌍 Timezone *
//   </label>
//   <select 
//     className="form-select" 
//     style={{ background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9' }}
//     value={form.timezone} 
//     onChange={e => setForm(p => ({ ...p, timezone: e.target.value }))} 
//     required
//   >
//     {TIMEZONES.map(tz => (
//       <option key={tz.value} value={tz.value}>
//         {tz.label}
//       </option>
//     ))}
//   </select>
//   <small style={{ color: '#64748b' }}>
//     ⚠️ Affects all date calculations — choose carefully
//   </small>
// </div>

//               <div className="mb-3">
//                 <label className="form-label small" style={{ color: '#94a3b8' }}>Admin Name</label>
//                 <input className="form-control" style={{ background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9' }}
//                   value={form.adminName} onChange={e => setForm(p => ({ ...p, adminName: e.target.value }))} />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label small" style={{ color: '#94a3b8' }}>Admin Email *</label>
//                 <input type="email" className="form-control" style={{ background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9' }}
//                   value={form.adminEmail} onChange={e => setForm(p => ({ ...p, adminEmail: e.target.value }))} required />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label small" style={{ color: '#94a3b8' }}>Plan *</label>
//                 <select className="form-select" style={{ background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9' }}
//                   value={form.planSlug} onChange={e => setForm(p => ({ ...p, planSlug: e.target.value }))} required>
//                   {plans.map(p => (
//                     <option key={p.slug} value={p.slug}>
//                       {p.name} — {p.price} {p.currency} / {p.durationDays} days
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="modal-footer" style={{ borderColor: '#334155' }}>
//               <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
//               <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
//                 {loading ? <><span className="spinner-border spinner-border-sm me-1" />Creating...</> : 'Create Company'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─── Main ───────────────────────────────────── */
// export default function PlatformTenants() {
//     const navigate  = useNavigate();

//   const [tenants, setTenants]       = useState([]);
//   const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
//   const [loading, setLoading]       = useState(true);
//   const [page, setPage]             = useState(1);
//   const [search, setSearch]         = useState('');
//   const [statusFilter, setStatus]   = useState('');
//   const [showCreate, setShowCreate] = useState(false);
//   const [plans, setPlans]           = useState([]);
//   const [toast, setToast]           = useState({ show: false, message: '', type: 'success' });

//   const showToast = (message, type = 'success') => setToast({ show: true, message, type });

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await getTenants({
//         page, limit: 15,
//         search:  search  || undefined,
//         status:  statusFilter || undefined,
//       });
//       setTenants(res.data.data);
//       setPagination(res.data.pagination);
//     } catch {
//       showToast('Failed to load companies', 'error');
//     } finally { setLoading(false); }
//   }, [page, search, statusFilter]);

//   useEffect(() => { load(); }, [load]);

//   useEffect(() => {
//     getPlans({ activeOnly: 'true', limit: 50 })
//       .then(r => setPlans(r.data.data))
//       .catch(() => {});
//   }, []);

//   const handleStatus = async (id, status) => {
//     try {
//       await updateTenantStatus(id, { status });
//       showToast(`Company ${status} successfully`);
//       load();
//     } catch (err) {
//       showToast(err.response?.data?.message || 'Failed', 'error');
//     }
//   };

//   const statusBadge = (s) => {
//     const map = { active: 'success', suspended: 'danger', inactive: 'secondary' };
//     return <span className={`badge bg-${map[s] || 'secondary'}`}>{s}</span>;
//   };

//   const planBadge = (plan) => (
//     <span className="badge bg-primary bg-opacity-25 text-primary" style={{ textTransform: 'capitalize' }}>
//       {plan}
//     </span>
//   );

//   return (
//     <PlatformLayout>
//       {/* <div style={{ maxWidth: 1100 }}> */}
// <div style={{ width: '100%' }}>
//         {/* Header */}
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h4 style={{ color: '#f1f5f9', fontWeight: 700, margin: 0 }}>
//             <i className="fas fa-building me-2 text-primary" />
//             Companies
//             <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 400, marginLeft: 8 }}>
//               ({pagination.total})
//             </span>
//           </h4>
//           <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>
//             <i className="fas fa-plus me-1" /> New Company
//           </button>
//         </div>

//         {/* Filters */}
//         <div className="d-flex gap-2 mb-3 flex-wrap">
//           <input
//             className="form-control form-control-sm"
//             style={{ background: '#1e293b', border: '1px solid #334155', color: '#f1f5f9', maxWidth: 240 }}
//             placeholder="Search company or subdomain..."
//             value={search}
//             onChange={e => { setSearch(e.target.value); setPage(1); }}
//           />
//           <select
//             className="form-select form-select-sm"
//             style={{ background: '#1e293b', border: '1px solid #334155', color: '#f1f5f9', maxWidth: 160 }}
//             value={statusFilter}
//             onChange={e => { setStatus(e.target.value); setPage(1); }}
//           >
//             <option value="">All Status</option>
//             <option value="active">Active</option>
//             <option value="suspended">Suspended</option>
//             <option value="inactive">Inactive</option>
//           </select>
//         </div>

//         {/* Table */}
//         <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, overflow: 'hidden' }}>
//           {loading
//             ? <div className="text-center py-5"><span className="spinner-border" style={{ color: '#3b82f6' }} /></div>
//             : (
//               <table className="table table-sm mb-0" style={{ color: '#e2e8f0' }}>
//                 <thead>
//                   <tr style={{ background: '#0f172a' }}>
//                     {['Company', 'Subdomain', 'Plan', 'Status', 'Expires', 'Created', 'Actions'].map(h => (
//                       <th key={h} style={{ color: '#64748b', fontWeight: 500, borderColor: '#334155', padding: '0.75rem' }}>{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {tenants.map(t => {
//                     const expired = t.currentSubscription?.endDate && new Date(t.currentSubscription.endDate) < new Date();
//                     return (
//                       <tr key={t._id} style={{ borderColor: '#334155' }}>
//                         <td style={{ borderColor: '#334155', fontWeight: 600, padding: '0.75rem' }}onClick={() => navigate(`/platform/tenants/${t._id}`)}
//   className="text-decoration-underline" role="button">
//   {t.companyName}
// </td>
                        
//                         <td style={{ borderColor: '#334155', padding: '0.75rem' }}>
//                           <code style={{ color: '#7dd3fc', fontSize: '0.78rem' }}>{t.subdomain}</code>
//                         </td>
//                         <td style={{ borderColor: '#334155', padding: '0.75rem' }}>{planBadge(t.subscriptionPlan)}</td>
//                         <td style={{ borderColor: '#334155', padding: '0.75rem' }}>{statusBadge(t.status)}</td>
                        
//                         <td style={{ borderColor: '#334155', padding: '0.75rem', fontSize: '0.8rem', color: expired ? '#ef4444' : '#94a3b8' }}>
//                           {t.currentSubscription?.endDate
//                             ? new Date(t.currentSubscription.endDate).toLocaleDateString('en-GB')
//                             : '—'}
//                           {expired && <i className="fas fa-exclamation-circle ms-1" />}
//                         </td>
                        
//                         <td style={{ borderColor: '#334155', padding: '0.75rem', fontSize: '0.8rem', color: '#64748b' }}>
//                           {new Date(t.createdAt).toLocaleDateString('en-GB')}
//                         </td>
//                         <td style={{ borderColor: '#334155', padding: '0.75rem' }}>
//                           <div className="d-flex gap-1">
//                             {t.status === 'active'
//                               ? <button className="btn btn-warning btn-sm py-0 px-2" onClick={() => handleStatus(t._id, 'suspended')}>
//                                   <i className="fas fa-ban" />
//                                 </button>
//                               : <button className="btn btn-success btn-sm py-0 px-2" onClick={() => handleStatus(t._id, 'active')}>
//                                   <i className="fas fa-check" />
//                                 </button>
//                             }
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                   {!tenants.length && (
//                     <tr>
//                       <td colSpan={7} className="text-center py-4" style={{ color: '#475569', borderColor: '#334155' }}>
//                         No companies found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             )
//           }
//         </div>

//         {/* Pagination */}
//         {pagination.pages > 1 && (
//           <div className="d-flex justify-content-center gap-2 mt-3">
//             <button className="btn btn-sm btn-outline-secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
//             <span className="align-self-center small" style={{ color: '#94a3b8' }}>Page {page} / {pagination.pages}</span>
//             <button className="btn btn-sm btn-outline-secondary" disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
//           </div>
//         )}
//       </div>

//       <CreateTenantModal
//         show={showCreate}
//         plans={plans}
//         onClose={() => setShowCreate(false)}
//         onSuccess={() => { setShowCreate(false); load(); showToast('Company created! Activation email sent.'); }}
//       />

//       <Toast
//         show={toast.show}
//         message={toast.message}
//         type={toast.type}
//         onClose={() => setToast(p => ({ ...p, show: false }))}
//       />
//     </PlatformLayout>
//   );
// }


// src/pages/platform/PlatformTenants.jsx
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { getTenants, createTenant, updateTenantStatus } from '../../services/platform/platformTenants.service';
import { getPlans } from '../../services/platform/platformPlans.service';
import PlatformLayout from '../../components/platform/PlatformLayout';
import Toast from '../../components/ui/Toast';

/* ─── Create Modal ───────────────────────────── */
function CreateTenantModal({ show, plans, onClose, onSuccess }) {
  
  const [form, setForm]       = useState({ companyName: '', adminName: '', adminEmail: '', planSlug: '' ,timezone: 'UTC'});
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');


// ── 2. ضيف قائمة الـ timezones
const TIMEZONES = [
  { value: 'UTC',                  label: 'UTC (Universal)' },
  { value: 'Africa/Cairo',         label: 'Cairo (UTC+2/+3)' },
  { value: 'Asia/Riyadh',          label: 'Riyadh (UTC+3)' },
  { value: 'Asia/Dubai',           label: 'Dubai (UTC+4)' },
  { value: 'Asia/Kuwait',          label: 'Kuwait (UTC+3)' },
  { value: 'Asia/Beirut',          label: 'Beirut (UTC+2/+3)' },
  { value: 'Asia/Amman',           label: 'Amman (UTC+2/+3)' },
  { value: 'Asia/Baghdad',         label: 'Baghdad (UTC+3)' },
  { value: 'Europe/London',        label: 'London (UTC+0/+1)' },
  { value: 'Europe/Paris',         label: 'Paris (UTC+1/+2)' },
  { value: 'America/New_York',     label: 'New York (UTC-5/-4)' },
  { value: 'America/Los_Angeles',  label: 'Los Angeles (UTC-8/-7)' },
  { value: 'Asia/Karachi',         label: 'Karachi (UTC+5)' },
  { value: 'Asia/Kolkata',         label: 'India (UTC+5:30)' },
  { value: 'Asia/Singapore',       label: 'Singapore (UTC+8)' },
];


  useEffect(() => {
    if (show && plans.length) setForm(p => ({ ...p, planSlug: plans[0].slug }));
    if (!show) setError('');
  }, [show, plans]);

  if (!show) return null;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await createTenant(form);
      onSuccess();
     setForm({ companyName: '', adminName: '', adminEmail: '', planSlug: plans[0]?.slug || '', timezone: 'UTC' });

    } catch (err) {
      setError(err.response?.data?.errors?.join(' · ') || err.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,.65)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{ background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0' }}>

          <div className="modal-header" style={{ borderColor: '#334155' }}>
            <h5 className="modal-title" style={{ color: '#1e4b79' }}>
              <i className="fas fa-plus-circle me-2 text-primary" />
              Create New Company
            </h5>
            <button className="btn-close btn-close" onClick={onClose} />
          </div>

          <form onSubmit={submit}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger py-2 small">{error}</div>
              )}


              <div className="mb-3">
                <label className="form-label small" style={{ color: '#94a3b8' }}>Company Name *</label>
                <input className="form-control" style={{ background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9' }}
                  value={form.companyName} onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))} required />
              </div><div className="mb-3">
  <label className="form-label small" style={{ color: '#94a3b8' }}>
    🌍 Timezone *
  </label>
  <select 
    className="form-select" 
    style={{ background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9' }}
    value={form.timezone} 
    onChange={e => setForm(p => ({ ...p, timezone: e.target.value }))} 
    required
  >
    {TIMEZONES.map(tz => (
      <option key={tz.value} value={tz.value}>
        {tz.label}
      </option>
    ))}
  </select>
  <small style={{ color: '#64748b' }}>
    ⚠️ Affects all date calculations — choose carefully
  </small>
</div>

              <div className="mb-3">
                <label className="form-label small" style={{ color: '#94a3b8' }}>Admin Name</label>
                <input className="form-control" style={{ background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9' }}
                  value={form.adminName} onChange={e => setForm(p => ({ ...p, adminName: e.target.value }))} />
              </div>
              <div className="mb-3">
                <label className="form-label small" style={{ color: '#94a3b8' }}>Admin Email *</label>
                <input type="email" className="form-control" style={{ background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9' }}
                  value={form.adminEmail} onChange={e => setForm(p => ({ ...p, adminEmail: e.target.value }))} required />
              </div>
              <div className="mb-3">
                <label className="form-label small" style={{ color: '#94a3b8' }}>Plan *</label>
                <select className="form-select" style={{ background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9' }}
                  value={form.planSlug} onChange={e => setForm(p => ({ ...p, planSlug: e.target.value }))} required>
                  {plans.map(p => (
                    <option key={p.slug} value={p.slug}>
                      {p.name} — {p.price} {p.currency} / {p.durationDays} days
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer" style={{ borderColor: '#334155' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                {loading ? <><span className="spinner-border spinner-border-sm me-1" />Creating...</> : 'Create Company'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────── */
export default function PlatformTenants() {
    const navigate  = useNavigate();

  const [tenants, setTenants]       = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading]       = useState(true);
  const [page, setPage]             = useState(1);
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatus]   = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [plans, setPlans]           = useState([]);
  const [toast, setToast]           = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => setToast({ show: true, message, type });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTenants({
        page, limit: 15,
        search:  search  || undefined,
        status:  statusFilter || undefined,
      });
      setTenants(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      showToast('Failed to load companies', 'error');
    } finally { setLoading(false); }
  }, [page, search, statusFilter]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    getPlans({ activeOnly: 'true', limit: 50 })
      .then(r => setPlans(r.data.data))
      .catch(() => {});
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await updateTenantStatus(id, { status });
      showToast(`Company ${status} successfully`);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed', 'error');
    }
  };

  const statusBadge = (s) => {
    const map = { active: 'success', suspended: 'danger', inactive: 'secondary' };
    return <span className={`badge bg-${map[s] || 'secondary'}`}>{s}</span>;
  };

  const planBadge = (plan) => (
    <span className="badge bg-primary bg-opacity-25 text-primary" style={{ textTransform: 'capitalize' }}>
      {plan}
    </span>
  );

  return (
    <PlatformLayout>
      {/* <div style={{ maxWidth: 1100 }}> */}
<div style={{ width: '100%' }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 style={{ color: '#f1f5f9', fontWeight: 700, margin: 0 }}>
            <i className="fas fa-building me-2 text-primary" />
            Companies
            <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 400, marginLeft: 8 }}>
              ({pagination.total})
            </span>
          </h4>
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>
            <i className="fas fa-plus me-1" /> New Company
          </button>
        </div>

        {/* Filters */}
        <div className="d-flex gap-2 mb-3 flex-wrap">
          <input
            className="form-control form-control-sm"
            style={{ background: '#1e293b', border: '1px solid #334155', color: '#f1f5f9', maxWidth: 240 }}
            placeholder="Search company or subdomain..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          <select
            className="form-select form-select-sm"
            style={{ background: '#1e293b', border: '1px solid #334155', color: '#f1f5f9', maxWidth: 160 }}
            value={statusFilter}
            onChange={e => { setStatus(e.target.value); setPage(1); }}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, overflow: 'hidden' }}>
          {loading
            ? <div className="text-center py-5"><span className="spinner-border" style={{ color: '#3b82f6' }} /></div>
            : (
              <div className="table-responsive">
              <table className="table table-sm mb-0" style={{ color: '#e2e8f0', minWidth: 720 }}>
                <thead>
                  <tr style={{ background: '#0f172a' }}>
                    {['Company', 'Subdomain', 'Plan', 'Status', 'Expires', 'Created', 'Actions'].map(h => (
                      <th key={h} style={{ color: '#64748b', fontWeight: 500, borderColor: '#334155', padding: '0.75rem' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tenants.map(t => {
                    const expired = t.currentSubscription?.endDate && new Date(t.currentSubscription.endDate) < new Date();
                    return (
                      <tr key={t._id} style={{ borderColor: '#334155' }}>
                        <td style={{ borderColor: '#334155', fontWeight: 600, padding: '0.75rem' }}onClick={() => navigate(`/platform/tenants/${t._id}`)}
  className="text-decoration-underline" role="button">
  {t.companyName}
</td>
                        
                        <td style={{ borderColor: '#334155', padding: '0.75rem' }}>
                          <code style={{ color: '#7dd3fc', fontSize: '0.78rem' }}>{t.subdomain}</code>
                        </td>
                        <td style={{ borderColor: '#334155', padding: '0.75rem' }}>{planBadge(t.subscriptionPlan)}</td>
                        <td style={{ borderColor: '#334155', padding: '0.75rem' }}>{statusBadge(t.status)}</td>
                        
                        <td style={{ borderColor: '#334155', padding: '0.75rem', fontSize: '0.8rem', color: expired ? '#ef4444' : '#94a3b8' }}>
                          {t.currentSubscription?.endDate
                            ? new Date(t.currentSubscription.endDate).toLocaleDateString('en-GB')
                            : '—'}
                          {expired && <i className="fas fa-exclamation-circle ms-1" />}
                        </td>
                        
                        <td style={{ borderColor: '#334155', padding: '0.75rem', fontSize: '0.8rem', color: '#64748b' }}>
                          {new Date(t.createdAt).toLocaleDateString('en-GB')}
                        </td>
                        <td style={{ borderColor: '#334155', padding: '0.75rem' }}>
                          <div className="d-flex gap-1">
                            {t.status === 'active'
                              ? <button className="btn btn-warning btn-sm py-0 px-2" onClick={() => handleStatus(t._id, 'suspended')}>
                                  <i className="fas fa-ban" />
                                </button>
                              : <button className="btn btn-success btn-sm py-0 px-2" onClick={() => handleStatus(t._id, 'active')}>
                                  <i className="fas fa-check" />
                                </button>
                            }
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {!tenants.length && (
                    <tr>
                      <td colSpan={7} className="text-center py-4" style={{ color: '#475569', borderColor: '#334155' }}>
                        No companies found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>
            )
          }
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="d-flex justify-content-center gap-2 mt-3">
            <button className="btn btn-sm btn-outline-secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            <span className="align-self-center small" style={{ color: '#94a3b8' }}>Page {page} / {pagination.pages}</span>
            <button className="btn btn-sm btn-outline-secondary" disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>

      <CreateTenantModal
        show={showCreate}
        plans={plans}
        onClose={() => setShowCreate(false)}
        onSuccess={() => { setShowCreate(false); load(); showToast('Company created! Activation email sent.'); }}
      />

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(p => ({ ...p, show: false }))}
      />
    </PlatformLayout>
  );
}