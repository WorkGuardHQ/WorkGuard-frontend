// // // src/pages/Dashboard/DashboardPage.jsx







// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import '../../style/dashboard.css';
// import logo from '../../assets/logo.png';

// const DashboardPage = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   const quickActions = [
//     {
//       id: 'add-employee',
//       title: 'Add New Employee',
//       titleAr: 'إضافة موظف جديد',
//       description: 'Register a new employee in the system',
//       descriptionAr: 'تسجيل موظف جديد في النظام',
//       icon: 'fa-user-plus',
//       color: '#10b981',
//       path: '/add-employee'
//     },
//     {
//       id: 'view-employees',
//       title: 'Employee Directory',
//       titleAr: 'دليل الموظفين',
//       description: 'View and manage employee profiles',
//       descriptionAr: 'عرض وإدارة ملفات الموظفين',
//       icon: 'fa-users',
//       color: '#3b82f6',
//       path: '/admin/employees'
//     },
//     {
//       id: 'reports',
//       title: 'Reports & Analytics',
//       titleAr: 'التقارير والتحليلات',
//       description: 'Generate comprehensive HR reports',
//       descriptionAr: 'إنشاء تقارير شاملة للموارد البشرية',
//       icon: 'fa-chart-line',
//       color: '#8b5cf6',
//       path: '/admin/reports'
//     }
//   ];

//   const adminModules = [
//           {
//       id: 'payroll',
//       title: 'Payroll Management',
//       titleAr: 'إدارة الرواتب',
//       description: 'Process and manage employee payrolls',
//       descriptionAr: 'معالجة وإدارة رواتب الموظفين',
//       icon: 'fa-money-bill-wave',
//       color: '#10b981',
//       path: '/payroll'
//     },
    
//     {
//        id: 'overtime',
//       title: 'Overtime Policies',
//       titleAr: 'سياسات الإضافي',
//       description: 'Manage and configure overtime policies',
//       descriptionAr: 'إدارة وتكوين سياسات العمل الإضافي',
//       icon: 'fa-clock',
//       color: '#8b5cf6',
//       path: '/admin/overtime-policies'
//     },
//     {
//       id: 'bonus',
//       title: 'Bonus Policies',
//       titleAr: 'سياسات المكافآت',
//       description: 'Manage and configure bonus policies',
//       descriptionAr: 'إدارة وتكوين سياسات المكافآت',
//       icon: 'fa-gift',
//       color: '#ec4899',
//       path: '/admin/bonus-policies'
//     },
//     {
//       id: 'overtimeentries',
//       title: 'Overtime Entries',
//       titleAr: 'سجلات العمل الإضافي',
//       description: 'Manage and review overtime entries',
//       descriptionAr: 'إدارة ومراجعة سجلات العمل الإضافي',
//       icon: 'fa-clock',
//       color: '#f59e0b',
//       path: '/admin/overtime-entries'
//     },
//     {
//       id: 'holidays',
//       title: 'Holidays & Events Management',
//       titleAr: 'إدارة الإجازات',
//       description: 'Manage company-wide and employee-specific holidays',
//       descriptionAr: 'إدارة الإجازات الرسمية للشركة والموظفين',
//       icon: 'fa-calendar-alt',
//       color: '#667eea',
//       path: '/admin/holidays'
//     },
//     // {
//     //   id: 'payroll',
//     //   title: 'Payroll Management',
//     //   titleAr: 'إدارة الرواتب',
//     //   description: 'View and manage employee payrolls',
//     //   descriptionAr: 'عرض وإدارة رواتب الموظفين',
//     //   icon: 'fa-money-bill-wave',
//     //   color: '#48bb78',
//     //   path: '/payroll'
//     // },
 
