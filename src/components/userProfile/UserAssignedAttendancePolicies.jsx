// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { getUserAssignedAttendancePolicies } from '../../services/attendancePolicy.api';

// const UserAssignedAttendancePolicies = ({ userId }) => {
//   const { t } = useTranslation();
//   const [data, setData] = useState(null);
//   const [expanded, setExpanded] = useState(false);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!userId) return;

//     setLoading(true);
//     getUserAssignedAttendancePolicies(userId)
//       .then(setData)
//       .finally(() => setLoading(false));
//   }, [userId]);

//   if (loading) {
//     return <div className="text-muted">{t('common.loading')}</div>;
//   }

//   if (!data) return null;

//   return (
//     <div className="card border-secondary mb-4">
//       <div className="card-body">

//         <h5 className="mb-3">
//           <i className="fas fa-layer-group me-2" />
//           {t('attendancePolicy.assignedPolicies')}
//         </h5>

//         {/* Global */}
//         {data.global && (
//           <div className="mb-2">
//             <strong>{t('attendancePolicy.globalPolicy')}</strong>
//           </div>
//         )}

//         {/* Role */}
//         {data.role && (
//           <div className="mb-2">
//             <strong>{t('attendancePolicy.rolePolicy')}:</strong>{' '}
//             <span className="badge bg-secondary">
//               {data.role.role}
//             </span>
//           </div>
//         )}

//         {/* Branches */}
//         {data.branches?.length > 0 && (
//           <>
//             <button
//               className="btn btn-outline-secondary btn-sm mb-2"
//               onClick={() => setExpanded(v => !v)}
//             >
//               <i className="fas fa-code-branch me-1" />
//               {t('attendancePolicy.branchPolicies')}
//             </button>

//             {expanded && (
//               <ul className="list-group list-group-flush small">
//                 {data.branches.map(b => (
//                   <li key={b.branchId} className="list-group-item">
//                     🏢 {b.branchName}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </>
//         )}

//         {!data.global && !data.role && !data.branches?.length && (
//           <div className="text-muted small">
//             {t('attendancePolicy.noAssignedPolicies')}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserAssignedAttendancePolicies;


// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { getUserAssignedAttendancePolicies } from '../../services/attendancePolicy.api';


// const PolicyDetails = ({ policy }) => {
//   const { t } = useTranslation();
//   if (!policy) return null;

//   return (
//     <div className="border rounded p-3 mt-2 bg-light small">
//       <div className="mb-1">
//         <strong>{t('attendancePolicy.policyDetails.graceLate')}:</strong>{' '}
//         {policy.grace?.lateMinutes ?? 0} min
//       </div>
//       <div className="mb-1">
//         <strong>{t('attendancePolicy.policyDetails.graceEarly')}:</strong>{' '}
//         {policy.grace?.earlyLeaveMinutes ?? 0} min
//       </div>
//       <div className="mb-1">
//         <strong>{t('attendancePolicy.policyDetails.lateRate')}:</strong>{' '}
//         {policy.rates?.latePerMinute ?? 0}
//       </div>
//       <div className="mb-1">
//         <strong>{t('attendancePolicy.policyDetails.earlyRate')}:</strong>{' '}
//         {policy.rates?.earlyLeavePerMinute ?? 0}
//       </div>
//       <div className="mb-1">
//         <strong>{t('attendancePolicy.policyDetails.transitRate')}:</strong>{' '}
//         {policy.rates?.transitPerMinute ?? 0}
//       </div>
//       <div className="mb-1">
//         <strong>{t('attendancePolicy.policyDetails.absence')}:</strong>{' '}
//         {policy.absence?.paid
//           ? t('attendancePolicy.policyDetails.paid')
//           : t('attendancePolicy.policyDetails.unpaid')}{' '}
//         /{' '}
//         {policy.absence?.markDayAbsent
//           ? `${policy.absence?.dayRate * 100}%`
//           : t('attendancePolicy.policyDetails.noDeduction')}
//       </div>
//     </div>
//   );
// };

// const UserAssignedAttendancePolicies = ({ userId }) => {
//   const { t } = useTranslation();

