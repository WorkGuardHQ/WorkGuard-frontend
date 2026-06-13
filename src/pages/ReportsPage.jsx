

// src/pages/Reports/ReportsPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from '../components/ui/Toast';

import ReportFilters from '../components/reports/ReportFilters';
import CompanyMonthReport  from '../components/reports/CompanyMonthReport';
import CompanyYearReport   from '../components/reports/CompanyYearReport';
import UserMonthReport     from '../components/reports/UserMonthReport';

import {
  getCompanyMonthReport,  downloadCompanyMonthPdf,  downloadCompanyMonthExcel,
  getCompanyYearReport,   downloadCompanyYearPdf,   downloadCompanyYearExcel,
  getUserMonthReport,     downloadUserMonthPdf,     downloadUserMonthExcel,
} from '../services/report.api';

import { getBranchLookup } from '../services/branch.api';
import { getDepartments }  from '../services/department.api';
import { getTokenPayload } from '../helpers/auth';

import '../style/Reports.css';

const TABS = [
  { key: 'companyMonth', icon: 'fa-calendar-day' },
  { key: 'companyYear',  icon: 'fa-calendar'      },
  { key: 'employee',     icon: 'fa-user-tie'       },
];

function getAdminScopeFromToken() {
  const payload = getTokenPayload();
  if (!payload) return null;
  return payload.adminScope || { type: 'GLOBAL', branches: [] };
}

/** Safe array extraction from any API response shape */
function extractArray(res, keys = ['branches','departments','data','users']) {
  const d = res?.data ?? res;
  if (Array.isArray(d)) return d;
  for (const k of keys) {
    if (Array.isArray(d?.[k])) return d[k];
  }
  return [];
}