//     {
//       id: 'attendance',
//       title: 'Attendance Policies',
//       titleAr: 'سياسات الحضور',
//       description: 'Configure attendance and deduction policies',
//       descriptionAr: 'إعداد سياسات الحضور والخصومات',
//       icon: 'fa-user-clock',
//       color: '#f59e0b',
//       path: '/admin/attendance-policies'
//     },
//     // {
//     //   id: 'leaves',
//     //   title: 'Leave Requests',
//     //   titleAr: 'طلبات الإجازات',
//     //   description: 'Review and approve leave requests',
//     //   descriptionAr: 'مراجعة والموافقة على طلبات الإجازات',
//     //   icon: 'fa-umbrella-beach',
//     //   color: '#ec4899',
//     //   path: '/leaves'
//     // }
//     // ,
//     //  {
//     //   id: 'LeavePolicies',
//     //   title: 'Leave Policies',
//     //   titleAr: 'طلبات الإجازات',
//     //   description: 'Manage employee leave policies and entitlements',
//     //   descriptionAr: 'إدارة سياسات واستحقاقات إجازات الموظفين',
//     //   icon: 'fa-file-alt',
//     //   color: '#7f48ec',
//     //   path: '/admin/leave-policies'
//     // },
//         {
//       id: 'leaves',
//       title: 'Leave Management',
//       titleAr: 'إدارة الإجازات',
//       description: 'Manage leave requests and policies',
//       descriptionAr: 'إدارة طلبات الإجازات والسياسات',
//       icon: 'fa-umbrella-beach',
//       // color: '#ec4899',
//             color: '#f2f20d',

//       path: '/admin/leaves'
//     },
//     {
//       id: 'Device Control',
//       title: 'Device Control',
//       titleAr: 'طلبات الإجازات',
//       description: 'Manage and monitor all registered devices',
//       descriptionAr: 'إدارة ومراقبة جميع الأجهزة المسجلة',
//       icon: 'fa-desktop',
//       color: '#38bdf8',
//       path: '/admin/devices'
//     },
//     //    {
//     //   id: 'Manage Branches',
//     //   title: 'Manage Branches',
//     //   titleAr: 'ادارة الفروع',
//     //   description: 'Manage and monitor all company branches',
//     //   descriptionAr: 'إدارة ومراقبة جميع فروع الشركة',
//     //   icon: 'fa-building',
//     //   color: '#ec9748',
//     //   path: '/adminbranches'
//     // },
//   {
//       id: 'branches',
//       title: 'Branch Management',
//       titleAr: 'إدارة الفروع',
//       description: 'Manage company branches and locations',
//       descriptionAr: 'إدارة فروع الشركة والمواقع',
//       icon: 'fa-building',
//       color: '#f97316',
//       path: '/adminbranches'
//     },
//      {
//       id: 'Departments ',
//       title:'Departments Management',
//       titleAr: 'إدارة الأقسام',
//       description: 'Manage company departments and employee assignments',
//       descriptionAr: 'إدارة أقسام الشركة وتعيين الموظفين',
//       icon: 'fas fa-sitemap',
//       color: '#8b5cf6',
//       path: '/admin/departments'
//     },

//        {
//       id: 'RemotePermission ',
//       title:'Remote Permission Management',
//       titleAr: 'إدارة أذونات العمل عن بُعد',
//       description: 'Grant employees permission to check in/out from outside branch location',
//       descriptionAr: 'منح الموظفين إذن تسجيل الحضور والانصراف من خارج نطاق الفرع',
//       icon: ' fas fa-map-marker-alt fa-2x',
//       color: 'hsl(203, 80%, 21%)',
//       path: '/admin/RemotePermission'
//     },
//   ];


