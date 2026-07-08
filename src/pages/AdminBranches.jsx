
// import React, { useState, useEffect ,useRef} from 'react';
// import { apiGet, apiPost, apiPut, apiDelete } from '../helpers/api';
// import { MapContainer, TileLayer, Marker, Popup, useMapEvents,useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import { useTranslation } from 'react-i18next';
// import '../style/adminbranshes.css';

// // Fix Leaflet default icon issue
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
//   iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
// });

// // Custom icons
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

// function AdminBranches() {
//   const { t } = useTranslation();
//   const formRef = useRef(null);
// const nameInputRef = useRef(null);

//   const [branches, setBranches] = useState([]);
//   const [formData, setFormData] = useState({
//     name: '',
//     lat: '',
//     lng: '',
//     radius: '',
//     allowedIPs: '',
//     transitThresholdMinutes: '',
//   });
//   const [branchSearch, setBranchSearch] = useState('');

//   const [editingId, setEditingId] = useState(null);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [attendanceData, setAttendanceData] = useState({});
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [branchToDelete, setBranchToDelete] = useState(null);
// const [searchQuery, setSearchQuery] = useState('');
// const [isSearching, setIsSearching] = useState(false);

//   useEffect(() => {
//     const fetchBranches = async () => {
//       try {
//         const res = await apiGet('/branches');
//         setBranches(res.data);
//       } catch (err) {
//         setError(t('adminBranches.error'));
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBranches();
//   }, [t]);

//   useEffect(() => {
//     const fetchAttendanceForAllBranches = async () => {
//       const newAttendanceData = {};
//       for (const branch of branches) {
//         try {
//           const res = await apiGet(`/admin/attendance?branch=${branch._id}`);
//           newAttendanceData[branch._id] = res.data[0]?.attendance || [];
//         } catch (err) {
//           console.error(`Error fetching attendance for branch ${branch._id}:`, err);
//         }
//       }
//       setAttendanceData(newAttendanceData);
//     };
//     if (branches.length > 0) {
//       fetchAttendanceForAllBranches();
//     }
//   }, [branches]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     const allowedIPsString = String(formData.allowedIPs || '');
//     const allowedIPsArray = allowedIPsString
//       .split(',')
//       .map(ip => ip.trim())
//       .filter(ip => ip.length > 0);

//     const dataToSend = {
//       ...formData,
//       location: {
//         lat: parseFloat(formData.lat) || 0,
//         lng: parseFloat(formData.lng) || 0
//       },
//       radius: parseFloat(formData.radius) || 0,
//       allowedIPs: allowedIPsArray,
//     };
// // 🔢 تطبيع وقت المواصلات المسموح (null لو فاضي)
// if (
//   formData.transitThresholdMinutes === '' ||
//   formData.transitThresholdMinutes === null ||
//   typeof formData.transitThresholdMinutes === 'undefined'
// ) {
//   dataToSend.transitThresholdMinutes = null;
// } else {
//   dataToSend.transitThresholdMinutes = Number(formData.transitThresholdMinutes);
// }
//     try {
//       if (editingId) {
//         const res = await apiPut(`/branches/${editingId}`, dataToSend);
//         setBranches(branches.map((b) => (b._id === editingId ? res.data : b)));
//         setSuccess(t('adminBranches.branchUpdated'));
//       } else {
//         const res = await apiPost('/branches', dataToSend);
//         setBranches([...branches, res.data]);
//         setSuccess(t('adminBranches.branchCreated'));
//       }

//       setFormData({
//         name: '',
//         lat: '',
//         lng: '',
//         radius: '',
//         allowedIPs: '',
//         transitThresholdMinutes: '',
//       });
//       setEditingId(null);

//     } catch (err) {
//       setError(err.response?.data?.message || t('adminBranches.error'));
//     }
//   };

//   const handleEdit = (branch) => {
//     setFormData({
//       name: branch.name,
//       lat: branch.location.lat,
//       lng: branch.location.lng,
//       radius: branch.radius,
//       allowedIPs: branch.allowedIPs?.join(',') || '',
//       transitThresholdMinutes:
//       typeof branch.transitThresholdMinutes === 'number'
//         ? branch.transitThresholdMinutes
//         : '', // فاضي = يعني هنرجع للـ default logic
//     });
//     setEditingId(branch._id);  // نطلع تلقائي فوق عند الفورم
//   if (formRef.current) {
//     formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
//   }

//   // ندي فوكس على حقل الاسم
//   if (nameInputRef.current) {
//     nameInputRef.current.focus();
//   }
//   };
// const handleSearchLocation = async (e) => {
//   e.preventDefault();
//   if (!searchQuery.trim()) return;

//   try {
//     setIsSearching(true);
//     setError('');
//     setSuccess('');

//     const res = await fetch(
//       `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//         searchQuery
//       )}`
//     );
//     const data = await res.json();

//     if (!data || data.length === 0) {
//       setError('لم يتم العثور على موقع مطابق للبحث');
//       return;
//     }

//     const first = data[0];
//     const lat = parseFloat(first.lat);
//     const lng = parseFloat(first.lon);

