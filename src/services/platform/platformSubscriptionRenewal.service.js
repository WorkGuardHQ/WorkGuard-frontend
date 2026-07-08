// src/services/platform/platformSubscriptionRenewal.service.js
import platformApi from '../../helpers/platformApi';

/* ── Renewal Preview ── */
// ✅ يقبل config اختياري (زي { signal }) عشان نقدر نلغي طلب قديم
// لو المستخدم غيّر اختيار الخطة بسرعة قبل ما الرد الأول يرجع
export const getRenewalPreview = (tenantId, planSlug, config = {}) =>
  platformApi.get(`/tenants/${tenantId}/renewal-preview`, {
    params: { planSlug },
    ...config,
  });

/* ── Renew / Change Plan ── */
export const renewSubscription = (tenantId, data) =>
  platformApi.post(`/tenants/${tenantId}/renew`, data);

/* ── Renewal History ── */
export const getRenewalHistory = (tenantId, params = {}) =>
  platformApi.get(`/tenants/${tenantId}/renewals`, {
    params,
  });