// // src/services/admin.api.js
// import { apiGet, apiPost, apiPut } from '../helpers/api';

// /* ======================================================
//    Admin - Attendance
// ====================================================== */

// /**
//  * 📋 Get all attendance records
//  */
// export const getAllAttendance = (params = {}) => {
//   const queryParams = new URLSearchParams(params);
//   return apiGet(`/admin/attendance?${queryParams.toString()}`);
// };

// /**
//  * 👤 Get attendance by user ID
//  */
// export const getAttendanceByUser = (userId, params = {}) => {
//   const queryParams = new URLSearchParams(params);
//   return apiGet(`/admin/attendance/${userId}?${queryParams.toString()}`);
// };

// /**
//  * ✏️ Admin update attendance (same as in attendance.api.js but via admin route)
//  */
// export const adminUpdateAttendance = (attendanceId, data) => {
//   return apiPut(`/admin/attendance/${attendanceId}`, data);
// };

// /**
//  * 📊 Get attendance summary (main table with pagination)
//  */
// export const getAttendanceSummary = (params = {}) => {
//   const queryParams = new URLSearchParams(params);
//   return apiGet(`/admin/attendance-summary?${queryParams.toString()}`);
// };

// /**
//  * 📅 Get admin weekly attendance for specific user
//  */
// export const getAdminWeeklyAttendance = (userId, params = {}) => {
//   const queryParams = new URLSearchParams(params);
//   return apiGet(`/admin/users/${userId}/attendance-week?${queryParams.toString()}`);
// };

// /**
//  * ➕ Create manual attendance
//  */
// export const createManualAttendance = (data) => {
//   return apiPost('/admin/attendance/manual', data);
// };

// /* ======================================================
//    Admin - Payroll
// ====================================================== */

// /**
//  * 💰 Get total salaries
//  */
// export const getTotalSalaries = (params = {}) => {
//   const queryParams = new URLSearchParams(params);
//   return apiGet(`/admin/total-salaries?${queryParams.toString()}`);
// };

// /**
//  * 📊 Get yearly salaries
//  */
// export const getYearlySalaries = (params = {}) => {
//   const queryParams = new URLSearchParams(params);
//   return apiGet(`/admin/yearly-salaries?${queryParams.toString()}`);
// };

// /* ======================================================
//    Admin - Devices
// ====================================================== */

// /**
//  * 📱 Get all devices (admin view)
//  */
// export const getAdminDevices = (params = {}) => {
//   const queryParams = new URLSearchParams(params);
//   return apiGet(`/admin/devices?${queryParams.toString()}`);
// };

// /* ======================================================
//    Admin - Reports
// ====================================================== */

// /**
//  * 📈 Get user monthly report
//  */
// export const getUserMonthlyReport = (params = {}) => {
//   const queryParams = new URLSearchParams(params);
//   return apiGet(`/admin/user-monthly-report?${queryParams.toString()}`);
// };

// /* ======================================================
//    Self - Employee Views (Non-Admin)
// ====================================================== */

// /**
//  * 📊 Get my attendance summary (employee self-view)
//  */
// export const getSelfAttendanceSummary = (params = {}) => {
//   const queryParams = new URLSearchParams(params);
//   return apiGet(`/admin/my-attendance-summary?${queryParams.toString()}`);
// };

// /**
//  * 📅 Get my day details (employee self-view)
//  */
// export const getSelfDayDetails = (params = {}) => {
//   const queryParams = new URLSearchParams(params);
//   return apiGet(`/admin/my-attendance/day-details?${queryParams.toString()}`);
// };

// src/services/admin.api.js

// import { apiGet, apiPost, apiPut } from '../helpers/api';

// /* ======================================================
//    Admin - Attendance
// ====================================================== */

// /** 📋 الجدول الكبير — DailyAttendanceSummary (1 row/user/day) */
// export const getAllAttendance = (params = {}) => {
//   const queryParams = new URLSearchParams(params);
//   return apiGet(`/admin/attendance?${queryParams.toString()}`);
// };