//     // نحدّث الفورم بالإحداثيات
//     setFormData((prev) => ({
//       ...prev,
//       lat: lat.toFixed(6),
//       lng: lng.toFixed(6),
//     }));

//     setSuccess(`تم العثور على: ${first.display_name}`);
//   } catch (err) {
//     console.error(err);
//     setError('حصل خطأ أثناء البحث عن الموقع');
//   } finally {
//     setIsSearching(false);
//   }
// };

//   const handleDeleteClick = (branch) => {
//     setBranchToDelete(branch);
//     setShowDeleteModal(true);
//   };

//   const handleDelete = async () => {
//     if (!branchToDelete) return;
//     try {
//       await apiDelete(`/branches/${branchToDelete._id}`);
//       setBranches(branches.filter((b) => b._id !== branchToDelete._id));
//       setSuccess(t('adminBranches.branchDeleted'));
//       setShowDeleteModal(false);
//       setBranchToDelete(null);
//     } catch (err) {
//       setError(err.response?.data?.message || t('adminBranches.error'));
//       setShowDeleteModal(false);
//       setBranchToDelete(null);
//     }
//   };

//   const handleCancelDelete = () => {
//     setShowDeleteModal(false);
//     setBranchToDelete(null);
//   };

//   const handleToggleEmergency = async (branchId, allowRemote) => {
//     try {
//       await apiPost('/attendance/toggle-emergency', { branchId, allowRemote });
//       setBranches(branches.map(b => b._id === branchId ? { ...b, allowRemoteCheckin: allowRemote } : b));
//       setSuccess(allowRemote ? t('adminBranches.emergencyActivated') : t('adminBranches.emergencyDeactivated'));
//     } catch (err) {
//       setError(err.response?.data?.message || t('adminBranches.error'));
//     }
//   };
//   // 📍 لما أدمن يضغط على الخريطة نحرك الإحداثيات في الفورم
//   const handleMapClick = (latlng) => {
//     setFormData((prev) => ({
//       ...prev,
//       lat: latlng.lat.toFixed(6),
//       lng: latlng.lng.toFixed(6),
//     }));
//   };

//   // 📍 ماركر وهمي بس علشان نسمع كليك على الخريطة
//   const LocationMarker = ({ onLocationSelect }) => {
//     useMapEvents({
//       click(e) {
//         onLocationSelect(e.latlng);
//       },
//     });
//     return null;
//   };

//   // 🎯 يخلي الخريطة تروح تلقائيًا على الإحداثيات اللي في الفورم
//   const MapAutoCenter = ({ lat, lng }) => {
//     const map = useMap();

//     useEffect(() => {
//       if (!lat || !lng) return;
//       map.setView([lat, lng], 15); // زووم 15 علشان يجيب المكان قريب
//     }, [lat, lng, map]);

//     return null;
//   };



//   if (loading) {
//     return (
//       <div className="container mt-4 text-center">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">{t('adminBranches.loading')}</span>
//         </div>
//         <span className="ms-2">{t('adminBranches.loading')}</span>
//       </div>
//     );
//   }
// const filteredBranches = branches.filter((branch) =>
//   branch.name?.toLowerCase().includes(branchSearch.toLowerCase())
// );
//   return (
//     <div className="container mt-4">
//       <h2 className="mb-4"><i className="fas fa-building me-2"></i>{t('adminBranches.manageBranches')}</h2>

