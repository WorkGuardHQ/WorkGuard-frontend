// src/pages/platform/PlatformPlans.jsx
import { useState, useEffect } from 'react';
import {
  getPlans, createPlan, updatePlan, togglePlan, deletePlan,
} from '../../services/platform/platformPlans.service';
import PlatformLayout from '../../components/platform/PlatformLayout';
import Toast from '../../components/ui/Toast';
import PlanCard from '../../components/platform/plans/PlanCard';
import PlanFormModal from '../../components/platform/plans/PlanFormModal';
/* ─── Plan Form Modal ────────────────────────── */
// function PlanFormModal({ show, plan, onClose, onSuccess, onError }) {
//   const isEdit = !!plan;
//   // const empty  = { name: '', slug: '', price: '', currency: 'EGP', durationDays: '30', isTrial: false, maxEmployees: '50', maxBranches: '5', maxAdmins: '3', description: '' };
//   const empty = {
//   name: '',
//   slug: '',
//   description: '',

//   price: '',
//   currency: 'EGP',
//   durationDays: 30,

//   isTrial: false,
//   sortOrder: 0,

//   maxEmployees: '',
//   maxBranches: '',
//   maxAdmins: '',

//   unlimitedEmployees: false,
//   unlimitedBranches: false,
//   unlimitedAdmins: false,
// };

//   const [form, setForm]       = useState(empty);
//   const [loading, setLoading] = useState(false);
//   const [error, setError]     = useState('');

//   useEffect(() => {
//     if (plan) {
//       // setForm({
//       //   name: plan.name, slug: plan.slug, price: plan.price,
//       //   currency: plan.currency, durationDays: plan.durationDays,
//       //   isTrial: plan.isTrial, description: plan.description || '',
//       //   maxEmployees: plan.limits?.maxEmployees ?? 50,
//       //   maxBranches:  plan.limits?.maxBranches  ?? 5,
//       //   maxAdmins:    plan.limits?.maxAdmins    ?? 3,
//       // });
//       setForm({
//   name: plan.name,
//   slug: plan.slug,
//   description: plan.description || '',

//   price: plan.price,
//   currency: plan.currency,

//   durationDays: plan.durationDays,

//   isTrial: plan.isTrial,

//   sortOrder: plan.sortOrder ?? 0,

//   maxEmployees:
//     plan.limits?.maxEmployees ?? '',

//   maxBranches:
//     plan.limits?.maxBranches ?? '',

//   maxAdmins:
//     plan.limits?.maxAdmins ?? '',

//   unlimitedEmployees:
//     plan.limits?.maxEmployees == null,

//   unlimitedBranches:
//     plan.limits?.maxBranches == null,

//   unlimitedAdmins:
//     plan.limits?.maxAdmins == null,
// });
//     } else { setForm(empty); }
//     setError('');
//   }, [plan, show]);

//   if (!show) return null;

//   const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

//   const submit = async (e) => {
//     e.preventDefault();
//     setLoading(true); setError('');
//     const data = {
//       name: form.name, slug: form.slug, description: form.description || null,
//       price: Number(form.price), currency: form.currency,
//       durationDays: Number(form.durationDays), isTrial: form.isTrial,
//       // limits: { maxEmployees: Number(form.maxEmployees), maxBranches: Number(form.maxBranches), maxAdmins: Number(form.maxAdmins) },
//       limits: {
//   maxEmployees:
//     form.unlimitedEmployees
//       ? null
//       : Number(form.maxEmployees),

//   maxBranches:
//     form.unlimitedBranches
//       ? null
//       : Number(form.maxBranches),

//   maxAdmins:
//     form.unlimitedAdmins
//       ? null
//       : Number(form.maxAdmins),
// },

// sortOrder: Number(form.sortOrder),
//     };
//     try {
//       if (isEdit) await updatePlan(plan._id, data);
//       else        await createPlan(data);
//       onSuccess(isEdit ? 'Plan updated!' : 'Plan created!');
//     } catch (err) {
//       const msg = err.response?.data?.errors?.join(' · ') || err.response?.data?.message || 'Failed';
//       setError(msg);
//       onError(msg);
//     } finally { setLoading(false); }
//   };

//   const inputStyle = { background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9' };
//   const labelStyle = { color: '#94a3b8', fontSize: '0.8rem' };

//   return (
//     <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,.65)' }}>
//       <div className="modal-dialog modal-dialog-centered modal-lg">
//         <div className="modal-content" style={{ background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0' }}>

//           <div className="modal-header" style={{ borderColor: '#334155' }}>
//             <h5 className="modal-title" style={{ color: '#f1f5f9' }}>
//               <i className={`fas ${isEdit ? 'fa-edit' : 'fa-plus-circle'} me-2 text-primary`} />
//               {isEdit ? 'Edit Plan' : 'Create New Plan'}
//             </h5>
//             <button className="btn-close btn-close-white" onClick={onClose} />
//           </div>