//   //   {
//   //     id: 'attendance',
//   //     title: 'Attendance Management',
//   //     titleAr: 'إدارة الحضور',
//   //     description: 'Track employee attendance and working hours',
//   //     descriptionAr: 'تتبع حضور الموظفين وساعات العمل',
//   //     icon: 'fa-clock',
//   //     color: '#f59e0b',
//   //     path: '/admin/attendance-policies'
//   //   },
//   //   {
//   //     id: 'leaves',
//   //     title: 'Leave Management',
//   //     titleAr: 'إدارة الإجازات',
//   //     description: 'Manage leave requests and policies',
//   //     descriptionAr: 'إدارة طلبات الإجازات والسياسات',
//   //     icon: 'fa-umbrella-beach',
//   //     color: '#ec4899',
//   //     path: '/leaves'
//   //   },
//   //   {
//   //     id: 'payroll',
//   //     title: 'Payroll Management',
//   //     titleAr: 'إدارة الرواتب',
//   //     description: 'Process and manage employee payrolls',
//   //     descriptionAr: 'معالجة وإدارة رواتب الموظفين',
//   //     icon: 'fa-money-bill-wave',
//   //     color: '#10b981',
//   //     path: '/payroll'
//   //   },
//   //   {
//   //     id: 'holidays',
//   //     title: 'Holidays & Events',
//   //     titleAr: 'الإجازات والمناسبات',
//   //     description: 'Manage company holidays and events',
//   //     descriptionAr: 'إدارة إجازات الشركة والمناسبات',
//   //     icon: 'fa-calendar-alt',
//   //     color: '#667eea',
//   //     path: '/admin/holidays'
//   //   },
//     // {
//     //   id: 'branches',
//     //   title: 'Branch Management',
//     //   titleAr: 'إدارة الفروع',
//     //   description: 'Manage company branches and locations',
//     //   descriptionAr: 'إدارة فروع الشركة والمواقع',
//     //   icon: 'fa-building',
//     //   color: '#f97316',
//     //   path: '/adminbranches'
//     // },
//   //   {
//   //     id: 'devices',
//   //     title: 'Device Control',
//   //     titleAr: 'التحكم في الأجهزة',
//   //     description: 'Monitor and manage registered devices',
//   //     descriptionAr: 'مراقبة وإدارة الأجهزة المسجلة',
//   //     icon: 'fa-desktop',
//   //     color: '#06b6d4',
//   //     path: '/admin/devices'
//   //   },
//   //   {
//   //     id: 'remote',
//   //     title: 'Remote Permissions',
//   //     titleAr: 'أذونات العمل عن بُعد',
//   //     description: 'Manage remote check-in permissions',
//   //     descriptionAr: 'إدارة أذونات تسجيل الحضور عن بُعد',
//   //     icon: 'fa-map-marker-alt',
//   //     color: '#14532d',
//   //     path: '/admin/RemotePermission'
//   //   },
//   //   {
//   //     id: 'leave-policies',
//   //     title: 'Leave Policies',
//   //     titleAr: 'سياسات الإجازات',
//   //     description: 'Configure leave policies and entitlements',
//   //     descriptionAr: 'إعداد سياسات واستحقاقات الإجازات',
//   //     icon: 'fa-file-alt',
//   //     color: '#7c3aed',
//   //     path: '/admin/leave-policies'
//   //   }
//   // ];

//   return (
//     <div className="dashboard-page">
//       <div className="dashboard-container ">
//         {/* Simple Logo Header */}
//         <div className="dashboard-header-simple">
//           <img src={logo} alt="WorkGuard" className="dashboard-logo-simple" />
//         </div>

//         {/* Quick Actions */}
//         <div className="section">
//           <div className="section-header">
//             <h2>
//               <i className="fas fa-bolt"></i>
//               Quick Actions
//             </h2>
//           </div>
//           <div className="quick-actions-grid">
//             {quickActions.map((action) => (
//               <div
//                 key={action.id}
//                 className="action-card-simple"
//                 onClick={() => navigate(action.path)}
//                 style={{ '--action-color': action.color }}
//               >
//                 <div className="action-icon-simple" style={{ background: action.color }}>
//                   <i className={`fas ${action.icon}`}></i>
//                 </div>
//                 <div className="action-content-simple">
//                   <h3>{action.title}</h3>
//                   <p>{action.description}</p>
//                 </div>
//                 <div className="action-arrow-simple">
//                   <i className="fas fa-arrow-right"></i>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Admin Modules */}
//         <div className="section">
//           <div className="section-header">
//             <h2>
//               <i className="fas fa-th-large"></i>
//               Management Modules
//             </h2>
//           </div>
//           <div className="modules-grid-simple">
//             {adminModules.map((module) => (
//               <div
//                 key={module.id}
//                 className="module-card-simple"
//                 onClick={() => navigate(module.path)}
//                 style={{ '--module-color': module.color }}
//               >
//                 <div className="module-icon-simple" style={{ background: module.color }}>
//                   <i className={`fas ${module.icon}`}></i>
//                 </div>
//                 <div className="module-content-simple">
//                   <h3>{module.title}</h3>
//                   <p>{module.description}</p>
//                 </div>
//                 <div className="module-arrow-simple">
//                   <i className="fas fa-chevron-right"></i>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;

















import { useNavigate }     from 'react-router-dom';
import { useTranslation }  from 'react-i18next';
import '../../style/dashboard.css';
import logo from '../../assets/loginlogo.png';

/* ─── data ──────────────────────────────────────────────────────────────────
   النصوص اتشالت من هنا وبقت في ملفات الترجمة.
   كل card بيستخدم مفتاح id للـ t('quickActions.id.title') إلخ
────────────────────────────────────────────────────────────────────────── */
const QUICK_ACTIONS = [
  { id: 'addEmployee',      icon: 'fa-user-plus',      color: '#10b981', path: '/add-employee'          },
  { id: 'viewEmployees',    icon: 'fa-users',           color: '#3b82f6', path: '/admin/employees'       },
  { id: 'reports',          icon: 'fa-chart-line',      color: '#8b5cf6', path: '/admin/reports'         },
];

const ADMIN_MODULES = [
  { id: 'payroll',          icon: 'fa-money-bill-wave', color: '#10b981', path: '/payroll'                      },
  { id: 'overtimePolicies', icon: 'fa-clock',           color: '#8b5cf6', path: '/admin/overtime-policies'      },
  { id: 'bonusPolicies',    icon: 'fa-gift',            color: '#ec4899', path: '/admin/bonus-policies'         },
  { id: 'overtimeEntries',  icon: 'fa-clock',           color: '#f59e0b', path: '/admin/overtime-entries'       },
  { id: 'holidays',         icon: 'fa-calendar-alt',    color: '#667eea', path: '/admin/holidays'               },
  { id: 'attendance',       icon: 'fa-user-clock',      color: '#f59e0b', path: '/admin/attendance-policies'    },
  { id: 'leaves',           icon: 'fa-umbrella-beach',  color: '#f2f20d', path: '/admin/leaves'                 },
  { id: 'devices',          icon: 'fa-desktop',         color: '#38bdf8', path: '/admin/devices'                },
  { id: 'branches',         icon: 'fa-building',        color: '#f97316', path: '/adminbranches'                },
  { id: 'departments',      icon: 'fa-sitemap',         color: '#8b5cf6', path: '/admin/departments'            },
  { id: 'remotePermission', icon: 'fa-map-marker-alt',  color: '#0d4f7a', path: '/admin/RemotePermission'       },
];

/* ══════════════════════════════════════════════════════════════════════════════
   Component
══════════════════════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const { t }    = useTranslation('Dashboard');
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        {/* ── Logo ── */}
        <div className="dashboard-header-simple">
          <img src={logo} alt="WorkGuard" className="dashboard-logo-simple" />
        </div>

        {/* ── Quick Actions ── */}
        <div className="section">
          <div className="section-header">
            <h2>
              <i className="fas fa-bolt" />
              {t('sections.quickActions')}
            </h2>
          </div>
          <div className="quick-actions-grid">
            {QUICK_ACTIONS.map(action => (
              <div
                key={action.id}
                className="action-card-simple"
                onClick={() => navigate(action.path)}
                style={{ '--action-color': action.color }}
              >
                <div className="action-icon-simple" style={{ background: action.color }}>
                  <i className={`fas ${action.icon}`} />
                </div>
                <div className="action-content-simple">
                  <h3>{t(`quickActions.${action.id}.title`)}</h3>
                  <p>{t(`quickActions.${action.id}.description`)}</p>
                </div>
                <div className="action-arrow-simple">
                  <i className="fas fa-arrow-right" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Admin Modules ── */}
        <div className="section">
          <div className="section-header">
            <h2>
              <i className="fas fa-th-large" />
              {t('sections.modules')}
            </h2>
          </div>
          <div className="modules-grid-simple">
            {ADMIN_MODULES.map(module => (
              <div
                key={module.id}
                className="module-card-simple"
                onClick={() => navigate(module.path)}
                style={{ '--module-color': module.color }}
              >
                <div className="module-icon-simple" style={{ background: module.color }}>
                  <i className={`fas ${module.icon}`} />
                </div>
                <div className="module-content-simple">
                  <h3>{t(`modules.${module.id}.title`)}</h3>
                  <p>{t(`modules.${module.id}.description`)}</p>
                </div>
                <div className="module-arrow-simple">
                  <i className="fas fa-chevron-right" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}