//       {/* Toast Container */}
//       <div className="toast-container position-fixed top-0 end-0 p-3">
//         {success && (
//           <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
//             <div className="toast-header bg-success text-white">
//               <i className="fas fa-check-circle me-2"></i>
//               <strong className="me-auto">{t('adminBranches.success')}</strong>
//               <button type="button" className="btn-close btn-close-white" onClick={() => setSuccess('')}></button>
//             </div>
//             <div className="toast-body">{success}</div>
//           </div>
//         )}
//         {error && (
//           <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
//             <div className="toast-header bg-danger text-white">
//               <i className="fas fa-exclamation-triangle me-2"></i>
//               <strong className="me-auto">{t('adminBranches.error')}</strong>
//               <button type="button" className="btn-close btn-close-white" onClick={() => setError('')}></button>
//             </div>
//             <div className="toast-body">{error}</div>
//           </div>
//         )}
//       </div>

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && branchToDelete && (
//         <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title" id="deleteModalLabel">
//                   <i className="fas fa-trash-alt me-2"></i>{t('adminBranches.delete')}
//                 </h5>
//                 <button type="button" className="btn-close" onClick={handleCancelDelete} aria-label="Close"></button>
//               </div>
//               <div className="modal-body">
//                 {t('adminBranches.delete')} {t('adminBranches.branchName')}: <strong>{branchToDelete.name}</strong>?
//               </div>
//               <div className="modal-footer">
//                 <button type="button" className="btn btn-secondary" onClick={handleCancelDelete}>
//                   <i className="fas fa-times me-2"></i>{t('adminBranches.cancel')}
//                 </button>
//                 <button type="button" className="btn btn-delete" onClick={handleDelete}>
//                   <i className="fas fa-trash-alt me-2"></i>{t('adminBranches.delete')}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       {showDeleteModal && <div className="modal-backdrop fade show"></div>}

//       <div className="card shadow mb-4 ref={formRef}">
//         <div className="card-header bg-primary text-white">
//           <h5 className="mb-0"><i className="fas fa-plus-circle me-2"></i>{editingId ? t('adminBranches.editBranch') : t('adminBranches.addBranch')}</h5>
//         </div>
//         <div className="card-body">
//           <form onSubmit={handleSubmit}>
//             <div className="mb-3">
//               <label className="form-label"><i className="fas fa-tag me-2"></i>{t('adminBranches.branchName')}</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 required
//                  ref={nameInputRef}
//               />
//             </div>
//             <div className="row">
//               <div className="col-md-6 mb-3">
//                 <label className="form-label"><i className="fas fa-map-marker-alt me-2"></i>{t('adminBranches.latitude')}</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   value={formData.lat}
//                   onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
//                   required
//                   step="any"
//                 />
//               </div>
//               <div className="col-md-6 mb-3">
//                 <label className="form-label"><i className="fas fa-map-marker-alt me-2"></i>{t('adminBranches.longitude')}</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   value={formData.lng}
//                   onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
//                   required
//                   step="any"
//                 />
//               </div>
//             </div>
//             <div className="mb-3">
//               <label className="form-label"><i className="fas fa-ruler-combined me-2"></i>{t('adminBranches.radius')}</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 value={formData.radius}
//                 onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
//                 required
//               />
//             </div><div className="mb-3">
//   <label className="form-label">
//     <i className="fas fa-route me-2"></i>
//     {t('adminBranches.transitThresholdMinutes') || 'وقت المواصلات المسموح (دقايق)'}
//   </label>
//   <input
//     type="number"
//     min="0"
//     className="form-control"
//     value={formData.transitThresholdMinutes}
//     onChange={(e) =>
//       setFormData({
//         ...formData,
//         transitThresholdMinutes: e.target.value,
//       })
//     }
//     placeholder={t('example60minutes') ||
//     'مثال: 30 (دقيقة)'}
//   />
//   <small className="text-muted"> {t('Enter the allowed travel time between branches.If no value is entered, it will be taken from the employee settings or the system s default value of 60 minutes.') || ' أدخل الوقت المسموح به للتنقل من هذا الفرع الي اخر. اذا لم تدخل قيمة، سيتم اخذها من اعدادات الموظف او القيمة العامة للسيستم وهي 60 دقيقة.'}
//   </small>
// </div>

//             <div className="mb-3">
//               <label className="form-label"><i className="fas fa-network-wired me-2"></i>{t('adminBranches.allowedIPs')}</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={formData.allowedIPs}
//                 onChange={(e) => setFormData({ ...formData, allowedIPs: e.target.value })}
//                 placeholder="192.168.1.1, 192.168.1.2"
//               />
//             </div>
//             <div className="mb-3">
              
//               <label className="form-label"><i className="fas fa-map me-2"></i>{t('adminBranches.selectLocationOnMap')}    <i className="fas fa-search-location me-2"></i>
// </label>
//               <div className="mb-3">
//   <label className="form-label">
//   </label>
//   <div className="input-group">
//     <input
//       type="text"
//       className="form-control"
//       placeholder="example: Nasr City Cairo"
//       value={searchQuery}
//       onChange={(e) => setSearchQuery(e.target.value)}
//     />
//     <button
//       className="btn btn-outline-primary"
//       type="button"
//       onClick={handleSearchLocation}
//       disabled={isSearching}
//     >
//       {isSearching ? (
//         <>
//           <span className="spinner-border spinner-border-sm me-1" />
//          {t("Search")|| "جاري البحث..."}
//         </>
//       ) : (
//         <>
//           <i className="fas fa-search me-1" />
//                   {t("Search")|| " بحث"}

//         </>
//       )}
//     </button>
//   </div>
//   <small className="text-muted">
//     {t("Locate the site in detail on the map. Click on the map to select the location.") ||" انقر على الخريطة لاختيار الموقع"}
  
//   </small>
// </div>

//               <MapContainer
//   center={
//     formData.lat && formData.lng
//       ? [parseFloat(formData.lat), parseFloat(formData.lng)]
//       : [24.7136, 46.6753] // مركز افتراضي
//   }
//   zoom={10}
//   style={{ height: '300px', width: '100%' }}
// >
//   <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//   {/* كليك على الخريطة يظبط الإحداثيات في الفورم */}
//   <LocationMarker onLocationSelect={handleMapClick} />

//   {/* لما الإحداثيات تتغير (من السيرش أو من الكليك) الخريطة تروح عليها تلقائي */}
//   <MapAutoCenter
//     lat={formData.lat ? parseFloat(formData.lat) : null}
//     lng={formData.lng ? parseFloat(formData.lng) : null}
//   />

//   {formData.lat && formData.lng && (
//     <Marker
//       position={[parseFloat(formData.lat), parseFloat(formData.lng)]}
//       icon={branchIcon}
//     >
//       <Popup>{t('adminBranches.selectedLocation')}</Popup>
//     </Marker>
//   )}
// </MapContainer>

//             </div>
//             <div className="d-flex">
//               <button type="submit" className="btn btn-primary me-2">
//                 <i className="fas fa-save me-2"></i>{editingId ? t('adminBranches.update') : t('adminBranches.addBranch')}
//               </button>
//               {editingId && (
//                 <button type="button" className="btn btn-secondary" onClick={() => setEditingId(null)}>
//                   <i className="fas fa-times me-2"></i>{t('adminBranches.cancel')}
//                 </button>
//               )}
//             </div>
//           </form>
//         </div>
//       </div>

//       <div className="card shadow mb-4">
//         <div className="card-header bg-info text-white">
//           <h5 className="mb-0"><i className="fas fa-list-ul me-2"></i>{t('adminBranches.branchList')}</h5>
//         </div>
//         <div className="card-body">
//           <div className="row mb-3">
//   <div className="col-md-4">
//     <label className="form-label">
//       <i className="fas fa-search me-2"></i>
//       {t('adminBranches.searchByName') || 'ابحث باسم الفرع'}
//     </label>
//     <input
//       type="text"
//       className="form-control"
//       placeholder={t('Branche Name') || 'مثال: فرع مدينة نصر'}
//       value={branchSearch}
//       onChange={(e) => setBranchSearch(e.target.value)}
//     />
//   </div>
// </div>

//           <div className="table-responsive">
//             <table className="table table-striped table-hover">
//               <thead className="table-dark">
//                 <tr>
//                   <th>{t('adminBranches.branchName')}</th>
//                   <th>{t('adminBranches.latitude')}</th>
//                   <th>{t('adminBranches.longitude')}</th>
//                   <th>{t('adminBranches.radius')}</th>
//                   <th>{t('adminBranches.allowedIPs')}</th>
//                   <th>{t('adminBranches.transitThresholdMinutes') || 'وقت المواصلات (دقايق)'}</th>
//                   <th>{t('adminBranches.actions')}</th>
//                 </tr>
//               </thead>
//               <tbody>
//   {filteredBranches.map((branch) => {
//     const attendance = attendanceData[branch._id] || [];
//     const hasLocation =
//       branch.location &&
//       typeof branch.location.lat === 'number' &&
//       typeof branch.location.lng === 'number';


//     return (
//       <React.Fragment key={branch._id}>
//         {/* الصف الرئيسي للفَرع */}
//         <tr>
//           <td>{branch.name}</td>
//           <td>{branch.location.lat}</td>
//           <td>{branch.location.lng}</td>
//           <td>{branch.radius}</td>
//           <td>{branch.allowedIPs?.join(', ') || t('adminBranches.none')}</td>
//           <td>
//             {typeof branch.transitThresholdMinutes === 'number' ? (
//               <>
//                 {branch.transitThresholdMinutes}{' '}
//                 {t('adminBranches.minutes') || 'دقيقة'}
//               </>
//             ) : (
//               <span className="text-muted">
//                 {t('adminBranches.defaultTransit') || 'القيمة الافتراضية'}
//               </span>
//             )}
//           </td>
//           <td>
//             <button
//               className="btn btn-sm btn-info me-1"
//               onClick={() => handleEdit(branch)}
//             >
//               <i className="fas fa-edit"></i>{' '}
//               {t('adminBranches.editBranch')}
//             </button>
//             <button
//               className="btn btn-sm btn-danger me-1"
//               onClick={() => handleDeleteClick(branch)}
//             >
//               <i className="fas fa-trash-alt"></i>{' '}
//               {t('adminBranches.delete')}
//             </button>
//             <button
//               className={`btn btn-sm ${
//                 branch.allowRemoteCheckin ? 'btn-warning' : 'btn-success'
//               }`}
//               onClick={() =>
//                 handleToggleEmergency(branch._id, !branch.allowRemoteCheckin)
//               }
//             >
//               <i
//                 className={`fas ${
//                   branch.allowRemoteCheckin
//                     ? 'fa-exclamation-triangle'
//                     : 'fa-shield-alt'
//                 }`}
//               ></i>{' '}
//               {branch.allowRemoteCheckin
//                 ? t('adminBranches.emergencyOn')
//                 : t('adminBranches.emergencyOff')}
//             </button>
//           </td>
//         </tr>

//         {/* صف تحت الفرع فيه الميني ماب */}
//         <tr className="branch-map-row">
//           <td colSpan={7}>
//             <div className="mini-map-wrapper">
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <span className="fw-semibold">
//                   <i className="fas fa-map-marked-alt me-2"></i>
//                   {t('adminBranches.attendanceMap')} - {branch.name}
//                 </span>
//                 <small className="text-muted">
//                   {attendance.length > 0
//                     ? `${attendance.length} ${t('adminBranches.records') || 'سجل حضور'}`
//                     : t('adminBranches.noData')}
//                 </small>
//               </div>

//               {hasLocation ? (
//                 <MapContainer
//                   center={[branch.location.lat, branch.location.lng]}
//                   zoom={13}
//                   style={{ height: '200px', width: '100%' }}
//                   scrollWheelZoom={false}
//                 >
//                   <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//                   {/* ماركر موقع الفرع */}
//                   <Marker
//                     position={[branch.location.lat, branch.location.lng]}
//                     icon={branchIcon}
//                   >
//                     <Popup>
//                       {t('adminBranches.branchLocation')}: {branch.name}
//                     </Popup>
//                   </Marker>

//                   {/* ماركرات الحضور */}
//                   {attendance.map((record) => (
//                     <React.Fragment key={record._id}>
//                       {record.locationIn && (
//                         <Marker
//                           position={[
//                             record.locationIn.lat,
//                             record.locationIn.lng,
//                           ]}
//                           icon={checkInIcon}
//                         >
//                           <Popup>
//                             {t('adminBranches.user')}:{' '}
//                             {record.user?.name ||
//                               t('adminBranches.unknown')}
//                             <br />
//                             {t('adminBranches.checkIn')}:{' '}
//                             {record.checkInTime
//                               ? new Date(
//                                   record.checkInTime
//                                 ).toLocaleString()
//                               : 'N/A'}
//                             <br />
//                             {record.lateMinutes > 0 &&
//                               `${t('adminBranches.late')}: ${
//                                 record.lateMinutes
//                               } ${t('adminBranches.minutes')}`}
//                           </Popup>
//                         </Marker>
//                       )}
//                       {record.locationOut && (
//                         <Marker
//                           position={[
//                             record.locationOut.lat,
//                             record.locationOut.lng,
//                           ]}
//                           icon={checkOutIcon}
//                         >
//                           <Popup>
//                             {t('adminBranches.user')}:{' '}
//                             {record.user?.name ||
//                               t('adminBranches.unknown')}
//                             <br />
//                             {t('adminBranches.checkOut')}:{' '}
//                             {record.checkOutTime
//                               ? new Date(
//                                   record.checkOutTime
//                                 ).toLocaleString()
//                               : 'N/A'}
//                             <br />
//                             {record.earlyLeaveMinutes > 0 &&
//                               `${t('adminBranches.earlyLeave')}: ${
//                                 record.earlyLeaveMinutes
//                               } ${t('adminBranches.minutes')}`}
//                           </Popup>
//                         </Marker>
//                       )}
//                     </React.Fragment>
//                   ))}
//                 </MapContainer>
//               ) : (
//                 <div className="alert alert-warning mb-0">
//                   {t('adminBranches.noLocation') ||
//                     'لم يتم ضبط إحداثيات هذا الفرع بعد'}
//                 </div>
//               )}
//             </div>
//           </td>
//         </tr>
//       </React.Fragment>
//     );
//   })}
// </tbody>

//             </table>
//           </div>
//         </div>
//       </div>

      
//     </div>
//   );
// }

// export default AdminBranches;

// //==================ui & components==========

// import React, { useState, useEffect } from 'react';

// // Branch services
// import {
//   getBranches,
//   createBranch,
//   updateBranch,
//   deleteBranch
// } from '../services/branch.api';

// // Attendance services
// import {
//   getCurrentAttendanceByBranch,
//   toggleEmergency
// } from '../services/attendance.api';

// import { useTranslation } from 'react-i18next';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // Components
// import BranchForm from '../components/branches/BranchForm';
// import BranchTable from '../components/branches/BranchTable';
// import 
//  CurrentAttendanceModal  from '../components/attendance/CurrentAttendanceModal';
// import { Toast, ConfirmModal, Loading } from '../components/branches/UIComponents';

// // Styles
// import '../style/Adminbranches-modern.css';

// // Fix Leaflet default icon issue
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
//   iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
// });

// function AdminBranches() {
//   const { t } = useTranslation();

//   // State Management
//   const [branches, setBranches] = useState([]);
//   const [formData, setFormData] = useState({
//     name: '',
//     lat: '',
//     lng: '',
//     radius: '',
//     allowedIPs: '',
//     transitThresholdMinutes: '',
//   });
//   const [editingId, setEditingId] = useState(null);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [attendanceData, setAttendanceData] = useState({});
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [branchToDelete, setBranchToDelete] = useState(null);
// const [showAttendanceModal, setShowAttendanceModal] = useState(false);
// const [selectedBranch, setSelectedBranch] = useState(null);

// const [showBranchForm, setShowBranchForm] = useState(false);


//   // Fetch Branches on Mount
//   useEffect(() => {
//     const fetchBranches = async () => {
//       try {
//        const res = await getBranches();
// setBranches(res.data);

//       } catch (err) {
//         setError(t('adminBranches.error'));
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBranches();
//   }, [t]);

//   // Fetch Attendance Data for All Branches
//   useEffect(() => {
//     const fetchAttendanceForAllBranches = async () => {
//       const newAttendanceData = {};
//       for (const branch of branches) {
//         try {
       
//    const res = await getCurrentAttendanceByBranch(branch._id);
// newAttendanceData[branch._id] = res.data.data || [];

//         } catch (err) {
//           console.error(`Error fetching attendance for branch ${branch._id}:`, err);
//         }
//       }
//       setAttendanceData(newAttendanceData);
//     };
//     if (branches.length > 0) {
//       fetchAttendanceForAllBranches();
//     }
//   }, [branches]);

//   // Auto-hide notifications after 5 seconds
//   useEffect(() => {
//     if (success || error) {
//       const timer = setTimeout(() => {
//         setSuccess('');
//         setError('');
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [success, error]);

