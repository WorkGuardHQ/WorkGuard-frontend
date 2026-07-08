const formatLimit = (value) =>
  value == null ? 'Unlimited' : value;

const POLICY_LABELS = {
  hardLimit: 'Hard Limit',
  allowOverage: 'Allow Overage',
  contactSales: 'Contact Sales',
};

// const FEATURE_LABELS = {
//   attendance: 'Attendance',
//   payroll: 'Payroll',
//   gps: 'GPS',
//   faceRecognition: 'Face Recognition',
//   reports: 'Reports',
//   api: 'API',
//   exportExcel: 'Export Excel',
// };

export default function PlanCard({
  plan,
  onEdit,
  onToggle,
  onDelete,
}) {
//   const enabledFeatures = Object.entries(plan.features || {})
//     .filter(([key, value]) => key !== 'customFeatures' && value === true);

  return (
    <div
      style={{
        background: '#1e293b',
        border: `1px solid ${plan.isActive ? '#334155' : '#1e293b'}`,
        borderRadius: 14,
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        opacity: plan.isActive ? 1 : .6,
      }}
    >

      {/* Header */}

      <div
        className="d-flex justify-content-between align-items-start"
      >
        <div>

          <div
            style={{
              color:'#f8fafc',
              fontWeight:700,
              fontSize:'1.05rem'
            }}
          >
            {plan.name}
          </div>

          <code
            style={{
              color:'#7dd3fc',
              fontSize:12
            }}
          >
            {plan.slug}
          </code>

        </div>

        <div className="text-end">

          <span
            className={`badge ${
              plan.isActive
                ? 'bg-success'
                : 'bg-secondary'
            }`}
          >
            {plan.isActive ? 'Active' : 'Inactive'}
          </span>

          {plan.isTrial && (
            <div className="mt-1">

              <span className="badge bg-info text-dark">
                Trial
              </span>

            </div>
          )}

        </div>
      </div>

      {/* Price */}

      <div>

        <div
          style={{
            fontSize:'2rem',
            fontWeight:800,
            color:'#fff'
          }}
        >
          {plan.price}

          <span
            style={{
              fontSize:14,
              color:'#94a3b8',
              marginLeft:6
            }}
          >
            {plan.currency}
          </span>

        </div>

        <small
          style={{
            color:'#64748b'
          }}
        >
          {plan.durationDays} days
        </small>

      </div>

      {/* Limits */}

      <div>

        <div
          style={{
            color:'#94a3b8',
            fontWeight:600,
            marginBottom:8
          }}
        >
          Limits
        </div>

        <div className="d-flex justify-content-between">
          <span>Employees</span>
          <strong>{formatLimit(plan.limits?.maxEmployees)}</strong>
        </div>

        <div className="d-flex justify-content-between">
          <span>Branches</span>
          <strong>{formatLimit(plan.limits?.maxBranches)}</strong>
        </div>

        <div className="d-flex justify-content-between">
          <span>Admins</span>
          <strong>{formatLimit(plan.limits?.maxAdmins)}</strong>
        </div>

      </div>

      {/* Overage */}

      <div>

        <div
          style={{
            color:'#94a3b8',
            fontWeight:600,
            marginBottom:8
          }}
        >
          Overage
        </div>

        <div
          className="mb-2"
          style={{fontSize:13}}
        >
          Policy :

          <strong className="ms-2">

            {POLICY_LABELS[
              plan.overagePolicy
            ]}

          </strong>

        </div>

        {['employees','branches','admins']
          .map(resource=>{

            const item=
              plan.overages?.[resource];

            if(!item?.enabled)
              return null;

            return(

              <div
                key={resource}
                className="d-flex justify-content-between"
                style={{fontSize:13}}
              >

                <span>

                  {resource}

                </span>

                <span>

                  {item.unitPrice}

                  {' '}

                  {plan.currency}

                </span>

              </div>

            );

          })}

      </div>

      {/* Features */}

    {/*  <div>

        <div
          style={{
            color:'#94a3b8',
            fontWeight:600,
            marginBottom:8
          }}
        >
          Features
        </div>

         <div
          style={{
            display:'flex',
            flexWrap:'wrap',
            gap:6
          }}
        >

          {enabledFeatures.length===0
          ?(
            <small
              style={{
                color:'#64748b'
              }}
            >
              No Features
            </small>
          )
          :(
            enabledFeatures.map(
              ([key])=>(

                <span
                  key={key}
                  className="badge bg-primary bg-opacity-25 text-primary"
                >

                  {FEATURE_LABELS[key]}

                </span>

              )
            )
          )}

        </div> 

      {/* </div> */}

      {/* Description */}

      {plan.description && (

        <div
          style={{
            color:'#94a3b8',
            fontSize:13,
            borderTop:'1px solid #334155',
            paddingTop:12
          }}
        >
          {plan.description}
        </div>

      )}

      {/* Footer */}

      <div
        className="d-flex gap-2 mt-auto"
      >

        <button
          className="btn btn-sm btn-outline-primary flex-fill"
          onClick={()=>onEdit(plan)}
        >
          <i className="fas fa-edit me-1"/>
          Edit
        </button>

        <button
          className={`btn btn-sm flex-fill ${
            plan.isActive
            ?'btn-outline-warning'
            :'btn-outline-success'
          }`}
          onClick={()=>onToggle(plan._id)}
        >

          <i
            className={`fas ${
              plan.isActive
              ?'fa-pause'
              :'fa-play'
            } me-1`}
          />

          {plan.isActive
            ?'Deactivate'
            :'Activate'}

        </button>

        <button
          className="btn btn-sm btn-outline-danger"
          onClick={()=>onDelete(plan._id)}
        >

          <i className="fas fa-trash"/>

        </button>

      </div>

    </div>
  );
}