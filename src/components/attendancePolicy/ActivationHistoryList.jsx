// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { getAttendancePolicyActivationHistory } from '../../services/attendancePolicy.api';

// const ActivationHistoryList = ({ policyId }) => {
//   const { t } = useTranslation();

//   const [history, setHistory] = useState([]);
//   const [meta, setMeta] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);

//   const loadHistory = async () => {
//     try {
//       setLoading(true);
//       const res = await getAttendancePolicyActivationHistory(policyId, {
//         page,
//         limit: 5
//       });

//     setHistory(res.data.data || []);
// setMeta(res.data.meta);

//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadHistory();
//   }, [page]);

//   if (loading) {
//     return <div className="text-muted small">{t('common.loading')}</div>;
//   }

//   if (!history.length) {
//     return (
//       <div className="text-muted small">
//         {t('attendancePolicy.noHistory')}
//       </div>
//     );
//   }

//   return (
//     <div className="activation-history">
//       <ul className="list-group list-group-flush">
//         {history.map((h, i) => (
//           <li key={i} className="list-group-item small d-flex justify-content-between">
//             <span>
//               <i
//                 className={`fas me-2 ${
//                   h.active ? 'fa-toggle-on text-success' : 'fa-toggle-off text-danger'
//                 }`}
//               />
//               {h.active
//                 ? t('attendancePolicy.activated')
//                 : t('attendancePolicy.deactivated')}
//             </span>

//             <span className="text-muted">
//               {new Date(h.changedAt).toLocaleString()}
//             </span>
//           </li>
//         ))}
//       </ul>

//       {/* Pagination */}
//       {meta?.totalPages > 1 && (
//         <div className="d-flex justify-content-end gap-2 mt-2">
//           <button
//             className="btn btn-sm btn-outline-secondary"
//             disabled={page === 1}
//             onClick={() => setPage(p => p - 1)}
//           >
//             {t('common.prev')}
//           </button>

//           <button
//             className="btn btn-sm btn-outline-secondary"
//             disabled={page === meta.totalPages}
//             onClick={() => setPage(p => p + 1)}
//           >
//             {t('common.next')}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ActivationHistoryList;

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAttendancePolicyActivationHistory } from '../../services/attendancePolicy.api';
import { formatDisplayDate } from '../../helpers/timezone';

const ActivationHistoryList = ({ policyId , timezone }) => {
  const { t } = useTranslation();

  const [history, setHistory] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await getAttendancePolicyActivationHistory(policyId, {
        page,
        limit: 5
      });

      setHistory(res.data.data || []);
      setMeta(res.data.meta);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [page]);

  if (loading) {
    return <div className="text-muted small">{t('common.loading')}</div>;
  }

  if (!history.length) {
    return (
      <div className="text-muted small">
        {t('attendancePolicy.noHistory')}
      </div>
    );
  }

  return (
    <div className="activation-history">
      <ul className="list-group list-group-flush">
        {history.map((h, i) => (
          <li
            key={i}
            className="list-group-item small d-flex justify-content-between"
          >
            <span>
              <i
                className={`fas me-2 ${
                  h.active
                    ? 'fa-toggle-on text-success'
                    : 'fa-toggle-off text-danger'
                }`}
              />
              {h.active
                ? t('attendancePolicy.activated')
                : t('attendancePolicy.deactivated')}
            </span>

        <span className="text-muted">
  {formatDisplayDate(h.changedAt, timezone)} ({timezone})
</span>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      {meta?.totalPages > 1 && (
        <div className="d-flex justify-content-end gap-2 mt-2">
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            {t('common.prev')}
          </button>

          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page === meta.totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            {t('common.next')}
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivationHistoryList;

