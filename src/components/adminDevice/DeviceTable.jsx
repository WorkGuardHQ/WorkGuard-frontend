// //translation

// import { apiPut, apiDelete } from '../../helpers/api';
// import { useTranslation } from 'react-i18next';

// function DeviceTable({ devices, loading, onUpdated, onToast, onDelete }) {
//   const { t } = useTranslation();

//   if (loading) {
//     return (
//       <div className="alert alert-secondary">
//         {t('common.loading')}
//       </div>
//     );
//   }

//   if (!devices.length) {
//     return (
//       <div className="alert alert-info">
//         {t('devicesAdmin.noDevices')}
//       </div>
//     );
//   }

//   const approve = async (userId, deviceId) => {
//     try {
//       await apiPut(`/users/${userId}/devices/${deviceId}/approve`);
//       onToast(t('devicesAdmin.toastApproved'));
//       onUpdated();
//     } catch {
//       onToast(t('devicesAdmin.toastApproveError'), 'error');
//     }
//   };

//   const toggle = async (userId, deviceId, isActive) => {
//     try {
//       await apiPut(`/users/${userId}/devices/${deviceId}`, { isActive });
//       onToast(
//         isActive
//           ? t('devicesAdmin.toastEnabled')
//           : t('devicesAdmin.toastDisabled'),
//         'warning'
//       );
//       onUpdated();
//     } catch {
//       onToast(t('devicesAdmin.toastToggleError'), 'error');
//     }
//   };

//   const remove = async (userId, deviceId) => {
//     if (!confirm(t('devicesAdmin.confirmDelete'))) return;

//     try {
//       await apiDelete(`/users/${userId}/devices/${deviceId}`);
//       onToast(t('devicesAdmin.toastDeleted'));
//       onUpdated();
//     } catch {
//       onToast(t('devicesAdmin.toastDeleteError'), 'error');
//     }
//   };

//   return (
//     <div className="table-responsive">
//       <table className="table table-bordered align-middle">
//         <thead className="table-light">
//           <tr>
//             <th>{t('devicesAdmin.user')}</th>
//             <th>{t('devicesAdmin.email')}</th>
//             <th>{t('devicesAdmin.device')}</th>
//             <th>{t('devicesAdmin.status')}</th>
//             <th>{t('devicesAdmin.registered')}</th>
//             <th>{t('devicesAdmin.actions')}</th>
//           </tr>
//         </thead>

//         <tbody>
//           {devices.map(d => (
//             <tr key={`${d.userId}-${d.deviceId || Math.random()}`}>
//               <td>{d.userName}</td>
//               <td>{d.userEmail}</td>
//               <td>{d.userAgent || t('devicesAdmin.unknown')}</td>

//               <td>
//                 <span
//                   className={`badge ${
//                     d.status === 'pending'
//                       ? 'bg-warning'
//                       : d.status === 'approved'
//                       ? 'bg-success'
//                       : 'bg-secondary'
//                   }`}
//                 >
//                   {t(`devicesAdmin.status_${d.status}`)}
//                 </span>
//               </td>

//               <td>
//                 {new Date(d.registeredAt).toLocaleString()}
//               </td>

//               <td className="d-flex gap-2">
//                 {d.status === 'pending' && (
//                   <button
//                     className="btn btn-sm btn-success"
//                     onClick={() => approve(d.userId, d.deviceId)}
//                   >
//                     {t('devicesAdmin.approve')}
//                   </button>
//                 )}

//                 {d.status === 'approved' && (
//                   <button
//                     className="btn btn-sm btn-warning"
//                     onClick={() => toggle(d.userId, d.deviceId, false)}
//                   >
//                     {t('devicesAdmin.disable')}
//                   </button>
//                 )}

//                 {d.status === 'disabled' && (
//                   <button
//                     className="btn btn-sm btn-success"
//                     onClick={() => toggle(d.userId, d.deviceId, true)}
//                   >
//                     {t('devicesAdmin.enable')}
//                   </button>
//                 )}

//                 <button
//                   className="btn btn-sm btn-danger"
//                   onClick={() => onDelete(d.userId, d.deviceId)}
//                 >
//                   {t('devicesAdmin.delete')}
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default DeviceTable;


// components/adminDevice/DeviceTable.jsx
import {
  approveUserDevice,
  removeUserDevice,
  toggleDeviceStatus
} from '../../services/device.api';
import { useTranslation } from 'react-i18next';

