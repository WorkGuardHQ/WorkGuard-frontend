// // SubscriptionBanner.jsx
// import { useState, useEffect, useCallback } from 'react';
// import { useTranslation } from 'react-i18next';
// import { getSubscriptionBanner } from '../../services/subscription/subscriptionStatus.service';
// import { isGlobalAdmin } from '../../helpers/auth';
// import { formatDisplayDate } from '../../helpers/timezone';
// import '../../style/Subscription/SubscriptionBanner.css';

// /**
//  * ============================================================
//  *  SubscriptionBanner
//  *  - Popup/modal shown when a Global Admin opens the system
//  *  - Fully localized via i18next (see i18n keys: "subscriptionBanner.*")
//  *  - Dates are shown in the TENANT's timezone (sent by the backend),
//  *    not the viewer's browser timezone — subscription expiry is a
//  *    tenant-level fact and must look the same to every admin.
//  *  - Dismissed by the admin (X button / Escape / "remind later").
//  *    Dismissal is remembered per (level + day), so if the alert
//  *    escalates (e.g. warning -> critical) it will show again.
//  * ============================================================
//  */

// const DISMISS_PREFIX = 'sub_banner_dismissed_';

// const buildDismissKey = (level) => {
//   const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC-based key is fine, it's just a "don't repeat today" guard)
//   return `${DISMISS_PREFIX}${level}_${today}`;
// };

// const LEVEL_STYLES = {
//   critical: { color: '#dc2626', bg: '#fef2f2', icon: '⛔' },
//   expired:  { color: '#991b1b', bg: '#fef2f2', icon: '🚫' },
//   warning:  { color: '#d97706', bg: '#fffbeb', icon: '⚠️' },
//   info:     { color: '#2563eb', bg: '#eff6ff', icon: 'ℹ️' },
// };

// export default function SubscriptionBanner() {
//   const { t } = useTranslation('subscriptionBanner');
//   const [data, setData] = useState(null);
//   const [visible, setVisible] = useState(false);

//   const fetchStatus = useCallback(async () => {
//     // ✅ Mirrors the backend's Global Admin check — avoids an unnecessary request/render
//     if (!isGlobalAdmin()) return;

//     try {
//       const res = await getSubscriptionBanner();
//       const payload = res?.data;

//       if (payload?.show) {
//         const key = buildDismissKey(payload.level);
//         const dismissed = sessionStorage.getItem(key);
//         if (!dismissed) {
//           setData(payload);
//           setVisible(true);
//         }
//       }
//     } catch (err) {
//       // ✅ A failed request must never break the UI
//       console.error('[SubscriptionBanner] fetch failed:', err);
//     }
//   }, []);

//   useEffect(() => {
//     fetchStatus();
//   }, [fetchStatus]);

//   const handleClose = () => {
//     if (data?.level) {
//       sessionStorage.setItem(buildDismissKey(data.level), '1');
//     }
//     setVisible(false);
//   };

//   useEffect(() => {
//     if (!visible) return;
//     const onKey = (e) => {
//       if (e.key === 'Escape') handleClose();
//     };
//     window.addEventListener('keydown', onKey);
//     return () => window.removeEventListener('keydown', onKey);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [visible]);

//   if (!visible || !data) return null;

//   const style = LEVEL_STYLES[data.level] || LEVEL_STYLES.info;
//   const tz = data.timezone || 'UTC';

//   // Build the localized message from raw numbers sent by the backend.
//   // This lets i18next pick the correct Arabic/English plural form automatically.
//   let message = '';
//   if (data.level === 'expired') {
//     message =
//       data.graceDaysRemaining > 0
//         ? t('subscriptionBanner.message.expiredWithGrace', { count: data.graceDaysRemaining })
//         : t('subscriptionBanner.message.expiredNoGrace');
//   } else {
//     message =
//       data.daysRemaining === 0
//         ? t('subscriptionBanner.message.expiringToday')
//         : t('subscriptionBanner.message.expiringIn', { count: data.daysRemaining });
//   }

//   return (
//     <div
//       className="sub-banner-overlay"
//       role="dialog"
//       aria-modal="true"
//       aria-labelledby="sub-banner-title"
//     >
//       <div className="sub-banner-modal" style={{ borderTop: `4px solid ${style.color}` }}>
//         <button
//           type="button"
//           className="sub-banner-close"
//           onClick={handleClose}
//           aria-label={t('subscriptionBanner.close')}
//         >
//           &times;
//         </button>

//         <div className="sub-banner-icon" style={{ background: style.bg }}>
//           <span>{style.icon}</span>
//         </div>

//         <h4 id="sub-banner-title" className="sub-banner-title" style={{ color: style.color }}>
//           {t(`subscriptionBanner.title.${data.level}`)}
//         </h4>

//         <p className="sub-banner-message">{message}</p>

//         {data.planName && (
//           <p className="sub-banner-plan">
//             {t('subscriptionBanner.planLabel')}: <strong>{data.planName}</strong>
//           </p>
//         )}

