import { useTranslation } from 'react-i18next';
import UserSearch from './UserSearch';
import { getTodayString } from '../../helpers/dateHelpers';
import { getPolicyTimezone } from '../../helpers/timezone';
function BulkPermission({
  bulkMode,
  setBulkMode,
  selectedUsers,
  bulkBranch,
  dateFrom,
  dateTo,
  bulkReason,
  setBulkBranch,
  setDateFrom,
  setDateTo,
  setBulkReason,
  branches = [],
  loading,
  handleGrantBulk,
  resetBulkForm,
  searchQuery,
  handleSearchUsers,
  users,
  isSearching,
  toggleUserSelection,
  setSelectedUsers,
   tenantTimezone
}) {
  const { t } = useTranslation();

  // const today = new Date().toISOString().split('T')[0];
// 1) display (لـ UI فقط)
const displayTZ =
  bulkMode === 'branch'
    ? getPolicyTimezone(
        { scope: 'branch', branch: bulkBranch },
        branches,
        tenantTimezone
      )
    : null; // users mode → مش هنعتمد عليه

// 2) calculation (لازم يكون دايمًا valid)
const calcTZ =
  bulkMode === 'branch'
    ? displayTZ || tenantTimezone || 'UTC'
    : tenantTimezone || 'UTC';
const today = getTodayString(calcTZ);

const uniqueTZs = [
  ...new Set(
    selectedUsers
      .map(u => u.workTimezone)
      .filter(Boolean)
  )
];

  return (
    <div className="fade-in">
      {/* Mode Toggle */}
      <div className="mode-toggle">
        <button
          className={`mode-btn ${bulkMode === 'users' ? 'active' : ''}`}
          onClick={() => setBulkMode('users')}
          disabled={loading}
        >
          <i className="fas fa-user-friends me-2"></i>
          {t('REMOTE_PERMISSION.specificEmployees')}
        </button>
        <button
          className={`mode-btn ${bulkMode === 'branch' ? 'active' : ''}`}
          onClick={() => setBulkMode('branch')}
          disabled={loading}
        >
          <i className="fas fa-building me-2"></i>
          {t('REMOTE_PERMISSION.allBranchEmployees')}
        </button>
      </div>

      {/* Users Mode */}
      {bulkMode === 'users' ? (
        <div className="mb-4">
          <label className="form-label fw-semibold">
            <i className="fas fa-search me-2 text-primary"></i>
            {t('REMOTE_PERMISSION.searchAndAddEmployees')} *
          </label>
          
          <UserSearch
            searchQuery={searchQuery}
            handleSearchUsers={handleSearchUsers}
            users={users}
            isSearching={isSearching}
            onSelectUser={toggleUserSelection}
            selectedUsers={selectedUsers}
            multiSelect={true}
          />

          {/* Selected Users Display */}
          {selectedUsers.length > 0 && (
            <div className="selected-users-container mt-3">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="fw-semibold text-muted">
                  <i className="fas fa-users me-2"></i>
                  {t('REMOTE_PERMISSION.selectedEmployees')} ({selectedUsers.length})
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => setSelectedUsers([])}
                  disabled={loading}
                >
                  <i className="fas fa-trash me-1"></i>
                  {t('REMOTE_PERMISSION.clearAll')}
                </button>
              </div>

              <div className="d-flex flex-wrap">
                {selectedUsers.map(user => (
                  <div key={user._id} className="user-chip">
                    <span className="fw-medium">{user.name}</span>
                    <button
                      type="button"
                      className="user-chip-remove"
                      onClick={() => toggleUserSelection(user)}
                      disabled={loading}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Branch Mode */
        <div className="mb-4">
          <label className="form-label fw-semibold">
            <i className="fas fa-building me-2 text-primary"></i>
            {t('REMOTE_PERMISSION.selectBranch')} *
          </label>
          <select
            className="form-select form-select-lg"
            value={bulkBranch}
            onChange={(e) => setBulkBranch(e.target.value)}
            disabled={loading}
          >
            <option value="">{t('REMOTE_PERMISSION.selectBranchPlaceholder')}</option>
            {branches.map(branch => (
              <option key={branch._id} value={branch._id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Date Range */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3 mb-md-0">
          <label className="form-label fw-semibold">
            <i className="fas fa-calendar-day me-2 text-primary"></i>
            {t('REMOTE_PERMISSION.fromDate')} *
          </label>
          <input
            type="date"
            className="form-control form-control-lg"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            min={today}
            disabled={loading}
          />
          <div className="form-text mt-2">
  <i className="fas fa-globe me-1"></i>
  {t('REMOTE_PERMISSION.TIMEZONE_HINT')}:






  <div className="form-text mt-2">
  <i className="fas fa-globe me-1"></i>

  {bulkMode === 'users' ? (
    uniqueTZs.length === 0 ? (
      <span className="text-muted">
        {t('REMOTE_PERMISSION.NO_TIMEZONE')}
      </span>
    ) : uniqueTZs.length === 1 ? (
      <strong>{uniqueTZs[0]}</strong>
    ) : (
      <div className="d-flex flex-wrap gap-1 mt-1">
        {uniqueTZs.map(tz => (
          <span key={tz} className="badge bg-light text-dark border">
            🌍 {tz}
          </span>
        ))}
      </div>
    )
  ) : (
    <strong>{displayTZ}</strong>
  )}
</div>
</div>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold">
            <i className="fas fa-calendar-check me-2 text-primary"></i>
            {t('REMOTE_PERMISSION.toDate')}
          </label>
          <input
            type="date"
            className="form-control form-control-lg"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            min={dateFrom || today}
            disabled={loading}
          />
          <div className="form-text">{t('REMOTE_PERMISSION.optionalSingleDay')}</div>
        </div>
      </div>

      {/* Reason */}
      <div className="mb-4">
        <label className="form-label fw-semibold">
          <i className="fas fa-comment-alt me-2 text-primary"></i>
          {t('REMOTE_PERMISSION.reasonNotes')}
        </label>
        <textarea
          className="form-control"
          rows="4"
          placeholder={t('REMOTE_PERMISSION.bulkReasonPlaceholder')}
          value={bulkReason}
          onChange={(e) => setBulkReason(e.target.value)}
          disabled={loading}
        ></textarea>
      </div>

      {/* Action Buttons */}
      <div className="d-flex gap-3">
        <button
          className="btn btn-primary-custom btn-lg flex-grow-1"
          onClick={handleGrantBulk}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              {t('REMOTE_PERMISSION.processing')}
            </>
          ) : (
            <>
              <i className="fas fa-check-double me-2"></i>
              {t('REMOTE_PERMISSION.grantPermissions')}
            </>
          )}
        </button>

        <button
          className="btn btn-outline-secondary btn-lg"
          onClick={resetBulkForm}
          disabled={loading}
        >
          <i className="fas fa-redo me-2"></i>
          {t('REMOTE_PERMISSION.reset')}
        </button>
      </div>
    </div>
  );
}

export default BulkPermission;