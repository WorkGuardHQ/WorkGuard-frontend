// import { apiGet, apiPost, apiPut } from '../../../helpers/api';

// /**
//  * ================================
//  * Submit new leave (Employee)
//  * ================================
//  */
// export const submitLeave = (payload) => {
//   return apiPost('/leaves', payload);
// };

// /**
//  * ================================
//  * Get my leaves (Employee)
//  * ================================
//  * params:
//  * - page
//  * - limit
//  * - status (optional)
//  */
// export const getMyLeaves = ({
//   page = 1,
//   limit = 10,
//   status
// }) => {
//   const params = new URLSearchParams({
//     page,
//     limit
//   });

//   if (status) params.append('status', status);

//   return apiGet(`/leaves/my?${params.toString()}`);
// };

// /**
//  * ================================
//  * Get all leaves (Admin)
//  * ================================
//  * params:
//  * - page
//  * - limit
//  * - status
//  * - userId
//  */
// export const getAllLeaves = ({
//   page = 1,
//   limit = 10,
//   status,
//   userId
// }) => {
//   const params = new URLSearchParams({
//     page,
//     limit
//   });

//   if (status) params.append('status', status);
//   if (userId) params.append('userId', userId);

//   return apiGet(`/leaves/all?${params.toString()}`);
// };

// /**
//  * ================================
//  * Get leave details
//  * ================================
//  */
// export const getLeaveById = (leaveId) => {
//   return apiGet(`/leaves/${leaveId}`);
// };
//  //get leave summary (Admin / Owner)
// export const getLeaveSummary = (leaveId) => {
//   return apiGet(`/leaves/${leaveId}/summary`);
// };

// /**
//  * ================================
//  * Get leave breakdown (Admin / Owner)
//  * ================================
//  */
// export const getLeaveBreakdown = (leaveId) => {
//   return apiGet(`/leaves/${leaveId}/breakdown`);
// };



// /**
//  * ================================
//  * Admin actions
//  * ================================
//  */


import { apiGet, apiPost, apiPut } from '../../helpers/api';

/* ======================================================
   Employee – Leaves
====================================================== */

export const getMyBranches = () => {
  return apiGet('/branches/mybranches');
};

/**
 * Submit new leave (Employee / Admin)
 */
export const submitLeave = (payload) => {
  return apiPost('/leaves', payload);
};

/**
 * Get my leaves
 */
export const getMyLeaves = ({
  page = 1,
  limit = 10,
  status,
   year 
}) => {
  const params = new URLSearchParams({ page, limit });
  if (status) params.append('status', status);
  if (year)   params.append('year', year);

  return apiGet(`/leaves/my?${params.toString()}`);
};

/**
 * Get single leave details
 */
export const getLeaveById = (leaveId) => {
  return apiGet(`/leaves/${leaveId}`);
};

/**
 * Get leave breakdown (Admin / Owner)
 */
export const getLeaveBreakdown = (leaveId) => {
  return apiGet(`/leaves/${leaveId}/breakdown`);
};

/**
 * Cancel leave (Pending: Owner/Admin – Approved: Admin only)
 */
// export const cancelLeave = (leaveId) => {
//   return apiPut(`/leaves/${leaveId}/cancel`);
// };


// ✅ أضف payload
export const cancelLeave = (leaveId, payload = {}) => {
  return apiPut(`/leaves/${leaveId}/cancel`, payload);
};
/* ======================================================
   Admin – Leaves
====================================================== */

/**
 * Get all leaves
 */
// export const getAllLeaves = ({
//   page = 1,
//   limit = 10,
//   year,
//   status,
//   userId
// }) => {
//   const params = new URLSearchParams({ page, limit });
//   if (status) params.append('status', status);
//   if (userId) params.append('userId', userId);

//   return apiGet(`/leaves/all?${params.toString()}`);
// };
export const getAllLeaves = ({
  page = 1,
  limit = 10,
  year,
  status,
  userId
}) => {
  const params = new URLSearchParams();

  params.append('page', page);
  params.append('limit', limit);

  if (year) {
    params.append('year', year);
  }

  if (status) {
    params.append('status', status);
  }

  if (userId) {
    params.append('userId', userId);
  }

  return apiGet(`/leaves/all?${params.toString()}`);
};

/**
 * Approve leave
 */
// export const approveLeave = (leaveId) => {
//   return apiPut(`/leaves/${leaveId}/approve`);
// };


// ✅ أضف forceApprove option
export const approveLeave = (leaveId, payload = {}) => {
  return apiPut(`/leaves/${leaveId}/approve`, payload);
};

/**
 * Reject leave
 */
export const rejectLeave = (leaveId, rejectionReason) => {
  return apiPut(`/leaves/${leaveId}/reject`, { rejectionReason });
};

/**
 * Leave summary for user
 */
export const getUserLeaveSummary = ({ userId, year }) => {
  if (!userId) throw new Error('userId is required');

  const params = new URLSearchParams();
  if (year) params.append('year', year);

  return apiGet(`/leaves/users/${userId}/summary?${params.toString()}`);
};

/**
 * 📅 Get User Leave Year (Annual / Sick / Unpaid)
 */
export const getUserLeaveYear = ({ userId, year }) => {
  if (!userId) throw new Error('userId is required');

  const params = new URLSearchParams();
  if (year) params.append('year', year);

  return apiGet(
    `/leaves/users/${userId}/leave-year?${params.toString()}`
  );
};

/* ======================================================
   Admin – Leave Reset & Adjustments
====================================================== */




export const previewYearlyLeaveResetUnified = ({
  year,
  types = ['annual', 'sick'],
  page = 1,
  limit = 20,
  search = '',
  status ='',
  branchId = '',
} = {}) => {
  const params = new URLSearchParams();

  if (year) params.append('year', year);
  if (types?.length) params.append('types', types.join(','));
    if (search) params.append('search', search);
params.append('status', status);
if (branchId) {
  params.append(
    'branchId',
    branchId
  );
}
  params.append('page', page);
  params.append('limit', limit);
return apiGet(
  `/admin/leave-policies/leaves/yearly-reset/preview?${params.toString()}`
);


};


export const runYearlyLeaveResetUnified = ({
  year,
  types = ['annual', 'sick'],
  force = false
} = {}) => {
  return apiPost(
    '/admin/leave-policies/leaves/yearly-reset/run',
    { year, types, force }
  );
};



export const adjustLeaveBalance = ({ userId, ...payload }) => {
  return apiPost(`/admin/leave-policies/leave-adjustments/${userId}`, payload);
};


// export const adjustLeaveBalance = (userId, payload) => {
//   if (!userId) throw new Error('userId is required');
//   return apiPost(`/admin/leaves/adjust-balance/${userId}`, payload);
// };
