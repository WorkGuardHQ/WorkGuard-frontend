import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createBonusPolicy, updateBonusPolicy } from '../../services/Overtime & Bonus/bonusPolicy.api';
import ScopeSelector from '../ui/ScopeSelector';

/* ==============================================
   📝 BonusPolicyFormModal
   Props:
   - show:          Boolean
   - editingPolicy: Object | null
   - onClose:       () => void
   - onSuccess:     () => void
   - onToast:       ({ type, message }) => void
============================================== */

const defaultForm = () => ({
  name:       '',
  scope:      'global',
  scopeId:    '',
  scopeLabel: '',
  rules: {
    attendanceBonus: {
      enabled: false,
      condition: {
        maxAbsences:        0,
        maxLateDays:        0,
        maxLateMinutesTotal: 0,
        maxUnpaidDays:      0
      },
      reward: {
        type:  'fixed',
        value: ''
      }
    },
    fixedBonus: {
      enabled:   false,
      amount:    '',
      condition: 'always'
    }
  }
});

export default function BonusPolicyFormModal({
  show,
  editingPolicy,
  onClose,
  onSuccess,
  onToast
}) {
  const { t }  = useTranslation("bonusPolicy");
  const [form,   setForm]   = useState(defaultForm());
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const isEdit = !!editingPolicy;

  /* =========================
     Populate on edit
  ========================= */
  useEffect(() => {
    if (!show) return;

    if (editingPolicy) {
      const ab = editingPolicy.rules?.attendanceBonus;
      const fb = editingPolicy.rules?.fixedBonus;

      setForm({
        name:       editingPolicy.name    || '',
        scope:      editingPolicy.scope   || 'global',
        scopeId:    editingPolicy.scopeId || '',
        scopeLabel: '',
        rules: {
          attendanceBonus: {
            enabled: ab?.enabled || false,
            condition: {
              maxAbsences:         ab?.condition?.maxAbsences         ?? 0,
              maxLateDays:         ab?.condition?.maxLateDays         ?? 0,
              maxLateMinutesTotal: ab?.condition?.maxLateMinutesTotal ?? 0,
              maxUnpaidDays:       ab?.condition?.maxUnpaidDays       ?? 0
            },
            reward: {
              type:  ab?.reward?.type  || 'fixed',
              value: ab?.reward?.value ?? ''
            }
          },
          fixedBonus: {
            enabled:   fb?.enabled   || false,
            amount:    fb?.amount    ?? '',
            condition: fb?.condition || 'always'
          }
        }
      });
    } else {
      setForm(defaultForm());
    }

    setErrors({});
  }, [show, editingPolicy]);

  /* =========================
     setField (dot-path)
  ========================= */
  const setField = (path, value) => {
    setForm(prev => {
      const next = structuredClone(prev);
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  /* =========================
     ScopeSelector handler
  ========================= */
  const handleScopeChange = ({ scope, scopeId, scopeLabel }) => {
   setForm(prev => ({
  ...prev,

  scope,

  scopeId:
    scope === 'global'
      ? ''
      : scopeId,

  scopeLabel
}));
    setErrors(prev => ({ ...prev, scopeId: undefined }));
  };

  /* =========================
     Validate
  ========================= */
  const validate = () => {
    const e = {};

    if (!form.name.trim())
      e.name = t('common.required', { ns: "translation" });

    if (form.scope !== 'global' && !form.scopeId?.toString().trim())
      e.scopeId = t('common.required', { ns: "translation" });

    const ab = form.rules.attendanceBonus;
    if (ab.enabled) {
      if (!ab.reward.value || Number(ab.reward.value) <= 0)
        e.abRewardValue = t('common.required', { ns: "translation" });
      if (ab.reward.type === 'percentage' && Number(ab.reward.value) > 100)
        e.abRewardValue = 'Max 100%';
    }

    const fb = form.rules.fixedBonus;
    if (fb.enabled) {
      if (!fb.amount || Number(fb.amount) <= 0)
        e.fbAmount = t('common.required', { ns: "translation" });
    }

    if (!ab.enabled && !fb.enabled)
      e.noRule = t('bonusPolicy.rules.atLeastOne') || 'Enable at least one rule';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* =========================
     Submit
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const ab = form.rules.attendanceBonus;
      const fb = form.rules.fixedBonus;

      const payload = {
        name:  form.name.trim(),
        rules: {
          attendanceBonus: {
            enabled: ab.enabled,
            condition: {
              maxAbsences:         Number(ab.condition.maxAbsences)         || 0,
              maxLateDays:         Number(ab.condition.maxLateDays)         || 0,
              maxLateMinutesTotal: Number(ab.condition.maxLateMinutesTotal) || 0,
              maxUnpaidDays:       Number(ab.condition.maxUnpaidDays)       || 0
            },
            reward: {
              type:  ab.reward.type,
              value: Number(ab.reward.value)
            }
          },
          fixedBonus: {
            enabled:   fb.enabled,
            amount:    Number(fb.amount) || 0,
            condition: fb.condition
          }
        }
      };

      if (!isEdit) {
        payload.scope   = form.scope;
        payload.scopeId = form.scope !== 'global' ? form.scopeId : null;
      }

      if (isEdit) {
        await updateBonusPolicy(editingPolicy._id, payload);
      } else {
        await createBonusPolicy(payload);
      }

      onSuccess();
    } catch (err) {
      onToast({
        type:    'error',
        message: err?.response?.data?.message || t('bonusPolicy.saveError')
      });
    } finally {
      setSaving(false);
    }
  };

  if (!show) return null;

  const ab = form.rules.attendanceBonus;
  const fb = form.rules.fixedBonus;

  return (
    <div className="modal fade show d-block" tabIndex="-1"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">

          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-gift me-2 text-success" />
              {isEdit ? t('bonusPolicy.edit') : t('bonusPolicy.create')}
            </h5>
            <button className="btn-close" onClick={onClose} disabled={saving} />
          </div>

          {/* Body */}
          <div className="modal-body">
            <form onSubmit={handleSubmit} id="bonus-policy-form" noValidate>

              {/* ── Name ── */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  {t('bonusPolicy.fields.name')} <span className="text-danger">*</span>
                </label>
                <input type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  value={form.name}
                  onChange={e => setField('name', e.target.value)}
                  placeholder={t('bonusPolicy.fields.name')} />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              {/* ── Scope ── */}
              {!isEdit ? (
                <div className="mb-4">
               <ScopeSelector
  scope={form.scope}
  scopeId={form.scopeId}
  onChange={handleScopeChange}
  error={errors.scopeId}
/>
                </div>
              ) : (
                <div className="mb-4 alert alert-light border py-2 px-3 small">
                  <i className="fas fa-lock me-2 text-muted" />
                  <strong>{t('bonusPolicy.fields.scope')}:</strong>{' '}
                  {t(`bonusPolicy.scopes.${form.scope}`)}
                  {form.scope && <span className="ms-2 text-muted">({form.scope})</span>}
                </div>
              )}

              {/* ── No Rule Error ── */}
              {errors.noRule && (
                <div className="alert alert-warning py-2 px-3 small mb-3">
                  <i className="fas fa-exclamation-triangle me-2" />
                  {errors.noRule}
                </div>
              )}

              {/* ── Attendance Bonus ── */}
              <div className="bonus-rule-card mb-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <h6 className="fw-semibold mb-0">
                      <i className="fas fa-user-check me-2 text-success" />
                      {t('bonusPolicy.rules.attendanceBonus.label')}
                    </h6>
                    <small className="text-muted">
                      {t('bonusPolicy.rules.attendanceBonus.desc')}
                    </small>
                  </div>
                  <div className="form-check form-switch mb-0">
                    <input className="form-check-input" type="checkbox"
                      checked={ab.enabled}
                      onChange={e => setField('rules.attendanceBonus.enabled', e.target.checked)} />
                  </div>
                </div>

                {ab.enabled && (
                  <div className="ps-2">
                    {/* Conditions */}
                    <p className="text-muted small mb-2 fw-semibold">
                      {t('common.conditions', { ns: "translation" })}:
                    </p>
                    <div className="row g-2 mb-3">
                      <div className="col-6 col-md-3">
                        <label className="form-label small">
                          {t('bonusPolicy.rules.attendanceBonus.maxAbsences')}
                        </label>
                        <input type="number" min="0"
                          className="form-control form-control-sm"
                          value={ab.condition.maxAbsences}
                          onChange={e => setField('rules.attendanceBonus.condition.maxAbsences', e.target.value)} />
                      </div>

                      <div className="col-6 col-md-3">
                        <label className="form-label small">
                          {t('bonusPolicy.rules.attendanceBonus.maxLateDays')}
                        </label>
                        <input type="number" min="0"
                          className="form-control form-control-sm"
                          value={ab.condition.maxLateDays}
                          onChange={e => setField('rules.attendanceBonus.condition.maxLateDays', e.target.value)} />
                      </div>

                      <div className="col-6 col-md-3">
                        <label className="form-label small">
                          {t('bonusPolicy.rules.attendanceBonus.maxLateMinutesTotal')}
                        </label>
                        <input type="number" min="0"
                          className="form-control form-control-sm"
                          value={ab.condition.maxLateMinutesTotal}
                          onChange={e => setField('rules.attendanceBonus.condition.maxLateMinutesTotal', e.target.value)} />
                      </div>

                      <div className="col-6 col-md-3">
                        <label className="form-label small">
                          {t('bonusPolicy.rules.attendanceBonus.maxUnpaidDays')}
                        </label>
                        <input type="number" min="0"
                          className="form-control form-control-sm"
                          value={ab.condition.maxUnpaidDays}
                          onChange={e => setField('rules.attendanceBonus.condition.maxUnpaidDays', e.target.value)} />
                      </div>
                    </div>

                    {/* Reward */}
                    <p className="text-muted small mb-2 fw-semibold">
                      {t('bonusPolicy.rules.attendanceBonus.rewardType')}:
                    </p>
                    <div className="row g-2 align-items-end">
                      <div className="col-6 col-md-4">
                        <select className="form-select form-select-sm"
                          value={ab.reward.type}
                          onChange={e => setField('rules.attendanceBonus.reward.type', e.target.value)}>
                          <option value="fixed">
                            {t('bonusPolicy.rules.attendanceBonus.rewardTypes.fixed')}
                          </option>
                          <option value="percentage">
                            {t('bonusPolicy.rules.attendanceBonus.rewardTypes.percentage')}
                          </option>
                        </select>
                      </div>

                      <div className="col-6 col-md-4">
                        <label className="form-label small">
                          {t('bonusPolicy.rules.attendanceBonus.rewardValue')}
                          {ab.reward.type === 'percentage' ? ' (%)' : ` (${t('common.currency', { ns: "translation" })})`}
                        </label>
                        <input type="number" min="0"
                          step={ab.reward.type === 'percentage' ? '0.5' : '1'}
                          className={`form-control form-control-sm ${errors.abRewardValue ? 'is-invalid' : ''}`}
                          value={ab.reward.value}
                          onChange={e => setField('rules.attendanceBonus.reward.value', e.target.value)} />
                        {errors.abRewardValue && (
                          <div className="invalid-feedback">{errors.abRewardValue}</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Fixed Bonus ── */}
              <div className="bonus-rule-card mb-2">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <h6 className="fw-semibold mb-0">
                      <i className="fas fa-coins me-2 text-info" />
                      {t('bonusPolicy.rules.fixedBonus.label')}
                    </h6>
                    <small className="text-muted">
                      {t('bonusPolicy.rules.fixedBonus.desc')}
                    </small>
                  </div>
                  <div className="form-check form-switch mb-0">
                    <input className="form-check-input" type="checkbox"
                      checked={fb.enabled}
                      onChange={e => setField('rules.fixedBonus.enabled', e.target.checked)} />
                  </div>
                </div>

                {fb.enabled && (
                  <div className="ps-2 row g-2 align-items-end">
                    <div className="col-6 col-md-4">
                      <label className="form-label small">
                        {t('bonusPolicy.rules.fixedBonus.amount')} ({t('common.currency', { ns: "translation" })})
                      </label>
                      <input type="number" min="0"
                        className={`form-control form-control-sm ${errors.fbAmount ? 'is-invalid' : ''}`}
                        value={fb.amount}
                        onChange={e => setField('rules.fixedBonus.amount', e.target.value)} />
                      {errors.fbAmount && (
                        <div className="invalid-feedback">{errors.fbAmount}</div>
                      )}
                    </div>

                    <div className="col-6 col-md-4">
                      <label className="form-label small">
                        {t('bonusPolicy.rules.fixedBonus.condition')}
                      </label>
                      <select className="form-select form-select-sm"
                        value={fb.condition}
                        onChange={e => setField('rules.fixedBonus.condition', e.target.value)}>
                        <option value="always">
                          {t('bonusPolicy.rules.fixedBonus.conditions.always')}
                        </option>
                        <option value="active_only">
                          {t('bonusPolicy.rules.fixedBonus.conditions.active_only')}
                        </option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

            </form>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary"
              onClick={onClose} disabled={saving}>
              {t('bonusPolicy.cancel')}
            </button>
            <button type="submit" form="bonus-policy-form"
              className="btn btn-success" disabled={saving}>
              {saving
                ? <><span className="spinner-border spinner-border-sm me-2" />{t('common.saving', { ns: "translation" })}</>
                : <><i className="fas fa-save me-2" />{t('bonusPolicy.save')}</>
              }
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}