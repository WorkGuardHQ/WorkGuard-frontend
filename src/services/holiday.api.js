// import { apiGet, apiPost, apiPut, apiDelete } from '../helpers/api';

// /* =========================
//    📋 Get Holidays with Pagination
// ========================= */
// export const getHolidays = async (params = {}) => {
//   const queryParams = new URLSearchParams();
  
//   if (params.year) queryParams.append('year', params.year);
//   if (params.branch) queryParams.append('branch', params.branch);
//   if (params.user) queryParams.append('user', params.user);
//   if (params.scope) queryParams.append('scope', params.scope);
//   if (params.page) queryParams.append('page', params.page);
//   if (params.limit) queryParams.append('limit', params.limit);

//   const url = `/holidays${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  
//   const response = await apiGet(url);
//   return response.data;
// };

// /* =========================
//    ➕ Create Holiday
// ========================= */
// export const createHoliday = async (data) => {
//   const response = await apiPost('/holidays', data);
//   return response.data;
// };

// /* =========================
//    ✏️ Update Holiday
// ========================= */
// export const updateHoliday = async (id, data) => {
//   const response = await apiPut(`/holidays/${id}`, data);
//   return response.data;
// };

// /* =========================
//    🗑️ Delete Holiday
// ========================= */
// export const deleteHoliday = async (id) => {
//   const response = await apiDelete(`/holidays/${id}`);
//   return response.data;
// };

// /* =========================
//    👥 Get Users List (for user-specific holidays)
// ========================= */
// export const getUsers = async () => {
//   const response = await apiGet('/users');
//   return response.data;
// };

// /* =========================
//    🏢 Get Branches List
// ========================= */
// export const getBranches = async () => {
//   const response = await apiGet('/branches');
//   return response.data;
// };


import { apiGet, apiPost, apiPut, apiDelete } from '../helpers/api';

/* =========================
   📋 CRUD Operations
========================= */

export const getHolidays = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.year) queryParams.append('year', params.year);
  if (params.branch) queryParams.append('branch', params.branch);
  if (params.user) queryParams.append('user', params.user);
  if (params.scope) queryParams.append('scope', params.scope);
    if (params.status) queryParams.append('status', params.status); 

  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);

  const url = `/holidays${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  
  const response = await apiGet(url);
  return response.data;
};

export const createHoliday = async (data) => {
  const response = await apiPost('/holidays', data);
  return response.data;
};

export const bulkCreateHolidays = async (holidays) => {
  const response = await apiPost('/holidays/bulk', { holidays });
  return response.data;
};

export const updateHoliday = async (id, data) => {
  const response = await apiPut(`/holidays/${id}`, data);
  return response.data;
};

export const deleteHoliday = async (id) => {
  const response = await apiDelete(`/holidays/${id}`);
  return response.data;
};


/* =========================
   🗓️ Holiday Plans
========================= */

// export const createHolidayPlan = async (holidays) => {
//   const response = await apiPost('/holidays/plan', { holidays });
//   return response.data;
// };


export const activateHoliday = async (id) => {
  const res = await apiPost(`/holidays/${id}/activate`);
  return res.data;
};

export const cancelHoliday = async (id, cancelFrom = null) => {
  const res = await apiPost(`/holidays/${id}/cancel`, {
    cancelFrom
  });
  return res.data;
};

/* =========================
   🔍 Lookup / Search
========================= */

// export const searchUsers = async (query, branchId = null) => {
//   const params = { q: query };
//   if (branchId) params.branch = branchId;

//   const response = await apiGet('/users/lookup', { params });
//   return response.data.data;
// };
export const searchUsers = async (
  query,
  branchId = null,
  departmentId = null
) => {
  const params = { q: query };

  if (branchId) {
    params.branch = branchId;
  }

  if (departmentId) {
    params.department = departmentId;
  }

  const response = await apiGet('/users/lookup', { params });

  return response.data.data;
};

export const getBranchLookup = async () => {
  const response = await apiGet('/branches/lookup');
  return response.data;
};


/* =========================
   🗓️ Holiday Plans
========================= */

// Create plan
export const createHolidayPlan = async ({ planName, year, holidays }) => {
  const res = await apiPost('/holidays/plans', {
    planName,
    year,
    holidays
  });
  return res.data;
};

// Get plans (pagination + filters)
export const getHolidayPlans = async (params = {}) => {
  const query = new URLSearchParams();

  if (params.year) query.append('year', params.year);
  if (params.status) query.append('status', params.status);
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);

  const url = `/holidays/plans${query.toString() ? '?' + query.toString() : ''}`;
  const res = await apiGet(url);
  return res.data;
};

// Get holidays inside plan
export const getPlanHolidays = async (planId, params = {}) => {
  const query = new URLSearchParams();

  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);

  const url = `/holidays/plans/${planId}/holidays${query.toString() ? '?' + query.toString() : ''}`;
  const res = await apiGet(url);
  return res.data;
};

// Update plan (draft only)
export const updateHolidayPlan = async (id, data) => {
  const res = await apiPut(`/holidays/plans/${id}`, data);
  return res.data;
};

// Activate plan
export const activateHolidayPlan = async (id) => {
  const res = await apiPost(`/holidays/plans/${id}/activate`);
  return res.data;
};

// Cancel plan
export const cancelHolidayPlan = async (id, cancelFrom = null) => {
  const res = await apiPost(`/holidays/plans/${id}/cancel`, {
    cancelFrom
  });
  return res.data;
};

// Delete plan (draft only)
export const deleteHolidayPlan = async (id) => {
  const res = await apiDelete(`/holidays/plans/${id}`);
  return res.data;
};

// Add holiday to plan
export const addHolidayToPlan = async (planId, data) => {
  const res = await apiPost(`/holidays/plans/${planId}/holidays`, data);
  return res.data;
};

// ✅ Aliases للـ backward compatibility
export const getUsers = searchUsers;
export const getBranches = getBranchLookup;

