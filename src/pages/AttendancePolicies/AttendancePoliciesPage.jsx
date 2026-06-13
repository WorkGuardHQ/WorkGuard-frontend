
// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';

// import { getAttendancePolicies } from '../../services/attendancePolicy.api';
// import AttendancePolicyTable from '../../components/attendancePolicy/AttendancePolicyTable';
// import AttendancePolicyFormModal from '../../components/attendancePolicy/AttendancePolicyFormModal';
// import Toast from '../../components/ui/Toast';

// const AttendancePoliciesPage = () => {
//   const { t } = useTranslation();

//   const [policies, setPolicies] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [showModal, setShowModal] = useState(false);
//   const [editingPolicy, setEditingPolicy] = useState(null);
//   const [toast, setToast] = useState(null);
// const [confirmToast, setConfirmToast] = useState(null);
// const [togglingId, setTogglingId] = useState(null);

//   const loadPolicies = async () => {
//     try {
//       setLoading(true);
//       const res = await getAttendancePolicies({ limit: 50 });
//       setPolicies(res.data || []);
//     } catch {
//       setToast({
//         type: 'error',
//         message: t('attendancePolicy.loadError')
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadPolicies();
//   }, []);

//   return (
//     <div className="container-fluid">

//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h3 className="mb-0">
//           <i className="fas fa-sliders-h me-2" />
//           {t('attendancePolicy.pageTitle')}
//         </h3>

//         <button
//           className="btn btn-primary"
//           onClick={() => {
//             setEditingPolicy(null);
//             setShowModal(true);
//           }}
//         >
//           <i className="fas fa-plus me-1" />
//           {t('attendancePolicy.create')}
//         </button>
//       </div>

//       {/* Table */}
//       <AttendancePolicyTable
//         policies={policies}
//         loading={loading}
//         onEdit={(p) => {
//           setEditingPolicy(p);
//           setShowModal(true);
//         }}
//         onReload={loadPolicies}
//       />

//       {/* Modal */}
//       <AttendancePolicyFormModal
//         show={showModal}
//         editingPolicy={editingPolicy}
//         onClose={() => setShowModal(false)}
//         onSuccess={() => {
//           setShowModal(false);
//           loadPolicies();
//           setToast({
//             type: 'success',
//             message: t('attendancePolicy.saved')
//           });
//         }}
//       />

//       {/* Toast */}
//       {toast && (
//         <Toast
//           type={toast.type}
//           message={toast.message}
//           onClose={() => setToast(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default AttendancePoliciesPage;

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getAttendancePolicies } from '../../services/attendancePolicy.api';
import AttendancePolicyTable from '../../components/attendancePolicy/AttendancePolicyTable';
import AttendancePolicyFormModal from '../../components/attendancePolicy/AttendancePolicyFormModal';
import Toast from '../../components/ui/Toast';
import AttendancePolicyNotes from '../../components/attendancePolicy/AttendancePolicyNotes';
import { isGlobalAdmin } from '../../helpers/auth';

import '../../style/AttendancePoliciesPage.css';

