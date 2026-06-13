// import { useTranslation } from 'react-i18next';
// import '../../style/UserProfile.css';
// import { employmentStatusMap } from '../../helpers/userHelpers';

// function UserHeader({ user, isAdmin }) {
//   const { t } = useTranslation();
//   if (!user) return null;

//   // =========================
//   // Account Status (Activation)
//   // =========================
//   const accountStatus = user.isActive ? 'active' : 'pending';
// const currentStatus = user?.employmentHistory?.at(-1)?.status;
//   // =========================
//   // Employment Status (HR)
//   // =========================
//   const employmentStatus =
//     employmentStatusMap[currentStatus] ||
//     employmentStatusMap.active;

//   return (
//     <div className="card shadow-sm mb-4 border-0">
//       <div className="card-body">
//         <div className="row align-items-center">

//           {/* LEFT – Identity */}
//           <div className="col-md-8">
//             <h4 className="mb-1 fw-bold">
//               <i className="fas fa-user-circle me-2 text-primary"></i>
//               {user.name}
//             </h4>

//             <div className="text-muted small mb-1">
//               <i className="fas fa-envelope me-2"></i>
//               {user.email}
//             </div>

//             {/* Account Status */}
//             <span
//               className={`badge ${
//                 user.isActive ? 'bg-success' : 'bg-warning'
//               }`}
//             >
//               <i
//                 className={`fas ${
//                   user.isActive ? 'fa-check-circle' : 'fa-clock'
//                 } me-1`}
//               ></i>
//               {user.isActive
//                 ? t('accountActive')
//                 : t('pendingActivation')}
//             </span>

//             {user.branches?.length > 0 && (
//               <div className="text-muted small mt-1">
//                 <i className="fas fa-building me-2"></i>
//                 {user.branches.map(b => b.name).join(' , ')}
//               </div>
//             )}

//             {/* Employment Info */}
//             <div className="mt-2 small text-muted">
//               {user.employmentStartDate && (
//                 <div>
//                   <i className="fas fa-calendar-day me-2"></i>
//                   {t('startDate')}:{' '}
//                   {new Date(user.employmentStartDate).toLocaleDateString()}
//                 </div>
//               )}

//               {user.workingDaysNames?.length > 0 && (
//                 <div>
//                   <i className="fas fa-calendar-week me-2"></i>
//                   {t('workingDays')}:{' '}
//                   {user.workingDaysNames.join(' , ')}
//                 </div>
//               )}

//               {user.workStartTime && user.workEndTime && (
//                 <div>
//                   <i className="fas fa-clock me-2"></i>
//                   {t('workingHours')}:{' '}
//                   {user.workStartTime} – {user.workEndTime}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* RIGHT – Status & Admin Info */}
//           <div className="col-md-4 text-md-end mt-3 mt-md-0">

//             {/* Employment Status */}
//             <span
//               className={`badge bg-${employmentStatus.color} fs-6 mb-2`}
//             >
//               <i
//                 className={`fas ${employmentStatus.icon} me-2`}
//               ></i>
//               {t(currentStatus)}
//             </span>

//             {/* Role */}
//             <div>
//               <span className="badge bg-light text-dark">
//                 <i className="fas fa-user-tag me-2"></i>
//                 {t(user.role)}
//               </span>
//             </div>

//             {/* Salary – Admin only */}
//             {isAdmin && user.salary && (
//               <div className="mt-2">
//                 <span className="badge bg-success">
//                   <i className="fas fa-coins me-2"></i>
//                   {user.salary} {t('currency')}
//                 </span>
//               </div>
//             )}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default UserHeader;

// src/components/userProfile/ProfileHeader.jsx
import { useTranslation } from 'react-i18next';
import { employmentStatusMap } from '../../helpers/userHelpers';
import { formatDisplayTime } from '../../helpers/timezone';
/* ── helpers ── */
function fmt12(time) {
  if (!time) return null;
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12  = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="d-flex align-items-start gap-2 mb-1" style={{ fontSize: '0.83rem', color: '#475569' }}>
      <i className={`fa-solid ${icon} mt-1`} style={{ width: 14, color: '#94a3b8', flexShrink: 0 }} />
      <span><span style={{ color: '#64748b', fontWeight: 500 }}>{label}:</span> {value}</span>
    </div>
  );
}

function formatShiftTime(time) {
  if (!time) return null;

  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12  = h % 12 || 12;

  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}
