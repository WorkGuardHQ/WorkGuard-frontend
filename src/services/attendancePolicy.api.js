import { apiGet, apiPost, apiPut,apiDelete } from '../helpers/api'; 
// api = axios instance (baseURL + token interceptor)

/* =========================
   Attendance Policy API
========================= */

/**
 * 📋 Get Policies (list + filters)
 * @param {Object} params
 * params = { page, limit, scope, active }
 */
export const getAttendancePolicies = async (params = {}) => {
  const { data } = await apiGet('/attendance-policies', { params });
  return data;
};


/**
 * ➕ Create Attendance Policy
 */
export const createAttendancePolicy = async (payload) => {
  const { data } = await apiPost('/attendance-policies', payload);
  return data;
};


/**
 * ✏️ Update Attendance Policy
 * ⚠ scope لا يتغير
 */
export const updateAttendancePolicy = async (id, payload) => {
  const { data } = await apiPut(`/attendance-policies/${id}`, payload);
  return data;
};

/**
 * 🔄 Enable / Disable Policy
 */
export const setAttendancePolicyActive = async (id, active) => {
  const { data } = await apiPut(
    `/attendance-policies/${id}/active`,
    { active }
  );
  return data;
};

/**
 * 🗑️ Delete Policy
 */
export const deleteAttendancePolicy = async (id) => {
  const { data } = await apiDelete(`/attendance-policies/${id}`);
  return data;
};



//==============================

//get effective policy for user(winning policy for user)

/**
 * 🎯 Resolve winning policy for user or form preview
 */

export const resolvePolicy = ({
  userId, branchId, role,
  salary, workingDaysCount, workingHoursPerDay,
}) => {
  return apiGet('/attendance-policies/resolve', {
    params: {
      ...(userId && { userId }),
      ...(branchId && { branchId }),
      ...(role && { role }),
      ...(salary != null && { salary }),
      ...(workingDaysCount != null && { workingDaysCount }),
      ...(workingHoursPerDay != null && { workingHoursPerDay }),
    }
  });
};
// export const resolvePolicy = ({ userId, branchId, role }) => {
//   return apiGet('/attendance-policies/resolve', {
//     params: {
//       ...(userId && { userId }),
//       ...(branchId && { branchId }),
//       ...(role && { role })
//     }
//   });
// };
/**
 * 👤 Get effective attendance policy for user
 * Admin only
 */
export const getUserEffectiveAttendancePolicy = async (userId) => {
  const { data } = await apiGet(
    `/attendance-policies/users/${userId}/effective-policy`
  );
  return data;
};

export const getUserBranchPolicies = async (userId) => {
  return apiGet(
    `/attendance-policies/users/${userId}/attendance-policies`
  ).then(res => res.data);
};

export const getUserAssignedAttendancePolicies = async (userId) => {
  const { data } = await apiGet(
    `/attendance-policies/users/${userId}/assigned`
  );
  return data;
};

export const getAttendancePolicyActivationHistory = (
  policyId,
  { page = 1, limit = 10 } = {}
) => {
  return apiGet(
    `/attendance-policies/${policyId}/activation-history`,
    {
      params: { page, limit }
    }
  );
};