const AttendancePoliciesPage = () => {
  const { t } = useTranslation();

  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [toast, setToast] = useState(null);
const [activeFilter, setActiveFilter] = useState(null);
const [tenantTimezone, setTenantTimezone] = useState('UTC');
  /* =========================
     Load Policies (زي النسخة الأولى)
  ========================= */
  const loadPolicies = async () => {
    try {
      setLoading(true);
      const res = await getAttendancePolicies({ limit: 50 });
      
console.log('FULL RESPONSE:', res);
console.log('META:', res.meta);
      setPolicies(res.data || []);

      setTenantTimezone(res.meta?.timezone || 'UTC');

    } catch {
      setToast({
        type: 'error',
        message: t('attendancePolicy.loadError')
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPolicies();
  }, []);


  /* =========================
     Stats (UI فقط)
  ========================= */
  const stats = [
    {
      label: t('attendancePolicy.totalPolicies'),
      value: policies.length,
      icon: 'fa-list-alt',
      color: 'primary',
       filterKey: null
    },
    {
      label: t('common.active'),
      value: policies.filter(p => p.active).length,
      icon: 'fa-check-circle',
      color: 'success',
      filterKey: 'active'
    },
    {
      label: t('common.inactive'),
      value: policies.filter(p => !p.active).length,
      icon: 'fa-times-circle',
      color: 'warning',
       filterKey: 'inactive'
    },
    {
      label: t('attendancePolicy.global'),
      value: policies.filter(p => p.scope === 'global').length,
      icon: 'fa-globe',
      color: 'info',
      filterKey: 'global'
    }
    
  ];
const filteredPolicies = (() => {
  if (!activeFilter) return policies;

  if (activeFilter === 'active') {
    return policies.filter(p => p.active);
  }

  if (activeFilter === 'inactive') {
    return policies.filter(p => !p.active);
  }

  if (activeFilter === 'global') {
    return policies.filter(p => p.scope === 'global');
  }

  return policies;
})();

  return (
    <div className="attendance-policies-page">
      <div className="container-fluid">

        {/* Header (من الكومنت) */}
        <div className="page-header mb-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="page-title mb-1">
                <i className="fas fa-sliders-h me-2" />
                {t('attendancePolicy.pageTitle')}
              </h2>
              <p className="page-subtitle mb-0">
                {t('attendancePolicy.pageSubtitle')}
              </p>
            </div>



            <button
              className="btn btn-primary btn-create"
              onClick={() => {
                setEditingPolicy(null);
                setShowModal(true);
              }}
            >
              <i className="fas fa-plus me-2" />
              {t('attendancePolicy.create')}
            </button>
          </div>
        </div>

        {/* Stats (من الكومنت) */}
    <div className="row g-3 mb-4">
  {stats.map((stat, i) => {
    const isActive = activeFilter === stat.filterKey;

    return (
      <div key={i} className="col-6 col-lg-3"> 
        <div
          className={`stat-card stat-card-${stat.color} ${
            isActive ? 'stat-card-active' : ''
          }`}
          role="button"
          onClick={() =>
            setActiveFilter(prev =>
              prev === stat.filterKey ? null : stat.filterKey
            )
          }
        >
          <div className="stat-icon">
            <i className={`fas ${stat.icon}`} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        </div>
      </div>
    );
  })}
</div>

  
        {/* TABLE (النسخة الأولى الشغالة) */}
        <AttendancePolicyTable
     
           policies={filteredPolicies}
          loading={loading}
          onEdit={(p) => {
            setEditingPolicy(p);
            setShowModal(true);
          }}
          onReload={loadPolicies}
          tenantTimezone={tenantTimezone}
        />
{/* Notes / Rules */}
<AttendancePolicyNotes t={t} />
        {/* Modal */}
        <AttendancePolicyFormModal
          show={showModal}
          editingPolicy={editingPolicy}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadPolicies();
            setToast({
              type: 'success',
              message: t('attendancePolicy.saved')
            });
          }}
           tenantTimezone={tenantTimezone}
        />

        {/* Toast */}
        {toast && (
          <Toast
          show={true}
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}

      </div>
    </div>
  );
};

export default AttendancePoliciesPage;



//ui not working=======================
// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { getAttendancePolicies } from '../../services/attendancePolicy.api';
// import AttendancePolicyTable from '../../components/attendancePolicy/AttendancePolicyTable';
// import AttendancePolicyFormModal from '../../components/attendancePolicy/AttendancePolicyFormModal';
// import Toast from '../../components/ui/Toast';
// import '../../style/AttendancePoliciesPage.css';

// const AttendancePoliciesPage = () => {
//   const { t } = useTranslation();

//   const [policies, setPolicies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingPolicy, setEditingPolicy] = useState(null);
//   const [toast, setToast] = useState(null);

//   const loadPolicies = async () => {
//     try {
//       setLoading(true);
//       const res = await getAttendancePolicies({ limit: 50 });
//       setPolicies(res.data || []);
//     } catch {
//       setToast({
//         type: 'error',
//         message: t('attendancePolicy.loadError')
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadPolicies();
//   }, []);

//   const stats = [
//     { 
//       label: t('attendancePolicy.totalPolicies') || 'Total', 
//       value: policies.length, 
//       icon: 'fa-list-alt', 
//       color: 'primary'
//     },
//     { 
//       label: t('attendancePolicy.active') || 'Active', 
//       value: policies.filter(p => p.active).length, 
//       icon: 'fa-check-circle', 
//       color: 'success'
//     },
//     { 
//       label: t('attendancePolicy.inactive') || 'Inactive', 
//       value: policies.filter(p => !p.active).length, 
//       icon: 'fa-times-circle', 
//       color: 'warning'
//     },
//     { 
//       label: t('attendancePolicy.global') || 'Global', 
//       value: policies.filter(p => p.scope === 'global').length, 
//       icon: 'fa-globe', 
//       color: 'info'
//     }
//   ];

//   return (
//     <div className="attendance-policies-page">
//       <div className="container-fluid">
        
//         {/* Header */}
//         <div className="page-header mb-4">
//           <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
//             <div>
//               <h2 className="page-title mb-1">
//                 <i className="fas fa-sliders-h me-2"></i>
//                 {t('attendancePolicy.pageTitle')}
//               </h2>
//               <p className="page-subtitle mb-0">
//                 {t('attendancePolicy.pageSubtitle') || 'Manage attendance rules and deduction policies'}
//               </p>
//             </div>
//             <button
//               className="btn btn-primary btn-create"
//               onClick={() => {
//                 setEditingPolicy(null);
//                 setShowModal(true);
//               }}
//             >
//               <i className="fas fa-plus me-2"></i>
//               {t('attendancePolicy.create')}
//             </button>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="row g-3 mb-4">
//           {stats.map((stat, index) => (
//             <div key={index} className="col-6 col-lg-3">
//               <div className={`stat-card stat-card-${stat.color}`}>
//                 <div className="stat-icon">
//                   <i className={`fas ${stat.icon}`}></i>
//                 </div>
//                 <div className="stat-content">
//                   <div className="stat-value">{stat.value}</div>
//                   <div className="stat-label">{stat.label}</div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Content */}
//         {loading ? (
//           <div className="loading-container">
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">{t('common.loading')}</span>
//             </div>
//           </div>
//         ) : policies.length === 0 ? (
//           <div className="empty-state">
//             <i className="fas fa-clipboard-list empty-icon"></i>
//             <h4>{t('attendancePolicy.noPolicies') || 'No Policies Yet'}</h4>
//             <p className="text-muted mb-3">
//               {t('attendancePolicy.noPoliciesDesc') || 'Create your first attendance policy to get started'}
//             </p>
//             <button
//               className="btn btn-primary"
//               onClick={() => setShowModal(true)}
//             >
//               <i className="fas fa-plus me-2"></i>
//               {t('attendancePolicy.create')}
//             </button>
//           </div>
//         ) : (
//           <div className="policies-grid">
//             {policies.map((policy) => (
//               <div key={policy._id} className="policy-card">
                
//                 {/* Header */}
//                 <div className="policy-header">
//                   <div className="d-flex align-items-center justify-content-between">
//                     <div className="d-flex align-items-center gap-2">
//                       <div className="policy-icon">
//                         <i className={`fas ${
//                           policy.scope === 'global' ? 'fa-globe' :
//                           policy.scope === 'branch' ? 'fa-building' :
//                           'fa-user-shield'
//                         }`}></i>
//                       </div>
//                       <div>
//                         <h6 className="policy-scope mb-0">
//                           {t(`attendancePolicy.scope_${policy.scope}`)}
//                         </h6>
//                         <small className="policy-target">
//                           {policy.scope === 'global' && (t('attendancePolicy.allCompany') || 'All Company')}
//                           {policy.scope === 'branch' && (policy.scopeId?.name || '-')}
//                           {policy.scope === 'role' && (t(`roles.${policy.role}`) || policy.role)}
//                         </small>
//                       </div>
//                     </div>
//                     <span className={`badge badge-status ${policy.active ? 'badge-active' : 'badge-inactive'}`}>
//                       {policy.active ? t('common.active') : t('common.inactive')}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Body */}
//                 <div className="policy-body">
                  
//                   {/* Grace */}
//                   <div className="policy-section">
//                     <div className="section-title">
//                       <i className="fas fa-clock me-2"></i>
//                       {t('attendancePolicy.gracePeriods') || 'Grace Periods'}
//                     </div>
//                     <div className="row g-2">
//                       <div className="col-6">
//                         <div className="info-item">
//                           <span className="info-label">{t('attendancePolicy.lateGrace')}</span>
//                           <span className="info-value">{policy.grace?.lateMinutes || 0} {t('common.minutes')}</span>
//                         </div>
//                       </div>
//                       <div className="col-6">
//                         <div className="info-item">
//                           <span className="info-label">{t('attendancePolicy.earlyGrace')}</span>
//                           <span className="info-value">{policy.grace?.earlyLeaveMinutes || 0} {t('common.minutes')}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Rates */}
//                   <div className="policy-section">
//                     <div className="section-title">
//                       <i className="fas fa-percentage me-2"></i>
//                       {t('attendancePolicy.deductionRates') || 'Deduction Rates'}
//                     </div>
//                     <div className="rates-list">
//                       <div className="rate-item rate-late">
//                         <span>{t('attendancePolicy.lateRate')}</span>
//                         <strong>{policy.rates?.latePerMinute || 0}</strong>
//                       </div>
//                       <div className="rate-item rate-early">
//                         <span>{t('attendancePolicy.earlyRate')}</span>
//                         <strong>{policy.rates?.earlyLeavePerMinute || 0}</strong>
//                       </div>
//                       <div className="rate-item rate-transit">
//                         <span>{t('attendancePolicy.transitRate')}</span>
//                         <strong>{policy.rates?.transitPerMinute || 0}</strong>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Absence */}
//                   <div className="policy-section">
//                     <div className="section-title">
//                       <i className="fas fa-user-times me-2"></i>
//                       {t('attendancePolicy.absence')}
//                     </div>
//                     <div className="absence-info">
//                       {!policy.absence?.markDayAbsent ? (
//                         <span><i className="fas fa-check-circle me-1"></i> {t('attendancePolicy.noDeduction')}</span>
//                       ) : policy.absence?.paid ? (
//                         <span><i className="fas fa-dollar-sign me-1"></i> {t('attendancePolicy.absencePaid')}</span>
//                       ) : (
//                         <span><i className="fas fa-exclamation-triangle me-1"></i> {t('attendancePolicy.absenceDeduction')}: <strong>{policy.absence.dayRate * 100}%</strong></span>
//                       )}
//                     </div>
//                   </div>

//                 </div>

//                 {/* Footer */}
//                 <div className="policy-footer">
//                   <div className="policy-date">
//                     <i className="fas fa-calendar-alt me-1"></i>
//                     <small>{new Date(policy.effectiveFrom).toLocaleDateString()}</small>
//                   </div>
//                   <div className="policy-actions">
//                     <button
//                       className="btn-action btn-action-edit"
//                       onClick={() => {
//                         setEditingPolicy(policy);
//                         setShowModal(true);
//                       }}
//                       title={t('common.edit')}
//                     >
//                       <i className="fas fa-edit"></i>
//                     </button>
//                     <button
//                       className="btn-action btn-action-toggle"
//                       onClick={() => {
//                         if (window.confirm(
//                           policy.active
//                             ? t('attendancePolicy.confirmDisable')
//                             : t('attendancePolicy.confirmEnable')
//                         )) {
//                           loadPolicies();
//                         }
//                       }}
//                       title={t('common.toggleStatus')}
//                     >
//                       <i className="fas fa-power-off"></i>
//                     </button>
//                     <button
//                       className="btn-action btn-action-delete"
//                       onClick={() => {
//                         if (window.confirm(t('attendancePolicy.confirmDelete'))) {
//                           loadPolicies();
//                         }
//                       }}
//                       title={t('common.delete')}
//                     >
//                       <i className="fas fa-trash"></i>
//                     </button>
//                   </div>
//                 </div>

//               </div>
//             ))}
//           </div>
//         )}

//         {/* Modal */}
//         <AttendancePolicyFormModal
//           show={showModal}
//           editingPolicy={editingPolicy}
//           onClose={() => setShowModal(false)}
//           onSuccess={() => {
//             setShowModal(false);
//             loadPolicies();
//             setToast({
//               type: 'success',
//               message: t('attendancePolicy.saved')
//             });
//           }}
//         />

//         {/* Toast */}
//         {toast && (
//           <Toast
//             type={toast.type}
//             message={toast.message}
//             onClose={() => setToast(null)}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default AttendancePoliciesPage;