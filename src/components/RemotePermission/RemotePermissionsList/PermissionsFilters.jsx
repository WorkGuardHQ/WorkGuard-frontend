

// function PermissionsFilters({ filters, setFilters, branches }) {
//   const updateFilter = (key, value) => {
//     setFilters(prev => ({
//       ...prev,
//       [key]: value === 'all' ? '' : value,
//       page: 1
//     }));
//   };

//   const branchSelected = Boolean(filters.branchId);

//   return (
//     <div className="card mb-3">
//       <div className="card-body row g-3 align-items-end">

//         {/* 🏢 Branch (FIRST) */}
//         <div className="col-md-3">
//           <label className="form-label small">Branch</label>
//           <select
//             className="form-select"
//             value={filters.branchId}
//             onChange={(e) => {
//               updateFilter('branchId', e.target.value);
//               // 🔁 reset search when branch changes
//               updateFilter('search', '');
//             }}
//           >
//             <option value="">Select branch</option>
//             <option value="all">All branches</option>
//             {branches?.map(branch => (
//               <option key={branch._id} value={branch._id}>
//                 {branch.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* 🔍 Search (depends on branch) */}
//         <div className="col-md-3">
//           <label className="form-label small">
//             Search (User / Email)
//           </label>
//           <input
//             type="text"
//             className="form-control"
//             placeholder={
//               branchSelected
//                 ? 'User name or email'
//                 : 'Select branch first'
//             }
//             value={filters.search}
//             disabled={!branchSelected}
//             onChange={(e) =>
//               updateFilter('search', e.target.value)
//             }
//           />
//           {!branchSelected && (
//             <small className="text-muted">
//               Select a branch to enable search
//             </small>
//           )}
//         </div>

//         {/* 📌 Status */}
//         <div className="col-md-2">
//           <label className="form-label small">Status</label>
//           <select
//             className="form-select"
//             value={filters.status}
//             onChange={(e) =>
//               updateFilter('status', e.target.value)
//             }
//           >
//             <option value="active">Active</option>
//             <option value="expired">Expired</option>
//             <option value="revoked">Revoked</option>
//             <option value="all">All</option>
//           </select>
//         </div>

//         {/* 📅 From */}
//         <div className="col-md-2">
//           <label className="form-label small">From</label>
//           <input
//             type="date"
//             className="form-control"
//             value={filters.dateFrom}
//             onChange={(e) => {
//               updateFilter('dateFrom', e.target.value);
//               updateFilter('dateTo', '');
//             }}
//           />
//         </div>

//         {/* 📅 To */}
//         <div className="col-md-2">
//           <label className="form-label small">To</label>
//           <input
//             type="date"
//             className="form-control"
//             value={filters.dateTo}
//             min={filters.dateFrom}
//             onChange={(e) =>
//               updateFilter('dateTo', e.target.value)
//             }
//           />
//         </div>

//       </div>
//     </div>
//   );
// }

// export default PermissionsFilters;

import { useTranslation } from 'react-i18next';

function PermissionsFilters({ filters, setFilters, branches = [] }) {
  const { t } = useTranslation();

 const updateFilter = (key, value) => {
  setFilters(prev => ({
    ...prev,
    [key]: value,
    page: 1
  }));
};

  const branchSelected = Boolean(filters.branchId);

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-light">
        <h6 className="mb-0">
          <i className="fas fa-filter me-2 text-primary"></i>
          {t('REMOTE_PERMISSION.FILTERS')}
        </h6>
      </div>
      <div className="card-body">
        <div className="row g-3 ">

          {/* 🏢 Branch (FIRST) */}
          <div className="col-md-3">
            <label className="form-label fw-semibold small">
              <i className="fas fa-building me-1 text-primary"></i>
              {t('REMOTE_PERMISSION.BRANCH')}
            </label>
            <select
              className="form-select form-select-sm"
              value={filters.branchId}
              onChange={(e) => {
                updateFilter('branchId', e.target.value);
                // updateFilter('search', '');
              }}
            >
              {/* <option value="">{t('REMOTE_PERMISSION.selectBranchPlaceholder')}</option> */}
              <option value="all">{t('REMOTE_PERMISSION.allBranches')}</option>
              {branches.map(branch => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          {/* 🔍 Search (depends on branch) */}
          <div className="col-md-3">
            <label className="form-label fw-semibold small">
              <i className="fas fa-search me-1 text-primary"></i>
              {t('REMOTE_PERMISSION.SEARCH_USER_EMAIL')}
            </label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder={
                branchSelected
                  ? t('REMOTE_PERMISSION.SEARCH_USER_EMAIL')
                  : t('REMOTE_PERMISSION.SELECT_BRANCH_FIRST')
              }
              value={filters.search}
              disabled={!branchSelected}
              onChange={(e) => updateFilter('search', e.target.value)}
            />
            {!branchSelected && (
              <small className="text-muted">
                <i className="fas fa-info-circle me-1"></i>
                {t('REMOTE_PERMISSION.SELECT_BRANCH_TO_SEARCH')}
              </small>
            )}
          </div>

          {/* 📌 Status */}
          <div className="col-md-2">
            <label className="form-label fw-semibold small">
              <i className="fas fa-tag me-1 text-primary"></i>
              {t('REMOTE_PERMISSION.STATUS')}
            </label>
            <select
              className="form-select form-select-sm"
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value)}
            >
              <option value="active">{t('REMOTE_PERMISSION.ACTIVE')}</option>
              <option value="expired">{t('REMOTE_PERMISSION.EXPIRED')}</option>
              <option value="revoked">{t('REMOTE_PERMISSION.REVOKED')}</option>
            <option value="all">{t('REMOTE_PERMISSION.ALL_STATUSES')}</option>
            </select>
          </div>

          {/* 📅 From */}
          <div className="col-md-2">
            <label className="form-label fw-semibold small">
              <i className="fas fa-calendar-day me-1 text-primary"></i>
              {t('common.FROM')}
            </label>
            <input
              type="date"
              className="form-control"
              value={filters.dateFrom}
              onChange={(e) => {
                updateFilter('dateFrom', e.target.value);
                if (e.target.value > filters.dateTo) {
                  updateFilter('dateTo', '');
                }
              }}
            />
          </div>

          {/* 📅 To */}
          <div className="col-md-2">
            <label className="form-label fw-semibold small">
              <i className="fas fa-calendar-check me-1 text-primary"></i>
              {t('common.TO')}
            </label>
            <input
              type="date"
              className="form-control"
              value={filters.dateTo}
              min={filters.dateFrom}
              onChange={(e) => updateFilter('dateTo', e.target.value)}
            />
          </div>
<div className="col-md-12 text-end">
  <button
    className="btn btn-outline-secondary btn-sm"
    onClick={() =>
      setFilters({
        page: 1,
        limit: 20,
        branchId: 'all',
        userId: '',
        status: 'active',
        search: '',
        dateFrom: '',
        dateTo: ''
      })
    }
  >
    <i className="fas fa-rotate-left me-1"></i>
    {t('common.reset')}
  </button>
</div>
        </div>
      </div>
    </div>
  );
}

export default PermissionsFilters;