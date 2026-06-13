import { useTranslation } from 'react-i18next';

/* ==============================================
   🔍 OvertimeEntryFilters
   Props:
   - filters:   { userId, type, status, source, dateFrom, dateTo }
   - onChange:  (key, value) => void
   - onReset:   () => void
   - userQuery: string  (search input value)
   - onUserSearch: (query) => void
============================================== */

const TYPES = [
  'BEFORE_SHIFT',
  'AFTER_SHIFT_DAY',
  'AFTER_SHIFT_NIGHT',
  'WEEKLY_OFF',
  'HOLIDAY',
  'EXCEPTIONAL'
];

const SOURCES = ['auto', 'manual'];

export default function OvertimeEntryFilters({
  filters,
  onChange,
  onReset
}) {
  const { t } = useTranslation("overtimeEntry");

  const hasActiveFilter =Object.values(filters).some(
  v =>
    v !== undefined &&
    v !== null &&
    v !== ''
);
  // Object.values(filters).some(v => v && v !== '');

  const invalidDateRange =

  filters.dateFrom &&
  filters.dateTo &&
  filters.dateTo < filters.dateFrom;

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6 className="fw-semibold mb-0">
            <i className="fas fa-filter me-2 text-primary" />
            {t('overtimeEntry.filters.title')}
          </h6>
          {hasActiveFilter && (
            <button className="btn btn-sm btn-outline-secondary" onClick={onReset}>
              <i className="fas fa-times me-1" />
              {t('overtimeEntry.filters.reset')}
            </button>
          )}
        </div>

        <div className="row g-2">

          {/* Type */}
          <div className="col-6 col-md-2">
            <label className="form-label small">{t('overtimeEntry.filters.type')}</label>
            <select className="form-select form-select-sm"
              value={filters.type || ''}
              onChange={e => onChange('type', e.target.value)}>
              <option value="">{t('overtimeEntry.filters.allTypes')}</option>
              {TYPES.map(tp => (
                <option key={tp} value={tp}>{t(`overtimeEntry.types.${tp}`)}</option>
              ))}
            </select>
          </div>

          {/* Source */}
          <div className="col-6 col-md-2">
            <label className="form-label small">{t('overtimeEntry.filters.source')}</label>
            <select className="form-select form-select-sm"
              value={filters.source || ''}
              onChange={e => onChange('source', e.target.value)}>
              <option value="">{t('overtimeEntry.filters.allSources')}</option>
              {SOURCES.map(s => (
                <option key={s} value={s}>{t(`overtimeEntry.sources.${s}`)}</option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div className="col-6 col-md-2">
            <label className="form-label small">{t('overtimeEntry.filters.dateFrom')}</label>
            <input type="date" className={`form-control form-control-sm ${
  invalidDateRange ? 'is-invalid' : ''
}`}
              value={filters.dateFrom || ''}
              onChange={e => onChange('dateFrom', e.target.value)} />
          </div>

          {/* Date To */}
          <div className="col-6 col-md-2">
            <label className="form-label small">{t('overtimeEntry.filters.dateTo')}</label>
            <input type="date" className={`form-control form-control-sm ${
  invalidDateRange ? 'is-invalid' : ''
}`}
              value={filters.dateTo || ''}
              onChange={e => onChange('dateTo', e.target.value)} />
          </div>
        </div>

        {invalidDateRange && (
          <div className="text-danger small mt-2">

            <i className="fas fa-exclamation-circle me-1" />

            {t('common.invalidDateRange', {
              ns: 'translation'
            })}

          </div>
        )}

      </div>
    </div>
  );
}