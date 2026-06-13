// import { useTranslation } from 'react-i18next';

// function AbsenceDetailsModal({
//   show = false,
//   onClose,
//   loading = false,
//   data,
//   year,
//   month
// }) {
//   const { t } = useTranslation();
//   if (!show) return null;

//   return (
//     <>
//       <div className="modal-backdrop fade show" />

//       <div className="modal fade show d-block">
//         <div className="modal-dialog modal-lg modal-dialog-centered">
//           <div className="modal-content">

//             {/* Header */}
//             <div className="modal-header">
//               <h5 className="modal-title">
//                 {t('attendance.absenceDetails')}
//                 <span className="text-muted ms-2">
//                   ({month}/{year})
//                 </span>
//               </h5>
//               <button className="btn-close" onClick={onClose} />
//             </div>

//             {/* Body */}
//             <div className="modal-body">
//               {loading ? (
//                 <div className="text-center py-5">
//                   <div className="spinner-border" />
//                 </div>
//               ) : !data?.days?.length ? (
//                 <div className="alert alert-light text-center">
//                   {t('attendance.noAbsence')}
//                 </div>
//               ) : (
//                 <div className="table-responsive">
//                   <table className="table table-sm table-bordered">
//                     <thead className="table-light">
//                       <tr>
//                         <th>{t('date')}</th>
//                         <th>{t('attendance.status')}</th>
//                         <th>{t('attendance.decision')}</th>
//                         <th>{t('attendance.salaryImpact')}</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {data.days.map(day => (
//                         <tr key={day.date}>
//                           <td>{day.date}</td>

//                           <td>
//                             <span className={`badge ${
//                               day.dayStatus === 'absent'
//                                 ? 'bg-danger'
//                                 : 'bg-warning'
//                             }`}>
//                               {t(`attendance.${day.dayStatus}`)}
//                             </span>
//                           </td>

//                     <td>
//   {day.absenceType === 'without_permission'
//     ? t('attendance.absentWithoutPermission')
//     : t('attendance.unpaidLeave')}
// </td>

// <td>
//   <span className="text-danger fw-semibold">
//     {t('attendance.salaryDeducted')}
//   </span>
// </td>

//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>

//             {/* Footer */}
//             <div className="modal-footer">
//               <button className="btn btn-secondary" onClick={onClose}>
//                 {t('close')}
//               </button>
//             </div>

//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default AbsenceDetailsModal;



// user profile/leave & absence

import { useTranslation } from 'react-i18next';
import { formatDisplayDate } from '../../../helpers/timezone';
function AbsenceDetailsSection({
  loading = false,
  data,
  year,
  month
}) {
const { t } = useTranslation('leave');
const { t: tCommon } = useTranslation('translation');

const tz = data?.timezone || 'UTC';
  return (
    <div className="card shadow-sm mb-4">
      
      {/* Header */}
      <div className="card-header fw-semibold">
  {t('attendance.absenceDetails')}
  <span className="text-white ms-2">
    ({month}/{year})
  </span>

  <div className="text-white small">
    🌍 {tz.replace('_', ' ')}
  </div>
</div>

      {/* Body */}
      <div className="card-body">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" />
          </div>
        ) : !data?.days?.length ? (
          <div className="alert alert-light text-center">
            {t('attendance.noAbsence')}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-sm table-bordered">
              <thead className="table-light">
                <tr>
                  <th>{t('date')}</th>
                  <th>{t('attendance.status')}</th>
                  <th>{t('attendance.decision')}</th>
                  <th>{t('attendance.salaryImpact')}</th>
                </tr>
              </thead>

              <tbody>
                {data.days.map(day => (
                  <tr key={day.date}>
                    {/* <td>{day.date}</td> */}
<td>
 {formatDisplayDate(day.date, tz)}
  {/* <div className="text-muted small">
    🌍 {tz.replace('_', ' ')}
  </div> */}
</td>
                    <td>
                      <span
                        className={`badge ${
                          day.dayStatus === 'absent'
                            ? 'bg-danger'
                            : 'bg-warning'
                        }`}
                      >
                        {t(`attendance.${day.dayStatus}`)}
                      </span>
                    </td>

                    <td>
                      {day.absenceType === 'without_permission'
                        ? t('attendance.absentWithoutPermission')
                        : t('attendance.unpaidLeave')}
                    </td>

                    <td>
                      <span className="text-danger fw-semibold">
                        {t('attendance.salaryDeducted')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AbsenceDetailsSection;