import {
  formatDisplayDate,
  formatDisplayTime
} from '../../helpers/timezone';

import '../../style/DeviceTable.css';

function DeviceTable({ devices, loading, onUpdated, onToast, onDelete ,timezone = 'UTC'}) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="table-empty-state loading-state">
        <div className="empty-icon-circle">
          <i className="fas fa-spinner fa-spin"></i>
        </div>
        <p className="empty-message">{t('common.loading')}</p>
      </div>
    );
  }

  if (!devices.length) {
    return (
      <div className="table-empty-state no-data-state">
        <div className="empty-icon-circle">
          <i className="fas fa-inbox"></i>
        </div>
        <h5 className="empty-title">{t('devicesAdmin.noDevices')}</h5>
        <p className="empty-subtitle">No devices match your current filters</p>
      </div>
    );
  }

  const approve = async (userId, deviceId) => {
    try {
      await approveUserDevice(userId, deviceId);
      onToast(t('devicesAdmin.toastApproved'));
      onUpdated();
    } catch {
      onToast(t('devicesAdmin.toastApproveError'), 'error');
    }
  };

  const toggle = async (userId, deviceId, isActive) => {
    try {
      await toggleDeviceStatus(userId, deviceId, { isActive });
      onToast(
        isActive ? t('devicesAdmin.toastEnabled') : t('devicesAdmin.toastDisabled'),
        'warning'
      );
      onUpdated();
    } catch {
      onToast(t('devicesAdmin.toastToggleError'), 'error');
    }
  };

  const getDeviceIcon = (userAgent) => {
    if (!userAgent) return 'fa-laptop';
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone'))
      return 'fa-mobile-alt';
    if (ua.includes('tablet') || ua.includes('ipad'))
      return 'fa-tablet-alt';
    return 'fa-laptop';
  };

  const formatUserAgent = (userAgent) => {
    if (!userAgent) return t('devicesAdmin.unknown');
    const parts = userAgent.split(')')[0];
    return parts ? parts + ')' : userAgent.substring(0, 50);
  };

  return (
    <div className="device-table-wrapper">
      {/* ── Desktop Table ── */}
      <div className="table-responsive desktop-table">
        <table className="device-table">
          <thead>
            <tr>
              <th><i className="fas fa-user me-2"></i>{t('devicesAdmin.user')}</th>
              <th><i className="fas fa-envelope me-2"></i>{t('devicesAdmin.email')}</th>
              <th><i className="fas fa-laptop me-2"></i>{t('devicesAdmin.device')}</th>
              <th><i className="fas fa-info-circle me-2"></i>{t('devicesAdmin.status')}</th>
              <th><i className="fas fa-calendar me-2"></i>{t('devicesAdmin.registered')}</th>
              <th><i className="fas fa-cog me-2"></i>{t('devicesAdmin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((d, index) => (
              <tr key={`${d.userId}-${d.deviceId}`} style={{ animationDelay: `${index * 0.05}s` }}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">
                      {d.userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="user-name">{d.userName}</span>
                  </div>
                </td>
                <td><span className="user-email">{d.userEmail}</span></td>
                <td>
                  <div className="device-cell">
                    <i className={`fas ${getDeviceIcon(d.userAgent)} device-icon`}></i>
                    <span className="device-name">{formatUserAgent(d.userAgent)}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge status-${d.status}`}>
                    <span className="status-dot"></span>
                    {t(`devicesAdmin.status_${d.status}`)}
                  </span>
                </td>
                <td>
                  <div className="date-cell">
                    <i className="far fa-clock me-1"></i>
                   {formatDisplayDate(
  d.registeredAt,
  timezone
)}
                    <br />
                    <small className="time-text">
                   {formatDisplayTime(
  d.registeredAt,
  timezone
)}
                    </small>
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    {d.status === 'pending' && (
                      <button
                        className="action-btn approve-btn"
                        onClick={() => approve(d.userId, d.deviceId)}
                        title={t('devicesAdmin.approve')}
                      >
                        <i className="fas fa-check"></i>
                      </button>
                    )}
                    {d.status === 'approved' && (
                      <button
                        className="action-btn disable-btn"
                        onClick={() => toggle(d.userId, d.deviceId, false)}
                        title={t('devicesAdmin.disable')}
                      >
                        <i className="fas fa-pause"></i>
                      </button>
                    )}
                    {d.status === 'disabled' && (
                      <button
                        className="action-btn enable-btn"
                        onClick={() => toggle(d.userId, d.deviceId, true)}
                        title={t('devicesAdmin.enable')}
                      >
                        <i className="fas fa-play"></i>
                      </button>
                    )}
                    {/* ✅ دايماً onDelete – بيمر بالـ confirm toast */}
                    <button
                      className="action-btn delete-btn"
                      onClick={() => onDelete(d.userId, d.deviceId)}
                      title={t('devicesAdmin.delete')}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="mobile-cards">
        {devices.map((d, index) => (
          <div
            key={`${d.userId}-${d.deviceId}`}
            className="device-card-mobile"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="card-header-mobile">
              <div className="user-info-mobile">
                <div className="user-avatar-mobile">
                  {d.userName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="user-details-mobile">
                  <div className="user-name-mobile">{d.userName}</div>
                  <div className="user-email-mobile">{d.userEmail}</div>
                </div>
              </div>
              <span className={`status-badge-mobile status-${d.status}`}>
                <span className="status-dot"></span>
                {t(`devicesAdmin.status_${d.status}`)}
              </span>
            </div>

            <div className="card-body-mobile">
              <div className="info-row-mobile">
                <i className={`fas ${getDeviceIcon(d.userAgent)} info-icon`}></i>
                <div className="info-content">
                  <div className="info-label">Device</div>
                  <div className="info-value">{formatUserAgent(d.userAgent)}</div>
                </div>
              </div>
              <div className="info-row-mobile">
                <i className="far fa-calendar info-icon"></i>
                <div className="info-content">
                  <div className="info-label">Registered</div>
                  <div className="info-value">
                   <>
  {formatDisplayDate(
    d.registeredAt,
    timezone
  )}

  {' • '}

  {formatDisplayTime(
    d.registeredAt,
    timezone
  )}
</>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-actions-mobile">
              {d.status === 'pending' && (
                <button
                  className="action-btn-mobile approve-btn"
                  onClick={() => approve(d.userId, d.deviceId)}
                >
                  <i className="fas fa-check me-2"></i>
                  {t('devicesAdmin.approve')}
                </button>
              )}
              {d.status === 'approved' && (
                <button
                  className="action-btn-mobile disable-btn"
                  onClick={() => toggle(d.userId, d.deviceId, false)}
                >
                  <i className="fas fa-pause me-2"></i>
                  {t('devicesAdmin.disable')}
                </button>
              )}
              {d.status === 'disabled' && (
                <button
                  className="action-btn-mobile enable-btn"
                  onClick={() => toggle(d.userId, d.deviceId, true)}
                >
                  <i className="fas fa-play me-2"></i>
                  {t('devicesAdmin.enable')}
                </button>
              )}
              {/* ✅ FIX: كان بيستخدم remove (بدون confirm) — دلوقتي onDelete */}
              <button
                className="action-btn-mobile delete-btn"
                onClick={() => onDelete(d.userId, d.deviceId)}
              >
                <i className="fas fa-trash me-2"></i>
                {t('devicesAdmin.delete')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeviceTable;

// import { apiPut, apiDelete ,apiPatch} from '../../helpers/api';

// import {
//   approveUserDevice,
//   removeUserDevice,
//   toggleDeviceStatus
// } from '../../services/device.api';


// import { useTranslation } from 'react-i18next';
// import '../../style/DeviceTable.css';

// function DeviceTable({ devices, loading, onUpdated, onToast, onDelete }) {
//   const { t } = useTranslation();

//   const remove = async (userId, deviceId) => {
//   try {
//     await removeUserDevice(userId, deviceId);
//     onToast(t('devicesAdmin.toastDeleted'));
//     onUpdated();
//   } catch {
//     onToast(t('devicesAdmin.toastDeleteError'), 'error');
//   }
// };

//   if (loading) {
//     return (
//       <div className="table-empty-state loading-state">
//         <div className="empty-icon-circle">
//           <i className="fas fa-spinner fa-spin"></i>
//         </div>
//         <p className="empty-message">{t('common.loading')}</p>
//       </div>
//     );
//   }

//   if (!devices.length) {
//     return (
//       <div className="table-empty-state no-data-state">
//         <div className="empty-icon-circle">
//           <i className="fas fa-inbox"></i>
//         </div>
//         <h5 className="empty-title">{t('devicesAdmin.noDevices')}</h5>
//         <p className="empty-subtitle">No devices match your current filters</p>
//       </div>
//     );
//   }

//  const approve = async (userId, deviceId) => {
//   try {
//     await approveUserDevice(userId, deviceId);
//       onToast(t('devicesAdmin.toastApproved'));
//       onUpdated();
//     } catch {
//       onToast(t('devicesAdmin.toastApproveError'), 'error');
//     }
//   };

//   const toggle = async (userId, deviceId, isActive) => {
//     try {
//       await toggleDeviceStatus(userId, deviceId, { isActive });
//       onToast(
//         isActive
//           ? t('devicesAdmin.toastEnabled')
//           : t('devicesAdmin.toastDisabled'),
//         'warning'
//       );
//       onUpdated();
//     } catch {
//       onToast(t('devicesAdmin.toastToggleError'), 'error');
//     }
//   };

//   const getDeviceIcon = (userAgent) => {
//     if (!userAgent) return 'fa-laptop';
//     const ua = userAgent.toLowerCase();
//     if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
//       return 'fa-mobile-alt';
//     }
//     if (ua.includes('tablet') || ua.includes('ipad')) {
//       return 'fa-tablet-alt';
//     }
//     return 'fa-laptop';
//   };

//   const formatUserAgent = (userAgent) => {
//     if (!userAgent) return t('devicesAdmin.unknown');
//     const parts = userAgent.split(')')[0];
//     return parts ? parts + ')' : userAgent.substring(0, 50);
//   };

//   return (
//     <div className="device-table-wrapper">
//       {/* Desktop Table View */}
//       <div className="table-responsive desktop-table">
//         <table className="device-table">
//           <thead>
//             <tr>
//               <th>
//                 <i className="fas fa-user me-2"></i>
//                 {t('devicesAdmin.user')}
//               </th>
//               <th>
//                 <i className="fas fa-envelope me-2"></i>
//                 {t('devicesAdmin.email')}
//               </th>
//               <th>
//                 <i className="fas fa-laptop me-2"></i>
//                 {t('devicesAdmin.device')}
//               </th>
//               <th>
//                 <i className="fas fa-info-circle me-2"></i>
//                 {t('devicesAdmin.status')}
//               </th>
//               <th>
//                 <i className="fas fa-calendar me-2"></i>
//                 {t('devicesAdmin.registered')}
//               </th>
//               <th>
//                 <i className="fas fa-cog me-2"></i>
//                 {t('devicesAdmin.actions')}
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {devices.map((d, index) => (
//               <tr
//               //  key={`${d.userId}-${d.deviceId || Math.random()}`}
//                key={`${d.userId}-${d.deviceId}`}
//                style={{ animationDelay: `${index * 0.05}s` }}>
//                 <td>
//                   <div className="user-cell">
//                     <div className="user-avatar">
//                       {d.userName?.charAt(0).toUpperCase() || 'U'}
//                     </div>
//                     <span className="user-name">{d.userName}</span>
//                   </div>
//                 </td>
//                 <td>
//                   <span className="user-email">{d.userEmail}</span>
//                 </td>
//                 <td>
//                   <div className="device-cell">
//                     <i className={`fas ${getDeviceIcon(d.userAgent)} device-icon`}></i>
//                     <span className="device-name">{formatUserAgent(d.userAgent)}</span>
//                   </div>
//                 </td>
//                 <td>
//                   <span className={`status-badge status-${d.status}`}>
//                     <span className="status-dot"></span>
//                     {t(`devicesAdmin.status_${d.status}`)}
//                   </span>
//                 </td>
//                 <td>
//                   <div className="date-cell">
//                     <i className="far fa-clock me-1"></i>
//                     {new Date(d.registeredAt).toLocaleDateString('en-US', {
//                       month: 'short',
//                       day: 'numeric',
//                       year: 'numeric'
//                     })}
//                     <br />
//                     <small className="time-text">
//                       {new Date(d.registeredAt).toLocaleTimeString('en-US', {
//                         hour: '2-digit',
//                         minute: '2-digit'
//                       })}
//                     </small>
//                   </div>
//                 </td>
//                 <td>
//                   <div className="action-buttons">
//                     {d.status === 'pending' && (
//                       <button
//                         className="action-btn approve-btn"
//                         onClick={() => approve(d.userId, d.deviceId)}
//                         title={t('devicesAdmin.approve')}
//                       >
//                         <i className="fas fa-check"></i>
//                         {/* <span className="btn-text">{t('devicesAdmin.approve')}</span> */}
//                       </button>
//                     )}

//                     {d.status === 'approved' && (
//                       <button
//                         className="action-btn disable-btn"
//                         onClick={() => toggle(d.userId, d.deviceId, false)}
//                         title={t('devicesAdmin.disable')}
//                       >
//                         <i className="fas fa-pause"></i>
//                         {/* <span className="btn-text">{t('devicesAdmin.disable')}</span> */}
//                       </button>
//                     )}

//                     {d.status === 'disabled' && (
//                       <button
//                         className="action-btn enable-btn"
//                         onClick={() => toggle(d.userId, d.deviceId, true)}
//                         title={t('devicesAdmin.enable')}
//                       >
//                         <i className="fas fa-play"></i>
//                         {/* <span className="btn-text">{t('devicesAdmin.enable')}</span> */}
//                       </button>
//                     )}

//                     <button
//                       className="action-btn delete-btn"
//                     onClick={() => onDelete(d.userId, d.deviceId)}

//                       title={t('devicesAdmin.delete')}
//                     >
//                       <i className="fas fa-trash"></i>
//                       {/* <span className="btn-text">{t('devicesAdmin.delete')}</span> */}
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile Card View */}
//       <div className="mobile-cards">
//         {devices.map((d, index) => (
//           <div 
//             // key={`${d.userId}-${d.deviceId || Math.random()}`}
//             key={`${d.userId}-${d.deviceId}`}

//             className="device-card-mobile"
//             style={{ animationDelay: `${index * 0.1}s` }}
//           >
//             <div className="card-header-mobile">
//               <div className="user-info-mobile">
//                 <div className="user-avatar-mobile">
//                   {d.userName?.charAt(0).toUpperCase() || 'U'}
//                 </div>
//                 <div className="user-details-mobile">
//                   <div className="user-name-mobile">{d.userName}</div>
//                   <div className="user-email-mobile">{d.userEmail}</div>
//                 </div>
//               </div>
//               <span className={`status-badge-mobile status-${d.status}`}>
//                 <span className="status-dot"></span>
//                 {t(`devicesAdmin.status_${d.status}`)}
//               </span>
//             </div>

//             <div className="card-body-mobile">
//               <div className="info-row-mobile">
//                 <i className={`fas ${getDeviceIcon(d.userAgent)} info-icon`}></i>
//                 <div className="info-content">
//                   <div className="info-label">Device</div>
//                   <div className="info-value">{formatUserAgent(d.userAgent)}</div>
//                 </div>
//               </div>

//               <div className="info-row-mobile">
//                 <i className="far fa-calendar info-icon"></i>
//                 <div className="info-content">
//                   <div className="info-label">Registered</div>
//                   <div className="info-value">
//                     {new Date(d.registeredAt).toLocaleDateString('en-US', {
//                       month: 'short',
//                       day: 'numeric',
//                       year: 'numeric',
//                       hour: '2-digit',
//                       minute: '2-digit'
//                     })}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="card-actions-mobile">
//               {d.status === 'pending' && (
//                 <button
//                   className="action-btn-mobile approve-btn"
//                   onClick={() => approve(d.userId, d.deviceId)}
//                 >
//                   <i className="fas fa-check me-2"></i>
//                   {t('devicesAdmin.approve')}
//                 </button>
//               )}

//               {d.status === 'approved' && (
//                 <button
//                   className="action-btn-mobile disable-btn"
//                   onClick={() => toggle(d.userId, d.deviceId, false)}
//                 >
//                   <i className="fas fa-pause me-2"></i>
//                   {t('devicesAdmin.disable')}
//                 </button>
//               )}

//               {d.status === 'disabled' && (
//                 <button
//                   className="action-btn-mobile enable-btn"
//                   onClick={() => toggle(d.userId, d.deviceId, true)}
//                 >
//                   <i className="fas fa-play me-2"></i>
//                   {t('devicesAdmin.enable')}
//                 </button>
//               )}

//               <button
//                 className="action-btn-mobile delete-btn"
//                 onClick={() => remove(d.userId, d.deviceId)}
//               >
//                 <i className="fas fa-trash me-2"></i>
//                 {t('devicesAdmin.delete')}
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default DeviceTable;