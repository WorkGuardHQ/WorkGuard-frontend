import { useTranslation } from 'react-i18next';

/* ==============================================
   🏷️ OvertimeEntryStatusBadge
   Props: status, type, source
============================================== */

const TYPE_CONFIG = {
  BEFORE_SHIFT:      { color: 'warning', icon: 'fa-sun'           },
  AFTER_SHIFT_DAY:   { color: 'primary', icon: 'fa-cloud-sun'     },
  AFTER_SHIFT_NIGHT: { color: 'info',    icon: 'fa-moon'          },
  WEEKLY_OFF:        { color: 'success', icon: 'fa-calendar-times' },
  HOLIDAY:           { color: 'danger',  icon: 'fa-umbrella-beach' },
  EXCEPTIONAL:       { color: 'purple',  icon: 'fa-star'           }
};

const STATUS_CONFIG = {
  pending:  { color: 'warning',   icon: 'fa-clock'       },
  approved: { color: 'success',   icon: 'fa-check-circle' },
  rejected: { color: 'danger',    icon: 'fa-times-circle' }
};

export function TypeBadge({ type }) {
  const { t } = useTranslation("overtimeEntry");
  const cfg   = TYPE_CONFIG[type] || { color: 'secondary', icon: 'fa-circle' };

  // purple مش موجود في Bootstrap نتعامل معاه بـ style
  const isCustom = cfg.color === 'purple';

  return isCustom ? (
    <span className="badge border"
      style={{ background: '#f3e8ff', color: '#7c3aed', borderColor: '#c4b5fd' }}>
      <i className={`fas ${cfg.icon} me-1`} />
      {t(`overtimeEntry.types.${type}`)}
    </span>
  ) : (
    <span className={`badge bg-${cfg.color} bg-opacity-10 text-${cfg.color} border border-${cfg.color} border-opacity-25`}>
      <i className={`fas ${cfg.icon} me-1`} />
      {t(`overtimeEntry.types.${type}`)}
    </span>
  );
}

export function StatusBadge({ status }) {
  const { t } = useTranslation("overtimeEntry");
  const cfg   = STATUS_CONFIG[status] || { color: 'secondary', icon: 'fa-circle' };

  return (
    <span className={`badge bg-${cfg.color} bg-opacity-10 text-${cfg.color} border border-${cfg.color} border-opacity-25`}>
      <i className={`fas ${cfg.icon} me-1`} />
      {t(`overtimeEntry.statuses.${status}`)}
    </span>
  );
}

export function SourceBadge({ source }) {
  const { t } = useTranslation("overtimeEntry");
  return source === 'auto' ? (
    <span className="badge bg-light text-secondary border">
      <i className="fas fa-robot me-1" />
      {t('overtimeEntry.sources.auto')}
    </span>
  ) : (
    <span className="badge bg-light text-dark border">
      <i className="fas fa-user-edit me-1" />
      {t('overtimeEntry.sources.manual')}
    </span>
  );
}