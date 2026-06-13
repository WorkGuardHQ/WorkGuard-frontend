// src/services/branch.api.js
// src/services/branch.api.js
import { apiGet, apiPost, apiPut, apiDelete } from '../helpers/api';

/* ======================================================
   Branch Lookup
====================================================== */

/**
 * 🔍 Get branch lookup (lightweight for selects)
 */
export const getBranchLookup = () => {
  return apiGet('/branches/lookup');
  
};

/* ======================================================
   My Branches
====================================================== */

/**
 * 🏢 Get my branches
 */
export const getMyBranches = () => {
  return apiGet('/branches/mybranches');
};

/**
 * 👤 Get user branches
 */
export const getUserBranches = (userId) => {
  return apiGet(`/branches/user/${userId}`);
};

/* ======================================================
   Branch CRUD
====================================================== */

/**
 * ➕ Create branch
 */
export const createBranch = (data) => {
  return apiPost('/branches', data);
};

/**
 * 📋 Get all branches
 */
export const getBranches = (params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/branches?${queryParams.toString()}`);
};


export const getBranchesWithMeta=(params={})=>{
 const q=
  new URLSearchParams({
   ...params,
   includeMeta:true
  });

 return apiGet(
   `/branches?${q}`
 ).then(r=>r.data);
};

/**
 * ✏️ Update branch
 */
export const updateBranch = (branchId, data) => {
  return apiPut(`/branches/${branchId}`, data);
};

/**
 * ❌ Delete branch
 */
export const deleteBranch = (branchId) => {
  return apiDelete(`/branches/${branchId}`);
};