//   const [data, setData] = useState(null);
//   const [expanded, setExpanded] = useState({});
//   const [loading, setLoading] = useState(false);

//   const toggle = (key) => {
//     setExpanded(e => ({ ...e, [key]: !e[key] }));
//   };

//   useEffect(() => {
//     if (!userId) return;

//     setLoading(true);
//     getUserAssignedAttendancePolicies(userId)
//       .then(setData)
//       .finally(() => setLoading(false));
//   }, [userId]);

//   if (loading) {
//     return <div className="text-muted">{t('common.loading')}</div>;
//   }

//   if (!data) return null;

//   return (
//     <div className="card border-secondary mb-4">
//       <div className="card-body">

//         <h5 className="mb-3">
//           <i className="fas fa-layer-group me-2" />
//           {t('attendancePolicy.assignedPolicies')}
//         </h5>

//         {/* =========================
//             Global Policy
//         ========================= */}
//         {data.global && (
//           <div className="mb-3">
//             <button
//               className="btn btn-outline-secondary btn-sm w-100 text-start"
//               onClick={() => toggle('global')}
//             >
//               🌍 {t('attendancePolicy.globalPolicy')}
//             </button>

//             {expanded.global && (
//               <PolicyDetails policy={data.global.policy} />
//             )}
//           </div>
//         )}

//         {/* =========================
//             Role Policy
//         ========================= */}
//         {data.role && (
//           <div className="mb-3">
//             <button
//               className="btn btn-outline-secondary btn-sm w-100 text-start"
//               onClick={() => toggle('role')}
//             >
//               👤 {t('attendancePolicy.rolePolicy')} – {data.role.role}
//             </button>

//             {expanded.role && (
//               <PolicyDetails policy={data.role.policy} />
//             )}
//           </div>
//         )}

//         {/* =========================
//             Branch Policies
//         ========================= */}
//         {data.branches?.length > 0 && (
//           <div className="mb-2">
//             <div className="text-muted small mb-2">
//               {t('attendancePolicy.branchPolicies')}
//             </div>

//             {data.branches.map(b => (
//               <div key={b.branchId} className="mb-2">
//                 <button
//                   className="btn btn-outline-secondary btn-sm w-100 text-start"
//                   onClick={() => toggle(b.branchId)}
//                 >
//                   🏢 {b.branchName}
//                 </button>

//                 {expanded[b.branchId] && (
//                   <PolicyDetails policy={b.policy} />
//                 )}
//               </div>
//             ))}
//           </div>
//         )}

//         {!data.global && !data.role && !data.branches?.length && (
//           <div className="text-muted small">
//             {t('attendancePolicy.noAssignedPolicies')}
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default UserAssignedAttendancePolicies;


//-------------------------------------ui














// src/components/userProfile/UserAssignedAttendancePolicies.jsx
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isAdmin } from '../../helpers/auth';
import { getUserAssignedAttendancePolicies } from '../../services/attendancePolicy.api';

const SCOPE_CONFIG = {
  global: { icon: 'fa-globe',        color: '#6366f1', bg: '#ede9fe', label: 'attendancePolicy.globalPolicy' },
  role:   { icon: 'fa-user-tag',     color: '#0ea5e9', bg: '#e0f2fe', label: 'attendancePolicy.rolePolicy'   },
  branch: { icon: 'fa-building',     color: '#16a34a', bg: '#dcfce7', label: 'attendancePolicy.branchPolicy'  },
};

function PolicyRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{label}</span>
      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#0f172a' }}>{value}</span>
    </div>
  );
}

function PolicyDetails({ policy, t }) {
  if (!policy) return null;
  return (
    <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '0 0 10px 10px', borderTop: '1px solid #e2e8f0' }}>
      <PolicyRow label={t('attendancePolicy.policyDetails.graceLate')}   value={`${policy.grace?.lateMinutes ?? 0} min`} />
      <PolicyRow label={t('attendancePolicy.policyDetails.graceEarly')}  value={`${policy.grace?.earlyLeaveMinutes ?? 0} min`} />
      <PolicyRow
  label={t('attendancePolicy.policyDetails.graceBreak')}
  value={`${policy.grace?.gapMinutes ?? 0} min`}
