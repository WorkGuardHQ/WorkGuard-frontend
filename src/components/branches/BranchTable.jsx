// import React, { useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import { useTranslation } from 'react-i18next';
// import L from 'leaflet';

// const branchIcon = new L.Icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
//   iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// const checkInIcon = new L.Icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
//   iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// const checkOutIcon = new L.Icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
//   iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// const BranchTable = ({ branches, attendanceData, onEdit, onDelete, onToggleEmergency }) => {
//   const { t } = useTranslation();
//   const [branchSearch, setBranchSearch] = useState('');

//   const filteredBranches = branches.filter((branch) =>
//     branch.name?.toLowerCase().includes(branchSearch.toLowerCase())
//   );

//   return (
//     <div className="modern-card">
//       <div className="modern-card-header">
//         <h5>
//           <i className="fas fa-list-ul"></i>
//           {t('adminBranches.branchList')}
//           <span className="badge-modern badge-success ms-2">
//             {filteredBranches.length} {t('Branches')}
//           </span>
//         </h5>
//       </div>
//       <div className="modern-card-body">
//         {/* Search Bar */}
//         <div className="form-group-modern mb-modern">
//           <label className="form-label-modern">
//             <i className="fas fa-search"></i>
//             {t('adminBranches.searchByName') || 'ابحث باسم الفرع'}
//           </label>
//           <input
//             type="text"
//             className="form-control-modern"
//             placeholder={t('Example: Nasr City Branch')}
//             value={branchSearch}
//             onChange={(e) => setBranchSearch(e.target.value)}
//           />
//         </div>

//         {/* Table */}
//         <div class="table-responsive-wrapper">
//         <div className="table">
//           <table className="table-modern">
//             <thead>
//               <tr>
//                 <th>{t('adminBranches.branchName')}</th>
//                 <th>{t('adminBranches.latitude')}</th>
//                 <th>{t('adminBranches.longitude')}</th>
//                 <th>{t('adminBranches.radius')}</th>
//                 <th>{t('adminBranches.allowedIPs')}</th>
//                 <th>{t('adminBranches.transitThresholdMinutes') || 'وقت المواصلات'}</th>
//                 <th>{t('adminBranches.actions')}</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredBranches.map((branch) => {
//                 const attendance = attendanceData[branch._id] || [];
//                 const hasLocation =
//                   branch.location &&
//                   typeof branch.location.lat === 'number' &&
//                   typeof branch.location.lng === 'number';

//                 return (
//                   <React.Fragment key={branch._id}>
//                     {/* Main Branch Row */}
//                     <tr>
//                       <td>
//                         <strong>{branch.name}</strong>
//                       </td>
//                       <td>{branch.location.lat}</td>
//                       <td>{branch.location.lng}</td>
//                       <td>
//                         {branch.radius} {t('m')}
//                       </td>
//                       <td>
//                         {branch.allowedIPs?.length > 0 ? (
//                           <span className="badge-modern badge-default">
//                             {branch.allowedIPs.length} IPs
//                           </span>
//                         ) : (
//                           <span className="text-muted-modern">{t('adminBranches.none')}</span>
//                         )}
//                       </td>
//                       <td>
//                         {typeof branch.transitThresholdMinutes === 'number' ? (
//                           <span className="badge-modern badge-success">
//                             {branch.transitThresholdMinutes} {t('adminBranches.minutes') || 'دقيقة'}
//                           </span>
//                         ) : (
//                           <span className="badge-modern badge-default">
//                             {t('adminBranches.defaultTransit') || 'افتراضي'}
//                           </span>
//                         )}
//                       </td>
//                       <td>
//                         <div className="d-flex gap-1">
//                           <button
//                             className="btn-info-modern btn-modern btn-sm-modern"
//                             onClick={() => onEdit(branch)}
//                             title={t('adminBranches.editBranch')}
//                           >
//                             <i className="fas fa-edit"></i>
//                           </button>
//                           <button
//                             className="btn-danger-modern btn-modern btn-sm-modern"
//                             onClick={() => onDelete(branch)}
//                             title={t('adminBranches.delete')}
//                           >
//                             <i className="fas fa-trash-alt"></i>
//                           </button>
//                           <button
//                             className={`btn-modern btn-sm-modern ${
//                               branch.allowRemoteCheckin ? 'btn-warning-modern' : 'btn-success-modern'
//                             }`}
//                             onClick={() => onToggleEmergency(branch._id, !branch.allowRemoteCheckin)}
//                             title={
//                               branch.allowRemoteCheckin
//                                 ? t('adminBranches.emergencyOn')
//                                 : t('adminBranches.emergencyOff')
//                             }
//                           >
//                             <i
//                               className={`fas ${
//                                 branch.allowRemoteCheckin ? 'fa-exclamation-triangle' : 'fa-shield-alt'
//                               }`}
//                             ></i>
//                           </button>
//                         </div>
//                       </td>
//                     </tr>

