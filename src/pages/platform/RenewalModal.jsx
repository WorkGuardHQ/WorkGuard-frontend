// src/components/platform/RenewalModal.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { getPlans } from '../../services/platform/platformPlans.service';
import {
  getRenewalPreview,
  renewSubscription,
} from '../../services/platform/platformSubscriptionRenewal.service';

const PAYMENT_METHODS = [
  'manual', 'cash', 'bank_transfer', 'vodafone_cash',
  'instapay', 'free', 'stripe', 'fawry', 'other',
];

const inp = { background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9' };
const lbl = { color: '#94a3b8', fontSize: 13, display: 'block', marginBottom: 6, fontWeight: 500 };

const RESOURCE_LABELS = {
  employees: 'Employees',
  branches: 'Branches',
  admins: 'Admins',
};

const RESOURCES = [
  'employees',
  'branches',
  'admins',
];

const LIMIT_FIELDS = {
    employees: 'maxEmployees',
    branches: 'maxBranches',
    admins: 'maxAdmins',
};

// const formatMoney = (amount = 0, currency = '') =>
//   `${amount.toLocaleString()} ${currency}`;

const formatMoney = (
    amount = 0,
    currency = '',
) =>

new Intl.NumberFormat(
'en-US',
{
maximumFractionDigits:0,
}
).format(amount)

+ ` ${currency}`;



/* ── صف تفصيل التكلفة ── */
function CostRow({ label, value, muted, bold }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      padding: '6px 0', fontSize: 13,
      color: muted ? '#64748b' : '#e2e8f0',
      fontWeight: bold ? 700 : 400,
    }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}


function PreviewSection({ title, children }) {
  return (
    <div
      style={{
        background: '#111827',
        border: '1px solid #334155',
        borderRadius: 8,
        padding: 14,
        marginBottom: 14,
      }}
    >
      <div
        style={{
          color: '#f8fafc',
          fontWeight: 600,
          marginBottom: 10,
          fontSize: 13,
        }}
      >
        {title}
      </div>

      {children}
    </div>
  );
}

export default function RenewalModal({ show, tenant, currentPlanSlug, onClose, onSuccess }) {
  const [plans, setPlans]           = useState([]);
  const [planSlug, setPlanSlug]     = useState(currentPlanSlug || '');
  const [preview, setPreview]       = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError]     = useState('');

  const [paymentMethod, setPaymentMethod] = useState('manual');
  const [paymentStatus, setPaymentStatus] = useState('paid');
  const [notes, setNotes]                 = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // ✅ Race-condition guard — نتجاهل أي رد قديم لو المستخدم غيّر الاختيار بسرعة
  const abortRef = useRef(null);

  // ✅ تحميل الخطط مرة واحدة بس لما الـ Modal يفتح
  useEffect(() => {
    if (!show) return;
    setPlanSlug(currentPlanSlug || '');
    setPaymentMethod('manual');
    setPaymentStatus('paid');
    setNotes('');
    setSubmitError('');

    getPlans({ activeOnly: 'true', limit: 50 })
      .then(r => setPlans(r.data.data))
      .catch(() => setPlans([]));
  }, [show, currentPlanSlug]);

  // ✅ Preview مباشر كل ما الخطة تتغيّر — بإلغاء الطلب القديم أولاً
  useEffect(() => {
    if (!show || !planSlug || !tenant?._id) return;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setPreviewLoading(true);
    setPreviewError('');

    getRenewalPreview(tenant._id, planSlug, { signal: controller.signal })
      .then(res => setPreview(res.data.data))
      .catch(err => {
        if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return; // ✅ طلب اتلغى، مش خطأ فعلي
        setPreview(null);
        setPreviewError(err.response?.data?.message || 'Failed to calculate preview');
      })
      .finally(() => setPreviewLoading(false));

    return () => controller.abort();
  }, [show, planSlug, tenant?._id]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!tenant?._id) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await renewSubscription(tenant._id, {
        planSlug,
        paymentMethod,
        paymentStatus,
        notes: notes || undefined,
      });
      onSuccess();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to renew subscription');
    } finally {
      setSubmitting(false);
    }
  }, [tenant?._id, planSlug, paymentMethod, paymentStatus, notes, onSuccess]);

  if (!show) return null;

  const isPlanChange = planSlug !== currentPlanSlug;


  const currency =
preview?.summary?.currency
||
preview?.plan?.currency
||
'';



   const summary =