//   // Handle Form Submit (Create/Update)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     const allowedIPsString = String(formData.allowedIPs || '');
//     const allowedIPsArray = allowedIPsString
//       .split(',')
//       .map((ip) => ip.trim())
//       .filter((ip) => ip.length > 0);

//     const dataToSend = {
//       ...formData,
//       location: {
//         lat: parseFloat(formData.lat) || 0,
//         lng: parseFloat(formData.lng) || 0,
//       },
//       radius: parseFloat(formData.radius) || 0,
//       allowedIPs: allowedIPsArray,
//     };

//     // Normalize transit threshold
//     if (
//       formData.transitThresholdMinutes === '' ||
//       formData.transitThresholdMinutes === null ||
//       typeof formData.transitThresholdMinutes === 'undefined'
//     ) {
//       dataToSend.transitThresholdMinutes = null;
//     } else {
//       dataToSend.transitThresholdMinutes = Number(formData.transitThresholdMinutes);
//     }

//     try {
//       if (editingId) {
//        const res = await updateBranch(editingId, dataToSend);

//         setBranches(branches.map((b) => (b._id === editingId ? res.data : b)));
//         setSuccess(t('adminBranches.branchUpdated'));
//       } else {
//      const res = await createBranch(dataToSend);

//         setBranches([...branches, res.data]);
//         setSuccess(t('adminBranches.branchCreated'));
//       }

