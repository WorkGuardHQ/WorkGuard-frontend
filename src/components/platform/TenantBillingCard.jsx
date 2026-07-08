//src/components/platform/TenantBillingCard.jsx
import React from 'react';

const cardStyle = {
  background: '#1e293b',
  border: '1px solid #334155',
  borderRadius: 12,
};

const titleStyle = {
  color: '#f8fafc',
  fontWeight: 600,
  fontSize: 15,
};

const muted = {
  color: '#94a3b8',
};

function SectionTitle({ icon, title }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 14,
      }}
    >
      <i
        className={`fas ${icon}`}
        style={{
          color: '#3b82f6',
        }}
      />
      <span style={titleStyle}>
        {title}
      </span>
    </div>
  );
}

function StatRow({
  label,
  value,
  bold = false,
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '7px 0',
        borderBottom: '1px solid #334155',
        color: bold ? '#f8fafc' : '#cbd5e1',
        fontWeight: bold ? 700 : 400,
      }}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function PendingChargeRow({
  charge,
}) {
  return (
    <div
      style={{
        padding: '10px 12px',
        border: '1px solid #334155',
        borderRadius: 8,
        marginBottom: 10,
        background: '#0f172a',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <strong
          style={{
            color: '#f8fafc',
            textTransform: 'capitalize',
          }}
        >
          {charge.resource}
        </strong>

        <strong
          style={{
            color: '#f59e0b',
          }}
        >
          {charge.amount} {charge.currency}
        </strong>
      </div>

      <div
        style={{
          marginTop: 6,
          fontSize: 13,
          color: '#94a3b8',
        }}
      >
        {charge.quantity} × {charge.unitPrice}
      </div>
    </div>
  );
}

export default function TenantBillingCard({
  billing,
}) {
  if (!billing) return null;

  const {
    usage,
    limits,
    summary,
    pendingCharges,
  } = billing;

  return (
    <div
      className="card mb-4"
      style={cardStyle}
    >
      <>
  <SectionTitle
    icon="fa-file-invoice-dollar"
    title="Subscription Billing"
  />

  {/* Current Usage */}
  <div className="mb-4">
    <h6 style={muted}>Current Usage</h6>

    <StatRow
      label="Employees"
      value={`${usage.employees} / ${limits.maxEmployees ?? '∞'}`}
    />

    <StatRow
      label="Branches"
      value={`${usage.branches} / ${limits.maxBranches ?? '∞'}`}
    />

    <StatRow
      label="Admins"
      value={`${usage.admins} / ${limits.maxAdmins ?? '∞'}`}
    />
  </div>

  {/* Billing Summary */}
  <div className="mb-4">
    <h6 style={muted}>Current Billing</h6>

    <StatRow
      label="Plan Price"
      value={`${summary.planPrice} ${summary.currency}`}
    />

    <StatRow
      label="Overages"
      value={`${summary.overagesTotal} ${summary.currency}`}
    />

    <StatRow
      label="Pending Charges"
      value={`${summary.pendingTotal} ${summary.currency}`}
    />

    <StatRow
      bold
      label="Grand Total"
      value={`${summary.grandTotal} ${summary.currency}`}
    />
  </div>

  {/* Pending Charges */}
  {!!pendingCharges?.length && (
    <>
      <h6
        style={{
          ...muted,
          marginBottom: 12,
        }}
      >
        Pending Charges
      </h6>

      {pendingCharges.map((charge, index) => (
        <PendingChargeRow
          key={`${charge.resource}-${index}`}
          charge={charge}
        />
      ))}
    </>
  )}

  {!pendingCharges?.length && (
    <div
      className="text-center py-3"
      style={muted}
    >
      <i className="fas fa-check-circle me-2 text-success" />
      No pending charges.
    </div>
  )}
</>
    </div>
  );
}