import { useTranslation } from 'react-i18next';
import UserSearch from './UserSearch';
import { getTodayString } from '../../helpers/dateHelpers';
import { getPolicyTimezone } from '../../helpers/timezone';
import { useToast } from '../../context/ToastContext';
function SinglePermission({
  selectedUser,
  singleBranch,
  singleDate,
  singleReason,
  setSingleBranch,
  setSingleDate,
  setSingleReason,
  branches = [],
  loading,
  handleGrantSingle,
  resetSingleForm,
  searchQuery,
  handleSearchUsers,
  users,
  isSearching,
  selectUserForSingle,
  setSelectedUser,
  setSearchQuery,
  tenantTimezone,
}) {
  const { t } = useTranslation();
const { showToast } = useToast();

  const permissionTZ =
  getPolicyTimezone(
    {
      scope: selectedUser ? 'user' : 'global',
      branch: singleBranch,
      userTimezone: selectedUser?.workTimezone
    },
    branches,
    tenantTimezone
  );

  const today = getTodayString(permissionTZ);

  // const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fade-in">
      {/* User Selection */}
      <div className="mb-4">
        <label className="form-label fw-semibold">
          <i className="fas fa-user me-2 text-primary"></i>
          {t('common.selectEmployee')} *
        </label>
        
        {!selectedUser ? (
          <UserSearch
            searchQuery={searchQuery}
            handleSearchUsers={handleSearchUsers}
            users={users}
            isSearching={isSearching}
            onSelectUser={selectUserForSingle}
          />
        ) : (
          <div className="selected-user-card">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div className="user-avatar">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="fw-bold text-primary">{selectedUser.name}</div>
                  <div className="text-muted small">{selectedUser.email}</div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => {
                  setSelectedUser(null);
                  setSearchQuery('');
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Branch and Date */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3 mb-md-0">
          <label className="form-label fw-semibold">
            <i className="fas fa-building me-2 text-primary"></i>
            {t('REMOTE_PERMISSION.branch')}
          </label>
          <select
            className="form-select form-select-lg"
            value={singleBranch}
            onChange={(e) => setSingleBranch(e.target.value)}
            disabled={loading}
          >
            <option value="">{t('REMOTE_PERMISSION.allBranches')}</option>
            {branches.map(branch => (
              <option key={branch._id} value={branch._id}>
                {branch.name}
              </option>
            ))}
          </select>
          {/* <div className="form-text">{t('REMOTE_PERMISSION.optionalAllBranches')}</div> */}
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold">
            <i className="fas fa-calendar me-2 text-primary"></i>
            {t('common.date')} *
          </label>
          <input
            type="date"
            className="form-control form-control-lg"
            value={singleDate}
            onChange={(e) => setSingleDate(e.target.value)}
            min={today}
            disabled={loading}
          />
        </div>
    <div className="form-text mt-2">
  <i className="fas fa-info-circle me-1"></i>
  {t('REMOTE_PERMISSION.TIMEZONE_HINT')}:
  <strong> {permissionTZ} </strong>
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
          placeholder={t('REMOTE_PERMISSION.reasonPlaceholder')}
          value={singleReason}
          onChange={(e) => setSingleReason(e.target.value)}
          disabled={loading}
        ></textarea>
        {/* <div className="form-text">{t('REMOTE_PERMISSION.optionalWillAppearInLogs')}</div> */}
      </div>

      {/* Action Buttons */}
      <div className="d-flex gap-3">
        <button
          className="btn btn-primary-custom btn-lg flex-grow-1"
          onClick={handleGrantSingle}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              {t('REMOTE_PERMISSION.processing')}
            </>
          ) : (
            <>
              <i className="fas fa-check me-2"></i>
              {t('REMOTE_PERMISSION.grantPermission')}
            </>
          )}
        </button>

        <button
          className="btn btn-outline-secondary btn-lg"
          onClick={resetSingleForm}
          disabled={loading}
        >
          <i className="fas fa-redo me-2"></i>
          {t('REMOTE_PERMISSION.reset')}
        </button>
      </div>
    </div>
  );
}

export default SinglePermission;