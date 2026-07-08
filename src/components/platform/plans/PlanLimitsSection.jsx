//src/components/platform/plans/PlanLimitsSection.jsx
import React from 'react';

const inputStyle = {
  background: '#0f172a',
  border: '1px solid #334155',
  color: '#f1f5f9',
};

const sectionTitle = {
  color: '#94a3b8',
  fontSize: '0.8rem',
  fontWeight: 600,
  marginBottom: 10,
};

function LimitInput({
  title,
  value,
  unlimited,
  valueKey,
  unlimitedKey,
  onChange,
}) {
  return (
    <div className="col-md-4">
      <label
        className="form-label"
        style={{
          color: '#94a3b8',
          fontSize: '0.75rem',
        }}
      >
        {title}
      </label>

      <div className="input-group input-group-sm mb-2">
        <input
          type="number"
          min="1"
          className="form-control"
          style={inputStyle}
          disabled={unlimited}
          value={unlimited ? '' : value}
          onChange={(e) =>
            onChange(valueKey, e.target.value)
          }
          placeholder="Unlimited"
        />
      </div>

      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id={unlimitedKey}
          checked={unlimited}
          onChange={(e) =>
            onChange(unlimitedKey, e.target.checked)
          }
        />

        <label
          htmlFor={unlimitedKey}
          className="form-check-label"
          style={{
            color: '#64748b',
            fontSize: '0.75rem',
          }}
        >
          Unlimited
        </label>
      </div>
    </div>
  );
}

export default function PlanLimitsSection({
  form,
  setForm,
}) {
  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="col-12">

      <div style={sectionTitle}>
        Subscription Limits
      </div>

      <div className="row g-3">

        <LimitInput
          title="Employees"
          value={form.maxEmployees}
          unlimited={form.unlimitedEmployees}
          valueKey="maxEmployees"
          unlimitedKey="unlimitedEmployees"
          onChange={updateField}
        />

        <LimitInput
          title="Branches"
          value={form.maxBranches}
          unlimited={form.unlimitedBranches}
          valueKey="maxBranches"
          unlimitedKey="unlimitedBranches"
          onChange={updateField}
        />

        <LimitInput
          title="Admins"
          value={form.maxAdmins}
          unlimited={form.unlimitedAdmins}
          valueKey="maxAdmins"
          unlimitedKey="unlimitedAdmins"
          onChange={updateField}
        />

      </div>

    </div>
  );
}