preview?.summary;

  return (
    <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,.65)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{ background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0' }}>

          <div className="modal-header" style={{ borderColor: '#334155' }}>
            <h5 className="modal-title" style={{ color: '#f1f5f9', fontSize: 15 }}>
              <i className="fas fa-sync-alt me-2 text-primary" />
              Renew / Change Plan
            </h5>
            <button className="btn-close btn-close-white" onClick={onClose} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {submitError && <div className="alert alert-danger py-2 small mb-3">{submitError}</div>}

              <div className="mb-3">
                <label style={lbl}>Plan *</label>
                <select className="form-select" style={inp} value={planSlug}
                  onChange={e => setPlanSlug(e.target.value)} required>
                  {plans.map(p => (
                    <option key={p.slug} value={p.slug}>
                      {p.name} — {p.price} {p.currency} / {p.durationDays}d
                      {p.slug === currentPlanSlug ? ' (current)' : ''}
                    </option>
                  ))}
                </select>
                {isPlanChange && (
                  <small style={{ color: '#f59e0b' }}>
                    <i className="fas fa-exclamation-triangle me-1" />
                    This will change the tenant's plan, not just renew the current one.
                  </small>
                )}
              </div>

              {/* ── Preview ── */}
              <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 10, padding: '14px 16px', marginBottom: 16 }}>
                {previewLoading ? (
                  <div className="text-center py-2">
                    <span className="spinner-border spinner-border-sm" style={{ color: '#3b82f6' }} />
                  </div>
                ) : previewError ? (
                  <div style={{ color: '#ef4444', fontSize: 13 }}>{previewError}</div>
                ) : preview ? (
                  <>

                  <PreviewSection title="Current Usage">

  {RESOURCES.map(resource => {

    const used =
      preview.usage?.[resource] || 0;

      
    // const limitField = {
    //   employees: 'maxEmployees',
    //   branches: 'maxBranches',
    //   admins: 'maxAdmins',
    // }[resource];

    // const limit =
    //   preview.limits?.[limitField];
const limit =
preview.limits?.[
LIMIT_FIELDS[resource]
];
    const exceeded =
      limit !== null &&
      limit !== undefined &&
      used > limit;

      
    return (

      <CostRow
        key={resource}
        label={RESOURCE_LABELS[resource]}
        value={
          limit == null
            ? `${used} / Unlimited`
            : `${used} / ${limit}`
        }
        muted={!exceeded}
        bold={exceeded}
      />

    );

  })}

</PreviewSection>

{/* Subscription Charges */}
<PreviewSection title="Subscription Charges">

  <CostRow
    label={`${preview.plan.name} Plan`}
    value={formatMoney(
      preview.plan.price,
      currency,
    )}
  />

  {RESOURCES.map(resource => {

    const extra =
      preview.extras?.[resource] || 0;

    if (!extra) return null;

    const unitPrice =
      preview.plan.overages?.[resource]
        ?.unitPrice || 0;

     

    return (

      <CostRow
        key={resource}
        muted
        label={`${RESOURCE_LABELS[resource]} (${extra} × ${unitPrice})`}
        value={formatMoney(
          preview.extraCharges?.[resource] || 0,
          currency,
        )}
      />

    );

  })}

</PreviewSection>


                    {/* <CostRow label="Plan price" value={`${preview.plan.price} ${preview.plan.currency}`} /> */}
                    {/* {['employees', 'branches', 'admins'].map(resource => (
                      preview.extras?.[resource] > 0 && (
                        <CostRow
                          key={resource}
                          muted
                          label={`Extra ${resource} (${preview.extras[resource]} × ${preview.plan.overages?.[resource]?.unitPrice || 0})`}
                          value={`${preview.extraCharges[resource]} ${preview.plan.currency}`}
                        />
                      )
                    ))} */}

{/* Pending Charges */}
{preview.pendingCharges?.length > 0 && (

  <PreviewSection title="Pending Charges">

    {preview.pendingCharges.map((charge, index) => (

      <CostRow
        key={index}
        muted
      label={`${RESOURCE_LABELS[charge.resource]}
(${charge.quantity} × ${formatMoney(
    charge.unitPrice,
    charge.currency,
)})`}

        value={formatMoney(
          charge.amount,
          charge.currency,
        )}
      />

    ))}

  </PreviewSection>

)}
                    {/* <hr style={{ borderColor: '#334155', margin: '8px 0' }} /> */}
                    {/* <CostRow bold label="Total" value={`${preview.totalAmount} ${preview.plan.currency}`} /> */}
                    {/* <div style={{ marginTop: 8, fontSize: 11, color: '#64748b' }}>
                      Current usage: {preview.usage.employees} employees · {preview.usage.branches} branches · {preview.usage.admins} admins
                    </div> */}

                    <PreviewSection title="Summary">

  <CostRow
    label="Plan Price"
    value={formatMoney(
      // preview.summary.planPrice,
      summary?.planPrice,
      currency,
    )}
  />

  {Object.values(preview.extraCharges || {}).some(v => v > 0) && (
    <CostRow
      muted
      label="Overage Charges"
      value={formatMoney(
        // Object.values(preview.extraCharges).reduce(
        //   (sum, value) => sum + value,
        //   0,
        // )
        summary?.overagesTotal,
        currency,
      )}
    />
  )}

  {summary?.pendingTotal
 > 0 && (
    <CostRow
      muted
      label="Pending Charges"
      value={formatMoney(
        summary?.pendingTotal
,
        currency,
      )}
    />
  )}

  <hr style={{ borderColor: '#334155' }} />

  <CostRow
    bold
    label="Grand Total"
    value={formatMoney(
     summary?.grandTotal,
      currency,
    )}
  />

</PreviewSection>
                  </>
                ) : null}
              </div>

              <div className="row g-3">
                <div className="col-6">
                  <label style={lbl}>Payment Method</label>
                  <select className="form-select" style={inp} value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}>
                    {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="col-6">
                  <label style={lbl}>Payment Status</label>
                  <select className="form-select" style={inp} value={paymentStatus}
                    onChange={e => setPaymentStatus(e.target.value)}>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>
                <div className="col-12">
                  <label style={lbl}>Notes</label>
                  <textarea className="form-control" rows={2} style={inp}
                    value={notes} onChange={e => setNotes(e.target.value)}
                    placeholder="Optional internal notes..." />
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ borderColor: '#334155' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={submitting || previewLoading || !preview}>
                {submitting
                  ? <><span className="spinner-border spinner-border-sm me-1" />Processing...</>
                  : isPlanChange ? 'Change Plan' : 'Renew Subscription'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}