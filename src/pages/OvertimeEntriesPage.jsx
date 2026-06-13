// import { useEffect, useState, useCallback } from 'react';
// import { useTranslation } from 'react-i18next';

// import { getOvertimeEntries }  from '../services/Overtime & Bonus/overtimeEntry.api';
// import OvertimeEntryTable      from '../components/overtimeEntry/OvertimeEntryTable';
// import OvertimeEntryFilters    from '../components/overtimeEntry/OvertimeEntryFilters';
// import AddExceptionalModal     from '../components/overtimeEntry/AddExceptionalModal';
// import Toast                   from '../components/ui/Toast';

// import '../style/OvertimeEntriesPage.css';

// /* ==============================================
//    📄 OvertimeEntriesPage
// ============================================== */

// const DEFAULT_FILTERS = {
//   type:     '',
//   status:   '',
//   source:   '',
//   dateFrom: '',
//   dateTo:   ''
// };

// const OvertimeEntriesPage = () => {
//   const { t } = useTranslation("overtimeEntry");

//   const [entries,       setEntries]       = useState([]);
//   const [loading,       setLoading]       = useState(true);
//   const [filters,       setFilters]       = useState(DEFAULT_FILTERS);
//   const [pagination,    setPagination]    = useState({ page: 1, total: 0, totalPages: 1 });
//   const [showModal,     setShowModal]     = useState(false);
//   const [toast,         setToast]         = useState(null);
//   const [activeFilter,  setActiveFilter]  = useState(null);

//   /* =========================
//      Load Entries
//   ========================= */
//   const loadEntries = useCallback(async (page = 1) => {
//     try {
//       setLoading(true);
//       const params = { page, limit: 20, ...filters };

//       // حذف الفلاتر الفاضية
//       Object.keys(params).forEach(k => {
//         if (!params[k]) delete params[k];
//       });

//       const res = await getOvertimeEntries(params);

//       setEntries(res.data || []);
//       setPagination({
//         page:       res.pagination?.page       || 1,
//         total:      res.pagination?.total      || 0,
//         totalPages: res.pagination?.totalPages || 1
//       });
//     } catch {
//       setToast({ type: 'error', message: t('overtimeEntry.loadError') });
//     } finally {
//       setLoading(false);
//     }
//   }, [filters]);

//   useEffect(() => {
//     loadEntries(1);
//   }, [filters]);

//   /* =========================
//      Stats (من الـ entries المحملة)
//   ========================= */
//   const stats = [
//     {
//       label:     t('overtimeEntry.totalEntries'),
//       value:     pagination.total,
//       icon:      'fa-clock',
//       color:     'primary',
//       filterKey: null
//     },
//     {
//       label:     t('overtimeEntry.pendingEntries'),
//       value:     entries.filter(e => e.status === 'pending').length,
//       icon:      'fa-hourglass-half',
//       color:     'warning',
//       filterKey: 'pending'
//     },
//     {
//       label:     t('overtimeEntry.approvedEntries'),
//       value:     entries.filter(e => e.status === 'approved').length,
//       icon:      'fa-check-circle',
//       color:     'success',
//       filterKey: 'approved'
//     },
//     {
//       label:     t('overtimeEntry.rejectedEntries'),
//       value:     entries.filter(e => e.status === 'rejected').length,
//       icon:      'fa-times-circle',
//       color:     'danger',
//       filterKey: 'rejected'
//     }
//   ];

//   /* =========================
//      Filter Handlers
//   ========================= */
//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//   };

//   const handleFilterReset = () => {
//     setFilters(DEFAULT_FILTERS);
//     setActiveFilter(null);
//   };

//   // stat card click → status filter
//   const handleStatClick = (filterKey) => {
//     if (!filterKey) {
//       setFilters(DEFAULT_FILTERS);
//       setActiveFilter(null);
//       return;
//     }
//     setActiveFilter(prev => prev === filterKey ? null : filterKey);
//     setFilters(prev => ({
//       ...DEFAULT_FILTERS,
//       status: activeFilter === filterKey ? '' : filterKey
//     }));
//   };

//   /* =========================
//      JSX
//   ========================= */
//   return (
//     <div className="overtime-entries-page">
//       <div className="container-fluid">

//         {/* ── Header ── */}
//         <div className="page-header mb-4">
//           <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
//             <div>
//               <h2 className="page-title mb-1">
//                 <i className="fas fa-business-time me-2" />
//                 {t('overtimeEntry.pageTitle')}
//               </h2>
//               <p className="page-subtitle mb-0">{t('overtimeEntry.pageSubtitle')}</p>
//             </div>

//             <button className="btn btn-warning btn-create"
//               onClick={() => setShowModal(true)}>
//               <i className="fas fa-star me-2" />
//               {t('overtimeEntry.addExceptional')}
//             </button>
//           </div>
//         </div>

