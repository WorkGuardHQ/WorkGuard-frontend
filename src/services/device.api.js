import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '../helpers/api';

/* ======================================================
   Devices
====================================================== */

/**
 * 📱 Register device
 *  ""no longer supported.
 */
export const registerDevice = (data) => {
  return apiPost('/devices/register-device', data);
};

/**
 * 📋 Get pending devices
 */
export const getPendingDevices = (params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/devices/pending-devices?${queryParams.toString()}`);
};

/**
 * 📱 Get user devices
 */
// export const getUserDevices = (userId) => {
//   return apiGet(`/devices/${userId}/devices`);
// };

// في device.api.js — عدلي الفانكشن دي بس

export const getUserDevices = (userId, params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiGet(`/devices/${userId}/devices${query ? `?${query}` : ''}`);
};

/**
 * ✅ Approve device
 */
export const approveUserDevice = (userId, deviceId, data) => {
  return apiPatch(`/devices/${userId}/devices/${deviceId}/approve`, data);
};

/**
 * 🔄 Toggle device status (enable/disable)
 */
export const toggleDeviceStatus = (userId, deviceId, data) => {
  return apiPut(`/devices/${userId}/devices/${deviceId}`, data);
};

/**
 * ❌ Remove device
 */
export const removeUserDevice = (userId, deviceId) => {
  return apiDelete(`/devices/${userId}/devices/${deviceId}`);
};