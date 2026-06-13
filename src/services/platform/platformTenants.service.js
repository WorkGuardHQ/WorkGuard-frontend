// // src/services/platform/platformTenants.service.js
// import platformApi from '../../helpers/platformApi';

// export const getTenants          = (params)     => platformApi.get   ('/tenants',              { params });
// export const getTenant           = (id)         => platformApi.get   (`/tenants/${id}`);
// export const createTenant        = (data)       => platformApi.post  ('/tenants',               data);
// export const updateTenantStatus  = (id, data)   => platformApi.patch (`/tenants/${id}/status`,  data);


// src/services/platform/platformTenants.service.js
// src/services/platform/platformTenants.service.js
import { platformGet, platformPost, platformPatch } from '../../helpers/platformApi';
import platformApi from '../../helpers/platformApi';

/* ── Stats ── */
export const getTenantStats = () =>
  platformGet('/tenants/stats');

/* ── List ── */
export const getTenants = (params = {}) =>
  platformGet('/tenants', { params });

/* ── Single ── */
export const getTenant = (id) =>
  platformGet(`/tenants/${id}`);

/* ── Create ── */
export const createTenant = (data) =>
  platformPost('/tenants', data);

/* ── Status ── */
export const updateTenantStatus = (id, status, reason) =>
  platformPatch(`/tenants/${id}/status`, { status, reason });


export const updateTenant        = (id, data)            => platformPatch(`/tenants/${id}`, data);

/* ── Activate Account — public, بدون auth token ── */
export const activateAccount = (token, password) => {
  return platformApi.post('/tenants/activate', {
    token,
    password
  });
};