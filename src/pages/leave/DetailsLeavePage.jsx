import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getTokenPayload } from '../../helpers/auth';

import {
  getLeaveById,
  getLeaveBreakdown,
  approveLeave,
  rejectLeave,
  cancelLeave,
  getUserLeaveSummary
} from '../../services/Leave-services/leave.api';

import LeaveStatusBadge from '../../components/leave/components/LeaveStatusBadge';
import LeaveBalanceSummary from '../../components/leave/components/LeaveBalanceSummary';
import { formatDisplayDate, formatDisplayTime } from '../../helpers/timezone';


import Toast from '../../components/ui/Toast';

function DayStatusBadge({ appliedStatus, isWeeklyOff, holiday }) {
  if (holiday)     return <span className="badge bg-info text-dark">🎉 {holiday.name}</span>;
  if (isWeeklyOff) return <span className="badge bg-secondary">📅 Day Off</span>;

  const map = {
    'leave_paid':           { cls: 'bg-success',           label: '✅ Leave (Paid)'   },
    'leave_unpaid':         { cls: 'bg-warning text-dark',  label: '⚠️ Leave (Unpaid)' },
    'pending_candidate':    { cls: 'bg-warning text-dark',  label: '⏳ Pending'        },
    'HOLIDAY':              { cls: 'bg-info text-dark',     label: '🎉 Holiday'        },
    'WEEKLY_OFF':           { cls: 'bg-secondary',          label: '📅 Day Off'        },
    'candidate_unassigned': { cls: 'bg-light text-dark',    label: '—'                },
    'worked':               { cls: 'bg-primary',            label: '💼 Worked'         },
  };

  const s = map[appliedStatus] || { cls: 'bg-light text-dark', label: appliedStatus || '—' };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}

