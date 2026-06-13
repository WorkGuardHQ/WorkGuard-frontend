import { useTranslation } from 'react-i18next';

/* ==============================================
   📝 OvertimePolicyNotes
   Notes section explaining how OT works
============================================== */
export default function OvertimePolicyNotes() {
  const { t } = useTranslation("overtimePolicy");

  const notes = [
    { icon: 'fa-sort-amount-up',  key: 'priority',       extra: t('overtimePolicy.notes.priorityDesc'), color: 'primary' },

    
 { icon: 'fa-sort-amount-down',  key: 'priorityDesc2',    color: 'primary' },
    
    { icon: 'fa-sun',             key: 'beforeShift',     color: 'warning' },
    { icon: 'fa-cloud-sun',       key: 'afterShiftDay',   color: 'info' },
    { icon: 'fa-moon',            key: 'afterShiftNight', color: 'primary' },
    { icon: 'fa-calendar-times',  key: 'weeklyOff',       color: 'success' },
    { icon: 'fa-umbrella-beach',  key: 'holiday',         color: 'danger' },
    { icon: 'fa-hourglass-half',  key: 'cap',             color: 'warning' },
  ];

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header bg-light">
        <h6 className="mb-0 fw-semibold">
          <i className="fas fa-info-circle me-2 text-primary" />
          {t('overtimePolicy.notes.title')}
        </h6>
      </div>
      <div className="card-body">
        <div className="row g-3">
          {notes.map(({ icon, key, extra, color }) => (
            <div key={key} className="col-12 col-md-6">
              <div className="d-flex gap-2 align-items-start">
                <div className={`text-${color} mt-1`} style={{ minWidth: 20 }}>
                  <i className={`fas ${icon}`} />
                </div>
                <div>
                  <div className="fw-semibold small">
                    {t(`overtimePolicy.notes.${key}`)}
                  </div>
                  {extra && (
                    <div className="text-muted small">{extra}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}