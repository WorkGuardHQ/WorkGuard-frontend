/** 
 * LastResetInfo.jsx
 * file that shows the last reset information in the yearly reset page
 * now also includes the source of the reset (system job or admin) 

 **/

import {
  formatDisplayDate,
  formatDisplayTime
} from '../../../../helpers/timezone';

export default function LastResetInfo({
  yearResetStatus
}) {

  const lastReset =
    yearResetStatus?.lastReset;

// console.log(yearResetStatus);

  if (!lastReset) return null;

  const tenantTimezone =
    yearResetStatus?.tenantTimezone ||
    'UTC';

  return (
    <div className="alert alert-info mb-3">

      <div className="fw-semibold mb-2">
        Last Yearly Reset
      </div>

      <div className="small">
        📅 {
          formatDisplayDate(
            lastReset.date,
            tenantTimezone
          )
        }
      </div>

      <div className="small">
        🕒 {
          formatDisplayTime(
            lastReset.date,
            tenantTimezone
          )
        }
      </div>

      <div className="small">
        👤 {
          lastReset.source === 'system'
            ? 'System Job'
            : lastReset.adminName || 'Admin'
        }
      </div>

      {lastReset.forced && (
        <div className="small text-danger">
          Forced Reset
        </div>
      )}

      <div className="small text-muted mt-1">
        🌍 {tenantTimezone}
      </div>

    </div>
  );
}