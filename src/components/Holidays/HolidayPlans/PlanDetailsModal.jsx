import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getPlanHolidays } from '../../../services/holiday.api';

import AddHolidayToPlanModal from './AddHolidayToPlanModal';
import EditHolidayDatesModal from './EditHolidayDatesModal';

import { updateHoliday } from '../../../services/holiday.api';
import { formatDisplayDate } from '../../../helpers/timezone';

const PlanDetailsModal = ({ show, plan, onClose, onRefresh, onToast }) => {
  const { t } = useTranslation();

  const [showAddHolidayModal, setShowAddHolidayModal] = useState(false);
const [editingHoliday, setEditingHoliday] = useState(null);

  const [holidays, setHolidays] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20
  });

  /* =========================
     Load Plan Holidays
  ========================= */
  const loadHolidays = React.useCallback(async () => {
    if (!plan?._id) return;

    try {
      setLoading(true);
      const data = await getPlanHolidays(plan._id, filters);

      setHolidays(data.holidays || []);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error('Load plan holidays error:', err);
      onToast?.(
        err.response?.data?.message || t('holidays.loadHolidaysError'),
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [plan?._id, filters, t, onToast]);

  
  useEffect(() => {
    if (show) {
      loadHolidays();
    }
  }, [show, loadHolidays]);

  /* =========================
     Helpers
  ========================= */
 const formatDate = (
 date,
 timezone
)=>
 formatDisplayDate(
   date,
   timezone 
 );


  const renderScopeBadge = (holiday) => {
    if (holiday.scope === 'global') {
      return (
        <span className="hm-badge hm-badge-global">
          <i className="fas fa-globe"></i>
          {t('holidays.global')}
        </span>
      );
    }

    if (holiday.scope === 'branch') {
      return (
        <span className="hm-badge hm-badge-branch">
          <i className="fas fa-building"></i>
          {holiday.branch?.name || t('holidays.branch')}
        </span>
      );
    }

    if (holiday.scope === 'user') {
      return (
        <span className="hm-badge hm-badge-user">
          <i className="fas fa-user"></i>
          {holiday.user?.name || t('holidays.user')}
        </span>
      );
    }

    return null;
  };

  const renderStatusBadge = (holiday) => {
    const statusMap = {
      draft: 'hm-badge-draft',
      active: 'hm-badge-active',
      cancelled: 'hm-badge-cancelled',
      archived: 'hm-badge-archived'
    };

    return (
      <span className={`hm-badge ${statusMap[holiday.status]}`}>
        {t(`holidays.${holiday.status}`)}
      </span>
    );
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  if (!show) return null;


  
  return (
    <div className="hm-modal-overlay" onClick={onClose}>
      <div
        className="hm-modal hm-modal-wide"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {/* <div className="hm-modal-header">
          <div>
            <h2>{plan.name}</h2>
            <span className="hm-modal-subtitle">
              <i className="fas fa-calendar"></i>
              {plan.year} • {holidays.length} {t('holidays.holidays')}
            </span>
          </div>

          
          <button onClick={onClose} className="hm-modal-close">
            <i className="fas fa-times" />
          </button>
        </div> */}
<div className="hm-modal-header">
  <div>
    <h2>{plan.name}</h2>
    <span className="hm-modal-subtitle">
      <i className="fas fa-calendar"></i>
      {plan.year} • {holidays.length} {t('holidays.holidays')}
    </span>
    {plan.timezones?.length>0 && (
 <div className="small">
   <i className="fas fa-globe"/>
   {plan.timezones.length===1
    ? plan.timezones[0]
    : `${plan.timezones.length} Time Zones`}
 </div>
)}
  </div>

  <div className="hm-header-actions">
   

    <button onClick={onClose} className="hm-modal-close">
      <i className="fas fa-times" />
    </button>
  </div>
</div>

        {/* Body */}
        <div className="hm-modal-body">
          {/* Plan Info */}
          <div className="hm-plan-info">
            <div className="hm-info-item">
              <span className="hm-info-label">{t('holidays.status')}</span>
              <span className={`hm-badge hm-badge-${plan.status}`}>
                {t(`holidays.${plan.status}`)}
              </span>
            </div>

            <div className="hm-info-item">
              <span className="hm-info-label">{t('holidays.createdBy')}</span>
              <span>{plan.createdBy?.name || t('holidays.unknown')}</span>
            </div>

            <div className="hm-info-item">
              <span className="hm-info-label">{t('holidays.createdAt')}</span>
              <div>
 <span>
  {formatDate(
   plan.createdAt,
   plan.tenantTimezone
  )}
 </span>

 <small className="hm-muted">
  {plan.tenantTimezone}
 </small>
</div>
            </div>
          </div>


          {/* Holidays Table */}
          
          {loading ? (
            <div className="hm-loading-box">
              <div className="hm-spinner"></div>
              <p>{t('holidays.loadingHolidays')}</p>
            </div>
          ) : holidays.length === 0 ? (
            <div className="hm-empty-box">
              <i className="fas fa-calendar-times"></i>
              <p>{t('holidays.noHolidaysInPlan')}</p>
            </div>
          ) : (
            <>
              <div className="hm-table-wrapper">
                <table className="hm-table">
                  <thead>
                    <tr>
                      <th>{t('holidays.name')}</th>
                      <th>{t('holidays.dates')}</th>
                      <th>{t('holidays.scope')}</th>
                      <th>{t('holidays.status')}</th>
                      <th>{t('holidays.days')}</th>
                      <th>{t('holidays.timezone')}</th>
                      <th>{t('common.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holidays.map((holiday) => (
                      <tr key={holiday._id}>
                        <td>
                          <strong>{holiday.name}</strong>
                        </td>
                        <td>
                          {formatDate(
 holiday.startDate,
 holiday.timezone
) ===
formatDate(
 holiday.endDate,
 holiday.timezone
) ? (
                            formatDate(
 holiday.startDate,
 holiday.timezone
)
                          ) : (
                            <>
                              {formatDate(
 holiday.startDate,
 holiday.timezone
)}
                              <i className="fas fa-arrow-right hm-arrow"></i>
                              {formatDate(
 holiday.endDate,
 holiday.timezone
)}
                            </>
                          )}
                        </td>
                        <td>{renderScopeBadge(holiday)}</td>
                        <td>{renderStatusBadge(holiday)}</td>
                        <td>
                          <strong>{holiday.totalDays}</strong>
                        </td>
                        <td>
 <span className="hm-badge-timezone">
   <i className="fas fa-clock"/>
   {holiday.timezone}
 </span>
</td>
                        <td>
  <button
    className="hm-icon-btn hm-icon-btn-secondary"
    title={t('holidays.editDates')}
    disabled={holiday.status !== 'draft'}

    onClick={() => setEditingHoliday(holiday)}
  >
    <i className="fas fa-edit" />
  </button>
</td>

                      </tr>
                      
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination?.pages > 1 && (
                <div className="hm-pagination">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="hm-pagination-btn"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>

                  <span className="hm-pagination-info">
                    {t('holidays.page')} {pagination.page}{' '}
                    {t('holidays.of')} {pagination.pages}
                  </span>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="hm-pagination-btn"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        
        <div className="hm-modal-footer">
            
          <button
            onClick={onClose}
            className="hm-btn hm-btn-secondary"
          >
            {t('holidays.close')}
          </button>
        {plan.status === 'draft' && (
  <button
    className="hm-btn hm-btn-primary hm-btn-sm"
    onClick={() => setShowAddHolidayModal(true)}
  >
    <i className="fas fa-plus" />
    {t('holidays.addHoliday')}
  </button>
)}

        </div>
        
        <>
          {showAddHolidayModal && (
            <AddHolidayToPlanModal
              show={showAddHolidayModal}
              planId={plan._id}
              onClose={() => setShowAddHolidayModal(false)}
              onSave={async () => {
                await loadHolidays();
                onRefresh?.();
                setShowAddHolidayModal(false);
              }}
              onToast={onToast}
            />
          )}
        </>
        {editingHoliday && (
  <EditHolidayDatesModal
    show={!!editingHoliday}
    holiday={editingHoliday}
    onClose={() => setEditingHoliday(null)}
    onToast={onToast}
    onSave={async (payload) => {
         await updateHoliday(editingHoliday._id, payload);

      await loadHolidays();
      onRefresh?.();
      setEditingHoliday(null);
    }}
  />
)}

      </div>
    </div>
    
  );
};


export default PlanDetailsModal;