function DetailsLeavePage() {
  const { id }     = useParams();
  const navigate   = useNavigate();
 const { t } = useTranslation('leave');
const { t: tCommon } = useTranslation('translation');

// const isAdmin    = true;


const payload  = getTokenPayload();
const isAdmin  = payload?.role === 'admin';


  const [leave,     setLeave]     = useState(null);
  const [breakdown, setBreakdown] = useState([]);
  const [user,      setUser]      = useState(null);
  const [branch,    setBranch]    = useState(null);
  const [summary,   setSummary]   = useState(null);
  const [loading,   setLoading]   = useState(true);

  const [toast, setToast] = useState({
    show: false, message: '', type: 'success', onConfirm: null
  });

  const showToast = (message, type = 'success') =>
    setToast({ show: true, message, type, onConfirm: null });

  const closeToast = () =>
    setToast(prev => ({ ...prev, show: false, onConfirm: null }));

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const breakdownRes  = await getLeaveBreakdown(id);
      const breakdownData = breakdownRes.data;

      setLeave(breakdownData.leave);
      setUser(breakdownData.user);
      setBranch(breakdownData.branch);
      setBreakdown(breakdownData.breakdown || []);

      // ✅ جيب summary بـ year من الـ leave نفسه
      if (isAdmin && breakdownData?.user?._id && breakdownData?.leave?.leaveYear) {
        const summaryRes = await getUserLeaveSummary({
          userId: breakdownData.user._id,
          year:   breakdownData.leave.leaveYear  // ✅ سنة الإجازة مش السنة الحالية
        });
        setSummary(summaryRes.data);
      }

    } catch (err) {
      showToast(err?.response?.data?.message || t('leave.loadError'), 'error');
    } finally {
      setLoading(false);
    }
  }, [id, isAdmin, t]);

  useEffect(() => { loadData(); }, [loadData]);

 const handleApprove = async () => {
  try {
    const res = await approveLeave(id);
    
    // ✅ لو محتاج confirmation
    if (res.data?.requiresConfirmation) {
      const { lockedDays, message } = res.data;
      
      setToast({
        show: true,
        type: 'warning',
        message: (
          `⚠️ ${message}\n\nLocked days:\n${lockedDays.join(', ')}\n\nThese days will NOT be recalculated.`
        ),
        onConfirm: async () => {
          try {
            await approveLeave(id, { forceApprove: true }); // ✅ بعت force
            showToast(t('leave.toastApproved'));
            await loadData();
          } catch (err) {
            showToast(err?.response?.data?.message, 'error');
          }
        }
      });
      return;
    }

    showToast(t('leave.toastApproved'));
    await loadData();

  } catch (err) {
    showToast(err?.response?.data?.message, 'error');
  }
};

  const handleReject = async () => {
    const reason = prompt(t('leave.rejectReason'));
    if (!reason) return;
    try {
      await rejectLeave(id, reason);
      showToast(t('leave.toastRejected'));
      await loadData();
    } catch (err) {
      showToast(err?.response?.data?.message, 'error');
    }
  };

 const handleCancel = async (force = false) => {
  try {
    const res = await cancelLeave(id, force ? { forceCancel: true } : {});

    // ✅ لو محتاج confirmation
    if (res.data?.requiresConfirmation) {
      const { lockedDays, message } = res.data;
      setToast({
        show: true,
        type: 'warning',
        message: `⚠️ ${message}\n\nLocked days: ${lockedDays.join(', ')}\n\nThese days will NOT be recalculated.`,
        onConfirm: async () => {
          try {
            await cancelLeave(id, { forceCancel: true });
            showToast(t('leave.toastCancelled'));
            await loadData();
          } catch (err) {
            showToast(err?.response?.data?.message, 'error');
          }
        }
      });
      return;
    }

    showToast(t('leave.toastCancelled'));
    await loadData();

  } catch (err) {
    showToast(err?.response?.data?.message, 'error');
  }
};

  if (loading) return <div className="text-center py-5">{t('loading')}...</div>;
  if (!leave)  return null;

    const tz = leave.timezone || 'UTC';

    
  const canAdminCancel    = isAdmin && leave.status === 'approved';
  const canEmployeeCancel = !isAdmin && leave.status === 'pending' &&
    new Date(leave.startDate).getTime() > Date.now();

  const typeColorMap = { annual: 'primary', sick: 'danger', unpaid: 'warning' };
  const typeColor    = typeColorMap[leave.leaveType] || 'secondary';

  return (
    <div className="container py-4">

      {/* ===== Header ===== */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <button className="btn btn-sm btn-outline-dark mb-2" onClick={() => navigate(-1)}>
            ← {t('back')}
          </button>
          <h4 className="fw-bold mb-0">{t('leave.details.title')}</h4>
          <div className="text-muted small">{t('leave.details.subtitle')}</div>
        </div>
        <LeaveStatusBadge leave={{ status: leave.status, metadata: {} }} isAdmin={isAdmin} />
      </div>

      {/* ===== Info Cards Row ===== */}
      <div className="row g-3 mb-4">

        {/* Employee */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted mb-3">👤 {t('leave.employee')}</h6>
              <div className="fw-semibold fs-6">{user?.name}</div>
              <div className="text-muted small">{user?.email}</div>
              <hr />
              <div className="small">
                <strong>{t('leave.branch')}:</strong> {branch?.name || '—'}
              </div>
              {/* ✅ Departments */}
              {user?.departments?.length > 0 && (
                <div className="small mt-1">
                  <strong>{t('departments')}:</strong>{' '}
                  {user.departments.map((d, i) => (
                    <span key={i} className="badge bg-light text-dark me-1">{d}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Leave Info */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted mb-3">📋 {t('leave.details.title')}</h6>
              <div className="mb-2">
                <span className={`badge bg-${typeColor} me-2`}>
                  {t(`leave.types.${leave.leaveType}`)}
                </span>
                <span className="badge bg-light text-dark">
                  {leave.totalDays} {t('leave.days')}
                </span>
              </div>
              <div className="small mt-2">

                <div>
  <strong>{t('leave.from')}:</strong>{' '}
  {formatDisplayDate(leave.startDate, tz)}
</div>

<div>
  <strong>{t('leave.to')}:</strong>{' '}
  {formatDisplayDate(leave.endDate, tz)}
</div>

{/* <div className="text-muted small">
  {formatDisplayTime(leave.startDate, tz)}
</div> */}

                {/* <div><strong>{t('leave.from')}:</strong> {leave.startDate}</div>
                <div><strong>{t('leave.to')}:</strong> {leave.endDate}</div> */}
                <div><strong>{t('leave.year')}:</strong> {leave.leaveYear}
                
                </div>
                <div className="text-muted mt-1 small">
  🌍 {tz.replace('_', ' ')} 
  {leave.metadata?.timezoneSnapshot?.source === 'branch' && ' (Branch)'}
</div>
              </div>
            </div>
          </div>
        

        </div>

        {/* Decision */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted mb-3">⚖️ {t('leave.decision')}</h6>
              <div className="small">
                <div>
                  <strong>{t('leave.paidDays')}:</strong>{' '}
                  <span className="text-success fw-semibold">{leave.metadata?.paidDays ?? 0}</span>
                </div>
                <div>
                  <strong>{t('leave.unpaidDays')}:</strong>{' '}
                  <span className="text-danger fw-semibold">{leave.metadata?.unpaidDays ?? 0}</span>
                </div>
                {leave.decidedBy && (
                  <div className="mt-2">
                    <strong>{t('leave.decidedBy')}:</strong> {leave.decidedBy.name}
                    <div className="text-muted small">
                      {/* {leave.decidedAt ? new Date(leave.decidedAt).toLocaleDateString() : ''} */}

                      {leave.decidedAt && (
  <div className="text-muted small">
  {formatDisplayDate(leave.decidedAt, tz)} -{' '}
  {formatDisplayTime(leave.decidedAt, tz)}
</div>
)}

                    </div>
                  </div>
                )}
                {leave.rejectionReason && (
                  <div className="mt-2 alert alert-danger p-2 small mb-0">
                    <strong>{t('leave.rejectionReason')}:</strong> {leave.rejectionReason}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Reason ===== */}
      {leave.reason && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h6 className="text-muted mb-1">💬 {t('reason')}</h6>
            <p className="mb-0">{leave.reason}</p>
          </div>
        </div>
      )}

      {/* ===== Leave Balance — سنة الإجازة ✅ ===== */}
      {isAdmin && summary && (
        <div className="mb-4">
          <div className="text-muted small mb-1">
            {/* 📊 {t('leave.balance.title', { year: leave.leaveYear })} */}
          </div>
          <LeaveBalanceSummary summary={summary} />
        </div>
      )}

      {/* ===== Breakdown ===== */}
      <div className="card shadow-sm mb-4">
        <div className="card-header fw-semibold d-flex justify-content-between">
          <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="mb-0">📅 {t('leave.breakdown')}</span>
 <div className="text-muted small">
    🌍 {tz.replace('_', ' ')}
  </div></div>
          
          <span className="text-muted small">{breakdown.length} {t('leave.days')}</span>
        

        </div>
        <div className="table-responsive">
          <table className="table table-sm table-bordered mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>{t('date')}</th>
                {/* <th>{t('leave.weekday')}</th> */}
                <th>{t('leave.dayStatus')}</th>
                <th className="text-center">{t('leave.attendance')}</th>
                <th>{t('leave.holiday')}</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map(day => (
                <tr
                  key={day.date}
                  className={
                    day.isLeaveDay            ? 'table-success'   :
                    day.isWeeklyOff           ? 'table-secondary' :
                    day.holiday               ? 'table-info'      : ''
                  }
                >
                  {/* <td className="fw-semibold">{day.date}</td> */}
                  <td className="fw-semibold">
  {formatDisplayDate(day.date, tz)}
  <div className="text-muted small">
    {new Date(day.date).toLocaleDateString('en-US', {
      weekday: 'long',
      timeZone: tz
    })}
  </div>
</td>
                  <td>
                    <DayStatusBadge
                      appliedStatus={day.appliedStatus}
                      isWeeklyOff={day.isWeeklyOff}
                      holiday={day.holiday}
                    />
                  </td>
                  <td className="text-center">
                    {day.hasAttendance
                      ? <span className="badge bg-success">✅ {day.attendanceCount}</span>
                      : <span className="badge bg-light text-muted">—</span>
                    }
                  </td>
                  <td className="small text-muted">
                    {day.holiday?.name || (day.isWeeklyOff ? 'Weekly Off' : '—')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== Actions ===== */}
      {isAdmin && leave.status === 'pending' && (
        <div className="d-flex gap-2 mb-3">
          <button className="btn btn-success" onClick={handleApprove}>
            ✅ {t('leave.approve')}
          </button>
          <button className="btn btn-danger" onClick={handleReject}>
            ❌ {t('leave.reject')}
          </button>
        </div>
      )}

      {(canAdminCancel || canEmployeeCancel) && (
        <button className="btn btn-outline-danger mb-3" 
         onClick={() => handleCancel()}>
          🚫 {t('leave.cancel')}
        </button>
      )}

      <Toast {...toast} onClose={closeToast} />
    </div>
  );
}

export default DetailsLeavePage;