//                     {/* Map Row */}
//                     <tr className="branch-map-row">
//                       <td colSpan={7}>
//                         <div className="mini-map-wrapper">
//                           <div className="mini-map-header">
//                             <span className="mini-map-title">
//                               <i className="fas fa-map-marked-alt"></i>
//                               {t('adminBranches.attendanceMap')} - {branch.name}
//                             </span>
//                             <span className="mini-map-badge">
//                               {attendance.length > 0
//                                 ? `${attendance.length} ${t('adminBranches.records') || 'سجل'}`
//                                 : t('adminBranches.noData')}
//                             </span>
//                           </div>

//                           {hasLocation ? (
//                             <div className="map-container-modern">
//                               <MapContainer
//                                 center={[branch.location.lat, branch.location.lng]}
//                                 zoom={13}
//                                 style={{ height: '250px', width: '100%' }}
//                                 scrollWheelZoom={false}
//                               >
//                                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//                                 {/* Branch Marker */}
//                                 <Marker
//                                   position={[branch.location.lat, branch.location.lng]}
//                                   icon={branchIcon}
//                                 >
//                                   <Popup>
//                                     <strong>{t('adminBranches.branchLocation')}</strong>
//                                     <br />
//                                     {branch.name}
//                                   </Popup>
//                                 </Marker>