//           <form onSubmit={submit}>
//             <div className="modal-body">
//               {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

//               <div className="row g-3">
//                 <div className="col-md-6">
//                   <label className="form-label" style={labelStyle}>Plan Name *</label>
//                   <input className="form-control" style={inputStyle} value={form.name} onChange={set('name')} required />
//                 </div>
//                 <div className="col-md-6">
//                   <label className="form-label" style={labelStyle}>Slug * {isEdit && <span style={{ color: '#475569' }}>(not editable)</span>}</label>
//                   <input className="form-control" style={inputStyle} value={form.slug} onChange={set('slug')} disabled={isEdit} placeholder="e.g. basic" required />
//                 </div>
//                 <div className="col-md-4">
//                   <label className="form-label" style={labelStyle}>Price *</label>
//                   <div className="input-group">
//                     <input type="number" min="0" className="form-control" style={inputStyle} value={form.price} onChange={set('price')} required />
//                     <input className="form-control" style={{ ...inputStyle, maxWidth: 70 }} value={form.currency} onChange={set('currency')} />
//                   </div>
//                 </div>
//                 <div className="col-md-4">
//                   <label className="form-label" style={labelStyle}>Duration (days) *</label>
//                   <input type="number" min="1" className="form-control" style={inputStyle} value={form.durationDays} onChange={set('durationDays')} required />
//                 </div>
//                 <div className="col-md-4 d-flex align-items-end pb-2">
//                   <div className="form-check">
//                     <input className="form-check-input" type="checkbox" id="isTrial" checked={form.isTrial} onChange={set('isTrial')} />
//                     <label className="form-check-label" style={labelStyle} htmlFor="isTrial">Trial Plan</label>
//                   </div>
//                 </div>

//                 {/* Limits */}
//                 <div className="col-12">
//                   <label className="form-label" style={labelStyle}>Limits</label>
//                   <div className="row g-2">
//                     <div className="col-md-4">
//                       <div className="input-group input-group-sm">
//                         <span className="input-group-text" style={{ background: '#334155', border: '1px solid #475569', color: '#94a3b8', fontSize: '0.75rem' }}>Employees</span>
//                         <input type="number" min="1" className="form-control" style={inputStyle} value={form.maxEmployees} onChange={set('maxEmployees')} />
//                       </div>
//                     </div>
//                     <div className="col-md-4">
//                       <div className="input-group input-group-sm">
//                         <span className="input-group-text" style={{ background: '#334155', border: '1px solid #475569', color: '#94a3b8', fontSize: '0.75rem' }}>Branches</span>
//                         <input type="number" min="1" className="form-control" style={inputStyle} value={form.maxBranches} onChange={set('maxBranches')} />
//                       </div>
//                     </div>
//                     <div className="col-md-4">
//                       <div className="input-group input-group-sm">
//                         <span className="input-group-text" style={{ background: '#334155', border: '1px solid #475569', color: '#94a3b8', fontSize: '0.75rem' }}>Admins</span>
//                         <input type="number" min="1" className="form-control" style={inputStyle} value={form.maxAdmins} onChange={set('maxAdmins')} />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="col-12">
//                   <label className="form-label" style={labelStyle}>Description</label>
//                   <textarea className="form-control" rows={2} style={inputStyle} value={form.description} onChange={set('description')} />
//                 </div>
//               </div>
//             </div>

//             <div className="modal-footer" style={{ borderColor: '#334155' }}>
//               <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
//               <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
//                 {loading ? <><span className="spinner-border spinner-border-sm me-1" />Saving...</> : isEdit ? 'Update Plan' : 'Create Plan'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

/* ─── Plan Card ──────────────────────────────── */

const formatLimit = (value) =>
  value == null
    ? 'Unlimited'
    : value;

// function PlanCard({ plan, onEdit, onToggle, onDelete }) {

//   return (
//     <div style={{ background: '#1e293b', border: `1px solid ${plan.isActive ? '#334155' : '#1e293b'}`, borderRadius: 12, padding: '1.25rem', opacity: plan.isActive ? 1 : 0.6 }}>

//       <div className="d-flex justify-content-between align-items-start mb-2">
//         <div>
//           <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '1rem' }}>{plan.name}</div>
//           <code style={{ color: '#7dd3fc', fontSize: '0.75rem' }}>{plan.slug}</code>
//         </div>
//         <div className="d-flex gap-1 flex-column align-items-end">
//           <span className={`badge ${plan.isActive ? 'bg-success' : 'bg-secondary'}`}>
//             {plan.isActive ? 'Active' : 'Inactive'}
//           </span>
//           {plan.isTrial && <span className="badge bg-info bg-opacity-25 text-info">Trial</span>}
//         </div>
//       </div>