function Badge({ color, icon, text }) {
  const colors = {
    success: { bg: '#dcfce7', text: '#15803d' },
    danger:  { bg: '#fee2e2', text: '#b91c1c' },
    warning: { bg: '#fef9c3', text: '#854d0e' },
    info:    { bg: '#dbeafe', text: '#1d4ed8' },
    purple:  { bg: '#ede9fe', text: '#6d28d9' },
    gray:    { bg: '#f1f5f9', text: '#475569' },
  };
  const c = colors[color] || colors.gray;
  return (
    <span className="d-inline-flex align-items-center gap-1 me-1 mb-1"
      style={{ background: c.bg, color: c.text, fontSize: '0.73rem', fontWeight: 600,
        padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>
      {icon && <i className={`fa-solid ${icon}`} style={{ fontSize: 10 }} />}
      {text}
    </span>
  );
}

export default function UserHeader({ user, isAdmin }) {
  const { t } = useTranslation();
  if (!user) return null;

  const currentStatus  = user?.employmentHistory?.at(-1)?.status;
  const empStatus      = employmentStatusMap[currentStatus] || employmentStatusMap.active;
  const isGlobal       = user.adminScope?.type === 'GLOBAL';
  const isBranchAdmin  = user.adminScope?.type === 'BRANCH';
  const adminBranches  = user.adminScope?.branches || [];

  // const workHours = user.workStartTime && user.workEndTime
  //   ? `${fmt12(user.workStartTime)} – ${fmt12(user.workEndTime)}`
  //   : null;

// const tz = user.workTimezone || user.branch?.timezone || 'UTC';


const tz = user.workTimezone || 'UTC';

const workHours = user.workStartTime && user.workEndTime ? (
  <>
    {formatShiftTime(user.workStartTime)} – {formatShiftTime(user.workEndTime)}
   <small className="text-muted ms-2">({tz})</small>
  </>
) : null;

  // const workHours = user.workStartTime && user.workEndTime
  // ? `${formatDisplayTime(new Date(`1970-01-01T${user.workStartTime}:00`), user.workTimezone || user.branch?.timezone)}
  //    – 
  //    ${formatDisplayTime(new Date(`1970-01-01T${user.workEndTime}:00`), user.workTimezone || user.branch?.timezone)}`
  // : null;

  const adminScopeLabel = isGlobal
    ? 'Global Admin'
   // ✅ بعد
: isBranchAdmin
  ? `Branch Admin${adminBranches.filter(b => b?.name).length 
      ? ` (${adminBranches.filter(b => b?.name).map(b => b.name).join(', ')})` 
      : ''}`
      : null;

  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0',
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)', marginBottom: '1.25rem', overflow: 'hidden' }}>

      {/* ── Top gradient strip ── */}
      <div style={{ height: 6, background: 'linear-gradient(90deg,#3b82f6,#6366f1,#8b5cf6)' }} />

      <div className="p-4">
        <div className="row g-3 align-items-start">

          {/* ── Avatar + name ── */}
          <div className="col-auto">
            <div style={{ width: 64, height: 64, borderRadius: '50%',
              background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '1.5rem', fontWeight: 700, flexShrink: 0 }}>
              {user.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
          </div>

          {/* ── Main info ── */}
          <div className="col">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
              <h5 style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: '1.1rem' }}>
                {user.name}
              </h5>
              {/* Badges row */}
              <Badge
                color={user.isActive ? 'success' : 'warning'}
                icon={user.isActive ? 'fa-circle-check' : 'fa-clock'}
                text={user.isActive ? t('accountActive') : t('pendingActivation')}
              />
              <Badge
                color={empStatus.color || 'gray'}
                icon={empStatus.icon}
                text={t(`employment.status.${currentStatus}`) || currentStatus}
              />
              <Badge
                color="gray"
                icon="fa-user-tag"
                text={t(user.role) || user.role}
              />
              {user.isNightShift && <Badge color="purple" icon="fa-moon" text="Night Shift" />}
              {user.allowRemoteAbsence && <Badge color="info" icon="fa-house-laptop" text="Remote" />}
            </div>

            <div style={{ color: '#64748b', fontSize: '0.83rem', marginBottom: 8 }}>
              <i className="fa-solid fa-envelope me-1" style={{ color: '#94a3b8' }} />
              {user.email}
              {user.phone && (
                <span className="ms-3">
                  <i className="fa-solid fa-phone me-1" style={{ color: '#94a3b8' }} />
                  {user.phone}
                </span>
              )}
            </div>

            {/* Info rows */}
            <div className="row g-0">
              <div className="col-md-6">
                <InfoRow icon="fa-building"      label={t('branches')}      value={user.branches?.filter(b=>b?.name).map(b=>b.name).join(', ')} />
                <InfoRow icon="fa-sitemap"       label={t('department')}    value={user.departments?.filter(d=>d?.name).map(d=>d.name).join(', ')} />
                <InfoRow icon="fa-calendar-day"  label={t('startDate')}     value={user.employmentStartDate ? new Date(user.employmentStartDate).toLocaleDateString('en-GB') : null} />
                <InfoRow icon="fa-calendar-week" label={t('workingDays')}   value={user.workingDaysNames?.join(', ')} />
              </div>
              <div className="col-md-6">
                <InfoRow icon="fa-clock"         label={t('workingHours')}  value={workHours} />
                <InfoRow icon="fa-location-dot"  label={t('address')}       value={user.address} />
                {adminScopeLabel && (
                  <InfoRow icon="fa-shield-halved" label="Admin Scope" value={adminScopeLabel} />
                )}
                {isAdmin && user.salary && (
                  <InfoRow icon="fa-coins"       label={t('salary')}        value={`${user.salary} ${t('currency')}`} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
