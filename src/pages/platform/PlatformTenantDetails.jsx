// src/pages/platform/PlatformTenantDetails.jsx
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate }           from 'react-router-dom';
import { getTenant, updateTenant, updateTenantStatus } from '../../services/platform/platformTenants.service';
import PlatformLayout from '../../components/platform/PlatformLayout';
import Toast          from '../../components/ui/Toast';

/* ── helpers ── */
const fmtDate  = (d) => d ? new Date(d).toLocaleDateString('en-GB')  : '—';
const fmtDTime = (d) => d ? new Date(d).toLocaleString('en-GB')      : '—';
const daysLeft = (d) => {
  if (!d) return null;
  return Math.ceil((new Date(d) - Date.now()) / 86400000);
};

const PLAN_COLORS  = { trial: 'secondary', basic: 'info', pro: 'primary', enterprise: 'warning' };
const STATUS_COLORS= { active: 'success',  inactive: 'secondary', suspended: 'danger' };

const TIMEZONES = [
  { value: 'UTC',                 label: 'UTC (Universal)'     },
  { value: 'Africa/Cairo',        label: 'Cairo (UTC+2/+3)'    },
  { value: 'Asia/Riyadh',         label: 'Riyadh (UTC+3)'      },
  { value: 'Asia/Dubai',          label: 'Dubai (UTC+4)'       },
  { value: 'Asia/Kuwait',         label: 'Kuwait (UTC+3)'      },
  { value: 'Asia/Beirut',         label: 'Beirut (UTC+2/+3)'   },
  { value: 'Europe/London',       label: 'London (UTC+0/+1)'   },
  { value: 'Europe/Paris',        label: 'Paris (UTC+1/+2)'    },
  { value: 'America/New_York',    label: 'New York (UTC-5/-4)' },
  { value: 'Asia/Kolkata',        label: 'India (UTC+5:30)'    },
  { value: 'Asia/Singapore',      label: 'Singapore (UTC+8)'   },
];

/* ── Info Row ── */
function InfoRow({ label, children }) {
  return (
    <div style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid #1e293b', gap: 12 }}>
      <div style={{ width: 160, flexShrink: 0, color: '#64748b', fontSize: 13 }}>{label}</div>
      <div style={{ color: '#e2e8f0', fontSize: 13, flex: 1 }}>{children}</div>
    </div>
  );
}

/* ── Section Card ── */
function Section({ title, icon, children, action }) {
  return (
    <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, marginBottom: 20 }}>
      <div style={{
        padding: '14px 20px', borderBottom: '1px solid #334155',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 14 }}>
          <i className={`fas ${icon} me-2 text-primary`} />{title}
        </div>
        {action}
      </div>
      <div style={{ padding: '16px 20px' }}>{children}</div>
    </div>
  );
}

