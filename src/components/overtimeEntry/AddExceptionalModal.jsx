import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { addExceptionalBonus } from '../../services/Overtime & Bonus/overtimeEntry.api';
import { searchUsers } from '../../services/user.api';
import { getBranchLookup } from '../../services/branch.api';


import {
  getTodayString,
  toUTCFromTimezone
} from '../../helpers/dateHelpers';

/* ==============================================
   🎁 AddExceptionalModal
   Props:
   - show:      Boolean
   - onClose:   () => void
   - onSuccess: () => void
   - onToast:   ({ type, message }) => void
============================================== */

const defaultForm = () => ({
  userId:    '',
  userName:  '',
  userTimezone: null,
  // date:      new Date().toISOString().slice(0, 10),
  date: getTodayString(
  Intl.DateTimeFormat().resolvedOptions().timeZone
),
  amount:    '',
  notes:     ''
});

export default function AddExceptionalModal({
  show,
  onClose,
  onSuccess,
  onToast
}) {
  const { t }   = useTranslation("overtimeEntry");
  const [form,   setForm]   = useState(defaultForm());
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // ── User Search ──
  const [branches,            setBranches]            = useState([]);
  const [selectedBranch,      setSelectedBranch]      = useState('');
  const [userQuery,           setUserQuery]           = useState('');
  const [userResults,         setUserResults]         = useState([]);
  const [userSearchLoading,   setUserSearchLoading]   = useState(false);
  const [showUserDropdown,    setShowUserDropdown]     = useState(false);

  const searchRef   = useRef(null);
  const debounceRef = useRef(null);

  /* =========================
     Load branches
  ========================= */
  useEffect(() => {
    if (!show) return;
    getBranchLookup()
      .then(res => {
        const raw = res?.data?.data ?? res?.data?.branches ?? res?.data ?? [];
        setBranches(Array.isArray(raw) ? raw : []);
      })
      .catch(() => setBranches([]));
  }, [show]);

  /* =========================
     Reset on open
  ========================= */
  useEffect(() => {
    if (!show) return;
    setForm(defaultForm());
    setErrors({});
    setUserQuery('');
    setUserResults([]);
    setSelectedBranch('');
  }, [show]);

  /* =========================
     Outside click → close dropdown
  ========================= */
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  /* =========================
     User Search (debounced)
  ========================= */
  const handleUserSearch = useCallback((query) => {
    setUserQuery(query);
    setShowUserDropdown(true);
    setForm(prev => ({ ...prev, userId: '', userName: '' , userTimezone: null}));

    if (!query.trim() || query.length < 2) {
      setUserResults([]);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setUserSearchLoading(true);
      try {
        const res = await searchUsers(query, selectedBranch);
        const raw = res?.data?.data ?? res?.data?.users ?? res?.data ?? [];
        setUserResults(Array.isArray(raw) ? raw : []);
      } catch {
        setUserResults([]);
      } finally {
        setUserSearchLoading(false);
      }
    }, 350);
  }, [selectedBranch]);

  const handleUserSelect = (user) => {
    const label = user.name || user.email || '';
    setUserQuery(label);
    // setForm(prev => ({ ...prev, userId: user._id, userName: label }));
    setForm(prev => ({
  ...prev,

  userId: user._id,
  userName: label,

  userTimezone:
    user.workTimezone ||

    user.branchTimezone ||

    null
}));

    setShowUserDropdown(false);
    setUserResults([]);
    setErrors(prev => ({ ...prev, userId: undefined }));
  };

  /* =========================
     Validate
  ========================= */
  const validate = () => {
    const e = {};
    if (!form.userId)                          e.userId  = t('common.required',{ ns: "translation" });
    if (!form.date)                            e.date    = t('common.required',{ ns: "translation" });
    if (!form.amount || Number(form.amount) <= 0) e.amount = t('common.required',{ ns: "translation" });
    if (!(form.notes || '').trim())                    e.notes   = t('common.required',{ ns: "translation" });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* =========================
     Submit
  ========================= */
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const entryTimezone =
  form.userTimezone ||
  null;

      await addExceptionalBonus({
        userId: form.userId,
        // date:   form.date,
        date:
  entryTimezone
    ? toUTCFromTimezone(
        form.date,
        entryTimezone
      )
    : form.date,
        amount: Number(form.amount),
        notes:  form.notes.trim()
      });
      onSuccess();
    } catch (err) {
      onToast({
        type:    'error',
        message: err?.response?.data?.message || t('overtimeEntry.addError')
      });
    } finally {
      setSaving(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-star me-2 text-warning" />
              {t('overtimeEntry.exceptional.title')}
            </h5>
            <button className="btn-close" onClick={onClose} disabled={saving} />
          </div>

          {/* Body */}
          <div className="modal-body">
            <form onSubmit={handleSubmit} id="exceptional-form" noValidate>

              {/* ── Branch Filter + Employee Search ── */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  {t('overtimeEntry.exceptional.employee')} <span className="text-danger">*</span>
                </label>

                {/* Branch filter */}
                <select className="form-select form-select-sm mb-2"
                  value={selectedBranch}
                  onChange={e => {
                    setSelectedBranch(e.target.value);
                    setUserQuery('');
                    setUserResults([]);
                    setForm(prev => ({ ...prev, userId: '', userName: '' , userTimezone: null}));
                  }}>
                  <option value="">{t('common.allBranches',{ ns: "translation" })}</option>
                  {branches.map(b => (
                    <option key={b._id} value={b._id}>{b.name}</option>
                  ))}
                </select>

                {/* User search */}
                <div className="position-relative" ref={searchRef}>
                  <input type="text"
                    className={`form-control ${errors.userId ? 'is-invalid' : ''}`}
                    value={userQuery}
                    onChange={e => handleUserSearch(e.target.value)}
                    onFocus={() => userQuery.length >= 2 && setShowUserDropdown(true)}
                    placeholder={t('common.typeToSearch',{ ns: "translation" })}
                    autoComplete="off" />

                  {userSearchLoading && (
                    <span className="position-absolute top-50 end-0 translate-middle-y me-3"
                      style={{ pointerEvents: 'none' }}>
                      <span className="spinner-border spinner-border-sm text-secondary" />
                    </span>
                  )}

                  {showUserDropdown && userResults.length > 0 && (
                    <ul className="dropdown-menu show w-100 shadow-sm"
                      style={{ position: 'absolute', top: '100%', zIndex: 1055, maxHeight: 200, overflowY: 'auto' }}>
                      {userResults.map(user => (
                        <li key={user._id}>
                          <button type="button"
                            className="dropdown-item d-flex align-items-center gap-2 py-2"
                            onClick={() => handleUserSelect(user)}>
                            <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                              style={{ width: 30, height: 30, fontSize: 12 }}>
                              {(user.name || '?')[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="fw-semibold small">{user.name || '—'}</div>
                              <div className="text-muted" style={{ fontSize: 11 }}>{user.email}</div>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {showUserDropdown && !userSearchLoading && userQuery.length >= 2 && userResults.length === 0 && (
                    <ul className="dropdown-menu show w-100"
                      style={{ position: 'absolute', top: '100%', zIndex: 1055 }}>
                      <li className="dropdown-item text-muted small py-2">
                        <i className="fas fa-search me-1" />{t('common.noResults',{ ns: "translation" })}
                      </li>
                    </ul>
                  )}
                </div>

                {errors.userId && <div className="text-danger small mt-1">{errors.userId}</div>}

                {form.userId && (
                  <div className="mt-1">
                    <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25">
                      <i className="fas fa-user-check me-1" />{form.userName}
                    </span>
                  </div>
                )}
              </div>

              {/* ── Date ── */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  {t('overtimeEntry.exceptional.date')} <span className="text-danger">*</span>
                </label>
                <input type="date"
                  className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                  value={form.date}
                  onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))} />

{form.userTimezone && (
  <div className="small text-muted mt-1">

    <i className="fas fa-clock me-1" />

    {form.userTimezone}

  </div>
)}
                {errors.date && <div className="invalid-feedback">{errors.date}</div>}
              </div>

              {/* ── Amount ── */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  {t('overtimeEntry.exceptional.amount')} ({t('common.currency',{ ns: "translation" })}) <span className="text-danger">*</span>
                </label>
                <input type="number" min="0" step="0.5"
                  className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                  value={form.amount}
                  onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))} />
                {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
              </div>

              {/* ── Notes ── */}
              <div className="mb-2">
                <label className="form-label fw-semibold">
                  {t('overtimeEntry.exceptional.notes')} <span className="text-danger">*</span>
                </label>
                <textarea rows={3}
                  className={`form-control ${errors.notes ? 'is-invalid' : ''}`}
                  placeholder={t('overtimeEntry.exceptional.notesPlaceholder')}
                  value={form.notes}
                  onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))} />
                {errors.notes && <div className="invalid-feedback">{errors.notes}</div>}
              </div>

            </form>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary"
              onClick={onClose} disabled={saving}>
              {t('overtimeEntry.cancel')}
            </button>
            <button type="submit" form="exceptional-form"
              className="btn btn-warning" disabled={saving}>
              {saving
                ? <><span className="spinner-border spinner-border-sm me-2" />{t('common.saving',{ ns: "translation" })}</>
                : <><i className="fas fa-star me-2" />{t('overtimeEntry.save')}</>
              }
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}