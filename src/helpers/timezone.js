
//helpers/timezone.js

// src/helpers/timezone.js

/**
 * ترجع الـ timezone الصحيح حسب الأولوية:
 * 1. branch.timezone
 * 2. effectiveTimezone (اللي الباك بيبعته)
 * 3. tenant timezone (من الـ row أو من الـ context)
 * 4. UTC كـ fallback أخير فقط
 */


// helpers/timezone.js


// extract timezone from row
// export const getRowTimezone = (row) => {
//   if (!row) return 'UTC';

//   return (
//     row?.branch?.timezone ||
//     row?.effectiveTimezone ||
//     row?.user?.workTimezone ||   
//     row?.workTimezone ||  
//     row?.timezone ||
//     row?.tenantTimezone ||
//     'UTC'
//   );
// };



// helpers/timezone.js

//timezone validation
const isValidTimezone = (tz) => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
};

export const formatDisplayTime = (date, timezone = 'UTC') => {
  if (!date) return '—';

  const tz = isValidTimezone(timezone) ? timezone : 'UTC';

  try {
    const formatted = new Intl.DateTimeFormat('en-GB', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(date));

    return `${formatted} (${tz})`;
  } catch {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(date)) + ' (UTC)';
  }
};


/**
 * عرض التاريخ بطريقة آمنة
 */

export const formatDisplayDate = (date, timezone = 'UTC', options = {}) => {
  if (!date) return '—';

  const tz = isValidTimezone(timezone) ? timezone : 'UTC';

  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: tz,
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      ...options,
    }).format(new Date(date));
  } catch {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      ...options,
    }).format(new Date(date));
  }
};



//attendance policy (user ->worktimezon, branch->branch tz,role/global->tanent tz)
export const getPolicyTimezone = (form, branches, tenantTZ) => {
  if (form.scope === 'branch') {
    const branch = branches.find(b => b._id === form.branch);
    return branch?.timezone || tenantTZ;
  }

  if (form.scope === 'user') {
    return form.userTimezone || tenantTZ;
  }

  return tenantTZ;
};

// export const getRowTimezone = (row) => {
//   if (!row) return 'UTC';

//   return (
//     row?.branch?.timezone ||
//     row?.effectiveTimezone || 
//     row?.timezone ||
//     row?.tenantTimezone ||     // في حالة لو الباك بعته في المستقبل
//     'UTC'                      // fallback آمن فقط في حالة الطوارئ
//   );
// };

/**
 * عرض الوقت بطريقة آمنةdisplay فقط
 */
// export const formatDisplayTime = (date, timezone = 'UTC') => {
//   if (!date) return '—';

//   const tz = getRowTimezone({ effectiveTimezone: timezone }) || 'UTC';

//   try {
//     const formatted = new Intl.DateTimeFormat('en-GB', {
//       timeZone: tz,
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true,
//     }).format(new Date(date));

//     return `${formatted} (${tz})`;
//   } catch (error) {
//     console.warn(`Invalid timezone "${tz}" in formatDisplayTime, falling back to UTC`);
//     return new Intl.DateTimeFormat('en-GB', {
//       timeZone: 'UTC',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true,
//     }).format(new Date(date)) + ' (UTC)';
//   }
// };



// export const formatDisplayDate = (date, timezone = 'UTC', options = {}) => {
//   if (!date) return '—';

//   const tz = getRowTimezone({ effectiveTimezone: timezone }) || 'UTC';

//   try {
//     return new Intl.DateTimeFormat('en-GB', {
//       timeZone: tz,
//       year: 'numeric',
//       month: 'short',
//       day: '2-digit',
//       ...options,
//     }).format(new Date(date));
//   } catch (error) {
//     console.warn(`Invalid timezone "${tz}" in formatDisplayDate, falling back to UTC`);
//     return new Intl.DateTimeFormat('en-GB', {
//       timeZone: 'UTC',
//       year: 'numeric',
//       month: 'short',
//       day: '2-digit',
//       ...options,
//     }).format(new Date(date));
//   }
// };

// export const getRowTimezone = (row, tenantTZ = 'UTC') => {
//   return (
//     row?.branch?.timezone ||
//     row?.effectiveTimezone ||
//     row?.timezone ||
//     row?.tenantTimezone ||
//     tenantTZ ||
//     'UTC'
//   );
// };

// //format time
// export const formatDisplayTime = (date, timezone) => {
//   if (!date) return '-';

//   const time = new Intl.DateTimeFormat('en-GB', {
//     timeZone: timezone,
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//   }).format(new Date(date));

//   return `${time} (${timezone})`;
// };
// //format date
// export const formatDisplayDate = (date, timezone, options = {}) => {
//   if (!date) return '-';

//   return new Intl.DateTimeFormat('en-GB', {
//     timeZone: timezone,
//     year: 'numeric',
//     month: 'short',
//     day: '2-digit',
//      ...options
//   }).format(new Date(date));
// };