//       <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', margin: '0.5rem 0' }}>
//         {plan.price} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: '#64748b' }}>{plan.currency}</span>
//       </div>

//       {/* <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
//         <i className="fas fa-calendar me-1" />{plan.durationDays} days
//         <span className="mx-2">·</span>
//         <i className="fas fa-users me-1" />{plan.limits?.maxEmployees} emp
//         <span className="mx-2">·</span>
//         <i className="fas fa-code-branch me-1" />{plan.limits?.maxBranches} branches
//       </div> */}

//       <div
//   style={{
//     fontSize: '0.8rem',
//     color: '#94a3b8',
//     marginBottom: '0.75rem',
//   }}
// >
//   <div className="mb-2">
//     <i className="fas fa-calendar me-1" />
//     {plan.durationDays} days
//   </div>

//   <div
//     style={{
//       display: 'flex',
//       justifyContent: 'space-between',
//       marginBottom: 4,
//     }}
//   >
//     <span>
//       <i className="fas fa-users me-1" />
//       Employees
//     </span>

//     <strong>
//       {formatLimit(plan.limits?.maxEmployees)}
//     </strong>
//   </div>

//   <div
//     style={{
//       display: 'flex',
//       justifyContent: 'space-between',
//       marginBottom: 4,
//     }}
//   >
//     <span>
//       <i className="fas fa-code-branch me-1" />
//       Branches
//     </span>

//     <strong>
//       {formatLimit(plan.limits?.maxBranches)}
//     </strong>
//   </div>

//   <div
//     style={{
//       display: 'flex',
//       justifyContent: 'space-between',
//     }}
//   >
//     <span>
//       <i className="fas fa-user-shield me-1" />
//       Admins
//     </span>

//     <strong>
//       {formatLimit(plan.limits?.maxAdmins)}
//     </strong>
//   </div>
// </div>

//       {plan.description && (
//         <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.75rem' }}>{plan.description}</p>
//       )}

//       <div className="d-flex gap-1 pt-2" style={{ borderTop: '1px solid #334155' }}>
//         <button className="btn btn-sm btn-outline-primary flex-fill" onClick={() => onEdit(plan)}>
//           <i className="fas fa-edit me-1" />Edit
//         </button>
//         <button className={`btn btn-sm flex-fill ${plan.isActive ? 'btn-outline-warning' : 'btn-outline-success'}`} onClick={() => onToggle(plan._id)}>
//           <i className={`fas ${plan.isActive ? 'fa-pause' : 'fa-play'} me-1`} />
//           {plan.isActive ? 'Deactivate' : 'Activate'}
//         </button>
//         <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(plan._id)}>
//           <i className="fas fa-trash" />
//         </button>
//       </div>
//     </div>
//   );
// }

/* ─── Main ───────────────────────────────────── */
export default function PlatformPlans() {
  const [plans, setPlans]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast]     = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => setToast({ show: true, message, type });

  const load = async () => {
    setLoading(true);
    try {
      const r = await getPlans({ activeOnly: 'false', limit: 50 });
      setPlans(r.data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleToggle = async (id) => {
    try { await togglePlan(id); load(); showToast('Plan updated'); }
    catch { showToast('Failed to update plan', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this plan? Existing subscriptions are unaffected.')) return;
    try { await deletePlan(id); load(); showToast('Plan deactivated'); }
    catch { showToast('Failed', 'error'); }
  };

  return (
    <PlatformLayout>
      {/* <div style={{ maxWidth: 1100 }}> */}
<div style={{ width: '100%' }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 style={{ color: '#f1f5f9', fontWeight: 700, margin: 0 }}>
            <i className="fas fa-box me-2 text-primary" />
            Subscription Plans
          </h4>
          <button className="btn btn-primary btn-sm" onClick={() => { setEditing(null); setShowForm(true); }}>
            <i className="fas fa-plus me-1" /> New Plan
          </button>
        </div>

        {loading
          ? <div className="text-center py-5"><span className="spinner-border" style={{ color: '#3b82f6' }} /></div>
          : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {plans.map(p => (
                <PlanCard
                  key={p._id} plan={p}
                  onEdit={(plan) => { setEditing(plan); setShowForm(true); }}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
              {!plans.length && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#475569', padding: '3rem' }}>
                  No plans yet — create your first plan
                </div>
              )}
            </div>
          )
        }
      </div>

      <PlanFormModal
        show={showForm}
        plan={editing}
        onClose={() => setShowForm(false)}
        onSuccess={(msg) => { setShowForm(false); load(); showToast(msg); }}
        onError={(msg) => showToast(msg, 'error')}
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