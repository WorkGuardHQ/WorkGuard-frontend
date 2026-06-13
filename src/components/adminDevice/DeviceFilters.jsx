// function Filters({ filters, setFilters }) {
//   return (
//     <div className="card mb-3 p-3">
//       <div className="row g-2">

//         <div className="col-md-4">
//           <input
//             className="form-control"
//             placeholder="Search name or email"
//             value={filters.search}
//            onChange={e =>
//   setFilters({ ...filters, search: e.target.value })
// }

//           />
//         </div>

//         <div className="col-md-3">
//           <select
//             className="form-select"
//             value={filters.status}
//            onChange={e =>
//   setFilters({ ...filters, status: e.target.value })
// }

//           >
//             <option value="pending">Pending</option>
//             <option value="approved">Approved</option>
//             <option value="disabled">Disabled</option>
//             <option value="all">All</option>
//           </select>
//         </div>

//       </div>
//     </div>
//   );
// }

// export default Filters;












//translations

import { useTranslation } from 'react-i18next';

function Filters({ filters, setFilters,timezone }) {
  const { t } = useTranslation();

  return (
    <div className="card mb-3 p-3">
      <div className="row g-2">

        <div className="col-md-4">
          {/* <label className="form-label visually-hidden">
            {t('filter')}
            </label> */}
          <input
            // className="form-control"
                className="form-select"

            placeholder={t('common.searchPlaceholder')}
            value={filters.search}
            onChange={e =>
              setFilters({ ...filters, search: e.target.value })
            }
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={filters.status}
            
            onChange={e =>
              setFilters({ ...filters, status: e.target.value })
            }
          >
            <option value="pending">
              {t('devicesAdmin.status_pending')}
            </option>
            <option value="approved">
              {t('devicesAdmin.status_approved')}
            </option>
            <option value="disabled">
              {t('devicesAdmin.status_disabled')}
            </option>
            <option value="all">
              {t('devicesAdmin.status_all')}
            </option>
          </select>
        </div>
{/* <div className="mt-2">

  <span className="badge bg-light text-dark border">

    <i className="fas fa-globe me-1" />

    {timezone}

  </span>

</div> */}
      </div>
    </div>
  );
}

export default Filters;