//         {data.level === 'expired' && data.graceUntil && (
//           <p className="sub-banner-sub">
//             {t('subscriptionBanner.graceEndsOn')}:{' '}
//             <strong>{formatDisplayDate(data.graceUntil, tz)}</strong>
//           </p>
//         )}

//         {data.endDate && data.level !== 'expired' && (
//           <p className="sub-banner-sub">
//             {t('subscriptionBanner.expiresOn')}:{' '}
//             <strong>{formatDisplayDate(data.endDate, tz)}</strong>
//           </p>
//         )}

//         <div className="sub-banner-actions">
//           <button type="button" className="sub-banner-btn-ghost" onClick={handleClose}>
//             {t('subscriptionBanner.remindLater')}
//           </button>
//           <a
//             href="/admin/system"
//             className="sub-banner-btn-primary"
//             style={{ background: style.color }}
//           >
//             {t('subscriptionBanner.manage')}
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }









































// // SubscriptionBanner.jsx
// import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";


// import { getSubscriptionBanner } from "../../services/subscription/subscriptionStatus.service";
// import { formatDisplayDate } from "../../helpers/timezone";
// import { isGlobalAdmin } from "../../helpers/auth";

// import "../../style/Subscription/SubscriptionBanner.css";

// const BANNER_CONFIG = {
//   info: {
//     alertClass: "alert-info",
//     icon: "fa-solid fa-circle-info",
//     titleKey: "infoTitle",
//     descriptionKey: "infoDescription",
//   },

//   warning: {
//     alertClass: "alert-warning",
//     icon: "fa-solid fa-triangle-exclamation",
//     titleKey: "warningTitle",
//     descriptionKey: "warningDescription",
//   },

//   critical: {
//     alertClass: "alert-warning",
//     icon: "fa-solid fa-circle-exclamation",
//     titleKey: "criticalTitle",
//     descriptionKey: "criticalDescription",
//   },

//   expired: {
//     alertClass: "alert-danger",
//     icon: "fa-solid fa-circle-xmark",
//     titleKey: "expiredTitle",
//     descriptionKey: "expiredDescription",
//   },
// };


// const DISMISS_PREFIX = "subscription_banner_";

// const buildDismissKey = (level) => {
//   const today = new Date().toISOString().slice(0, 10);
//   return `${DISMISS_PREFIX}${level}_${today}`;
// };

// export default function SubscriptionBanner() {
//   const { t } = useTranslation("subscriptionBanner");

//   const [banner, setBanner] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [dismissed, setDismissed] = useState(false);

//   useEffect(() => {
//     if (!isGlobalAdmin()) {
//       setLoading(false);
//       return;
//     }

//     const loadBanner = async () => {
//       try {
//         const { data } = await getSubscriptionBanner();

//        if (data?.show) {
//   const dismissed = sessionStorage.getItem(
//     buildDismissKey(data.level)
//   );

//   if (!dismissed) {
//     setBanner(data);
//   }
// }
//       } catch (error) {
//         if (import.meta.env.DEV) {
//           console.error("[SubscriptionBanner]", error);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadBanner();
//   }, []);

//     if (loading || dismissed || !banner) {
//     return null;
//   }

//  const config = BANNER_CONFIG[banner.level];

// if (!config) {
//   return null;
// }

//   const expirationDate = banner.endDate
//     ? formatDisplayDate(
//         banner.endDate,
//         banner.timezone
//       )
//     : null;

//   const buildTitle = () => {
//     switch (banner.level) {
//       case "critical":
//         return t(config.titleKey, {
//           when:
//             banner.daysRemaining === 0
//               ? t("today")
//               : t("tomorrow"),
//         });

//       case "expired":
//         return t(config.titleKey);

//       default:
//         return t(config.titleKey, {
//           days: banner.daysRemaining,
//         });
//     }
//   };

//   const buildDescription = () => {
//     if (banner.level === "expired") {
//       return t(config.descriptionKey, {
//         days: banner.graceDaysRemaining,
//       });
//     }

//     return t(config.descriptionKey);
//   };

//   const title = buildTitle();

//   const description = buildDescription();
//     return (
//     <div
//       className={`alert ${config.alertClass} alert-dismissible fade show subscription-banner shadow-sm`}
//       role="alert"
//     >
//       <div className="subscription-banner-content">

        

//           <div className="subscription-banner-icon">

//             <i className={config.icon} aria-hidden="true"></i>

//           </div>

//           <div className="subscription-banner-text">

//             <h6 className="subscription-banner-title mb-1">

//               {banner.planName && (
//                 <>
//                   <span className="subscription-plan-name">
//                     {banner.planName} {t("plan")}
//                   </span>

//                   <span
//                     className="subscription-separator"
//                     aria-hidden="true"
//                   >
//                     •
//                   </span>
//                 </>
//               )}

//               {title}

//             </h6>

//             <p className="subscription-banner-description mb-2">

//               {description}

//             </p>