//       // Reset form
//       setFormData({
//         name: '',
//         lat: '',
//         lng: '',
//         radius: '',
//         allowedIPs: '',
//         transitThresholdMinutes: '',
//       });
//       setEditingId(null);
//     } catch (err) {
//       setError(err.response?.data?.message || t('adminBranches.error'));
//     }
//   };

//   // Handle Edit
//   const handleEdit = (branch) => {
//     setFormData({
//       name: branch.name,
//       lat: branch.location.lat,
//       lng: branch.location.lng,
//       radius: branch.radius,
//       allowedIPs: branch.allowedIPs?.join(',') || '',
//       transitThresholdMinutes:
//         typeof branch.transitThresholdMinutes === 'number' ? branch.transitThresholdMinutes : '',
//     });
//     setEditingId(branch._id);

//     // Scroll to form
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   // Handle Delete Click
//   const handleDeleteClick = (branch) => {
//     setBranchToDelete(branch);
//     setShowDeleteModal(true);
//   };

//   // Handle Delete Confirm
//   const handleDelete = async () => {
//     if (!branchToDelete) return;
//     try {
//       await deleteBranch(branchToDelete._id);

//       setBranches(branches.filter((b) => b._id !== branchToDelete._id));
//       setSuccess(t('adminBranches.branchDeleted'));
//       setShowDeleteModal(false);
//       setBranchToDelete(null);
//     } catch (err) {
//       setError(err.response?.data?.message || t('adminBranches.error'));
//       setShowDeleteModal(false);
//       setBranchToDelete(null);
//     }
//   };

