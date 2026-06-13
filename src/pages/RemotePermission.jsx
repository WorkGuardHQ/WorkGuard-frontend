
// // src/pages/RemotePermission.jsx
// import { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';

// import { 
//   grantRemotePermission, 
//   bulkGrantRemotePermission
// } from '../services/remotePermission.service';
// import { searchUsers } from '../services/user.api';
// import { getBranchLookup } from '../services/branch.api';

// import UserSearch from '../components/RemotePermission/UserSearch';
// import SinglePermission from '../components/RemotePermission/SinglePermission';
// import BulkPermission from '../components/RemotePermission/BulkPermission';

// import RemotePermissionsList from './RemotePermissionsList'
// import '../style/remote-permission.css';

// function RemotePermission() {
//   const { t } = useTranslation();
//   const [activeTab, setActiveTab] = useState('single');
//   const [loading, setLoading] = useState(false);
//   const [alert, setAlert] = useState({ show: false, type: '', message: '' });

//   // Single Permission States
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [singleBranch, setSingleBranch] = useState('');
//   const [singleDate, setSingleDate] = useState('');
//   const [singleReason, setSingleReason] = useState('');

//   // Bulk Permission States
//   const [bulkMode, setBulkMode] = useState('users');
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [bulkBranch, setBulkBranch] = useState('');
//   const [dateFrom, setDateFrom] = useState('');
//   const [dateTo, setDateTo] = useState('');
//   const [bulkReason, setBulkReason] = useState('');

//   // Data
//   const [users, setUsers] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isSearching, setIsSearching] = useState(false);

//   useEffect(() => {
//     loadBranches();
//   }, []);

//   const loadBranches = async () => {
//     try {
//       console.log('📍 Loading branches...');
//       const response = await getBranchLookup();
      
//       console.log('📦 Raw response:', response);
//       console.log('📦 Response.data:', response?.data);
      
//       // ✅ استخراج الـ data بشكل آمن
//       let branchesData = [];
      
//       if (Array.isArray(response)) {
//         // لو الـ response نفسه Array
//         branchesData = response;
//       } else if (Array.isArray(response?.data)) {
//         // لو الـ data جوه response
//         branchesData = response.data;
//       } else if (response?.data?.data && Array.isArray(response.data.data)) {
//         // لو الـ data متداخلة
//         branchesData = response.data.data;
//       }
      
//       console.log('✅ Branches loaded:', branchesData);
//       setBranches(branchesData);
//     } catch (error) {
//       console.error('❌ Error loading branches:', error);
//       setBranches([]);
//     }
//   };

//   const handleSearchUsers = async (query) => {
//     setSearchQuery(query);
    
//     if (query.length < 2) {
//       setUsers([]);
//       setIsSearching(false);
//       return;
//     }
    
//     setIsSearching(true);
//     console.log('🔍 Searching users:', query);
    
//     try {
//       const response = await searchUsers(query);
      
//       console.log('📦 Search response:', response);
      
//       // ✅ استخراج الـ data بشكل آمن
//       let usersData = [];
      
//       if (Array.isArray(response)) {
//         usersData = response;
//       } else if (Array.isArray(response?.data)) {
//         usersData = response.data;
//       } else if (response?.data?.data && Array.isArray(response.data.data)) {
//         usersData = response.data.data;
//       }
      
//       console.log('✅ Users found:', usersData);
//       setUsers(usersData);
//     } catch (error) {
//       console.error('❌ Search failed:', error);
//       setUsers([]);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   const showAlert = (type, message) => {
//     setAlert({ show: true, type, message });
//     setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
//   };

//   const resetSingleForm = () => {
//     setSelectedUser(null);
//     setSingleBranch('');
//     setSingleDate('');
//     setSingleReason('');
//     setSearchQuery('');
//     setUsers([]);
//   };

//   const resetBulkForm = () => {
//     setSelectedUsers([]);
//     setBulkBranch('');
//     setDateFrom('');
//     setDateTo('');
//     setBulkReason('');
//     setSearchQuery('');
//     setUsers([]);
//   };

//   const handleGrantSingle = async () => {
//     if (!selectedUser) {
//       showAlert('warning', 'يرجى اختيار موظف');
//       return;
//     }
//     if (!singleDate) {
//       showAlert('warning', 'يرجى اختيار التاريخ');
//       return;
//     }

//     setLoading(true);
//     console.log('📤 Granting permission:', {
//       userId: selectedUser._id,
//       branchId: singleBranch,
//       date: singleDate
//     });

