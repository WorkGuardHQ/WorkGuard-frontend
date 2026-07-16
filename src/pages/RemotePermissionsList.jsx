// // src/pages/RemotePermissionsList.jsx
// import { useEffect, useState } from 'react';
// import {
//   getRemotePermissions,
//   getRemotePermissionsStats,
//   revokeRemotePermission
// } from '../services/remotePermission.service';

// import PermissionsTable from '../components/RemotePermission/RemotePermissionsList/PermissionsTable';
// import PermissionsFilters from '../components/RemotePermission/RemotePermissionsList/PermissionsFilters';
// // import PermissionsStats from '../components/RemotePermissions/PermissionsStats';

// function RemotePermissionsList({ branches = [] }) {
//   const [permissions, setPermissions] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const [filters, setFilters] = useState({
//     page: 1,
//     limit: 20,
//     branchId: '',
//     userId: '',
//     status: 'active',
//     search: '',
//     dateFrom: '',
//     dateTo: ''
//   });

//   const [pagination, setPagination] = useState({});

//   useEffect(() => {
//     fetchData();
//   }, [filters]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [listRes, statsRes] = await Promise.all([
//         getRemotePermissions(filters),
//         getRemotePermissionsStats(filters)
//       ]);

//       setPermissions(listRes.data.permissions);
//       setPagination(listRes.data.pagination);
//       setStats(statsRes.data);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRevoke = async ({ userId, permissionId, reason }) => {
//     await revokeRemotePermission({ userId, permissionId, reason });
//     fetchData(); // refresh
//   };

//   return (
//     <div className="container py-4">
//       {/* <PermissionsStats stats={stats} /> */}

//       <PermissionsFilters
//   filters={filters}
//   setFilters={setFilters}
//   branches={branches}
// />


//       <PermissionsTable
//         data={permissions}
//         loading={loading}
//         pagination={pagination}
//         onPageChange={(page) =>
//           setFilters({ ...filters, page })
//         }
//         onRevoke={handleRevoke}
//       />

//     </div>
//   );
// }

// export default RemotePermissionsList;
// src/pages/RemotePermissionsList.jsx

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Toast from '../components/ui/Toast';
import useToast from '../hooks/useToast';

import {
  getRemotePermissions,
  getRemotePermissionsStats,
  revokeRemotePermission
} from '../services/remotePermission.service';

import PermissionsTable from
  '../components/RemotePermission/RemotePermissionsList/PermissionsTable';
import PermissionsFilters from
  '../components/RemotePermission/RemotePermissionsList/PermissionsFilters';
// import PermissionsStats from '../components/RemotePermissions/PermissionsStats';
import '../style/remote-permission.css';



function RemotePermissionsList({ branches = [] }) {
  const { t } = useTranslation();
  const { toast, showToast, hideToast } = useToast();

  const [permissions, setPermissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    // branchId: '',
    branchId: 'all',
    userId: '',
    status: 'active',
    search: '',
    dateFrom: '',
    dateTo: ''
  });

  const [pagination, setPagination] = useState({});

  /* 🔹 نفس اللوجيك – no change */
 useEffect(()=>{
 fetchData();
},[JSON.stringify(filters)]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        getRemotePermissions(filters),
        getRemotePermissionsStats(filters)
      ]);

      setPermissions(listRes?.data?.permissions || []);
      setPagination(listRes?.data?.pagination || {});
      setStats(statsRes?.data || null);
    } catch (err) {
      showToast({
        type: 'error',
        message: t(
          err.response?.data?.message ||
          'COMMON.FETCH_FAILED'
        )
      });
    } finally {
      setLoading(false);
    }
  };

  /* 🔹 Revoke with confirm toast */
  const handleRevoke = ({ userId, permissionId, reason }) => {
    showToast({
      type: 'warning',
      message: t('REMOTE_PERMISSION.CONFIRM_REVOKE'),
      confirmText: t('COMMON.CONFIRM'),
      cancelText: t('COMMON.CANCEL'),
      onConfirm: async () => {
        try {
          await revokeRemotePermission({
            userId,
            permissionId,
            reason
          });

          showToast({
            type: 'success',
            message: t('REMOTE_PERMISSION.REVOKED_SUCCESS')
          });

          fetchData(); // نفس السلوك
        } catch (err) {
          showToast({
            type: 'error',
            message: t(
              err.response?.data?.message ||
              'REMOTE_PERMISSION.REVOKE_FAILED'
            )
          });
        }
      }
    });
  };

  return (
    <div className="container py-4">

      {/* Filters */}
      <PermissionsFilters
        filters={filters}
        setFilters={setFilters}
        branches={branches}
      />

      {/* Table */}
      <PermissionsTable
        data={permissions}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) =>
          setFilters({ ...filters, page })
        }
        onRevoke={handleRevoke}
      />

      {/* Toast */}
      <Toast {...toast} onClose={hideToast} />
    </div>
  );
}

export default RemotePermissionsList;
