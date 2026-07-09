// import i18n from "i18next";
// import { initReactI18next } from "react-i18next";
// import ar from "./locales/ar/translation.json";
// import en from "./locales/en/translation.json";

// i18n
//   .use(initReactI18next)
//   .init({
//     resources: {
//       ar: { translation: ar },
//       en: { translation: en }
//     },
//     lng: "en",
//     fallbackLng: "en",
//     interpolation: { escapeValue: false }
//   });
//   //اتجاه النص
// // i18n.on('languageChanged', (lng) => {
// //   document.documentElement.setAttribute('dir', lng === 'ar' ? 'rtl' : 'ltr');
// //   document.documentElement.setAttribute('lang', lng);
// // });
// export default i18n;


import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ar from "./locales/ar/translation.json";
import en from "./locales/en/translation.json";

import arOvertimePolicy from "./locales/ar/overtimePolicy.json";
import enOvertimePolicy from "./locales/en/overtimePolicy.json";
import arBonusPolicy from "./locales/ar/bonusPolicy.json";
import enBonusPolicy from "./locales/en/bonusPolicy.json";
import arovertimeEntry from "./locales/ar/overtimeEntry.json";
import enovertimeEntry from "./locales/en/overtimeEntry.json";
import enAttendance from './locales/en/enAttendance.json';
import arAttendance from './locales/ar/arAttendance.json';

import enCompanyReport from './locales/en/companyReport.json';


import arCompanyReport from './locales/ar/companyReport.json';

import entenantEmail from './locales/en/tenantEmail.json'

import artenantEmail from './locales/ar/tenantEmail.json'

import enPayroll from './locales/en/Payroll.json';

import arPayroll from './locales/ar/Payroll.json';

import leaveEn from './locales/en/leave.json';

import leaveAr from './locales/ar/leave.json';

import AddemployeeEn from './locales/en/Addemployee.json';

import AddemployeeAr from './locales/ar/Addemployee.json';

import EditEmployeeEn from './locales/en/EditEmployee.json';

import EditEmployeeAr from './locales/ar/EditEmployee.json';

import enDashboard from './locales/en/Dashboard.json';

import arDashboard from './locales/ar/Dashboard.json';

import enattendanceRepair from './locales/en/attendanceRepair.json';

import arattendanceRepair from './locales/ar/attendanceRepair.json';


import ardepartment from './locales/ar/ardepartment.json';
import endepartment from './locales/en/endepartment.json';

import arsubscriptionBanner from './locales/ar/subscriptionBanner.json';
import ensubscriptionBanner from './locales/en/subscriptionBanner.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: {
        translation: ar,
        overtimePolicy: arOvertimePolicy,
        bonusPolicy: arBonusPolicy,
        overtimeEntry: arovertimeEntry,
        attendance: arAttendance,
        companyReport: arCompanyReport,
         tenantEmail: artenantEmail,
        Payroll: arPayroll,
        leave : leaveAr,
        Addemployee : AddemployeeAr,
        EditEmployee :EditEmployeeAr,
        Dashboard : arDashboard,
        attendanceRepair: arattendanceRepair,
        department: ardepartment,
        subscriptionBanner:arsubscriptionBanner,
      },
      en: {
        translation: en,
        overtimePolicy: enOvertimePolicy,
        bonusPolicy: enBonusPolicy,
        overtimeEntry: enovertimeEntry,
        attendance: enAttendance,
        companyReport: enCompanyReport,
        tenantEmail: entenantEmail,
         Payroll: enPayroll,
         leave : leaveEn,
         Addemployee :AddemployeeEn,
         EditEmployee :EditEmployeeEn,
         Dashboard : enDashboard,
          attendanceRepair: enattendanceRepair,
          department: endepartment,
          subscriptionBanner:ensubscriptionBanner,
      }
    },

    lng: "en",
    fallbackLng: "en",

    ns: ["translation", "overtimePolicy", "bonusPolicy","leave" ,"Addemployee","EditEmployee","Dashboard","attendanceRepair","department","overtimeEntry","attendance","companyReport","tenantEmail","Payroll","subscriptionBanner"],   
    defaultNS: "translation",

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;