/>

      <PolicyRow label={t('attendancePolicy.policyDetails.lateRate')}    value={policy.rates?.latePerMinute ?? 0} />
      <PolicyRow label={t('attendancePolicy.policyDetails.earlyRate')}   value={policy.rates?.earlyLeavePerMinute ?? 0} />
      <PolicyRow label={t('attendancePolicy.policyDetails.transitRate')} value={policy.rates?.transitPerMinute ?? 0} />
      <PolicyRow
  label={t('attendancePolicy.policyDetails.breakRate')}
  value={policy.rates?.gapPerMinute ?? 0}
/>
      <PolicyRow
        label={t('attendancePolicy.policyDetails.absence')}
        value={
          policy.absence?.paid
            ? t('attendancePolicy.policyDetails.paid')
            : `${t('attendancePolicy.policyDetails.unpaid')} · ${policy.absence?.dayRate ? `${policy.absence.dayRate * 100}%` : t('attendancePolicy.policyDetails.noDeduction')}`
        }
      />
    </div>
  );
}

function PolicyCard({ scopeType, title, policy, expanded, onToggle, t }) {
  const cfg = SCOPE_CONFIG[scopeType] || SCOPE_CONFIG.branch;
  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, marginBottom: 8, overflow: 'hidden' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px', background: '#fff', border: 'none', cursor: 'pointer',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className={`fa-solid ${cfg.icon}`} style={{ color: cfg.color, fontSize: '0.8rem' }} />
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>{title}</span>
        </div>
        <i className={`fa-solid fa-chevron-${expanded ? 'up' : 'down'}`} style={{ color: '#94a3b8', fontSize: '0.75rem' }} />
      </button>
      {expanded && <PolicyDetails policy={policy} t={t} />}
    </div>
  );
}

const UserAssignedAttendancePolicies = ({ userId }) => {
  const { t }   = useTranslation();
  const admin   = isAdmin(); // ✅ admin فقط

  const [data,     setData]     = useState(null);
  const [expanded, setExpanded] = useState({});
  const [loading,  setLoading]  = useState(false);

  const toggle = (key) => setExpanded(e => ({ ...e, [key]: !e[key] }));

  useEffect(() => {
    if (!userId || !admin) return;
    setLoading(true);
    getUserAssignedAttendancePolicies(userId)
      .then(setData)
      .finally(() => setLoading(false));
  }, [userId]);

  if (!admin) return null; // ✅ مش للادمن = مش يظهر

  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1rem', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="fa-solid fa-layer-group" style={{ color: '#6366f1', fontSize: '0.9rem' }} />
        </div>
        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
          {t('attendancePolicy.assignedPolicies')}
        </span>
      </div>

      <div style={{ padding: '14px 16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '0.85rem' }}>
            <i className="fa-solid fa-spinner fa-spin me-2" />{t('common.loading')}
          </div>
        ) : !data ? null : (
          <>
            {data.global && (
              <PolicyCard
                scopeType="global"
                title={t('attendancePolicy.globalPolicy')}
                policy={data.global.policy}
                expanded={!!expanded.global}
                onToggle={() => toggle('global')}
                t={t}
              />
            )}

            {data.role && (
              <PolicyCard
                scopeType="role"
                title={`${t('attendancePolicy.rolePolicy')} · ${data.role.role}`}
                policy={data.role.policy}
                expanded={!!expanded.role}
                onToggle={() => toggle('role')}
                t={t}
              />
            )}

            {data.branches?.map(b => (
              <PolicyCard
                key={b.branchId}
                scopeType="branch"
                title={b.branchName}
                policy={b.policy}
                expanded={!!expanded[b.branchId]}
                onToggle={() => toggle(b.branchId)}
                t={t}
              />
            ))}

            {!data.global && !data.role && !data.branches?.length && (
              <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '0.85rem' }}>
                <i className="fa-solid fa-circle-info me-2" />
                {t('attendancePolicy.noAssignedPolicies')}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserAssignedAttendancePolicies;