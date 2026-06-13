
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getHolidayPlans,
  activateHolidayPlan,
  cancelHolidayPlan,
  deleteHolidayPlan,
  updateHolidayPlan
} from '../../../services/holiday.api';

import PlanCard from './HolidayPlanCard';
import HolidayPlanModal from './HolidayPlanModal';
import PlanDetailsModal from './PlanDetailsModal';

const HolidayPlansList = ({ onToast }) => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const [plans, setPlans] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  // const [selectedPlan, setSelectedPlan] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [filters, setFilters] = useState({
    year: currentYear,
    status: '',
    page: 1,
    limit: 12
  });

  /* =========================
     Load Plans
  ========================= */
  const loadPlans = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await getHolidayPlans(filters);

      setPlans(data.plans || []);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error('Load plans error:', err);
      onToast?.(
        err.response?.data?.message || t('holidays.loadPlansError'),
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [filters, t, onToast]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  /* =========================
     Handlers
  ========================= */
  const handleCreate = () => {
    setEditingPlan(null);
    setShowCreateModal(true);
  };

  // const handleView = (plan) => {
  //   setSelectedPlan(plan);
  //   setShowDetailsModal(true);
  // };
const handleView = (plan) => {
  setSelectedPlanId(plan._id);
  setShowDetailsModal(true);
};
  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setShowCreateModal(true);
  };

  const handleSavePlan = async (planData) => {
    try {
      if (editingPlan) {
        await updateHolidayPlan(editingPlan._id, planData);
        onToast?.(t('holidays.planUpdated'), 'success');
      }

      setShowCreateModal(false);
      setEditingPlan(null);
      await loadPlans();
    } catch (err) {
      console.error('Save plan error:', err);
      onToast?.(
        err.response?.data?.message || t('holidays.savePlanError'),
        'error'
      );
      throw err;
    }
  };

  const handleActivate = async (planId) => {
    if (!window.confirm(t('holidays.confirmActivatePlan'))) return;

    try {
      await activateHolidayPlan(planId);
      onToast?.(t('holidays.planActivated'), 'success');
      await loadPlans();
    } catch (err) {
      onToast?.(
        err.response?.data?.message || t('holidays.activatePlanError'),
        'error'
      );
    }
  };

  const handleCancel = async (plan) => {
    if (!window.confirm(t('holidays.confirmCancelPlan'))) return;

    try {
      await cancelHolidayPlan(plan._id);
      onToast?.(t('holidays.planCancelled'), 'success');
      await loadPlans();
    } catch (err) {
      onToast?.(
        err.response?.data?.message || t('holidays.cancelPlanError'),
        'error'
      );
    }
  };

  const handleDelete = async (planId) => {
    if (!window.confirm(t('holidays.confirmDeletePlan'))) return;

    try {
      await deleteHolidayPlan(planId);
      onToast?.(t('holidays.planDeleted'), 'success');
      await loadPlans();
    } catch (err) {
      onToast?.(
        err.response?.data?.message || t('holidays.deletePlanError'),
        'error'
      );
    }
  };

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
  
const selectedPlan = React.useMemo(
 () => plans.find(
   p => p._id === selectedPlanId
 ) || null,
 [plans, selectedPlanId]
);
  /* =========================
     Render
  ========================= */
  if (loading) {
    return (
      <div className="hm-empty">
        <div className="hm-spinner"></div>
        <p>{t('holidays.loadingPlans')}</p>
      </div>
    );
  }

  return (
    <>
      {/* Actions Bar */}
      <div className="hm-plans-actions">
        <button onClick={handleCreate} className="hm-btn hm-btn-primary">
          <i className="fas fa-plus"></i>
          {t('holidays.createPlan')}
        </button>

        {/* Filters */}
        <div className="hm-plans-filters">
          <select
            className="hm-form-select"
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
          >
            {Array.from({ length: 5 }, (_, i) => {
              const year = currentYear + 1 - i;
              return (
                <option key={year} value={year}>{year}</option>
              );
            })}
          </select>

          <select
            className="hm-form-select"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">{t('holidays.allStatuses')}</option>
            <option value="draft">{t('holidays.draft')}</option>
            <option value="active">{t('holidays.active')}</option>
            <option value="archived">{t('holidays.archived')}</option>
          </select>

          <button onClick={loadPlans} className="hm-btn hm-btn-secondary">
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      {plans.length === 0 ? (
        <div className="hm-empty">
          <div className="hm-empty-icon">
            <i className="fas fa-layer-group"></i>
          </div>
          <h3>{t('holidays.noPlans')}</h3>
          <button onClick={handleCreate} className="hm-btn hm-btn-primary">
            <i className="fas fa-plus"></i>
            {t('holidays.createFirstPlan')}
          </button>
        </div>
      ) : (
        <>
          <div className="hm-plans-grid">
            {plans.map((plan) => (
              <PlanCard
                key={plan._id}
                plan={plan}
                onView={handleView}
                onEdit={handleEdit}
                onActivate={handleActivate}
                onCancel={handleCancel}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination?.pages > 1 && (
            <div className="hm-pagination">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="hm-pagination-btn"
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              <span className="hm-pagination-info">
                {t('holidays.page')} {pagination.page}{' '}
                {t('holidays.of')} {pagination.pages}
              </span>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="hm-pagination-btn"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showCreateModal && (
        <HolidayPlanModal
          show={showCreateModal}
          editingPlan={editingPlan}
          onClose={() => {
            setShowCreateModal(false);
            setEditingPlan(null);
          }}
          onSave={handleSavePlan}
          onToast={onToast}
        />
      )}

      {showDetailsModal && selectedPlanId && (
        <PlanDetailsModal
          show={showDetailsModal}
          plan={selectedPlan}
          onClose={() => {
            setShowDetailsModal(false);
setSelectedPlanId(null);          }}
          onRefresh={loadPlans}
          onToast={onToast}
        />
      )}
    </>
  );
};

export default HolidayPlansList;
