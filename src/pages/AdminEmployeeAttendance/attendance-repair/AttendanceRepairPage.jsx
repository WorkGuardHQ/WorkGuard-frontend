// // AttendanceRepairPage.jsx

// import { useMemo } from 'react';
// import { useTranslation } from 'react-i18next';

// import RecalculateDayCard from './RecalculateDayCard';
// import CloseOpenAttendancesCard from './CloseOpenAttendancesCard';
// import '../../../style/AttendanceRepair.css';

// const AttendanceRepairPage = ({
//   users = [],
//   branches = [],
//   departments = [],
//   openAttendances = [],
//   tenantTimezone = 'UTC'
// }) => {

//   const { t } = useTranslation('attendanceRepair');

//   const pageNotes = useMemo(() => ([
//     t('notes.note1'),
//     t('notes.note2'),
//     t('notes.note3'),
//     t('notes.note4')
//   ]), [t]);

//   return (
//     <div className="container-fluid py-4">

//       {/* Header */}
//       <div className="repair-page-header mb-4">

//         <div>

//           <h2 className="repair-page-title">

//             <i className="fas fa-tools me-2" />

//             {t('page.title')}

//           </h2>

//           <p className="repair-page-subtitle">

//             {t('page.subtitle')}

//           </p>

//         </div>

//         <div className="repair-page-timezone">

//           <i className="fas fa-globe me-2" />

//           {tenantTimezone}

//         </div>

//       </div>

//       {/* Notes */}
//       <div className="repair-notes-card mb-4">

//         <div className="repair-notes-title">

//           <i className="fas fa-shield-alt me-2" />

//           {t('notes.title')}

//         </div>

//         <ul className="repair-notes-list">

//           {pageNotes.map((note, idx) => (
//             <li key={idx}>
//               {note}
//             </li>
//           ))}

//         </ul>

//       </div>

//       {/* Cards */}
//       <div className="row g-4">

//         {/* Recalculate */}
//         <div className="col-12">

//           <RecalculateDayCard
//             users={users}
//             branches={branches}
//             departments={departments}
//             tenantTimezone={tenantTimezone}
//           />

//         </div>

//         {/* Close Open */}
//         <div className="col-12">

//           <CloseOpenAttendancesCard
//             users={users}
//             branches={branches}
//             departments={departments}
//             openAttendances={openAttendances}
//             tenantTimezone={tenantTimezone}
//           />

//         </div>

//       </div>

//     </div>
//   );
// };

// export default AttendanceRepairPage;


import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate }    from 'react-router-dom';
import RecalculateDayCard       from './RecalculateDayCard';
import CloseOpenAttendancesCard from './CloseOpenAttendancesCard';
import '../../../style/AttendanceRepair.css';

export default function AttendanceRepairPage() {
  const { t, i18n } = useTranslation('attendanceRepair');
  const navigate     = useNavigate();
  const isRTL        = i18n.language === 'ar';

  const pageNotes = useMemo(() => [
    t('notes.note1'),
    t('notes.note2'),
    t('notes.note3'),
    t('notes.note4'),

      t('notes.attendanceAutomationNote1'),
  t('notes.attendanceAutomationNote2'),
  t('notes.attendanceAutomationNote3')

  ].filter(Boolean), [t]);

  return (
    <div className="repair-page" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* Header */}
      <div className="repair-page-header">
        <button className="repair-back-btn" onClick={() => navigate(-1)}>
          <i className={`fas fa-chevron-${isRTL ? 'right' : 'left'}`} />
        </button>
        <div>
          <h2><i className="fas fa-tools" /> {t('page.title')}</h2>
          <p className="repair-page-subtitle">{t('page.subtitle')}</p>
        </div>
      </div>

      {/* Notes */}
      <div className="repair-notes-card">
        <div className="repair-notes-title">
          <i className="fas fa-shield-alt" />
          {t('notes.title')}
        </div>
        <ul className="repair-notes-list">
          {pageNotes.map((note, idx) => (
            <li key={idx}>{note}</li>
          ))}
        </ul>
      </div>

<div className="repair-warning-banner">
  
  {t('notes.warning')}
</div>
      {/* Cards */}
      <div className="repair-grid">
        <RecalculateDayCard />
        <CloseOpenAttendancesCard />
      </div>

    </div>
  );
}