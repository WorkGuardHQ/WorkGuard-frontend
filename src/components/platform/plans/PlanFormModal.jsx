// src/components/platform/plans/PlanFormModal.jsx
import { useState, useEffect,useMemo } from 'react';
import {
  createPlan,
  updatePlan,
} from '../../../services/platform/platformPlans.service';
import PlanLimitsSection from './PlanLimitsSection';
import PlanOverageSection from './PlanOverageSection';
import PlanPreviewCard from './PlanPreviewCard';

import {
createEmptyPlan,
normalizePlan,
buildPayload,
validatePlan,
} from '../../../helpers/planFormHelpers';


function PlanFormModal({ show, plan, onClose, onSuccess, onError }) {
  const isEdit = !!plan;
 
const empty = useMemo(
  () => createEmptyPlan(),
  []
);
  const [form, setForm]       = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

 useEffect(() => {
  if (!show) return;

  if (plan) {
    setForm(normalizePlan(plan));
  } else {
    setForm(createEmptyPlan());
  }

  setError('');
}, [show, plan]);

  if (!show) return null;

//   const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
const updateField =
  (key) =>
  (e) =>
    setForm((prev) => ({
      ...prev,
      [key]:
        e.target.type === 'checkbox'
          ? e.target.checked
          : e.target.value,
    }));

  const submit = async (e) => {
  e.preventDefault();

  setLoading(true);
  setError('');

  const errors = validatePlan(form);

  if (errors.length) {
    setError(errors.join(' • '));
    setLoading(false);
    return;
  }

  const data = buildPayload(form);

  try {
    if (isEdit)
      await updatePlan(plan._id, data);
    else
      await createPlan(data);

    onSuccess(isEdit ? 'Plan updated!' : 'Plan created!');
  } catch (err) {
    const msg =
      err.response?.data?.errors?.join(' · ') ||
      err.response?.data?.message ||
      'Failed';

    setError(msg);
    onError(msg);
  } finally {
    setLoading(false);
  }
};

  const inputStyle = { background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9' };
  const labelStyle = { color: '#94a3b8', fontSize: '0.8rem' };

  return (
    <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,.65)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content" style={{ background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0' }}>

          <div className="modal-header" style={{ borderColor: '#334155' }}>
            <h5 className="modal-title" style={{ color: '#19334e' }}>
              <i className={`fas ${isEdit ? 'fa-edit' : 'fa-plus-circle'} me-2 text-primary`} />
              {isEdit ? 'Edit Plan' : 'Create New Plan'}
            </h5>
            <button className="btn-close btn-close" onClick={onClose} />
          </div>

          <form onSubmit={submit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label" style={labelStyle}>Plan Name *</label>
                  <input className="form-control" style={inputStyle} value={form.name} onChange={updateField('name')}
                  required />
                </div>
                <div className="col-md-6">
                  <label className="form-label" style={labelStyle}>Slug * {isEdit && <span style={{ color: '#475569' }}>(not editable)</span>}</label>
                  <input className="form-control" style={inputStyle} value={form.slug} onChange={updateField('slug')} disabled={isEdit} placeholder="e.g. basic" required />
                </div>
                <div className="col-md-4">
                  <label className="form-label" style={labelStyle}>Price *</label>
                  <div className="input-group">
                    <input type="number" min="0" className="form-control" style={inputStyle} value={form.price} onChange={updateField('price')} required />
                    <input className="form-control" style={{ ...inputStyle, maxWidth: 70 }} value={form.currency} onChange={updateField('currency')} />
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="form-label" style={labelStyle}>Duration (days) *</label>
                  <input type="number" min="1" className="form-control" style={inputStyle} value={form.durationDays} onChange={updateField('durationDays')} required />
                </div>
                <div className="col-md-4 d-flex align-items-end pb-2">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="isTrial" checked={form.isTrial} onChange={updateField('isTrial')} />
                    <label className="form-check-label" style={labelStyle} htmlFor="isTrial">Trial Plan</label>
                  </div>
                </div>

                {/* Limits */}
                <PlanLimitsSection
  form={form}
  setForm={setForm}
/>
<PlanOverageSection
    form={form}
    setForm={setForm}
/>

             <PlanPreviewCard
    form={form}
/> 

                <div className="col-12">
                  <label className="form-label" style={labelStyle}>Description</label>
                  <textarea className="form-control" rows={2} style={inputStyle} value={form.description} onChange={updateField('description')} />
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ borderColor: '#334155' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                {loading ? <><span className="spinner-border spinner-border-sm me-1" />Saving...</> : isEdit ? 'Update Plan' : 'Create Plan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default PlanFormModal;