//   // Handle Cancel Delete
//   const handleCancelDelete = () => {
//     setShowDeleteModal(false);
//     setBranchToDelete(null);
//   };

//   // Handle Cancel Edit
//   const handleCancelEdit = () => {
//     setEditingId(null);
//     setFormData({
//       name: '',
//       lat: '',
//       lng: '',
//       radius: '',
//       allowedIPs: '',
//       transitThresholdMinutes: '',
//     });
//   };

//   // Handle Toggle Emergency
//   const handleToggleEmergency = async (branchId, allowRemote) => {
//     try {
//      await toggleEmergency({ branchId, allowRemote });

//       setBranches(
//         branches.map((b) => (b._id === branchId ? { ...b, allowRemoteCheckin: allowRemote } : b))
//       );
//       setSuccess(
//         allowRemote ? t('adminBranches.emergencyActivated') : t('adminBranches.emergencyDeactivated')
//       );
//     } catch (err) {
//       setError(err.response?.data?.message || t('adminBranches.error'));
//     }
//   };

//   // Loading State
//   if (loading) {
//     return (
//       <div className="admin-branches-container">
//         <Loading message={t('adminBranches.loading')} />
//       </div>
//     );
//   }
// ;
// const handleViewAttendance = (branch) => {
//   setSelectedBranch(branch);
//   setShowAttendanceModal(true);
// };


//   return (
//     <div className="admin-branches-container">
//       {/* Page Header */}
//       <div className="page-header">
//         <h2>
//           <i className="fas fa-building"></i>
//           {t('adminBranches.manageBranches')}
//         </h2>
//       </div>

//       {/* Toast Notifications */}
//       <Toast show={!!success} message={success} type="success" onClose={() => setSuccess('')} />
//       <Toast show={!!error} message={error} type="error" onClose={() => setError('')} />

