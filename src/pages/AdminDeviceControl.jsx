
// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';

// import { apiGet , apiDelete} from '../helpers/api';
// import DeviceTable from '../components/adminDevice/DeviceTable';
// import Filters from '../components/adminDevice/DeviceFilters';
// import Toast from '../components/ui/Toast';

// const PAGE_SIZE = 10;

// function AdminDeviceControl() {
//       const { t } = useTranslation();
//   const [devices, setDevices] = useState([]);
//   const [page, setPage] = useState(1);
//   const [pages, setPages] = useState(1);
//   const [loading, setLoading] = useState(false);

//   const [filters, setFilters] = useState({
//     status: 'pending', // pending | approved | disabled | all
//     search: '',
//     branchId: ''
//   });
// const [toast, setToast] = useState({
//   show: false,
//   message: '',
//   type: 'success',
//   onConfirm: null
// });


// const closeToast = () => {
//   setToast(t => ({ ...t, show: false, onConfirm: null }));
// };

// const showToast = (message, type = 'success') => {
//   setToast({
//     show: true,
//     message,
//     type,
//     onConfirm: null
//   });
// };
// const confirmDelete = (userId, deviceId) => {
//   setToast({
//     show: true,
//     type: 'warning',
//    message: t('devicesAdmin.confirmDelete')
// ,
//     onConfirm: async () => {
//       try {
//         await apiDelete(`/users/${userId}/devices/${deviceId}`);
//        showToast(t('devicesAdmin.toastDeleted'));

//         loadDevices();
//       } catch {
//       showToast(t('devicesAdmin.toastDeleteError'), 'error');

//       }
//     }
//   });
// };

//   const loadDevices = async () => {
//     try {
//       setLoading(true);

//       const res = await apiGet('/admin/devices', {
//         params: {
//           page,
//           limit: PAGE_SIZE,
//           status: filters.status,
//           search: filters.search,
//           branchId: filters.branchId
//         }
//       });

//       setDevices(res.data.data || []);
//       setPages(res.data.pagination?.pages || 1);
//     } catch (err) {
//       console.error('Failed to load devices', err);
//       setDevices([]);
//       setPages(1);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadDevices();
//   }, [page, filters]);

//   return (
//     <div>
// <h3 className="mb-3">🖥️ {t('devicesAdmin.controlTitle')}</h3>

//       {/* Filters */}
//       <Filters
//         filters={filters}
//         setFilters={(newFilters) => {
//           setPage(1); // مهم
//           setFilters(newFilters);
//         }}
//       />

//       {/* Table */}
//       <DeviceTable
//         devices={devices}
//         loading={loading}
//         onUpdated={loadDevices}
//          onToast={showToast}
//           onDelete={confirmDelete}
//       />
// <Toast
//   show={toast.show}
//   message={toast.message}
//   type={toast.type}
//   onConfirm={toast.onConfirm}
//   onClose={closeToast}
// />

//       {/* Pagination */}
//       {pages > 1 && (
//         <div className="d-flex justify-content-center gap-3 mt-3">
//           <button
//             className="btn btn-outline-secondary"
//             disabled={page === 1 || loading}
//             onClick={() => setPage(p => p - 1)}
//           >
//             ◀
//           </button>

//           <span className="fw-semibold align-self-center">
//             صفحة {page} من {pages}
//           </span>

//           <button
//             className="btn btn-outline-secondary"
//             disabled={page === pages || loading}
//             onClick={() => setPage(p => p + 1)}
//           >
//             ▶
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AdminDeviceControl;


import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getPendingDevices, removeUserDevice } from '../services/device.api';
import DeviceTable from '../components/adminDevice/DeviceTable';
import Filters from '../components/adminDevice/DeviceFilters';
import Toast from '../components/ui/Toast';
import '../style/AdminDeviceControl.css';

const PAGE_SIZE    = 10;
const INIT_STATS   = { total: 0, pending: 0, approved: 0, disabled: 0 };

function AdminDeviceControl() {
  const { t } = useTranslation();

  const [devices, setDevices] = useState([]);
  const [page, setPage]       = useState(1);
  const [pages, setPages]     = useState(1);
  const [stats, setStats]     = useState(INIT_STATS);
  const [meta, setMeta] =
  useState({
    timezone: 'UTC'
  });

  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    status: 'pending',
    search: '',
    branchId: ''
  });