export default function ReportsPage() {
  const { t, i18n } = useTranslation('companyReport');
  const isRTL = i18n.language === 'ar';

  const [activeTab,  setActiveTab]  = useState('companyMonth');
  const [report,     setReport]     = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [dlLoading,  setDlLoading]  = useState(false);

  /* Keep last params so page-change + download can re-use them */
  const [lastParams, setLastParams] = useState(null);
  const [lastUserId, setLastUserId] = useState(null);

  const [branches,    setBranches]    = useState([]);
  const [departments, setDepartments] = useState([]);
  const [adminScope,  setAdminScope]  = useState(null);

  const [toast, setToast] = useState({ show:false, message:'', type:'error' });
  const showError = msg => setToast({ show:true, message:msg, type:'error' });

  /* ── Load branches, departments, scope on mount ──────── */
  useEffect(() => {
    setAdminScope(getAdminScopeFromToken());

    async function loadMeta() {
      const [brRes, deptRes] = await Promise.allSettled([
        getBranchLookup(),
        getDepartments({ limit: 200 }),
      ]);

      if (brRes.status === 'fulfilled') {
        // ✅ handles { branches:[...] }, { data:[...] }, [...] all at once
        setBranches(extractArray(brRes.value, ['branches','data','users']));
      }
      if (deptRes.status === 'fulfilled') {
        setDepartments(extractArray(deptRes.value, ['departments','data','users']));
      }
    }
    loadMeta();
  }, []);

  /* ── Tab change resets report ────────────────────────── */
  const handleTabChange = tab => {
    setActiveTab(tab);
    setReport(null);
    setLastParams(null);
    setLastUserId(null);
  };

  /* ── Core fetch ──────────────────────────────────────── */
  const fetchReport = useCallback(async (reportType,params, userId = null) => {
    setLoading(true);
    try {
      // let res;
      // if (activeTab === 'companyMonth') {
      //   res = await getCompanyMonthReport(params);
      // } else if (activeTab === 'companyYear') {
      //   res = await getCompanyYearReport(params);
      // } else {
      //   res = await getUserMonthReport(userId, {
      //     year:                  params.year,
      //     month:                 params.month,
      //     requireApprovedPayroll:params.requireApprovedPayroll,
      //     includeLeaves:         true,
      //     includeOvertime:       true,
      //     includeLeaveBalance:   true,
      //   });
      // }
      let res;

if (reportType === 'companyMonth') {
  res = await getCompanyMonthReport(params);
}
else if (reportType === 'companyYear') {
  res = await getCompanyYearReport(params);
}
else {
  res = await getUserMonthReport(userId, {
    year: params.year,
    month: params.month,
    requireApprovedPayroll:
      params.requireApprovedPayroll,
    includeLeaves: true,
    includeOvertime: true,
    includeLeaveBalance: true,
  });
}
      const data = res.data?.data || res.data || null;
      setReport(data);
      return data;
    } catch (err) {
      showError(err.response?.data?.message || t('errors.fetchFailed'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [activeTab, t]);

  /* ── Generate (from filter bar) ─────────────────────── */
  const handleGenerate = useCallback(async ({
    year, month, branchId, departmentId,
    userId, payrollApprovedOnly, requireApprovedPayroll,
    page = 1, limit = 50,
  }) => {
    setReport(null);

    const params = {
      year, branchId, departmentId,
      payrollApprovedOnly,
      page, limit,
      ...(activeTab !== 'companyYear' && { month }),
    };

    setLastParams({ ...params, requireApprovedPayroll });
    setLastUserId(userId || null);

await fetchReport(
  activeTab,
  params,
  userId
);

}, [activeTab, fetchReport]);

  /* ── Page change (from EmployeesTable pagination) ────── */
  const handlePageChange = useCallback(async (page) => {
    if (!lastParams) return;
    const params = { ...lastParams, page };
    setLastParams(params);
    await fetchReport(
  activeTab,
  params,
  lastUserId
);
  }, [lastParams, lastUserId, fetchReport]);

  /* ── Download ────────────────────────────────────────── */
  const handleDownload = useCallback(async (format) => {
    if (!lastParams) return;
    setDlLoading(true);
    try {
      if (activeTab === 'companyMonth') {
        format === 'pdf'
          ? await downloadCompanyMonthPdf(lastParams)
          : await downloadCompanyMonthExcel(lastParams);
      } else if (activeTab === 'companyYear') {
        format === 'pdf'
          ? await downloadCompanyYearPdf(lastParams)
          : await downloadCompanyYearExcel(lastParams);
      } else if (lastUserId) {
        format === 'pdf'
          ? await downloadUserMonthPdf(lastUserId, lastParams)
          : await downloadUserMonthExcel(lastUserId, lastParams);
      }
    } catch {
      showError(t('errors.downloadFailed'));
    } finally {
      setDlLoading(false);
    }
  }, [activeTab, lastParams, lastUserId, t]);

  /* ── Employee drill-down from company table ──────────── */
  const handleSelectUser = useCallback((userId) => {
    setActiveTab('employee');
    setReport(null);
    if (lastParams?.year && lastParams?.month) {
      const params = {
        year:  lastParams.year,
        month: lastParams.month,
        requireApprovedPayroll: false,
      };
      setLastParams(params);
      setLastUserId(userId);
fetchReport(
  'employee',
  params,
  userId
);

}
  }, [lastParams, fetchReport]);

  /* ── Render ──────────────────────────────────────────── */
  return (
    <div className="reports-page" dir={isRTL ? 'rtl' : 'ltr'}>

      <div className="reports-header">
        <h2>
          {/* <i className="fa-solid fa-chart-bar me-2" style={{ color:'#1F3864' }} /> */}
          <i className="fa-solid fa-chart-bar me-2 reports-title-icon" />

          {t('title')}
        </h2>
      </div>

      <div className="report-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`report-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => handleTabChange(tab.key)}
          >
            <i className={`fa-solid ${tab.icon}`} />
            {t(`tabs.${tab.key}`)}
          </button>
        ))}
      </div>

      <ReportFilters
        activeTab={activeTab}
        branches={branches}
        departments={departments}
        adminScope={adminScope}
        onGenerate={handleGenerate}
        onDownload={handleDownload}
        hasReport={!!report}
        loading={loading}
        downloadLoading={dlLoading}
      />

      {loading && (
        <div className="report-loading">
          <i className="fa-solid fa-spinner fa-spin fa-lg" />
          {t('filters.generating')}
        </div>
      )}

      {!loading && !report && (
        <div className="report-empty">
          <i className="fa-solid fa-chart-column" />
          <p>{t('empty.selectFilters')}</p>
        </div>
      )}

      {!loading && report && (
        <>
          {activeTab === 'companyMonth' && (
            <CompanyMonthReport
              report={report}
              onSelectUser={handleSelectUser}
              onPageChange={handlePageChange}
            />
          )}
          {activeTab === 'companyYear' && (
            <CompanyYearReport
              report={report}
              onSelectUser={handleSelectUser}
              onPageChange={handlePageChange}
            />
          )}
          {activeTab === 'employee' && (
            <UserMonthReport report={report} />
          )}
        </>
      )}

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(p => ({ ...p, show:false }))}
      />
    </div>
  );
}