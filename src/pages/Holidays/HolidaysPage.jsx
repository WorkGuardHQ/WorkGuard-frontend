
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  getHolidays, 
  createHoliday, 
  updateHoliday, 
  deleteHoliday,
  activateHoliday,
  cancelHoliday
} from '../../services/holiday.api';

import HolidaysList from '../../components/Holidays/HolidaysList';
import HolidayFormModal from '../../components/Holidays/HolidayFormModal';
import HolidaysToast from '../../components/Holidays/HolidaysToast';
import HolidayPlansList from '../../components/Holidays/HolidayPlans/HolidayPlansList';


import '../../style/holidays-module.css';

const HolidaysPage = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();



  const [activeTab, setActiveTab] = useState('holidays');
  const [holidays, setHolidays] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [toast, setToast] = useState(null);


  const [filters, setFilters] = useState({
    year: currentYear,
    branch: '',
    user: '',
    scope: '',
    status: '',
    page: 1,
    limit: 20
  });

  
  /* =========================
     Load Holidays
  ========================= */
  const loadHolidays = React.useCallback(async () => {
    if (activeTab !== 'holidays') return;

    try {
      setLoading(true);
      const data = await getHolidays(filters);
      
      setHolidays(data.holidays || []);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error('Load holidays error:', err);
      showToast(
        err.response?.data?.message || t('holidays.loadError'),
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [filters, activeTab, t]);

  useEffect(() => {
    loadHolidays();
  }, [loadHolidays]);



  /* =========================
     Toast Helper
  ========================= */
  const showToast = (message, type = 'success') => {
    setToast({ message, type, show: true });
  };

  /* =========================
     Holiday Actions
  ========================= */
  const handleCreate = () => {
    setEditingHoliday(null);
    setShowModal(true);
  };

  const handleEdit = (holiday) => {
    setEditingHoliday(holiday);
    setShowModal(true);
  };

  const handleSave = async (formData) => {
    try {
      if (editingHoliday) {
        await updateHoliday(editingHoliday._id, formData);
        showToast(t('holidays.updated'), 'success');
      } else {
        await createHoliday(formData);
        showToast(t('holidays.created'), 'success');
      }

      setShowModal(false);
      setEditingHoliday(null);
      loadHolidays();
    } catch (err) {
      console.error('Save error:', err);
      showToast(
        err.response?.data?.message || 
        (editingHoliday ? t('holidays.updateError') : t('holidays.createError')),
        'error'
      );
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('holidays.confirmDelete'))) return;

    try {
      await deleteHoliday(id);
      showToast(t('holidays.deleted'), 'success');
      loadHolidays();
    } catch (err) {
      console.error('Delete error:', err);
      showToast(
        err.response?.data?.message || t('holidays.deleteError'),
        'error'
      );
    }
  };

  const handleActivate = async (id) => {
    try {
      await activateHoliday(id);
      showToast(t('holidays.activated'), 'success');
      loadHolidays();
    } catch (err) {
      showToast(
        err.response?.data?.message || t('holidays.activateError'),
        'error'
      );
    }
  };

  const handleCancel = async (holiday, cancelFrom = null) => {
    if (!window.confirm(t('holidays.confirmCancel'))) return;

    try {
      await cancelHoliday(holiday._id, cancelFrom);
      showToast(t('holidays.cancelled'), 'success');
      loadHolidays();
    } catch (err) {
      showToast(
        err.response?.data?.message || t('holidays.cancelError'),
        'error'
      );
    }
  };

  /* =========================
     Filter Handlers
  ========================= */
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  /* =========================
     Render
  ========================= */
  return (
    <div className="holidays-module">
      {/* Header */}
      <div className="hm-header">
        <div className="hm-header-content">
          <div className="hm-header-icon">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <div className="hm-header-text">
            <h1>{t('holidays.title')}</h1>
            <p>{t('holidays.subtitle')}</p>
          </div>
        </div>

        {activeTab === 'holidays' && (
          <button onClick={handleCreate} className="hm-btn hm-btn-primary">
            <i className="fas fa-plus"></i>
            {t('holidays.addHoliday')}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="hm-tabs">
        <button
          className={`hm-tab ${activeTab === 'holidays' ? 'hm-tab-active' : ''}`}
          onClick={() => setActiveTab('holidays')}
        >
          <i className="fas fa-calendar-day"></i>
          {t('holidays.individualHolidays')}
        </button>

        <button
          className={`hm-tab ${activeTab === 'plans' ? 'hm-tab-active' : ''}`}
          onClick={() => setActiveTab('plans')}
        >
          <i className="fas fa-layer-group"></i>
          {t('holidays.holidayPlans')}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'holidays' ? (
        <>
          {/* Filters */}
          <div className="hm-filters-card">
            <div className="hm-filters-grid">
              <div className="hm-form-group">
                <label className="hm-form-label">{t('holidays.year')}</label>
                <select
                  className="hm-form-select"
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = currentYear - i+2;
                    return (
                      <option key={year} value={year}>{year}</option>
                    );
                  })}
                </select>
              </div>

              <div className="hm-form-group">
                <label className="hm-form-label">{t('holidays.scope')}</label>
                <select
                  className="hm-form-select"
                  value={filters.scope}
                  onChange={(e) => handleFilterChange('scope', e.target.value)}
                >
                  <option value="">{t('holidays.allScopes')}</option>
                  <option value="global">{t('holidays.global')}</option>
                  <option value="branch">{t('holidays.branch')}</option>
                  <option value="user">{t('holidays.user')}</option>
                </select>
              </div>

              <div className="hm-form-group">
                <label className="hm-form-label">{t('holidays.status')}</label>
                <select
                  className="hm-form-select"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">{t('holidays.allStatuses')}</option>
                  <option value="draft">{t('holidays.draft')}</option>
                  <option value="active">{t('holidays.active')}</option>
                  <option value="cancelled">{t('holidays.cancelled')}</option>
                  <option value="archived">{t('holidays.archived')}</option>
                </select>
              </div>

              <div className="hm-form-group">
                <button 
                  onClick={loadHolidays} 
                  className="hm-btn hm-btn-secondary"
                  style={{ marginTop: '1.75rem' }}
                >
                
            <i className="fas fa-sync-alt" ></i>
{/*                   
                  {t('holidays.refresh')} */}
                </button>
              </div>
            </div>
          </div>

          {/* Holidays List */}
          <HolidaysList
            holidays={holidays}
            loading={loading}
            pagination={pagination}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onActivate={handleActivate}
            onCancel={handleCancel}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        /* Plans List */
        <HolidayPlansList onToast={showToast} />
      )}

      {/* Modals */}
      {showModal && (
        <HolidayFormModal
          show={showModal}
          editingHoliday={editingHoliday}
          onClose={() => {
            setShowModal(false);
            setEditingHoliday(null);
          }}
          onSave={handleSave}
        />
      )}

      {/* Toast */}
      {toast && (
        <HolidaysToast
          show={toast.show}
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default HolidaysPage;