const [debouncedSearch, setDebouncedSearch] =
  useState(filters.search);
  

    useEffect(() => {

  const timer = setTimeout(() => {

    setDebouncedSearch(
      filters.search
    );

  }, 300);

  return () => clearTimeout(timer);

}, [filters.search]);

  const [toast, setToast] = useState({
    show: false, message: '', type: 'success', onConfirm: null
  });

  const closeToast = () =>
    setToast(prev => ({ ...prev, show: false, onConfirm: null }));

  const showToast = (message, type = 'success') =>
    setToast({ show: true, message, type, onConfirm: null });

  const confirmDelete = (userId, deviceId) => {
    setToast({
      show: true, type: 'warning',
      message: t('devicesAdmin.confirmDelete'),
      onConfirm: async () => {
        try {
          await removeUserDevice(userId, deviceId);
          showToast(t('devicesAdmin.toastDeleted'));
          loadDevices();
        } catch {
          showToast(t('devicesAdmin.toastDeleteError'), 'error');
        }
      }
    });
  };

  const loadDevices = async () => {
    try {
      setLoading(true);

      const res = await getPendingDevices({
        page,
        limit:    PAGE_SIZE,
        status:   filters.status,    // ✅ بيتبعت للـ backend
        search:  debouncedSearch,    // ✅ بيتبعت للـ backend
        branchId: filters.branchId
      });

      setDevices(res.data?.data               || []);
      setPages(res.data?.pagination?.pages    || 1);   // ✅ pages مبنية على الفلتر
      setStats(res.data?.stats                || INIT_STATS);
setMeta(
  res.data?.meta || {
    timezone: 'UTC'
  }
);
    } catch (err) {
      console.error('Failed to load devices', err);
      setDevices([]);
      setPages(1);
      setStats(INIT_STATS);
    } finally {
      setLoading(false);
    }
  };