//     try {
//       const response = await grantRemotePermission({
//         userId: selectedUser._id,
//         branchId: singleBranch || undefined,
//         date: singleDate,
//         reason: singleReason
//       });

//       console.log('✅ Response:', response);
//       showAlert('success', response.data?.message || 'تم منح الإذن بنجاح');
//       resetSingleForm();
//     } catch (error) {
//       console.error('❌ Error:', error);
//       showAlert('danger', error.response?.data?.message || 'فشل منح الإذن');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGrantBulk = async () => {
//     if (bulkMode === 'users' && selectedUsers.length === 0) {
//       showAlert('warning', 'يرجى اختيار موظف واحد على الأقل');
//       return;
//     }
//     if (bulkMode === 'branch' && !bulkBranch) {
//       showAlert('warning', 'يرجى اختيار الفرع');
//       return;
//     }
//     if (!dateFrom) {
//       showAlert('warning', 'يرجى اختيار تاريخ البداية');
//       return;
//     }

//     setLoading(true);

//     try {
//       const payload = {
//         reason: bulkReason || 'إذن جماعي'
//       };

//       if (bulkMode === 'users') {
//         payload.userIds = selectedUsers.map(u => u._id);
//       } else {
//         payload.branchId = bulkBranch;
//       }

//       if (dateTo) {
//         payload.dateFrom = dateFrom;
//         payload.dateTo = dateTo;
//       } else {
//         payload.date = dateFrom;
//       }

//       console.log('📤 Bulk payload:', payload);
//       const response = await bulkGrantRemotePermission(payload);

//       const count = response.data?.usersCount || selectedUsers.length;
//       const daysCount = response.data?.datesCount || 1;
      
//       showAlert('success', `تم منح ${daysCount} إذن لـ ${count} موظف بنجاح`);
//       resetBulkForm();
//     } catch (error) {
//       console.error('❌ Error:', error);
//       showAlert('danger', error.response?.data?.message || 'فشل منح الأذونات');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleUserSelection = (user) => {
//     const exists = selectedUsers.find(u => u._id === user._id);
//     if (exists) {
//       setSelectedUsers(selectedUsers.filter(u => u._id !== user._id));
//     } else {
//       setSelectedUsers([...selectedUsers, user]);
//     }
//   };

//   const selectUserForSingle = (user) => {
//     setSelectedUser(user);
//     setUsers([]);
//     setSearchQuery(user.name);
//   };

//   return (
//     <div className="remote-permission-container">
//       <div className="container">
//         <div className="permission-card">
//           {/* Header */}
//           <div className="permission-header">
//             <div className="d-flex align-items-center gap-3">
//               <div className="permission-header-icon">
//                 <i className="fas fa-map-marker-alt fa-2x"></i>
//               </div>
//               <div>
//                 <h2 className="mb-1">{t('REMOTE_PERMISSION.remotePermissionManagement')}</h2>
//                 <p className="mb-0 opacity-75">{t('REMOTE_PERMISSION.remotePermissionDescription')}</p>
//               </div>
//             </div>
//           </div>

//           {/* Alert Messages */}
//           {alert.show && (
//             <div className="mx-4 mt-4">
//               <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
//                 <i className={`fas fa-${alert.type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2`}></i>
//                 {alert.message}
//                 <button 
//                   type="button" 
//                   className="btn-close" 
//                   onClick={() => setAlert({ show: false, type: '', message: '' })}
//                 ></button>
//               </div>
//             </div>
//           )}

//           {/* Info Box */}
//           <div className="mx-4">
//             <div className="info-box">
//               <div className="d-flex gap-3">
//                 <div className="info-box-icon">
//                   <i className="fas fa-info-circle"></i>
//                 </div>
//                 <div>
//                   <h6 className="fw-bold mb-2">{t('REMOTE_PERMISSION.importantNote')}</h6>
//                   <p className="mb-0 small">{t('REMOTE_PERMISSION.remotePermissionNote')}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Tabs */}
//           <ul className="nav nav-tabs nav-tabs-custom px-4">
//             <li className="nav-item">
//               <button
//                 className={`nav-link ${activeTab === 'single' ? 'active' : ''}`}
//                 onClick={() => setActiveTab('single')}
//               >
//                 <i className="fas fa-user me-2"></i>
//                 {t('REMOTE_PERMISSION.singlePermission')}
//               </button>
//             </li>
//             <li className="nav-item">
//               <button
//                 className={`nav-link ${activeTab === 'bulk' ? 'active' : ''}`}
//                 onClick={() => setActiveTab('bulk')}
//               >
//                 <i className="fas fa-users me-2"></i>
//                 {t('REMOTE_PERMISSION.bulkPermission')}
//               </button>
//             </li>
//             <li className="nav-item">
//     <button
//       className={`nav-link ${activeTab === 'list' ? 'active' : ''}`}
//       onClick={() => setActiveTab('list')}
//     >
//       <i className="fas fa-list me-2"></i>
//       {t('REMOTE_PERMISSION.permissionsList')}
//     </button>
//   </li>
//           </ul>