//         {/* ── Stats ── */}
//         <div className="row g-3 mb-4">
//           {stats.map((stat, i) => {
//             const isActive = activeFilter === stat.filterKey;
//             return (
//               <div key={i} className="col-6 col-lg-3">
//                 <div
//                   className={`stat-card stat-card-${stat.color} ${isActive ? 'stat-card-active' : ''}`}
//                   role="button"
//                   onClick={() => handleStatClick(stat.filterKey)}
//                 >
//                   <div className="stat-icon">
//                     <i className={`fas ${stat.icon}`} />
//                   </div>
//                   <div className="stat-content">
//                     <div className="stat-value">{stat.value}</div>
//                     <div className="stat-label">{stat.label}</div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* ── Filters ── */}
//         <OvertimeEntryFilters
//           filters={filters}
//           onChange={handleFilterChange}
//           onReset={handleFilterReset}
//         />

//         {/* ── Table ── */}
//         <OvertimeEntryTable
//           entries={entries}
//           loading={loading}
//           onReload={() => loadEntries(pagination.page)}
//           onToast={setToast}
//         />

//         {/* ── Pagination ── */}
//         {pagination.totalPages > 1 && (
//           <div className="d-flex justify-content-center mt-4 gap-2">
//             <button className="btn btn-sm btn-outline-secondary"
//               disabled={pagination.page <= 1}
//               onClick={() => loadEntries(pagination.page - 1)}>
//               <i className="fas fa-chevron-left" />
//             </button>

//             {[...Array(pagination.totalPages)].map((_, i) => (
//               <button key={i}
//                 className={`btn btn-sm ${pagination.page === i + 1 ? 'btn-primary' : 'btn-outline-secondary'}`}
//                 onClick={() => loadEntries(i + 1)}>
//                 {i + 1}
//               </button>
//             ))}

//             <button className="btn btn-sm btn-outline-secondary"
//               disabled={pagination.page >= pagination.totalPages}
//               onClick={() => loadEntries(pagination.page + 1)}>
//               <i className="fas fa-chevron-right" />
//             </button>
//           </div>
//         )}

//         {/* ── Add Exceptional Modal ── */}
//         <AddExceptionalModal
//           show={showModal}
//           onClose={() => setShowModal(false)}
//           onToast={setToast}
//           onSuccess={() => {
//             setShowModal(false);
//             loadEntries(1);
//             setToast({ type: 'success', message: t('overtimeEntry.added') });
//           }}
//         />

//         {/* ── Toast ── */}
//         {toast && (
//           <Toast
//             show={true}
//             type={toast.type}
//             message={toast.message}
//             onConfirm={toast.onConfirm}
//             onClose={() => setToast(null)}
//           />
//         )}

//       </div>
//     </div>
//   );
// };

// export default OvertimeEntriesPage;

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { getOvertimeEntries ,getOvertimeStats }  from '../services/Overtime & Bonus/overtimeEntry.api';
import OvertimeEntryTable      from '../components/overtimeEntry/OvertimeEntryTable';
import OvertimeEntryFilters    from '../components/overtimeEntry/OvertimeEntryFilters';
import AddExceptionalModal     from '../components/overtimeEntry/AddExceptionalModal';
import Toast                   from '../components/ui/Toast';

import '../style/OvertimeEntriesPage.css';

/* ==============================================
   📄 OvertimeEntriesPage

   كل الـ entries بتكون approved تلقائياً
   الصفحة = عرض + فلتر + إضافة EXCEPTIONAL
   Delete متاح بس للـ EXCEPTIONAL manual
   لو الـ Payroll approved → الـ backend بيرفض الحذف
============================================== */

const DEFAULT_FILTERS = {
  type:     '',
  status:   '',
  source:   '',
  dateFrom: '',
  dateTo:   ''
};

