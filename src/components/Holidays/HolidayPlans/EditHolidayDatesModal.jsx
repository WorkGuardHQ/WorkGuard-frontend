import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  toDateInputValue, 
  toUTCFromTimezone,
  isValidDateRange,
  calculateDays
} from '../../../helpers/dateHelpers.js';
const EditHolidayDatesModal = ({
  show,
  holiday,
  onClose,
  onSave,
  onToast
}) => {
  const { t } = useTranslation();

  /* =========================
     State
  ========================= */
  const [form, setForm] = useState({
    startDate: '',
    endDate: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* =========================
     Init
  ========================= */
  useEffect(() => {
    if (!show || !holiday) return;

 setForm({
 startDate: toDateInputValue(
   holiday.startDate,
   holiday.timezone
 ),

 endDate: toDateInputValue(
   holiday.endDate,
   holiday.timezone
 )
});

    setErrors({});
  }, [show, holiday]);

  /* =========================
     Validation
  ========================= */
  const validate = () => {
    const e = {};

    if (!form.startDate) {
      e.startDate = t('holidays.dateRequired');
    }

    // if (form.endDate && form.endDate < form.startDate)
      
      if(
 form.endDate &&
 !isValidDateRange(
   form.startDate,
   form.endDate
 )
){
      e.range = t('holidays.invalidDateRange');
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* =========================
     Submit
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSave({
       startDate: toUTCFromTimezone(
 form.startDate,
 holiday.timezone
),  // ✅ تحويل
  endDate: toUTCFromTimezone(
 form.endDate || form.startDate,
 holiday.timezone
)
      });

// إضافة عرض عدد الأيام المحسوبة

      onToast?.(t('holidays.holidayUpdated'), 'success');
      onClose();
    } catch (err) {
      const msg =
        err.response?.status === 409
          ? t('holidays.overlapError')
          : err.response?.data?.message ||
            t('holidays.updateHolidayError');

      onToast?.(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!show || !holiday) return null;

  /* =========================
     Helpers
  ========================= */
  const renderScopeLabel = () => {
    if (holiday.scope === 'global') return t('holidays.global');
    if (holiday.scope === 'branch') return holiday.branch?.name;
    if (holiday.scope === 'user') return holiday.user?.name;
    return '';
  };
  
const calculatedDays =
 form.startDate && form.endDate
 ? calculateDays(
    form.startDate,
    form.endDate,
    holiday.timezone
   )
 : null;

  /* =========================
     Render
  ========================= */
  return (
    <div className="hm-modal-overlay" onClick={onClose}>
      <div className="hm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="hm-modal-header">
          <h2>{t('holidays.editHolidayDates')}</h2>
          <button onClick={onClose} className="hm-modal-close">
            <i className="fas fa-times" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="hm-modal-body">

            {/* Info (read-only) */}
            <div className="hm-info-box">
              <div>
                <strong>{holiday.name}</strong>
              </div>
              <div className="hm-hint">
                {t('holidays.scope')}: {renderScopeLabel()}
              </div>
              <div className="hm-hint">
 <i className="fas fa-globe"/>
 {t('holidays.timezone')}:
 <strong>
   {holiday.timezone}
 </strong>
</div>
            </div>

            {/* Dates */}
            <div className="hm-form-group">
              <label className="hm-form-label">
                {t('holidays.from')} *
              </label>
              <input
                type="date"
                className={`hm-form-input ${
                  errors.startDate ? 'hm-error' : ''
                }`}
                value={form.startDate}
                onChange={(e) =>
                  setForm(prev => ({
                    ...prev,
                    startDate: e.target.value,
                    endDate: prev.endDate || e.target.value
                  }))
                }
              />
              {errors.startDate && (
                <span className="hm-error-text">{errors.startDate}</span>
              )}
            </div>

            <div className="hm-form-group">
              <label className="hm-form-label">
                {t('holidays.to')}
              </label>
              <input
                type="date"
                className={`hm-form-input ${
                  errors.range ? 'hm-error' : ''
                }`}
                min={form.startDate}
                value={form.endDate}
                onChange={(e) =>
                  setForm({ ...form, endDate: e.target.value })
                }
              />
              {errors.range && (
                <span className="hm-error-text">{errors.range}</span>
              )}
            </div>

   {/* Total days (hint) */}
{holiday.totalDays && (
  <div className="hm-hint">
    {t('holidays.previousTotalDays')}:
    <strong>{holiday.totalDays}</strong>
  </div>
)}

{calculatedDays && (
  <div className="hm-hint">
    {t('holidays.newTotalDays')}:
    <strong>{calculatedDays}</strong>
  </div>
)}



          </div>

          <div className="hm-modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="hm-btn hm-btn-secondary"
              disabled={loading}
            >
              {t('holidays.cancel')}
            </button>

            <button
              type="submit"
              className="hm-btn hm-btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin" />
                  {t('common.saving')}
                </>
              ) : (
                <>
                  <i className="fas fa-check" />
                  {t('holidays.update')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHolidayDatesModal;
