import { formatLimit } from '../../../helpers/planFormHelpers';

const POLICY_LABELS = {
  hardLimit: 'Hard Limit',
  allowOverage: 'Allow Overage',
  contactSales: 'Contact Sales',
};

export default function PlanPreviewCard({ form }) {
  return (
    <div
      className="col-12"
      style={{
        marginTop: 10,
      }}
    >
      <div
        style={{
          border: '1px solid #334155',
          borderRadius: 12,
          background: '#111827',
          padding: 20,
        }}
      >
        <div
          style={{
            color: '#94a3b8',
            fontWeight: 600,
            marginBottom: 18,
          }}
        >
          Live Preview
        </div>

        {/* Header */}

        <div className="d-flex justify-content-between">

          <div>

            <h5
              style={{
                color: '#fff',
                marginBottom: 2,
              }}
            >
              {form.name || 'Plan Name'}
            </h5>

            <small
              style={{
                color: '#64748b',
              }}
            >
              {form.slug || 'plan-slug'}
            </small>

          </div>

          {form.isTrial && (
            <span className="badge bg-info text-dark">
              Trial
            </span>
          )}

        </div>

        <hr
          style={{
            borderColor: '#334155',
          }}
        />

        {/* Price */}

        <div
          style={{
            fontSize: 34,
            fontWeight: 700,
            color: '#fff',
          }}
        >
          {form.price || 0}

          <span
            style={{
              fontSize: 14,
              marginLeft: 6,
              color: '#94a3b8',
            }}
          >
            {form.currency}
          </span>

        </div>

        <div
          style={{
            color: '#64748b',
            marginBottom: 20,
          }}
        >
          {form.durationDays} Days
        </div>

        {/* Limits */}

        <div className="mb-3">

          <strong
            style={{
              color: '#94a3b8',
            }}
          >
            Limits
          </strong>

          <div className="d-flex justify-content-between mt-2">
            <span>Employees</span>
            <strong>
              {formatLimit(
                form.unlimitedEmployees
                  ? null
                  : form.maxEmployees
              )}
            </strong>
          </div>

          <div className="d-flex justify-content-between">
            <span>Branches</span>
            <strong>
              {formatLimit(
                form.unlimitedBranches
                  ? null
                  : form.maxBranches
              )}
            </strong>
          </div>

          <div className="d-flex justify-content-between">
            <span>Admins</span>
            <strong>
              {formatLimit(
                form.unlimitedAdmins
                  ? null
                  : form.maxAdmins
              )}
            </strong>
          </div>

        </div>

        {/* Overage */}

        <div className="mb-3">

          <strong
            style={{
              color: '#94a3b8',
            }}
          >
            Overage
          </strong>

          <div
            style={{
              fontSize: 13,
              marginTop: 8,
            }}
          >
            Policy :

            <strong className="ms-2">
              {POLICY_LABELS[form.overagePolicy]}
            </strong>

          </div>

          {Object.entries(form.overages).map(([key, item]) => {

            if (!item.enabled)
              return null;

            return (

              <div
                key={key}
                className="d-flex justify-content-between"
                style={{
                  fontSize: 13,
                }}
              >

                <span>
                  {key}
                </span>

                <span>

                  {item.unitPrice}

                  {' '}

                  {form.currency}

                </span>

              </div>

            );

          })}

        </div>

        {/* Description */}

        {form.description && (

          <div
            style={{
              borderTop: '1px solid #334155',
              paddingTop: 15,
              color: '#94a3b8',
              fontSize: 13,
            }}
          >
            {form.description}
          </div>

        )}

      </div>
    </div>
  );
}