// /** 👤 حضور موظف واحد — DailyAttendanceSummary */
// export const getAttendanceByUser = (userId, params = {}) => {
//   const queryParams = new URLSearchParams(params);
//   return apiGet(`/admin/attendance/${userId}?${queryParams.toString()}`);
// };

// /** ✏️ تعديل سجل حضور خام */
// export const adminUpdateAttendance = (attendanceId, data) => {
//   return apiPut(`/admin/attendance/${attendanceId}`, data);
// };

// /** 📊 الجدول الرئيسي للأدمن — DailyAttendanceSummary مع pagination */
// export const getAttendanceSummary = (params = {}) => {
//   const queryParams = new URLSearchParams(params);
//   return apiGet(`/admin/attendance-summary?${queryParams.toString()}`);
// };

// /**
//  * 🔍 تفاصيل يوم واحد لموظف — Modal
//  *    بيرجع: summary (قرارات + دقائق + transits) + records (raw check-in/out)
//  *
//  * ✅ استخدم localDateStr() في الـ date قبل ما تبعتيه:
//  *    const d = new Date(row.date);
//  *    const date = `${d.getFullYear()}-${...}-${...}`  ← مش toISOString()
//  *
//  * @param {string} userId
//  * @param {string} date  — "yyyy-mm-dd" بـ local time (مش UTC)
//  */
// export const getAttendanceDayDetails = (userId, date) => {
//   return apiGet(`/admin/attendance/day-details?userId=${userId}&date=${date}`);
// };

// /** 📅 حضور أسبوعي لموظف */
// export const getAdminWeeklyAttendance = (userId, params = {}) => {
//   const queryParams = new URLSearchParams(params);
//   return apiGet(`/admin/users/${userId}/attendance-week?${queryParams.toString()}`);
// };

// /** ➕ إضافة حضور يدوي */
// export const createManualAttendance = (data) => {
//   return apiPost('/admin/attendance/manual', data);
// };

// /* ======================================================
//    Admin - Payroll
// ====================================================== */

// /** 💰 مجموع الرواتب شهري */
// export const getTotalSalaries = (params = {}) => {
//   const queryParams = new URLSearchParams(params);
//   return apiGet(`/admin/total-salaries?${queryParams.toString()}`);
// };

// /** 📊 الرواتب السنوية */
// export const getYearlySalaries = (params = {}) => {
//   const queryParams = new URLSearchParams(params);
//   return apiGet(`/admin/yearly-salaries?${queryParams.toString()}`);
// };

// /* ======================================================
//    Admin - Devices
// ====================================================== */

// /** 📱 أجهزة الموظفين */
// export const getAdminDevices = (params = {}) => {
//   const queryParams = new URLSearchParams(params);
//   return apiGet(`/admin/devices?${queryParams.toString()}`);
// };

// /* ======================================================
//    Admin - Reports
// ====================================================== */

// /** 📈 التقرير الشهري لموظف */
// export const getUserMonthlyReport = (params = {}) => {
//   const queryParams = new URLSearchParams(params);
//   return apiGet(`/admin/user-monthly-report?${queryParams.toString()}`);
// };

// /* ======================================================
//    Self — الموظف يشوف بياناته
// ====================================================== */

// /** 📊 ملخص حضوري الشهري */
// export const getSelfAttendanceSummary = (params = {}) => {
//   const queryParams = new URLSearchParams(params);
//   return apiGet(`/admin/my-attendance-summary?${queryParams.toString()}`);
// };

// /** 📅 تفاصيل يوم من حضوري */
// export const getSelfDayDetails = (params = {}) => {
//   const queryParams = new URLSearchParams(params);
//   return apiGet(`/admin/my-attendance/day-details?${queryParams.toString()}`);
// };

// src/services/admin.api.js

import { apiGet, apiPost, apiPut } from '../helpers/api';

/* ======================================================
   Admin - Attendance
====================================================== */