useEffect(() => {
  loadDevices();
}, [
  debouncedSearch,
  filters.status,
  filters.branchId,
  page
]);
  // useEffect(() => {
  //   loadDevices();
  // }, [page, filters]);

  return (
    <div className="admin-device-control">
      {/* Hero Header */}
      <div className="admin-header">
        <div className="header-content">
          <div className="header-icon-wrapper">
            <i className="fas fa-shield-alt header-icon"></i>
            <div className="icon-glow"></div>
          </div>
          <div className="header-text">
            <h1 className="header-title">{t('devicesAdmin.controlTitle')}</h1>
            <p className="header-subtitle text-light">
              <i className="fas fa-database me-2"></i>
            {t('devicesAdmin.controlSubtitle')}
            </p>
          </div>
        </div>

        {/* Stats – من الـ DB دايماً totals حقيقية */}
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-icon stat-icon-primary">
              <i className="fas fa-laptop"></i>
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-warning">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-success">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.approved}</div>
              <div className="stat-label">Approved</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-danger">
              <i className="fas fa-ban"></i>
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.disabled}</div>
              <div className="stat-label">Disabled</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="content-card">
        <div className="filters-section">
          <div className="section-header">
            <i className="fas fa-filter me-2"></i>
            <span>Filters</span>
          </div>
          <Filters
            filters={filters}
            setFilters={(newFilters) => {
              setPage(1);          // ✅ reset page عند أي تغيير في الفلتر
              setFilters(newFilters);
            }}
              timezone={meta?.timezone}

          />
        </div>

        <div className="table-section">
          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner">
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <i className="fas fa-laptop spinner-icon"></i>
              </div>
              <p className="loading-text">Loading devices...</p>
            </div>
          )}
          <DeviceTable
            devices={devices}
            loading={loading}
            onUpdated={loadDevices}
            onToast={showToast}
            onDelete={confirmDelete}
            timezone={meta?.timezone}

          />
        </div>

        {/* Pagination – مبنية على totalCount من الـ backend */}
        {pages > 1 && (
          <div className="pagination-wrapper">
            <div className="pagination-container">
              <button
                className="pagination-btn pagination-btn-prev"
                disabled={page === 1 || loading}
                onClick={() => setPage(p => p - 1)}
              >
                <i className="fas fa-chevron-left"></i>
                <span className="btn-text">Previous</span>
              </button>

              <div className="pagination-info">
                <div className="page-indicator">
                  <span className="current-page">{page}</span>
                  <span className="page-separator">/</span>
                  <span className="total-pages">{pages}</span>
                </div>
                <div className="page-label">Page {page} of {pages}</div>
              </div>

              <button
                className="pagination-btn pagination-btn-next"
                disabled={page === pages || loading}
                onClick={() => setPage(p => p + 1)}
              >
                <span className="btn-text">Next</span>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>

            <div className="page-jump">
              <span className="page-jump-label">Quick jump:</span>
              <div className="page-numbers">
                {[...Array(Math.min(pages, 5))].map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      className={`page-number ${page === pageNum ? 'active' : ''}`}
                      onClick={() => setPage(pageNum)}
                      disabled={loading}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {pages > 5 && (
                  <>
                    <span className="page-dots">...</span>
                    <button
                      className={`page-number ${page === pages ? 'active' : ''}`}
                      onClick={() => setPage(pages)}
                      disabled={loading}
                    >
                      {pages}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onConfirm={toast.onConfirm}
        onClose={closeToast}
      />
    </div>
  );
}

export default AdminDeviceControl;





// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// // import { apiGet, apiDelete } from '../helpers/api';

// import { getPendingDevices, removeUserDevice } from '../services/device.api';
// import DeviceTable from '../components/adminDevice/DeviceTable';
// import Filters from '../components/adminDevice/DeviceFilters';
// import Toast from '../components/ui/Toast';
// import '../style/AdminDeviceControl.css';

// const PAGE_SIZE = 10;

// function AdminDeviceControl() {
//   const { t } = useTranslation();
//   const [devices, setDevices] = useState([]);
//   const [page, setPage] = useState(1);
//   const [pages, setPages] = useState(1);
//   const [loading, setLoading] = useState(false);

//   const [filters, setFilters] = useState({
//     status: 'pending',
//     search: '',
//     branchId: ''
//   });

//   const [toast, setToast] = useState({
//     show: false,
//     message: '',
//     type: 'success',
//     onConfirm: null
//   });

//   const closeToast = () => {
//     setToast(t => ({ ...t, show: false, onConfirm: null }));
//   };

//   const showToast = (message, type = 'success') => {
//     setToast({
//       show: true,
//       message,
//       type,
//       onConfirm: null
//     });
//   };

//   const confirmDelete = (userId, deviceId) => {
//     setToast({
//       show: true,
//       type: 'warning',
//       message: t('devicesAdmin.confirmDelete'),
//       onConfirm: async () => {
//         try {
//           // await apiDelete(`/users/${userId}/devices/${deviceId}`);
//           await removeUserDevice(userId, deviceId);
//           showToast(t('devicesAdmin.toastDeleted'));
//           loadDevices();
//         } catch {
//           showToast(t('devicesAdmin.toastDeleteError'), 'error');
//         }
//       }
//     });
//   };

//   const loadDevices = async () => {
//     try {
//       setLoading(true);
      
// const res = await getPendingDevices({
//   page,
//   limit: PAGE_SIZE,
//   status: filters.status,
//   search: filters.search,
//   branchId: filters.branchId
// });
//       // const res = await apiGet('/admin/devices', {
//       //   params: {
//       //     page,
//       //     limit: PAGE_SIZE,
//       //     status: filters.status,
//       //     search: filters.search,
//       //     branchId: filters.branchId
//       //   }
//       // });

//       setDevices(res.data.data || []);
//       setPages(res.data.pagination?.pages || 1);
//     } catch (err) {
//       console.error('Failed to load devices', err);
//       setDevices([]);
//       setPages(1);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadDevices();
//   }, [page, filters]);

//   return (
//     <div className="admin-device-control">
//       {/* Hero Header */}
//       <div className="admin-header">
//         <div className="header-content">
//           <div className="header-icon-wrapper">
//             <i className="fas fa-shield-alt header-icon"></i>
//             <div className="icon-glow"></div>
//           </div>
//           <div className="header-text">
//             <h1 className="header-title">
//               {t('devicesAdmin.controlTitle')}
//             </h1>
//             <p className="header-subtitle">
//               <i className="fas fa-database me-2"></i>
//               Manage and monitor all registered devices
//             </p>
//           </div>
//         </div>
//         <div className="header-stats">
//           <div className="stat-card">
//             <div className="stat-icon stat-icon-primary">
//               <i className="fas fa-laptop"></i>
//             </div>
//             <div className="stat-info">
//               <div className="stat-value">{devices.length}</div>
//               <div className="stat-label">Devices</div>
//             </div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-icon stat-icon-success">
//               <i className="fas fa-check-circle"></i>
//             </div>
//             <div className="stat-info">
//               <div className="stat-value">{devices.filter(d => d.approved).length}</div>
//               <div className="stat-label">Approved</div>
//             </div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-icon stat-icon-warning">
//               <i className="fas fa-clock"></i>
//             </div>
//             <div className="stat-info">
//               <div className="stat-value">{devices.filter(d => !d.approved).length}</div>
//               <div className="stat-label">Pending</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content Card */}
//       <div className="content-card">
//         {/* Filters Section */}
//         <div className="filters-section">
//           <div className="section-header">
//             <i className="fas fa-filter me-2"></i>
//             <span>Filters</span>
//           </div>
//           <Filters
//             filters={filters}
//             setFilters={(newFilters) => {
//               setPage(1);
//               setFilters(newFilters);
//             }}
//           />
//         </div>

//         {/* Table Section */}
//         <div className="table-section">
//           {loading && (
//             <div className="loading-overlay">
//               <div className="loading-spinner">
//                 <div className="spinner-ring"></div>
//                 <div className="spinner-ring"></div>
//                 <div className="spinner-ring"></div>
//                 <i className="fas fa-laptop spinner-icon"></i>
//               </div>
//               <p className="loading-text">Loading devices...</p>
//             </div>
//           )}
          
//           <DeviceTable
//             devices={devices}
//             loading={loading}
//             onUpdated={loadDevices}
//             onToast={showToast}
//             onDelete={confirmDelete}
//           />
//         </div>

//         {/* Pagination */}
//         {pages > 1 && (
//           <div className="pagination-wrapper">
//             <div className="pagination-container">
//               <button
//                 className="pagination-btn pagination-btn-prev"
//                 disabled={page === 1 || loading}
//                 onClick={() => setPage(p => p - 1)}
//               >
//                 <i className="fas fa-chevron-left"></i>
//                 <span className="btn-text">Previous</span>
//               </button>

//               <div className="pagination-info">
//                 <div className="page-indicator">
//                   <span className="current-page">{page}</span>
//                   <span className="page-separator">/</span>
//                   <span className="total-pages">{pages}</span>
//                 </div>
//                 <div className="page-label">
//                   Page {page} of {pages}
//                 </div>
//               </div>

//               <button
//                 className="pagination-btn pagination-btn-next"
//                 disabled={page === pages || loading}
//                 onClick={() => setPage(p => p + 1)}
//               >
//                 <span className="btn-text">Next</span>
//                 <i className="fas fa-chevron-right"></i>
//               </button>
//             </div>

//             {/* Page Jump */}
//             <div className="page-jump">
//               <span className="page-jump-label">Quick jump:</span>
//               <div className="page-numbers">
//                 {[...Array(Math.min(pages, 5))].map((_, idx) => {
//                   const pageNum = idx + 1;
//                   return (
//                     <button
//                       key={pageNum}
//                       className={`page-number ${page === pageNum ? 'active' : ''}`}
//                       onClick={() => setPage(pageNum)}
//                       disabled={loading}
//                     >
//                       {pageNum}
//                     </button>
//                   );
//                 })}
//                 {pages > 5 && (
//                   <>
//                     <span className="page-dots">...</span>
//                     <button
//                       className={`page-number ${page === pages ? 'active' : ''}`}
//                       onClick={() => setPage(pages)}
//                       disabled={loading}
//                     >
//                       {pages}
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <Toast
//         show={toast.show}
//         message={toast.message}
//         type={toast.type}
//         onConfirm={toast.onConfirm}
//         onClose={closeToast}
//       />
//     </div>
//   );
// }

// export default AdminDeviceControl;