//       {/* Delete Confirmation Modal */}
//       <ConfirmModal
//         show={showDeleteModal}
//         title={t('adminBranches.delete')}
//         message={
//           <>
//             {t('adminBranches.delete')} {t('adminBranches.branchName')}:{' '}
//             <strong>{branchToDelete?.name}</strong>?
//           </>
//         }
//         onConfirm={handleDelete}
//         onCancel={handleCancelDelete}
//       />

//       {/* Branch Form */}
//       <BranchForm
//         formData={formData}
//         setFormData={setFormData}
//         editingId={editingId}
//         onSubmit={handleSubmit}
//         onCancel={handleCancelEdit}
//       />

//       {/* Branch Table */}
//       <BranchTable
//         branches={branches}
//         attendanceData={attendanceData}
//         onEdit={handleEdit}
//         onDelete={handleDeleteClick}
//         onToggleEmergency={handleToggleEmergency}
//   onViewAttendance={handleViewAttendance}

//       />
//   <CurrentAttendanceModal
//   show={showAttendanceModal}
//   branch={selectedBranch}
//   onClose={() => setShowAttendanceModal(false)}
// />


//     </div>
//   );
// }

// export default AdminBranches;



//=========================================2
import React, { useState, useEffect } from 'react';

// Branch services
import {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch
} from '../services/branch.api';

// Attendance services
import {
  getCurrentAttendanceByBranch,
  toggleEmergency
} from '../services/attendance.api';

import { useTranslation } from 'react-i18next';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Components
import BranchFormModal from '../components/branches/BranchFormModal';
import BranchTable from '../components/branches/BranchTable';
import CurrentAttendanceModal from '../components/attendance/CurrentAttendanceModal';
import { Toast, ConfirmModal, Loading } from '../components/branches/UIComponents';
import { isGlobalAdmin } from '../helpers/auth';
import OverageConfirmationToast from '../components/subscription/OverageConfirmationToast';

// Styles
import '../style/Adminbranches-modern.css';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