const OvertimeEntriesPage = () => {
  const { t } = useTranslation("overtimeEntry");

  const [entries,setEntries] = useState([]);
  const [loading,setLoading] = useState(true);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
 const [pagination, setPagination] = useState({
  page: 1,
  total: 0,
  pages: 1,
  hasNextPage: false,
  hasPrevPage: false
});
  const [showModal,  setShowModal]  = useState(false);
  const [toast,      setToast]      = useState(null);
  const [activeType, setActiveType] = useState(null);
const [statsData, setStatsData] = useState({});

// const loadStats = async ()=>{
//   try{
//     const res = await getOvertimeStats()
//     setStatsData(res)
//     console.log("stats response:", res)
//   }catch{
//     console.error("Failed loading stats")
//   }
// }
// useEffect(()=>{
//   loadStats()
// },[])
/* =========================
     Load Entries
  ========================= */
  const loadEntries = useCallback(async (page = 1) => {
    try {

      if (
  filters.dateFrom &&
  filters.dateTo &&
  filters.dateTo < filters.dateFrom
) {
  return;
}
      setLoading(true);
      const params = { page, limit: 10, ...filters };
      Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });

      const res = await getOvertimeEntries(params);
      setEntries(res.data || []);
     setPagination(res.pagination || {});
     setStatsData(res.stats || {});

    } catch {
      setToast({ type: 'error', message: t('overtimeEntry.loadError') });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { loadEntries(1); }, [filters]);

  /* =========================
     Stats — بالنوع مش الحالة
     (كل الـ entries approved تلقائياً)
  ========================= */

const stats = [
  {
    label: t('overtimeEntry.totalEntries'),
    value: statsData?.totalEntries || 0,
    icon: 'fa-list',
    color: 'primary',
    typeKey: null
  },

  {
    label: t('overtimeEntry.types.EXCEPTIONAL'),
    value: statsData?.exceptionalEntries || 0,
    icon: 'fa-star',
    color: 'warning',
    typeKey: 'EXCEPTIONAL'
  },

  {
  label: t('overtimeEntry.sources.auto'),
  value: statsData?.autoGeneratedEntries || 0,
  icon: 'fa-robot',
  color: 'info',
  typeKey: 'AUTO'
}
];

  /* =========================
     Filter Handlers
  ========================= */
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleFilterReset = () => {
    setFilters(DEFAULT_FILTERS);
    setActiveType(null);
  };

  // stat card click → type filter
const handleStatClick = (typeKey) => {

  const newType =
    activeType === typeKey
      ? null
      : typeKey;

  setActiveType(newType);

  if (!newType) {

    setFilters(DEFAULT_FILTERS);

    return;
  }

  if (newType === 'EXCEPTIONAL') {

    setFilters(prev => ({
      ...DEFAULT_FILTERS,
      type: 'EXCEPTIONAL'
    }));

    return;
  }

  if (newType === 'AUTO') {

    setFilters(prev => ({
      ...DEFAULT_FILTERS,
      source: 'auto'
    }));

    return;
  }
};

//
const showToast = (toastData) => {

  setToast(null);

  setTimeout(() => {
    setToast(toastData);
  }, 50);
};
  /* =========================
     JSX
  ========================= */
  return (
    <div className="overtime-entries-page">
      <div className="container-fluid">

        {/* ── Header ── */}
        <div className="page-header mb-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="page-title mb-1">
                <i className="fas fa-business-time me-2" />
                {t('overtimeEntry.pageTitle')}
              </h2>
              <p className="page-subtitle mb-0">{t('overtimeEntry.pageSubtitle')}</p>
            </div>

            <button className="btn btn-warning btn-create"
              onClick={() => setShowModal(true)}>
              <i className="fas fa-star me-2" />
              {t('overtimeEntry.addExceptional')}
            </button>
          </div>
        </div>

        {/* ── Stats (بالنوع) ── */}
        <div className="row g-3 mb-4">
          {stats.map((stat, i) => {
            const isActive = activeType === stat.typeKey;
            return (
              <div key={i} className="col-6 col-lg-3">
                <div
                  className={`stat-card stat-card-${stat.color} ${isActive ? 'stat-card-active' : ''}`}
                  role="button"
                  onClick={() => handleStatClick(stat.typeKey)}
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

        {/* ── Filters ── */}
        <OvertimeEntryFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleFilterReset}
        />

        {/* ── Table ── */}
        <OvertimeEntryTable
          entries={entries}
          loading={loading}
          onReload={() => loadEntries(pagination.page)}
          // onToast={setToast}
          onToast={showToast}
        />

        {/* ── Pagination ── */}
        {pagination.pages > 1 && (
          <div className="d-flex justify-content-center mt-4 gap-2 flex-wrap">
            <button className="btn btn-sm btn-outline-secondary"
              disabled={pagination.page <= 1}
              onClick={() => loadEntries(pagination.page - 1)}>
              <i className="fas fa-chevron-left" />
            </button>

            {[...Array(Math.min(pagination.pages, 10))].map((_, i) => (
              <button key={i}
                className={`btn btn-sm ${pagination.page === i + 1 ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => loadEntries(i + 1)}>
                {i + 1}
              </button>
            ))}

            <button className="btn btn-sm btn-outline-secondary"
              disabled={pagination.page >= pagination.pages}
              onClick={() => loadEntries(pagination.page + 1)}>
              <i className="fas fa-chevron-right" />
            </button>
          </div>
        )}

        {/* ── Add Exceptional Modal ── */}
        <AddExceptionalModal
          show={showModal}
          onClose={() => setShowModal(false)}
          // onToast={setToast}
          onToast={showToast}
          onSuccess={() => {
            setShowModal(false);
            loadEntries(1);
            // loadStats();
            setToast({ type: 'success', message: t('overtimeEntry.added') });
          }}
        />

        {/* ── Toast (with confirm) ── */}
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

export default OvertimeEntriesPage;