//           {/* Tab Content */}
//          {/* Tab Content */}
// <div className="p-4">

//   {activeTab === 'single' && (
//     <SinglePermission
//       selectedUser={selectedUser}
//       singleBranch={singleBranch}
//       singleDate={singleDate}
//       singleReason={singleReason}
//       setSingleBranch={setSingleBranch}
//       setSingleDate={setSingleDate}
//       setSingleReason={setSingleReason}
//       branches={branches}
//       loading={loading}
//       handleGrantSingle={handleGrantSingle}
//       resetSingleForm={resetSingleForm}
//       searchQuery={searchQuery}
//       handleSearchUsers={handleSearchUsers}
//       users={users}
//       isSearching={isSearching}
//       selectUserForSingle={selectUserForSingle}
//       setSelectedUser={setSelectedUser}
//       setSearchQuery={setSearchQuery}
//     />
//   )}

//   {activeTab === 'bulk' && (
//     <BulkPermission
//       bulkMode={bulkMode}
//       setBulkMode={setBulkMode}
//       selectedUsers={selectedUsers}
//       bulkBranch={bulkBranch}
//       dateFrom={dateFrom}
//       dateTo={dateTo}
//       bulkReason={bulkReason}
//       setBulkBranch={setBulkBranch}
//       setDateFrom={setDateFrom}
//       setDateTo={setDateTo}
//       setBulkReason={setBulkReason}
//       branches={branches}
//       loading={loading}
//       handleGrantBulk={handleGrantBulk}
//       resetBulkForm={resetBulkForm}
//       searchQuery={searchQuery}
//       handleSearchUsers={handleSearchUsers}
//       users={users}
//       isSearching={isSearching}
//       toggleUserSelection={toggleUserSelection}
//       setSelectedUsers={setSelectedUsers}
//     />
//   )}

//   {activeTab === 'list' && (
//     <RemotePermissionsList branches={branches} />
//   )}

// </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default RemotePermission;



// src/pages/RemotePermission.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  grantRemotePermission,
  bulkGrantRemotePermission
} from '../services/remotePermission.service';
import { searchUsers }    from '../services/user.api';
import { getBranchLookup } from '../services/branch.api';

import UserSearch          from '../components/RemotePermission/UserSearch';
import SinglePermission    from '../components/RemotePermission/SinglePermission';
import BulkPermission      from '../components/RemotePermission/BulkPermission';
import BulkGrantResult     from '../components/RemotePermission/BulkGrantResult';
import RemotePermissionsList from './RemotePermissionsList';
import Toast from '../components/ui/Toast';
import '../style/remote-permission.css';

function RemotePermission() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('single');
  const [loading, setLoading]     = useState(false);
  // const [alert, setAlert]         = useState({ show: false, type: '', message: '' });
const [toast, setToast] = useState({
  show: false,
  type: '',
  message: '',
  onConfirm: null
});
  // ── Bulk result modal state ──
  const [bulkResult, setBulkResult] = useState(null);

  // ── Single Permission States ──
  const [selectedUser, setSelectedUser] = useState(null);
  const [singleBranch, setSingleBranch] = useState('');
  const [singleDate, setSingleDate]     = useState('');
  const [singleReason, setSingleReason] = useState('');

  // ── Bulk Permission States ──
  const [bulkMode, setBulkMode]         = useState('users');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [bulkBranch, setBulkBranch]     = useState('');
  const [dateFrom, setDateFrom]         = useState('');
  const [dateTo, setDateTo]             = useState('');
  const [bulkReason, setBulkReason]     = useState('');

  // ── Search / Data ──
  const [users, setUsers]               = useState([]);
  const [branches, setBranches]         = useState([]);
  const [searchQuery, setSearchQuery]   = useState('');
  const [isSearching, setIsSearching]   = useState(false);

  useEffect(() => { loadBranches(); }, []);

  /* ─────────────────────────────────────────── */

  const loadBranches = async () => {
    try {
      const response = await getBranchLookup();
      let branchesData = [];
      if (Array.isArray(response))               branchesData = response;
      else if (Array.isArray(response?.data))    branchesData = response.data;
      else if (Array.isArray(response?.data?.data)) branchesData = response.data.data;
      setBranches(branchesData);
    } catch {
      setBranches([]);
    }
  };

  const handleSearchUsers = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) { setUsers([]); setIsSearching(false); return; }

    setIsSearching(true);
    try {
      const response = await searchUsers(query);
      let usersData = [];
      if (Array.isArray(response))               usersData = response;
      else if (Array.isArray(response?.data))    usersData = response.data;
      else if (Array.isArray(response?.data?.data)) usersData = response.data.data;
      setUsers(usersData);
    } catch {
      setUsers([]);
    } finally {
      setIsSearching(false);
    }
  };

  /* ── Alert helper (auto-dismiss in 5s) ── */
  // const showAlert = (type, message) => {
  //   setAlert({ show: true, type, message });
  //   setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  // };