/* ── Edit Modal ── */
function EditModal({ tenant, onClose, onSaved }) {
  const [form, setForm]   = useState({
    companyName:   tenant.companyName || '',
    timezone:      tenant.timezone    || 'UTC',
    internalNotes: tenant.internalNotes || '',
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      await updateTenant(tenant._id, form);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update');
    } finally { setLoading(false); }
  };

  const inp = { background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9' };
  const lbl = { color: '#94a3b8', fontSize: 13, display: 'block', marginBottom: 6, fontWeight: 500 };

  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,.6)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{ background: '#1e293b', border: '1px solid #334155' }}>
          <div className="modal-header" style={{ borderColor: '#334155' }}>
            <h5 className="modal-title" style={{ color: '#f1f5f9', fontSize: 15 }}>
              <i className="fas fa-edit me-2 text-primary" />Edit Company
            </h5>
            <button className="btn-close btn-close-white" onClick={onClose} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body" style={{ color: '#e2e8f0' }}>
              {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

              <div className="mb-3">
                <label style={lbl}>Company Name *</label>
                <input className="form-control" style={inp} required
                  value={form.companyName}
                  onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} />
              </div>

              <div className="mb-3">
                <label style={lbl}>Timezone</label>
                <select className="form-select" style={inp}
                  value={form.timezone}
                  onChange={e => setForm(f => ({ ...f, timezone: e.target.value }))}>
                  {TIMEZONES.map(tz => (
                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                  ))}
                </select>
                <small style={{ color: '#64748b', fontSize: 11 }}>
                  ⚠️ Affects all date calculations — change carefully
                </small>
              </div>

              <div className="mb-1">
                <label style={lbl}>Internal Notes</label>
                <textarea className="form-control" rows={3} style={inp}
                  value={form.internalNotes}
                  onChange={e => setForm(f => ({ ...f, internalNotes: e.target.value }))}
                  placeholder="Visible only to platform admins..." />
              </div>
            </div>
            <div className="modal-footer" style={{ borderColor: '#334155' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                {loading ? <><span className="spinner-border spinner-border-sm me-1" />Saving...</> : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   Main
════════════════════════════════════════════════ */
export default function PlatformTenantDetails() {
  const { id }    = useParams();
  const navigate  = useNavigate();

  const [data,      setData]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [showEdit,  setShowEdit]  = useState(false);
  const [toast,     setToast]     = useState(null);
  const [confirm,   setConfirm]   = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getTenant(id);
      setData(res.data.data);
    } catch {
      setToast({ type: 'error', message: 'Failed to load company' });
    } finally { setLoading(false); }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleStatus = (status) => {
    setConfirm({
      message: `${status === 'active' ? 'Activate' : status === 'suspended' ? 'Suspend' : 'Deactivate'} this company?`,
      action: async () => {
        await updateTenantStatus(id, status);
        setToast({ type: 'success', message: `Company ${status}` });
        load();
      },
    });
  };

  if (loading) return (
    <PlatformLayout>
      <div className="text-center py-5">
        <span className="spinner-border" style={{ color: '#3b82f6' }} />
      </div>
    </PlatformLayout>
  );

  if (!data) return null;

  const tenant  = data;
  const sub     = tenant.currentSubscription;
  const days    = daysLeft(sub?.endDate);
  const expired = days != null && days <= 0;

  return (
    <PlatformLayout>
      <div style={{ maxWidth: 900 }}>

        {/* ── Back + Header ── */}
        <div className="d-flex align-items-center gap-3 mb-4">
          <button className="btn btn-sm" style={{ background: '#334155', color: '#94a3b8', border: 'none' }}
            onClick={() => navigate('/platform/tenants')}>
            <i className="fas fa-arrow-left me-1" />Back
          </button>
          <div style={{ flex: 1 }}>
            <h4 style={{ color: '#f1f5f9', fontWeight: 800, margin: 0, fontSize: 20 }}>
              {tenant.companyName}
            </h4>
            <div style={{ color: '#64748b', fontSize: 13 }}>
              <code style={{ color: '#7dd3fc' }}>{tenant.subdomain}</code>
              <span className="mx-2">·</span>
              <span className={`badge bg-${STATUS_COLORS[tenant.status] || 'secondary'}`}>
                {tenant.status}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-outline-primary" onClick={() => setShowEdit(true)}>
              <i className="fas fa-edit me-1" />Edit
            </button>
            {tenant.status === 'active' ? (
              <button className="btn btn-sm btn-outline-warning" onClick={() => handleStatus('suspended')}>
                <i className="fas fa-ban me-1" />Suspend
              </button>
            ) : (
              <button className="btn btn-sm btn-outline-success" onClick={() => handleStatus('active')}>
                <i className="fas fa-check me-1" />Activate
              </button>
            )}
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="row g-3 mb-4">
          {[
            { label: 'Total Users',  value: tenant.employeeCount,  icon: 'fa-users',         color: 'info'    },
            { label: 'Admins',       value: tenant.adminCount,      icon: 'fa-user-shield',   color: 'warning' },
            { label: 'Plan',         value: sub?.plan || '—',       icon: 'fa-box',           color: 'primary' },
            { label: 'Days Left',    value: expired ? 'Expired' : (days != null ? `${days}d` : '—'),
                                                                     icon: 'fa-calendar',      color: expired ? 'danger' : 'success' },
          ].map(({ label, value, icon, color }) => (
            <div className="col-6 col-md-3" key={label}>
              <div style={{ background: '#1e293b', border: `1px solid #334155`, borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
                <i className={`fas ${icon} text-${color} mb-1`} style={{ fontSize: 18 }} />
                <div style={{ fontWeight: 700, fontSize: 20, color: '#f1f5f9' }}>{value ?? '—'}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Company Info ── */}
        <Section title="Company Information" icon="fa-building"
          action={
            <button className="btn btn-sm btn-outline-primary py-0 px-2" onClick={() => setShowEdit(true)}>
              <i className="fas fa-edit me-1" />Edit
            </button>
          }>
          <InfoRow label="Company Name">{tenant.companyName}</InfoRow>
          <InfoRow label="Subdomain"><code style={{ color: '#7dd3fc' }}>{tenant.subdomain}</code></InfoRow>
          <InfoRow label="Timezone">
            <span style={{ background: '#0f172a', padding: '2px 8px', borderRadius: 6, fontSize: 12 }}>
              <i className="fas fa-globe me-1 text-primary" />{tenant.timezone || 'UTC'}
            </span>
          </InfoRow>
          <InfoRow label="Status">
            <span className={`badge bg-${STATUS_COLORS[tenant.status]}`}>{tenant.status}</span>
          </InfoRow>
          <InfoRow label="Created">{fmtDTime(tenant.createdAt)}</InfoRow>
          {tenant.internalNotes && (
            <InfoRow label="Internal Notes">
              <span style={{ color: '#f59e0b', fontSize: 12 }}>
                <i className="fas fa-sticky-note me-1" />{tenant.internalNotes}
              </span>
            </InfoRow>
          )}
        </Section>

        {/* ── Current Subscription ── */}
        <Section title="Current Subscription" icon="fa-credit-card">
          {sub ? (
            <>
              <InfoRow label="Plan">
                <span className={`badge bg-${PLAN_COLORS[sub.plan] || 'secondary'}`}>
                  {sub.plan}
                </span>
                {sub.isTrial && <span className="badge bg-info bg-opacity-25 text-info ms-1">Trial</span>}
              </InfoRow>
              <InfoRow label="Status">
                <span className={`badge bg-${sub.status === 'active' ? 'success' : 'danger'}`}>{sub.status}</span>
              </InfoRow>
              <InfoRow label="Price">{sub.price} {sub.currency}</InfoRow>
              <InfoRow label="Start Date">{fmtDate(sub.startDate)}</InfoRow>
              <InfoRow label="End Date">
                <span style={{ color: expired ? '#ef4444' : '#e2e8f0' }}>
                  {fmtDate(sub.endDate)}
                  {expired && <span className="badge bg-danger ms-2">Expired</span>}
                  {!expired && days != null && days <= 7 && (
                    <span className="badge bg-warning text-dark ms-2">{days}d left</span>
                  )}
                </span>
              </InfoRow>
              <InfoRow label="Payment">
                <span className={`badge ${sub.paymentStatus === 'paid' ? 'bg-success' : 'bg-warning text-dark'}`}>
                  {sub.paymentStatus}
                </span>
                {sub.paymentMethod && (
                  <span className="badge bg-secondary ms-1">{sub.paymentMethod}</span>
                )}
              </InfoRow>
              {sub.limits && (
                <InfoRow label="Limits">
                  <span style={{ fontSize: 12 }}>
                    <i className="fas fa-users me-1 text-info" />{sub.limits.maxEmployees} employees
                    <span className="mx-2">·</span>
                    <i className="fas fa-code-branch me-1 text-info" />{sub.limits.maxBranches} branches
                  </span>
                </InfoRow>
              )}
            </>
          ) : (
            <div style={{ color: '#64748b', textAlign: 'center', padding: '16px 0' }}>
              No active subscription
            </div>
          )}
        </Section>

        {/* ── Subscription History ── */}
        <Section title="Subscription History" icon="fa-history">
          {tenant.subHistory?.length ? (
            // <div className="table-responsive">
            <div className="table-responsive rounded-3">
              <table className="table table-sm mb-0" style={{ color: '#e2e8f0' }}>
                <thead>
                  <tr style={{ borderColor: '#334155' }}>
                    {['Plan', 'Status', 'Price', 'Start', 'End', 'Payment'].map(h => (
                      <th key={h} style={{ color: '#64748b', borderColor: '#334155', fontWeight: 500, fontSize: 12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tenant.subHistory.map((s, i) => (
                    <tr key={i} style={{ borderColor: '#334155' }}>
                      <td style={{ borderColor: '#334155' }}>
                        <span className={`badge bg-${PLAN_COLORS[s.plan] || 'secondary'}`}>{s.plan}</span>
                        {s.isTrial && <span className="badge bg-info bg-opacity-25 text-info ms-1" style={{ fontSize: 10 }}>Trial</span>}
                      </td>
                      <td style={{ borderColor: '#334155' }}>
                        <span className={`badge bg-${s.status === 'active' ? 'success' : s.status === 'expired' ? 'danger' : 'secondary'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td style={{ borderColor: '#334155', fontSize: 12 }}>{s.price} {s.currency}</td>
                      <td style={{ borderColor: '#334155', fontSize: 12, color: '#94a3b8' }}>{fmtDate(s.startDate)}</td>
                      <td style={{ borderColor: '#334155', fontSize: 12, color: '#94a3b8' }}>{fmtDate(s.endDate)}</td>
                      <td style={{ borderColor: '#334155' }}>
                        <span className={`badge ${s.paymentStatus === 'paid' ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {s.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ color: '#64748b', textAlign: 'center', padding: '12px 0', fontSize: 13 }}>
              No subscription history
            </div>
          )}
        </Section>

      </div>

      {/* Edit Modal */}
      {showEdit && (
        <EditModal
          tenant={tenant}
          onClose={() => setShowEdit(false)}
          onSaved={() => { setShowEdit(false); setToast({ type: 'success', message: 'Company updated!' }); load(); }}
        />
      )}

      {/* Confirm Toast */}
      {confirm && (
        <Toast show type="warning" message={confirm.message}
          confirmText="Confirm" cancelText="Cancel"
          onConfirm={async () => { await confirm.action(); setConfirm(null); }}
          onClose={() => setConfirm(null)}
        />
      )}

      {toast && (
        <Toast show type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </PlatformLayout>
  );
}