function AdminBranches() {
  const { t } = useTranslation();

  // State Management
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    lat: '',
    lng: '',
    radius: '',
    allowedIPs: '',
    transitThresholdMinutes: '',
    timezone: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState({});
  
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showBranchFormModal, setShowBranchFormModal] = useState(false); // ✅ New state
const [overageWarning, setOverageWarning] = useState(null);


  // Fetch Branches on Mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await getBranches();
        setBranches(res.data);
      } catch (err) {
        setError(t('adminBranches.error'));
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, [t]);

  // Fetch Attendance Data for All Branches
  useEffect(() => {
    const fetchAttendanceForAllBranches = async () => {
      const newAttendanceData = {};
      for (const branch of branches) {
        try {
          const res = await getCurrentAttendanceByBranch(branch._id);
          newAttendanceData[branch._id] = res.data.data || [];
        } catch (err) {
          console.error(`Error fetching attendance for branch ${branch._id}:`, err);
        }
      }
      setAttendanceData(newAttendanceData);
    };
    if (branches.length > 0) {
      fetchAttendanceForAllBranches();
    }
  }, [branches]);

  // Auto-hide notifications after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Handle Form Submit (Create/Update)
 const handleSubmit = async (
  e,
  forceConfirm = false
) => {
    e.preventDefault();
    setOverageWarning(null);
    setError('');
    setSuccess('');

    const allowedIPsString = String(formData.allowedIPs || '');
    const allowedIPsArray = allowedIPsString
      .split(',')
      .map((ip) => ip.trim())
      .filter((ip) => ip.length > 0);

    const dataToSend = {
      ...formData,
     timezone: formData.timezone || null,
      location: {
        lat: parseFloat(formData.lat) || 0,
        lng: parseFloat(formData.lng) || 0,
      },
      radius: parseFloat(formData.radius) || 0,
      allowedIPs: allowedIPsArray,
    };

    // Normalize transit threshold
    if (
      formData.transitThresholdMinutes === '' ||
      formData.transitThresholdMinutes === null ||
      typeof formData.transitThresholdMinutes === 'undefined'
    ) {
      dataToSend.transitThresholdMinutes = null;
    } else {
      dataToSend.transitThresholdMinutes = Number(formData.transitThresholdMinutes);
    }

    try {
      if (editingId) {
        const res = await updateBranch(editingId, dataToSend);
        // setBranches(branches.map((b) => (b._id === editingId ? res.data : b)));
        setBranches(branches.map((b) => (
  b._id === editingId ? res.data.data : b
)));
        setSuccess(t('adminBranches.branchUpdated'));
      } else {
        const res = await createBranch({
  ...dataToSend,
  confirmOverage: forceConfirm,
});
        // console.log(res.data);
        setBranches([...branches, res.data]);
        setSuccess(t('adminBranches.branchCreated'));
        setOverageWarning(null);
        
      }

      // Reset form and close modal
      setFormData({
        name: '',
        lat: '',
        lng: '',
        radius: '',
        allowedIPs: '',
        transitThresholdMinutes: '',
        timezone: '',
      });
      setEditingId(null);
      setShowBranchFormModal(false); // ✅ Close modal after submit
    } catch (err) {

  const response = err?.response?.data;

  if (
    err?.response?.status === 409 &&
    response?.requiresConfirmation
  ) {

    setOverageWarning(
      response.warning || response.warnings
    );

    return;
  }

  setError(
    response?.message ||
    t('adminBranches.error')
  );
}
  };

  // ✅ Handle Add New Branch
  const handleAddBranch = () => {
    // Reset form for new branch
    setFormData({
      name: '',
      lat: '',
      lng: '',
      radius: '',
      allowedIPs: '',
      transitThresholdMinutes: '',
      timezone: '',
    });
    setEditingId(null);
    setShowBranchFormModal(true);
  };

  // ✅ Handle Edit
  const handleEdit = (branch) => {
    setFormData({
      name: branch.name,
      lat: branch.location.lat,
      lng: branch.location.lng,
      radius: branch.radius,
      allowedIPs: branch.allowedIPs?.join(',') || '',
      transitThresholdMinutes:
        typeof branch.transitThresholdMinutes === 'number' ? branch.transitThresholdMinutes : '',
         timezone: branch.timezone || '',
    });
    setEditingId(branch._id);
    setShowBranchFormModal(true); // ✅ Open modal for editing
  };

  // Handle Delete Click
  const handleDeleteClick = (branch) => {
    setBranchToDelete(branch);
    setShowDeleteModal(true);
  };

  // Handle Delete Confirm
  const handleDelete = async () => {
    if (!branchToDelete) return;
    try {
      await deleteBranch(branchToDelete._id);
      setBranches(branches.filter((b) => b._id !== branchToDelete._id));
      setSuccess(t('adminBranches.branchDeleted'));
      setShowDeleteModal(false);
      setBranchToDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || t('adminBranches.error'));
      setShowDeleteModal(false);
      setBranchToDelete(null);
    }
  };

  // Handle Cancel Delete
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setBranchToDelete(null);
  };

  // ✅ Handle Cancel Form (Close Modal)
  const handleCancelForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      lat: '',
      lng: '',
      radius: '',
      allowedIPs: '',
      transitThresholdMinutes: '',
      timezone: '',
    });
    setShowBranchFormModal(false); // ✅ Close modal
  };

  // Handle Toggle Emergency
  const handleToggleEmergency = async (branchId, allowRemote) => {
    try {
      await toggleEmergency({ branchId, allowRemote });
      setBranches(
        branches.map((b) => (b._id === branchId ? { ...b, allowRemoteCheckin: allowRemote } : b))
      );
      setSuccess(
        allowRemote ? t('adminBranches.emergencyActivated') : t('adminBranches.emergencyDeactivated')
      );
    } catch (err) {
      setError(err.response?.data?.message || t('adminBranches.error'));
    }
  };

  // Handle View Attendance
  const handleViewAttendance = (branch) => {
    setSelectedBranch(branch);
    setShowAttendanceModal(true);
  };

  // Loading State
  if (loading) {
    return (
      <div className="admin-branches-container">
        <Loading message={t('adminBranches.loading')} />
      </div>
    );
  }

  return (
    <div className="admin-branches-container">
      {/* Page Header with Add Button */}
      <div className="page-header">
        <h2>
          <i className="fas fa-building"></i>
          {t('adminBranches.manageBranches')}
        </h2>
        {/* ✅ Add Branch Button */}

{isGlobalAdmin() && (

        <button 
          className="btn-primary-modern btn-modern"
          onClick={handleAddBranch}
        >
          <i className="fas fa-plus-circle"></i>
          {t('adminBranches.addBranch')}
        </button>)}
      </div>

      {/* Toast Notifications */}
      <Toast show={!!success} message={success} type="success" onClose={() => setSuccess('')} />
      <Toast show={!!error} message={error} type="error" onClose={() => setError('')} />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={showDeleteModal}
        title={t('adminBranches.delete')}
        message={
          <>
            {t('adminBranches.delete')} {t('adminBranches.branchName')}:{' '}
            <strong>{branchToDelete?.name}</strong>?
          </>
        }
        onConfirm={handleDelete}
        onCancel={handleCancelDelete}
      />

      {/* ✅ Branch Form Modal */}
      <BranchFormModal
        show={showBranchFormModal}
        formData={formData}
        setFormData={setFormData}
        editingId={editingId}
        onSubmit={handleSubmit}
        onCancel={handleCancelForm}
      />

      {/* Branch Table */}
      <BranchTable
        branches={branches}
        attendanceData={attendanceData}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onToggleEmergency={handleToggleEmergency}
        onViewAttendance={handleViewAttendance}
      />

      {/* Attendance Modal */}
      <CurrentAttendanceModal
        show={showAttendanceModal}
        branch={selectedBranch}
        onClose={() => setShowAttendanceModal(false)}
      />
      <OverageConfirmationToast
  warning={overageWarning}
  onClose={() => setOverageWarning(null)}
  onConfirm={async () => {

    setOverageWarning(null);

    await handleSubmit(
      { preventDefault() {} },
      true
    );

  }}
/>

    </div>
  );
}

export default AdminBranches;