/** 📋 الجدول الكبير — DailyAttendanceSummary (1 row/user/day) */
export const getAllAttendance = (params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/admin/attendance?${queryParams.toString()}`);
};

/** 👤 حضور موظف واحد — DailyAttendanceSummary */
export const getAttendanceByUser = (userId, params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/admin/attendance/${userId}?${queryParams.toString()}`);
};

/** ✏️ تعديل سجل حضور خام */
// export const adminUpdateAttendance = (attendanceId, data) => {
//   return apiPut(`/admin/attendance/${attendanceId}`, data);
// };

/** 📊 الجدول الرئيسي للأدمن — DailyAttendanceSummary مع pagination */
export const getAttendanceSummary = (params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/admin/attendance-summary?${queryParams.toString()}`);
};

/**
 * 🔍 تفاصيل يوم واحد لموظف — Modal
 *    بيرجع: summary (قرارات + دقائق + transits) + records (raw check-in/out)
 *
 * ✅ استخدم localDateStr() في الـ date قبل ما تبعتيه:
 *    const d = new Date(row.date);
 *    const date = `${d.getFullYear()}-${...}-${...}`  ← مش toISOString()
 *
 * @param {string} userId
 * @param {string} date  — "yyyy-mm-dd" بـ local time (مش UTC)
 */
export const getAttendanceDayDetails = (userId, date, bust = false) => {
  // bust=true بيضيف timestamp عشان يتجاوز الكاش بعد أي تعديل
  const ts = bust ? `&_t=${Date.now()}` : '';
  return apiGet(`/admin/attendance/day-details?userId=${userId}&date=${date}${ts}`);
};

/** 📅 حضور أسبوعي لموظف */
export const getAdminWeeklyAttendance = (userId, params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/admin/users/${userId}/attendance-week?${queryParams.toString()}`);
};

/** ➕ إضافة حضور يدوي */
export const createManualAttendance = (data) => {
  return apiPost('/admin/attendance/manual', data);
};

/* ======================================================
   Admin - Payroll
====================================================== */

/** 💰 مجموع الرواتب شهري */
export const getTotalSalaries = (params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/admin/total-salaries?${queryParams.toString()}`);
};

/** 📊 الرواتب السنوية */
export const getYearlySalaries = (params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/admin/yearly-salaries?${queryParams.toString()}`);
};

/* ======================================================
   Admin - Devices
====================================================== */

/** 📱 أجهزة الموظفين */
export const getAdminDevices = (params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/admin/devices?${queryParams.toString()}`);
};

/* ======================================================
   Admin - Reports
====================================================== */

/** 📈 التقرير الشهري لموظف */
export const getUserMonthlyReport = (params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/admin/user-monthly-report?${queryParams.toString()}`);
};

/* ======================================================
   Self — الموظف يشوف بياناته
====================================================== */

/** 📊 ملخص حضوري الشهري */
export const getSelfAttendanceSummary = (params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/admin/my-attendance-summary?${queryParams.toString()}`);
};

/** 📅 تفاصيل يوم من حضوري */
export const getSelfDayDetails = (params = {}) => {
  const queryParams = new URLSearchParams(params);
  return apiGet(`/admin/my-attendance/day-details?${queryParams.toString()}`);
};



/* ======================================================
   Admin - Attendance Repair
====================================================== */



/** 🔄 إعادة احتساب يوم لموظف */
export const adminRecalculateDay = (data) => {
  return apiPost('/admin/attendance/recalculate-day', data);
};

/** 🔄 إعادة احتساب جماعي */
export const adminBulkRecalculateDay = (data) => {
  return apiPost('/admin/attendance/recalculate-bulk', data);
};

/** 🚫 إغلاق/إبطال سجل حضور مفتوح */
// export const adminCloseOpenAttendance = (data) => {
//   return apiPost('/admin/attendance/close-open', data);
// };

/** 🚫 إغلاق/إبطال فردي او جماعي للسجلات المفتوحة */
export const adminBulkCloseOpenAttendances = (data) => {
  return apiPost('/admin/attendance/close-open-bulk', data);
};