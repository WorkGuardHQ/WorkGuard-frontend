import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getBonusPolicies }    from '../services/Overtime & Bonus/bonusPolicy.api';
import BonusPolicyTable        from '../components/bonusPolicy/BonusPolicyTable';
import BonusPolicyFormModal    from '../components/bonusPolicy/BonusPolicyFormModal';
import BonusPolicyNotes from '../components/bonusPolicy/BonusPolicyNotes';
import Toast  from '../components/ui/Toast';
import { isGlobalAdmin } from '../helpers/auth';
import '../style/BonusPolicyPage.css';

/* ==============================================
   📄 BonusPoliciesPage
============================================== */
const BonusPoliciesPage = ({ currentUser }) => {
  const { t } = useTranslation("bonusPolicy");

//   const isSuperAdmin =
//     currentUser?.role === 'admin' &&
//     currentUser?.adminScope?.type === 'GLOBAL';
  // ✅ SuperAdmin = admin + GLOBAL scope

  const isSuperAdmin = isGlobalAdmin();
console.log("currentUser", currentUser);



  const [policies,      setPolicies]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [showModal,     setShowModal]     = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [toast,         setToast]         = useState(null);
  // const [activeFilter,  setActiveFilter]  = useState(null);


  const [page, setPage] = useState(1);
const [limit, setLimit] = useState(5);

const [scopeFilter, setScopeFilter] = useState('');
const [statusFilter, setStatusFilter] = useState('');

const [pagination, setPagination] = useState(null);
const [stats, setStats] = useState(null);
  /* =========================
     Load
  ========================= */
  // const loadPolicies = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await getBonusPolicies({ limit: 50 });
  //     setPolicies(res.data || []);
  //   } catch {
  //     setToast({ type: 'error', message: t('bonusPolicy.loadError') });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => { loadPolicies(); }, []);
const loadPolicies = async () => {
  try {
    setLoading(true);

    const res = await getBonusPolicies({
      page,
      limit,

      scope:
        scopeFilter || undefined,

      isActive:
        statusFilter === ''
          ? undefined
          : statusFilter
    });

    setPolicies(res.data || []);
    setPagination(res.pagination || null);
    setStats(res.stats || null);

  } catch {
    setToast({
      type: 'error',
      message: t('bonusPolicy.loadError')
    });
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  loadPolicies();
}, [page, limit, scopeFilter, statusFilter]);
  /* =========================
     Stats
  ========================= */
  const statsCards = [
    { label: t('bonusPolicy.totalPolicies'),   value: stats?.totalPolicies || 0,                          icon: 'fa-gift',         color: 'primary', filterKey: null       },
    { label: t('bonusPolicy.activePolicies'),  value: stats?.activePolicies || 0,  icon: 'fa-check-circle', color: 'success', filterKey: 'active'   },
    { label: t('bonusPolicy.inactivePolicies'),value: stats?.inactivePolicies || 0, icon: 'fa-times-circle', color: 'warning', filterKey: 'inactive' },
    { label: t('bonusPolicy.globalPolicies'),  value: stats?.globalPolicies || 0, icon: 'fa-globe', color: 'info', filterKey: 'global' }
  ];

  /* =========================
     Filter
  ========================= */
  // const filteredPolicies = (() => {
  //   if (!activeFilter)               return policies;
  //   if (activeFilter === 'active')   return policies.filter(p => p.isActive);
  //   if (activeFilter === 'inactive') return policies.filter(p => !p.isActive);
  //   if (activeFilter === 'global')   return policies.filter(p => p.scope === 'global');
  //   return policies;
  // })();
const showToast = (toastData) => {

  setToast(null);

  setTimeout(() => {
    setToast(toastData);
  }, 50);
};  


  return (
    <div className="bonus-policies-page">
      <div className="container-fluid">

        {/* ── Header ── */}
        <div className="page-header mb-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="page-title mb-1">
                <i className="fas fa-gift me-2" />
                {t('bonusPolicy.pageTitle')}
              </h2>
              <p className="page-subtitle mb-0">{t('bonusPolicy.pageSubtitle')}</p>
            </div>
            <button className="btn btn-success btn-create"
              onClick={() => { setEditingPolicy(null); setShowModal(true); }}>
              <i className="fas fa-plus me-2" />
              {t('bonusPolicy.create')}
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="row g-3 mb-4">
          {statsCards.map((stat, i) => {
            const isActive =
  (stat.filterKey === 'active' && statusFilter === 'true') ||
  (stat.filterKey === 'inactive' && statusFilter === 'false') ||
  (stat.filterKey === 'global' && scopeFilter === 'global');


            return (
              <div key={i} className="col-6 col-lg-3">
                <div
                  className={`stat-card stat-card-${stat.color} ${isActive ? 'stat-card-active' : ''}`}
                  role="button"
               onClick={() => {

  setPage(1);

  // ACTIVE
  if (stat.filterKey === 'active') {

    setStatusFilter(prev =>
      prev === 'true' ? '' : 'true'
    );

    return;
  }

  // INACTIVE
  if (stat.filterKey === 'inactive') {

    setStatusFilter(prev =>
      prev === 'false' ? '' : 'false'
    );

    return;
  }

  // GLOBAL
  if (stat.filterKey === 'global') {

    setScopeFilter(prev =>
      prev === 'global' ? '' : 'global'
    );

    return;
  }

  // TOTAL
  setStatusFilter('');
  setScopeFilter('');
}}
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

        {/* ── Table ── */}
        <BonusPolicyTable
         policies={policies}
          loading={loading}
          isSuperAdmin={isSuperAdmin}
          onEdit={p => { setEditingPolicy(p); setShowModal(true); }}
          onReload={loadPolicies}
          // onToast={setToast}
          onToast={showToast}
          pagination={pagination}
          onPageChange={setPage}
        />

        {/* ── Notes ── */}
        <BonusPolicyNotes />

        {/* ── Modal ── */}
        <BonusPolicyFormModal
          show={showModal}
          editingPolicy={editingPolicy}
          onClose={() => setShowModal(false)}
          // onToast={setToast}
          onToast={showToast}
          onSuccess={() => {
            setShowModal(false);
            loadPolicies();
            setToast({ type: 'success', message: t('bonusPolicy.saved') });
          }}
        />

        {/* ── Toast ── */}
        {toast && (
          <Toast
            show={true}
            type={toast.type}
            message={toast.message}
            onConfirm={toast.onConfirm}
            onClose={() => setToast(null)}
          />
        )}

      </div>
    </div>
  );
};

export default BonusPoliciesPage;