const showToast = (type, message, onConfirm = null) => {
  setToast(prev => ({
    ...prev,
    show: true,
    type,
    message,
    onConfirm
  }));
};
  /* ── Reset helpers ── */
  const resetSingleForm = () => {
    setSelectedUser(null);
    setSingleBranch('');
    setSingleDate('');
    setSingleReason('');
    setSearchQuery('');
    setUsers([]);
  };

  const resetBulkForm = () => {
    setSelectedUsers([]);
    setBulkBranch('');
    setDateFrom('');
    setDateTo('');
    setBulkReason('');
    setSearchQuery('');
    setUsers([]);
  };

  /* ─────────────────────────────────────────── */
  /*  GRANT — Single                             */
  /* ─────────────────────────────────────────── */

  const handleGrantSingle = async () => {
    if (!selectedUser) { showToast('warning', t('REMOTE_PERMISSION.SELECT_EMPLOYEE')); return; }
    if (!singleDate)   { showToast('warning', t('REMOTE_PERMISSION.SELECT_DATE'));     return; }

    setLoading(true);
    try {
      const response = await grantRemotePermission({
        userId:   selectedUser._id,
        branchId: singleBranch || undefined,
        date:     singleDate,
        reason:   singleReason
      });
      showToast('success', response.data?.message || t('REMOTE_PERMISSION.GRANT_SUCCESS'));
      resetSingleForm();
    } catch (error) {
      // 409 = duplicate — give specific message
      const msg = error.response?.data?.message || t('REMOTE_PERMISSION.GRANT_FAILED');
      showToast('error', msg);
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────────────────────────────────── */
  /*  GRANT — Bulk                               */
  /* ─────────────────────────────────────────── */

  const handleGrantBulk = async () => {
    if (bulkMode === 'users' && selectedUsers.length === 0) {
      showToast('warning', t('REMOTE_PERMISSION.SELECT_EMPLOYEE_ONE')); return;
    }
    if (bulkMode === 'branch' && !bulkBranch) {
      showToast('warning', t('REMOTE_PERMISSION.SELECT_BRANCH')); return;
    }
    if (!dateFrom) {
      showToast('warning', t('REMOTE_PERMISSION.SELECT_DATE_FROM')); return;
    }

    setLoading(true);
    try {
      const payload = { reason: bulkReason || t('REMOTE_PERMISSION.BULK_DEFAULT_REASON') };

      if (bulkMode === 'users') payload.userIds  = selectedUsers.map(u => u._id);
      else                      payload.branchId = bulkBranch;

      if (dateTo) { payload.dateFrom = dateFrom; payload.dateTo = dateTo; }
      else        { payload.date = dateFrom; }

      const response = await bulkGrantRemotePermission(payload);
      const data     = response.data;

      if (data.allGranted) {
        // ✅ كل شيء نجح — alert بسيط يكفي
        showToast('success', data.summary || t('REMOTE_PERMISSION.BULK_GRANT_SUCCESS'));
        resetBulkForm();
      } else {
        // ⚠️ في تخطيات أو partial — افتح المودال التفصيلي
        setBulkResult(data);
        // لا نعمل reset هنا — المستخدم يشوف التفاصيل الأول
      }

    } catch (error) {
      // 500 حقيقي أو validation error — مش duplicate
      const msg = error.response?.data?.message || t('REMOTE_PERMISSION.BULK_GRANT_FAILED');
      showToast('error', msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Helpers ── */
  const toggleUserSelection = (user) => {
    const exists = selectedUsers.find(u => u._id === user._id);
    setSelectedUsers(exists
      ? selectedUsers.filter(u => u._id !== user._id)
      : [...selectedUsers, user]
    );
  };

  const selectUserForSingle = (user) => {
    setSelectedUser(user);
    setUsers([]);
    setSearchQuery(user.name);
  };

  /* ─────────────────────────────────────────── */
  /*  RENDER                                     */
  /* ─────────────────────────────────────────── */

  return (
    <div className="remote-permission-container">
      <div className="container">
        <div className="permission-card">

          {/* Header */}
          <div className="permission-header">
            <div className="d-flex align-items-center gap-3">
              <div className="permission-header-icon">
                <i className="fas fa-map-marker-alt fa-2x"></i>
              </div>
              <div>
                <h2 className="mb-1">{t('REMOTE_PERMISSION.remotePermissionManagement')}</h2>
                <p className="mb-0 opacity-75">{t('REMOTE_PERMISSION.remotePermissionDescription')}</p>
              </div>
            </div>
          </div>

          {/* Alert */}
          {/* {alert.show && (
            <div className="mx-4 mt-4">
              <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                <i className={`fas fa-${alert.type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2`}></i>
                {alert.message}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setAlert({ show: false, type: '', message: '' })}
                />
              </div>
            </div>
          )} */}

          {/* Info box */}
          <div className="mx-4">
            <div className="info-box">
              <div className="d-flex gap-3">
                <div className="info-box-icon"><i className="fas fa-info-circle"></i></div>
                <div>
                  <h6 className="fw-bold mb-2">{t('REMOTE_PERMISSION.importantNote')}</h6>
                  <p className="mb-0 small">{t('REMOTE_PERMISSION.remotePermissionNote')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <ul className="nav nav-tabs nav-tabs-custom px-4">
            {[
              { key: 'single', icon: 'user',    label: 'singlePermission'  },
              { key: 'bulk',   icon: 'users',   label: 'bulkPermission'    },
              { key: 'list',   icon: 'list',    label: 'permissionsList'   }
            ].map(({ key, icon, label }) => (
              <li className="nav-item" key={key}>
                <button
                  className={`nav-link ${activeTab === key ? 'active' : ''}`}
                  onClick={() => setActiveTab(key)}
                >
                  <i className={`fas fa-${icon} me-2`}></i>
                  {t(`REMOTE_PERMISSION.${label}`)}
                </button>
              </li>
            ))}
          </ul>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === 'single' && (
              <SinglePermission
                selectedUser={selectedUser}
                singleBranch={singleBranch}
                singleDate={singleDate}
                singleReason={singleReason}
                setSingleBranch={setSingleBranch}
                setSingleDate={setSingleDate}
                setSingleReason={setSingleReason}
                branches={branches}
                loading={loading}
                handleGrantSingle={handleGrantSingle}
                resetSingleForm={resetSingleForm}
                searchQuery={searchQuery}
                handleSearchUsers={handleSearchUsers}
                users={users}
                isSearching={isSearching}
                selectUserForSingle={selectUserForSingle}
                setSelectedUser={setSelectedUser}
                setSearchQuery={setSearchQuery}
                showToast={showToast}
              />
            )}

            {activeTab === 'bulk' && (
              <BulkPermission
                bulkMode={bulkMode}
                setBulkMode={setBulkMode}
                selectedUsers={selectedUsers}
                bulkBranch={bulkBranch}
                dateFrom={dateFrom}
                dateTo={dateTo}
                bulkReason={bulkReason}
                setBulkBranch={setBulkBranch}
                setDateFrom={setDateFrom}
                setDateTo={setDateTo}
                setBulkReason={setBulkReason}
                branches={branches}
                loading={loading}
                handleGrantBulk={handleGrantBulk}
                resetBulkForm={resetBulkForm}
                searchQuery={searchQuery}
                handleSearchUsers={handleSearchUsers}
                users={users}
                isSearching={isSearching}
                toggleUserSelection={toggleUserSelection}
                setSelectedUsers={setSelectedUsers}
                showToast={showToast}
              />
            )}

            {activeTab === 'list' && (
              <RemotePermissionsList branches={branches} 
              showToast={showToast}/>
            )}
          </div>
        </div>
      </div>

      {/* ── Bulk Result Modal — يظهر فقط لو في تخطيات ── */}
      {bulkResult && (
        <BulkGrantResult
          result={bulkResult}
          onClose={() => {
            setBulkResult(null);
            resetBulkForm();
          
          }}
          showToast={showToast}
        />
      )}

      <Toast
  show={toast.show}
  message={toast.message}
  type={toast.type}
  onConfirm={toast.onConfirm}
  onClose={() => setToast(prev => ({ ...prev, show: false }))}
/>

    </div>
  );
}

export default RemotePermission;