//             {expirationDate && (
//               <div className="subscription-banner-date">

// <span className="subscription-banner-label">
//   {t("expirationDate")}
// </span>

//                 <span>
//                   {expirationDate}
//                 </span>

//               </div>
//             )}

//           </div>
//    <button
//           type="button"
//           className="btn-close"
//           aria-label={t("dismiss")}
//           title={t("dismiss")}
//           onClick={() => {
//   sessionStorage.setItem(
//     buildDismissKey(banner.level),
//     "1"
//   );

//   setDismissed(true);
// }}
//         />
//         </div>

     

//       </div>
  
//   );
// }


// SubscriptionBanner.jsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { getSubscriptionBanner } from "../../services/subscription/subscriptionStatus.service";
import { formatDisplayDate } from "../../helpers/timezone";
import { isGlobalAdmin } from "../../helpers/auth";

import "../../style/Subscription/SubscriptionBanner.css";

const BANNER_CONFIG = {
  info: {
    cardClass: "sb-info",
    icon: "fa-solid fa-circle-info",
    titleKey: "infoTitle",
    descriptionKey: "infoDescription",
  },

  warning: {
    cardClass: "sb-warning",
    icon: "fa-solid fa-triangle-exclamation",
    titleKey: "warningTitle",
    descriptionKey: "warningDescription",
  },

  critical: {
    cardClass: "sb-critical",
    icon: "fa-solid fa-circle-exclamation",
    titleKey: "criticalTitle",
    descriptionKey: "criticalDescription",
  },

  expired: {
    cardClass: "sb-expired",
    icon: "fa-solid fa-circle-xmark",
    titleKey: "expiredTitle",
    descriptionKey: "expiredDescription",
  },
};

const DISMISS_PREFIX = "subscription_banner_";

const buildDismissKey = (level) => {
  const today = new Date().toISOString().slice(0, 10);
  return `${DISMISS_PREFIX}${level}_${today}`;
};

// Wraps the dynamic fragment of an already-translated string (a day count,
// or "today"/"tomorrow") in a <strong> so the one number/word that matters
// reads first — without touching the translation content itself.
const highlight = (text, needle) => {
  if (needle === undefined || needle === null) return text;
  const value = String(needle);
  const index = text.indexOf(value);
  if (index === -1) return text;

  return (
    <>
      {text.slice(0, index)}
      <strong className="sb-highlight">{value}</strong>
      {text.slice(index + value.length)}
    </>
  );
};

export default function SubscriptionBanner() {
  const { t } = useTranslation("subscriptionBanner");

  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!isGlobalAdmin()) {
      setLoading(false);
      return;
    }

    const loadBanner = async () => {
      try {
        const { data } = await getSubscriptionBanner();

        if (data?.show) {
          const dismissed = sessionStorage.getItem(buildDismissKey(data.level));

          if (!dismissed) {
            setBanner(data);
          }
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("[SubscriptionBanner]", error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadBanner();
  }, []);

  if (loading || dismissed || !banner) {
    return null;
  }

  const config = BANNER_CONFIG[banner.level];

  if (!config) {
    return null;
  }

  const expirationDate = banner.endDate
    ? formatDisplayDate(banner.endDate, banner.timezone)
    : null;

  const buildTitle = () => {
    switch (banner.level) {
      case "critical": {
        const when = banner.daysRemaining === 0 ? t("today") : t("tomorrow");
        return highlight(t(config.titleKey, { when }), when);
      }

      case "expired":
        return t(config.titleKey);

      default:
        return highlight(
          t(config.titleKey, { days: banner.daysRemaining }),
          banner.daysRemaining
        );
    }
  };

  const buildDescription = () => {
    if (banner.level === "expired") {
      return highlight(
        t(config.descriptionKey, { days: banner.graceDaysRemaining }),
        banner.graceDaysRemaining
      );
    }

    return t(config.descriptionKey);
  };

  const title = buildTitle();
  const description = buildDescription();

  return (
    <div className="sb-sticky-zone">
      <div
        className={`sb-card ${config.cardClass}`}
        role="alert"
        aria-live="polite"
      >
        <button
          type="button"
          className="sb-close"
          aria-label={t("dismiss")}
          title={t("dismiss")}
          onClick={() => {
            sessionStorage.setItem(buildDismissKey(banner.level), "1");
            setDismissed(true);
          }}
        >
          <i className="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>

        <div className="sb-row">
          <div className="sb-icon">
            <i className={config.icon} aria-hidden="true"></i>
          </div>

          <div className="sb-body">
            {banner.planName && (
              <span className="sb-plan">
                {banner.planName} {t("plan")}
              </span>
            )}

            <h6 className="sb-title">{title}</h6>
            <p className="sb-description">{description}</p>

            {expirationDate && (
              <div className="sb-date">
                <i className="fa-regular fa-calendar" aria-hidden="true"></i>
                <span className="sb-date-label">{t("expirationDate")}</span>
                <span className="sb-date-value">{expirationDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}