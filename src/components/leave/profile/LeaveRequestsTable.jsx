import LeaveStatusBadge from '../components/LeaveStatusBadge';
import { useTranslation } from 'react-i18next';
import { formatDisplayDate } from '../../../helpers/timezone';
function LeaveRequestsTable({
  leaves = [],
  loading = false,
  page = 1,
  pages = 1,
  onPageChange,
  onViewDetails,
  isAdmin = false 
}) {
const { t } = useTranslation('leave');
const { t: tCommon } = useTranslation('translation');


  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (!leaves.length) {
    return (
      <div className="alert alert-light text-center">
        {t('leave.noRequests')}
      </div>
    );
  }
// console.log('LEAVES DATA:', leaves);

  return (
    <>
      <div className="table-responsive">
        <table className="table table-sm table-bordered align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>{t('leave.type')}</th>
              <th>{t('leave.period')}</th>
              <th className="text-center">{t('leave.days')}</th>
              <th className="text-center">{t('leave.statusLabel')}</th>

              <th className="text-center">{t('actions')}</th>
            </tr>
          </thead>

          <tbody>
            {leaves.map(leave => {

              const tz = leave.timezone || 'UTC';

              return (
              <tr key={leave._id}>
                <td>{t(`leave.types.${leave.leaveType}`)}</td>

                <td>
                  <div className="small">
                    <div>
                      <strong>{t('from')}:</strong>{' '}
                      {formatDisplayDate(leave.startDate, tz)}
                    </div>
                    <div>
                      <strong>{t('to')}:</strong>{' '}
                      {formatDisplayDate(leave.endDate, tz)}
                    </div>
                      {/* ✨ timezone label */}
    <div className="text-muted small mt-1">
      🌍 {tz.replace('_', ' ')}
    </div>
                  </div>
                </td>

                <td className="text-center fw-semibold">
                  {leave.totalDays}
                </td>

                <td className="text-center">
                 <LeaveStatusBadge leave={leave} isAdmin={isAdmin} />

                </td>

                <td className="text-center">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onViewDetails(leave._id)}
                  >
                    {t('details')}
                  </button>
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            ◀
          </button>

          <span className="small text-muted">
            {page} / {pages}
          </span>

          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={page === pages}
            onClick={() => onPageChange(page + 1)}
          >
            ▶
          </button>
        </div>
      )}
    </>
  );
}

export default LeaveRequestsTable;
