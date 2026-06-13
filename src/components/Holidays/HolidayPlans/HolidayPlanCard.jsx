// // اسم الخطة

// // السنة

// // status badge (draft / active / archived)

// // أزرار (Activate – Cancel – Delete)

// import React from 'react';
// import { useTranslation } from 'react-i18next';

// const HolidayPlanCard = ({ plan, onActivate, onCancel, onDelete, onView }) => {
//   return (
//     <div className="hm-card">
//       <div className="hm-info">
//         <h3>{plan.name}</h3>
//         <div className="hm-meta">
//           <span className="hm-badge">{plan.year}</span>
//           <span className={`hm-badge hm-badge-${plan.status}`}>
//             {plan.status}
//           </span>
//         </div>
//       </div>

//       <div className="hm-actions">
//         {plan.status === 'draft' && (
//           <button onClick={() => onActivate(plan._id)}>
//             <i className="fas fa-play" />
//           </button>
//         )}

//         {plan.status === 'active' && (
//           <button onClick={() => onCancel(plan._id)}>
//             <i className="fas fa-ban" />
//           </button>
//         )}

//         {plan.status === 'draft' && (
//           <button onClick={() => onDelete(plan._id)}>
//             <i className="fas fa-trash" />
//           </button>
//         )}

//         <button onClick={() => onView(plan)}>
//           <i className="fas fa-eye" />
//         </button>
//       </div>
//     </div>
//   );
// };
// export default HolidayPlanCard;

import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatDisplayDate } from '../../../helpers/timezone';
const PlanCard = ({ plan, onView, onEdit, onActivate, onCancel, onDelete }) => {
  const { t } = useTranslation();

  const isDraft = plan.status === 'draft';
  const isActive = plan.status === 'active';
  const isArchived = plan.status === 'archived';

  /* =========================
     Status Badge
  ========================= */
  const renderStatusBadge = () => {
    if (isDraft) {
      return (
        <span className="hm-badge hm-badge-draft">
          <i className="fas fa-edit"></i>
          {t('holidays.draft')}
        </span>
      );
    }

    if (isActive) {
      return (
        <span className="hm-badge hm-badge-active">
          <i className="fas fa-check-circle"></i>
          {t('holidays.active')}
        </span>
      );
    }

    if (isArchived) {
      return (
        <span className="hm-badge hm-badge-archived">
          <i className="fas fa-archive"></i>
          {t('holidays.archived')}
        </span>
      );
    }

    return null;
  };

  /* =========================
     Actions
  ========================= */
  const renderActions = () => {
    return (
      <div className="hm-plan-actions">

        <button
          onClick={() => onView(plan)}
          className="hm-btn hm-btn-sm hm-btn-secondary"
          title={t('holidays.viewDetails')}
        >
          <i className="fas fa-eye"></i>
          {t('holidays.view')}
        </button>

        {isDraft && (
          <>
            <button
              onClick={() => onEdit(plan)}
              className="hm-icon-btn hm-icon-btn-edit"
              title={t('holidays.edit')}
            >
              <i className="fas fa-edit"></i>
            </button>

            <button
              onClick={() => onActivate(plan._id)}
              className="hm-icon-btn hm-icon-btn-activate"
              title={t('holidays.activate')}
            >
              <i className="fas fa-play"></i>
            </button>

            <button
              onClick={() => onDelete(plan._id)}
              className="hm-icon-btn hm-icon-btn-delete"
              title={t('holidays.delete')}
            >
              <i className="fas fa-trash"></i>
            </button>
          </>
        )}

        {isActive && (
          <button
            onClick={() => onCancel(plan)}
            className="hm-icon-btn hm-icon-btn-cancel"
            title={t('holidays.cancel')}
          >
            <i className="fas fa-ban"></i>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={`hm-plan-card hm-plan-card-${plan.status}`}>
      {/* Header */}
      <div className="hm-plan-header">
        <div className="hm-plan-title">
          <h3>{plan.name}</h3>
          <span className="hm-plan-year">
            <i className="fas fa-calendar"></i>
            {plan.year}
          </span>


  {plan.timezones?.length > 0 && (
<div className="hm-badge-timezone">
 <i className="fas fa-globe"/>

 {plan.timezones.length === 1
   ? plan.timezones[0]
   : `${plan.timezones.length} Time Zones`}
</div>
)}
        </div>
        {renderStatusBadge()}
      </div>

      {/* Stats */}
      <div className="hm-plan-stats">
        <div className="hm-stat">
          <i className="fas fa-calendar-check"></i>
          <div>
            <strong>{plan.holidaysCount || 0}</strong>
            <span>{t('holidays.holidays')}</span>
          </div>
        </div>

        <div className="hm-stat">
          <i className="fas fa-user"></i>
          <div>
            <strong>{plan.createdBy?.name || t('holidays.unknown')}</strong>
            <span>{t('holidays.createdBy')}</span>
          </div>
        </div>

        <div className="hm-stat">
          <i className="fas fa-clock"></i>
          <div>
            {/* <strong>
              {new Date(plan.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short'
              })}
            </strong> */}
            <strong>
              
              {/* {formatDisplayDate(plan.createdAt, 'en-GB')} */}

       {formatDisplayDate(
   plan.createdAt,
   plan.tenantTimezone
 )}
            </strong>
<small className="hm-muted">
 {plan.tenantTimezone}
</small>
            <span>{t('holidays.created')}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {renderActions()}
    </div>
  );
};

export default PlanCard;