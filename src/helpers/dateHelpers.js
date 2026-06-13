// // src/helpers/dateHelpers.js

// /**
//  * تحويل Date Object أو ISO string إلى YYYY-MM-DD (local timezone)
//  * يستخدم في <input type="date" />
//  */
// export const toDateInputValue = (date) => {
//   if (!date) return '';
  
//   const d = new Date(date);
  
//   // التأكد من صحة التاريخ
//   if (isNaN(d.getTime())) return '';
  
//   // استخراج السنة والشهر واليوم من التوقيت المحلي
//   const year = d.getFullYear();
//   const month = String(d.getMonth() + 1).padStart(2, '0');
//   const day = String(d.getDate()).padStart(2, '0');
  
//   return `${year}-${month}-${day}`;
// };

// /**
//  * تحويل YYYY-MM-DD إلى ISO string مع UTC midnight
//  * يستخدم عند الإرسال للـ Backend
//  */
// export const toUTCMidnight = (dateString) => {
//   if (!dateString) return null;
  
//   const [year, month, day] = dateString.split('-').map(Number);
  
//   // إنشاء Date بـ UTC midnight
//   const d = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
//    console.log('toUTCMidnight result:', d.toISOString());
//   return d.toISOString();
// };

// /**
//  * عرض التاريخ بصيغة قابلة للقراءة (حسب locale المستخدم)
//  */
// export const formatDisplayDate = (date, locale = 'en-GB') => {
//   if (!date) return '';
  
//   const d = new Date(date);
  
//   if (isNaN(d.getTime())) return '';
  
//   return d.toLocaleDateString(locale, {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric'
//   });
// };

// /**
//  * حساب عدد الأيام بين تاريخين (شامل)
//  */
// export const calculateDays = (startDate, endDate) => {
//   const start = new Date(startDate);
//   const end = new Date(endDate);
  
//   start.setHours(0, 0, 0, 0);
//   end.setHours(0, 0, 0, 0);
  
//   const diffTime = end - start;
//   const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
//   return diffDays + 1; // +1 لأن اليوم الأول محسوب
// };

// /**
//  * التحقق من صحة نطاق التواريخ
//  */
// export const isValidDateRange = (startDate, endDate) => {
//   if (!startDate) return false;
//   if (!endDate) return true; // endDate اختياري
  
//   return endDate >= startDate;
// };

// /**
//  * الحصول على التاريخ الحالي بصيغة YYYY-MM-DD
//  */
// export const getTodayString = () => {
//   const today = new Date();
//   const year = today.getFullYear();
//   const month = String(today.getMonth() + 1).padStart(2, '0');
//   const day = String(today.getDate()).padStart(2, '0');
  
//   return `${year}-${month}-${day}`;
// };





// src/helpers/dateHelpers.js
/*
DB = UTC فقط
Backend = timezone-aware calculations
Frontend = timezone-aware display
💣 أهم تغيير حصل:

❌ مبقاش عندنا timezone واحد
✅ بقى عندنا timezone per record
*/

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(tz)

export const toUTCFromTimezone = (dateString, timezone) => {
  if (!dateString) return null;

  return dayjs
    .tz(dateString, timezone)
    .utc()
    .toISOString();
};


// ✅ fallback آمن
const safeTZ = (tz) => tz || 'UTC';

/**
 * تحويل Date → YYYY-MM-DD (input date)
 * ⚠️ يعتمد على timezone مش UTC
 */
export const toDateInputValue = (date, timezone) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const tz = safeTZ(timezone);

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(d);

  const year  = parts.find(p => p.type === 'year')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const day   = parts.find(p => p.type === 'day')?.value;

  return `${year}-${month}-${day}`;
};

/**
 * YYYY-MM-DD → UTC ISO
 */
export const toUTCMidnight = (dateString) => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toISOString();
};

/**
 * عرض التاريخ
 */
// export const formatDisplayDate = (date, timezone, locale = 'en-GB', opts = {}) => {
//   if (!date) return '';
//   const d = new Date(date);
//   if (isNaN(d.getTime())) return '';

//   return d.toLocaleDateString(locale, {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//     timeZone: safeTZ(timezone),
//     ...opts,
//   });
// };

// /**
//  * عرض الوقت
//  */
// export const formatDisplayTime = (date, timezone, locale = 'en-GB') => {
//   if (!date) return '—';
//   const d = new Date(date);
//   if (isNaN(d.getTime())) return '—';

//   return d.toLocaleTimeString(locale, {
//     hour: '2-digit',
//     minute: '2-digit',
//     timeZone: safeTZ(timezone),
//   });
// };

/**
 * تاريخ + يوم
 */
export const formatDisplayDateWithWeekday = (date, timezone, locale = 'en-GB') => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  return d.toLocaleDateString(locale, {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: safeTZ(timezone),
  });
};

/**
 * فرق الأيام (timezone-aware)
 */
export const calculateDays = (startDate, endDate, timezone) => {
  if (!startDate || !endDate) return 0;

  const start = toDateInputValue(startDate, timezone);
  const end   = toDateInputValue(endDate, timezone);

  const s = new Date(start);
  const e = new Date(end);

  return Math.floor((e - s) / (1000 * 60 * 60 * 24)) + 1;
};

/**
 * validation
 */
export const isValidDateRange = (startDate, endDate) => {
  if (!startDate) return false;
  if (!endDate) return true;
  return endDate >= startDate;
};

/**
 * اليوم الحالي حسب timezone
 */
export const getTodayString = (timezone) => {
  return toDateInputValue(new Date(), timezone);
};