//                                 {/* Attendance Markers */}
//                                 {attendance.map((record) => (
//                                   <React.Fragment key={record._id}>
//                                     {record.locationIn && (
//                                       <Marker
//                                         position={[record.locationIn.lat, record.locationIn.lng]}
//                                         icon={checkInIcon}
//                                       >
//                                         <Popup>
//                                           <strong>{t('adminBranches.user')}:</strong>{' '}
//                                           {record.user?.name || t('adminBranches.unknown')}
//                                           <br />
//                                           <strong>{t('adminBranches.checkIn')}:</strong>{' '}
//                                           {record.checkInTime
//                                             ? new Date(record.checkInTime).toLocaleString()
//                                             : 'N/A'}
//                                           <br />
//                                           {record.lateMinutes > 0 &&
//                                             `${t('adminBranches.late')}: ${record.lateMinutes} ${t(
//                                               'adminBranches.minutes'
//                                             )}`}
//                                         </Popup>
//                                       </Marker>
//                                     )}
//                                     {record.locationOut && (
//                                       <Marker
//                                         position={[record.locationOut.lat, record.locationOut.lng]}
//                                         icon={checkOutIcon}
//                                       >
//                                         <Popup>
//                                           <strong>{t('adminBranches.user')}:</strong>{' '}
//                                           {record.user?.name || t('adminBranches.unknown')}
//                                           <br />
//                                           <strong>{t('adminBranches.checkOut')}:</strong>{' '}
//                                           {record.checkOutTime
//                                             ? new Date(record.checkOutTime).toLocaleString()
//                                             : 'N/A'}
//                                           <br />
//                                           {record.earlyLeaveMinutes > 0 &&
//                                             `${t('adminBranches.earlyLeave')}: ${record.earlyLeaveMinutes} ${t(
//                                               'adminBranches.minutes'
//                                             )}`}
//                                         </Popup>
//                                       </Marker>
//                                     )}
//                                   </React.Fragment>
//                                 ))}
//                               </MapContainer>
//                             </div>
//                           ) : (
//                             <div className="alert alert-warning mb-0">
//                               <i className="fas fa-exclamation-triangle me-2"></i>
//                               {t('adminBranches.noLocation') || 'لم يتم ضبط إحداثيات هذا الفرع بعد'}
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   </React.Fragment>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {filteredBranches.length === 0 && (
//           <div className="text-center table text-muted-modern py-5" >
//             <i className="fas fa-inbox fa-3x mb-3 d-block" style={{ opacity: 0.3 }}></i>
//             <p>{t('No branches found')}</p>
//           </div>
//         )}
//       </div></div>
//     </div>
//   );
// };

// export default BranchTable;






//============================================1
import React, { useState } from 'react';
import { isGlobalAdmin } from '../../helpers/auth';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import L from 'leaflet';


const branchIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const checkInIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const checkOutIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const BranchTable = ({ branches, attendanceData, onEdit, onDelete, onToggleEmergency,onViewAttendance }) => {
  const { t } = useTranslation();
  const [branchSearch, setBranchSearch] = useState('');

  const filteredBranches = branches.filter((branch) =>
    branch.name?.toLowerCase().includes(branchSearch.toLowerCase())
  );

  return (
    <div className="modern-card">
      <div className="modern-card-header">
        <h5>
          <i className="fas fa-list-ul"></i>
          {t('adminBranches.branchList')}
          <span className="badge-modern badge-success ms-2">
            {filteredBranches.length} {t('Branches')}
          </span>
        </h5>
      </div>
      <div className="modern-card-body">
        {/* Search Bar */}
        <div className="form-group-modern mb-modern">
          <label className="form-label-modern">
            <i className="fas fa-search"></i>
            {t('adminBranches.searchByName') || 'ابحث باسم الفرع'}
          </label>
          <input
            type="text"
            className="form-control-modern"
            placeholder={t('Example: Nasr City Branch')}
            value={branchSearch}
            onChange={(e) => setBranchSearch(e.target.value)}
          />
        </div>

        {/* Table */}
           <div className="table-responsive">
          <table className="table-modern">
            <thead>
              <tr>
                <th>{t('adminBranches.branchName')}</th>
                <th>{t('adminBranches.latitude')}</th>
                <th>{t('adminBranches.longitude')}</th>
                <th>{t('adminBranches.radius')}</th>
                <th>{t('adminBranches.allowedIPs')}</th>
                <th>{t('adminBranches.transitThresholdMinutes') || 'وقت المواصلات'}</th>
                <th>{t('adminBranches.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredBranches.map((branch) => {
                const attendance = attendanceData[branch._id] || [];
                const hasLocation =
                  branch.location &&
                  typeof branch.location.lat === 'number' &&
                  typeof branch.location.lng === 'number';

                return (
                  <React.Fragment key={branch._id}>
                    {/* Main Branch Row */}
                    <tr>
                      <td>
                        <strong>{branch.name}</strong>
                      </td>
                      <td>{branch.location.lat}</td>
                      <td>{branch.location.lng}</td>
                      <td>
                        {branch.radius} {t('m')}
                      </td>
                      <td>
                        {branch.allowedIPs?.length > 0 ? (
                          <span className="badge-modern badge-default">
                            {branch.allowedIPs.length} IPs
                          </span>
                        ) : (
                          <span className="text-muted-modern">{t('adminBranches.none')}</span>
                        )}
                      </td>
                      <td>
                        {typeof branch.transitThresholdMinutes === 'number' ? (
                          <span className="badge-modern badge-success">
                            {branch.transitThresholdMinutes} {t('adminBranches.minutes') || 'دقيقة'}
                          </span>
                        ) : (
                          <span className="badge-modern badge-default">
                            {t('adminBranches.defaultTransit') || 'افتراضي'}
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-1">

                          {isGlobalAdmin() && (
  <>
                          <button
                            className="btn-info-modern btn-modern btn-sm-modern"
                            onClick={() => onEdit(branch)}
                            title={t('adminBranches.editBranch')}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn-danger-modern btn-modern btn-sm-modern"
                            onClick={() => onDelete(branch)}
                            title={t('adminBranches.delete')}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                          </>)}

                          
                          <button
                            className={`btn-modern btn-sm-modern ${
                              branch.allowRemoteCheckin ? 'btn-warning-modern' : 'btn-success-modern'
                            }`}
                            onClick={() => onToggleEmergency(branch._id, !branch.allowRemoteCheckin)}
                            title={
                              branch.allowRemoteCheckin
                                ? t('adminBranches.emergencyOn')
                                : t('adminBranches.emergencyOff')
                            }
                          >
                            {/* <i
                              className={`fas ${
                                branch.allowRemoteCheckin ? 'fa-exclamation-triangle' : 'fa-shield-alt'
                              }`}
                              
                            ></i> */}
                            <i class="fas fa-wifi"></i>

                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Map Row */}
                    <tr className="branch-map-row">
                      <td colSpan={7}>
                        <div className="mini-map-wrapper">
                          <div className="mini-map-header">
                            <span className="mini-map-title">
                              <i className="fas fa-map-marked-alt"></i>
                              {t('adminBranches.attendanceMap')} - {branch.name}
                            </span>
                            {/* <span className="mini-map-badge">
                              {attendance.length > 0
                                ? `${attendance.length} ${t('adminBranches.records') || 'سجل'}`
                                : t('adminBranches.noData')}
                            </span> */}
             <span
  className={`mini-map-badge ${attendance.length > 0 ? 'clickable' : ''}`}
 onClick={() => {

  //console.log('clicked', branch);

  attendance.length > 0 && onViewAttendance(branch);
}}

>
  {attendance.length > 0
    ? `${attendance.length} 
    
    Employees in Branch Now`
    : 'No employees currently in branch'}
</span>


                          </div>

                          {hasLocation ? (
                            <div className="map-container-modern">
                              <MapContainer
                                center={[branch.location.lat, branch.location.lng]}
                                zoom={13}
                                style={{ height: '250px', width: '100%' }}
                                scrollWheelZoom={false}
                              >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                                {/* Branch Marker */}
                                <Marker
                                  position={[branch.location.lat, branch.location.lng]}
                                  icon={branchIcon}
                                >
                                  <Popup>
                                    <strong>{t('adminBranches.branchLocation')}</strong>
                                    <br />
                                    {branch.name}
                                  </Popup>
                                </Marker>

                                {/* Attendance Markers */}
                                {attendance.map((record) => (
                                  <React.Fragment key={record._id}>
                                    {record.locationIn && (
                                      <Marker
                                        position={[record.locationIn.lat, record.locationIn.lng]}
                                        icon={checkInIcon}
                                      >
                                        <Popup>
                                          <strong>{t('adminBranches.user')}:</strong>{' '}
                                          {record.user?.name || t('adminBranches.unknown')}
                                          <br />
                                          <strong>{t('adminBranches.checkIn')}:</strong>{' '}
                                          {record.checkInTime
                                            ? new Date(record.checkInTime).toLocaleString()
                                            : 'N/A'}
                                          <br />
                                          {record.lateMinutes > 0 &&
                                            `${t('adminBranches.late')}: ${record.lateMinutes} ${t(
                                              'adminBranches.minutes'
                                            )}`}
                                        </Popup>
                                      </Marker>
                                    )}
                                    {record.locationOut && (
                                      <Marker
                                        position={[record.locationOut.lat, record.locationOut.lng]}
                                        icon={checkOutIcon}
                                      >
                                        <Popup>
                                          <strong>{t('adminBranches.user')}:</strong>{' '}
                                          {record.user?.name || t('adminBranches.unknown')}
                                          <br />
                                          <strong>{t('adminBranches.checkOut')}:</strong>{' '}
                                          {record.checkOutTime
                                            ? new Date(record.checkOutTime).toLocaleString()
                                            : 'N/A'}
                                          <br />
                                          {record.earlyLeaveMinutes > 0 &&
                                            `${t('adminBranches.earlyLeave')}: ${record.earlyLeaveMinutes} ${t(
                                              'adminBranches.minutes'
                                            )}`}
                                        </Popup>
                                      </Marker>
                                    )}
                                  </React.Fragment>
                                ))}
                              </MapContainer>
                            </div>
                          ) : (
                            <div className="alert alert-warning mb-0">
                              <i className="fas fa-exclamation-triangle me-2"></i>
                              {t('adminBranches.noLocation') || 'لم يتم ضبط إحداثيات هذا الفرع بعد'}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredBranches.length === 0 && (
          <div className="text-center text-muted-modern py-5">
            <i className="fas fa-inbox fa-3x mb-3 d-block" style={{ opacity: 0.3 }}></i>
            <p>{t('No branches found')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BranchTable;