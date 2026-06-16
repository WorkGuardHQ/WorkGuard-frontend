// // PermissionsTable.jsx
// function PermissionsTable({
//   data,
//   loading,
//   pagination,
//   onPageChange,
//   onRevoke
// }) {
//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className="card">
//       <table className="table table-hover">
//         <thead>
//           <tr>
//             <th>User</th>
//             <th>Email</th>
//             <th>Branch</th>
//             <th>Date</th>
//             <th>Status</th>
//             <th>Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {data.map(row => (
//             <tr key={row.permission._id}>
//               <td>{row.userName}</td>
//               <td>{row.userEmail}</td>
//               <td>{row.permission.branchName || 'All Branches'}</td>
//               <td>{new Date(row.permission.date).toLocaleDateString()}</td>
//               <td>
//                 {row.permission.revoked
//                   ? 'Revoked'
//                   : 'Active'}
//               </td>
//               <td>
//                 {!row.permission.revoked && (
//                   <button
//                     className="btn btn-sm btn-danger"
//                     onClick={() =>
//                       onRevoke({
//                         userId: row.userId,
//                         permissionId: row.permission._id,
//                         reason: 'Revoked by admin'
//                       })
//                     }
//                   >
//                     Revoke
//                   </button>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Pagination */}
//       <div className="p-3 d-flex justify-content-end gap-2">
//         {Array.from({ length: pagination.pages || 0 }).map((_, i) => (
//           <button
//             key={i}
//             className={`btn btn-sm ${
//               pagination.page === i + 1 ? 'btn-primary' : 'btn-outline-primary'
//             }`}
//             onClick={() => onPageChange(i + 1)}
//           >
//             {i + 1}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default PermissionsTable;

// src/components/RemotePermission/RemotePermissionsList/PermissionsTable.jsx

import { useTranslation } from 'react-i18next';
import {
 formatDisplayDate,
 formatDisplayTime
} from '../../../helpers/timezone';

function PermissionsTable({
  data = [],
  loading,
  pagination = {},
  onPageChange,
  onRevoke
}) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t('common.loading')}</span>
        </div>
        <p className="text-muted mt-2">{t('common.loading')}</p>
      </div>
    );
  }

  // const today = new Date();
  // today.setHours(0, 0, 0, 0);

  if (!data.length) {
    return (
      <div className="alert alert-info mb-0">
        <i className="fas fa-info-circle me-2"></i>
        {t('REMOTE_PERMISSION.NO_PERMISSIONS')}
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>{t('REMOTE_PERMISSION.USER')}</th>
              {/* <th>{t('REMOTE_PERMISSION.EMAIL')}</th> */}
              <th>{t('REMOTE_PERMISSION.BRANCH')}</th>
             <th>{t('REMOTE_PERMISSION.DATE')}</th>
{/* <th>{t('REMOTE_PERMISSION.TIMEZONE')}</th> */}
<th>{t('REMOTE_PERMISSION.GRANTED_AT')}</th>
{/* <th>{t('REMOTE_PERMISSION.GRANTED_BY')}</th> */}
<th>{t('REMOTE_PERMISSION.STATUS')}</th>
              <th className="text-end">{t('REMOTE_PERMISSION.ACTION')}</th>
            </tr>
          </thead>

          <tbody>
            {data.map(row => {
              const isRevoked =
 !row.permission.isActive;

const isExpired =
 row.permission.permissionStatus === 'expired';

let status =
 t('REMOTE_PERMISSION.ACTIVE');

let statusClass =
 'badge bg-success';

if(isRevoked){
 status =
  t('REMOTE_PERMISSION.REVOKED');

 statusClass =
  'badge bg-danger';
}
else if(isExpired){
 status =
  t('REMOTE_PERMISSION.EXPIRED');

 statusClass =
  'badge bg-secondary';
}

const canRevoke =
 row.permission.isActive &&
 row.permission.permissionStatus === 'active';

//  console.log(row.permission);

              // const permissionDate = new Date(row.permission.date);
              // permissionDate.setHours(0, 0, 0, 0);

              // let status = t('REMOTE_PERMISSION.ACTIVE');
              // let statusClass = 'badge bg-success';

              // if (row.permission.revoked) {
              //   status = t('REMOTE_PERMISSION.REVOKED');
              //   statusClass = 'badge bg-danger';
              // } else if (permissionDate < today) {
              //   status = t('REMOTE_PERMISSION.EXPIRED');
              //   statusClass = 'badge bg-secondary';
              // }

              // const canRevoke =
              //   !row.permission.revoked &&
              //   permissionDate >= today;

              return (
                <tr key={row.permission._id}>
                  <td className="fw-semibold">{row.userName} 

                  <div className="text-muted small">{row.userEmail}</div>
                  </td>
            <td>
 {row.permission.branchName ? (
   row.permission.branchName
 ) : (
   <span className="badge bg-info">
     Global
   </span>
 )}
</td>

<td>
 <div>
   <i className="fas fa-calendar me-2 text-muted"></i>

   {formatDisplayDate(
     row.permission.date,
     row.permission.timezone
   )}
 </div>

 {/* <small className="text-muted">
   {formatDisplayTime(
     row.permission.date,
     row.permission.timezone
   )}
 </small> */}
{/* </td>

<td> */}
 <small className="text-muted">
   <i className="fas fa-globe me-1"></i>
   {row.permission.timezone}
 </small>
</td>
<td>
 <div>
  {formatDisplayDate(
    row.permission.grantedAt,
    row.permission.timezone
  )}
  
 </div>

<small className="text-muted d-block">
  by {row.permission.grantedByName || '—'}

{row.permission.reason !== 'Remote work permission' && (
  <>
    <br />
    <span className="text-muted">
      reason: {t(row.permission.reason)}
    </span>
  </>
)}
</small>
</td>
{/* <td>
 {formatDisplayDate(
   row.permission.grantedAt,
   row.permission.timezone
 )}
</td>
<td>
 {row.permission.grantedByName || (
   <span className="text-muted">
     —
   </span>
 )}
</td> */}
<td>
 <span className={statusClass}>
   {status}
 </span>
</td>
             <td className="text-end">


  
    {isRevoked ? (
  <div className="text-end">
    <span className="badge bg-danger d-block">
      {t('REMOTE_PERMISSION.REVOKED')}
    </span>

    <small className="text-muted">
      by {row.permission.revokedByName || '—'}
    </small>
  </div>
  ) : isExpired ? (
    <span className="text-muted small">
      {t('REMOTE_PERMISSION.EXPIRED')}
    </span>
  ) : (
    <button
      className="btn btn-sm btn-outline-danger"
      onClick={() =>
        onRevoke({
          userId: row.userId,
          permissionId: row.permission._id,
          reason: 'Revoked by admin'
        })
      }
      title={t('REMOTE_PERMISSION.REVOKE')}
    >
      <i className="fas fa-times me-1"></i>
      {t('REMOTE_PERMISSION.REVOKE')}
    </button>
  )}
</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="card-footer bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-muted small">
              {t('REMOTE_PERMISSION.PAGE')} {pagination.page} {t('common.OF')} {pagination.pages}
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              
              {Array.from({ length: pagination.pages }).map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    className={`btn btn-sm ${
                      pagination.page === page
                        ? 'btn-primary'
                        : 'btn-outline-primary'
                    }`}
                    onClick={() => onPageChange(page)}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PermissionsTable;
