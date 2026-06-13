import { useTranslation } from 'react-i18next';

export default function BonusPolicyNotes() {
  const { t } = useTranslation ("bonusPolicy");

  const notes = [
    { icon: 'fa-sort-amount-up', key: 'priority',    extra: t('bonusPolicy.notes.priorityDesc'), color: 'primary' },
     { icon: 'fa-sort-amount-down',  key: 'priority2',    color: 'primary' },
    
    { icon: 'fa-user-check',     key: 'attendance',  color: 'success' },
    { icon: 'fa-coins',          key: 'fixed',       color: 'info'    },
    { icon: 'fa-star',           key: 'exceptional', color: 'warning' }
  ];

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header bg-light">
        <h6 className="mb-0 fw-semibold">
          <i className="fas fa-info-circle me-2 text-success" />
          {t('bonusPolicy.notes.title')}
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
                    {t(`bonusPolicy.notes.${key}`)}
                  </div>
                  {extra && <div className="text-muted small">{extra}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}