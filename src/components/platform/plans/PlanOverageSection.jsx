//src/components/platform/plans/PlanOverageSection.jsx

import {
  POLICY_OPTIONS,
} from '../../../helpers/planFormHelpers';


const inputStyle = {
  background: '#0f172a',
  border: '1px solid #334155',
  color: '#f1f5f9',
};

const labelStyle = {
  color: '#94a3b8',
  fontSize: '0.8rem',
  fontWeight: 600,
};

const RESOURCE_NAMES = {
  employees: 'Employees',
  branches: 'Branches',
  admins: 'Admins',
};



function ResourceCard({
  resource,
  data,
  form,
  setForm,
}) {
  const update = (field, value) => {
    setForm((prev) => ({
      ...prev,
      overages: {
        ...prev.overages,
        [resource]: {
          ...prev.overages[resource],
          [field]: value,
        },
      },
    }));
  };

  return (
    <div
      className="col-md-4"
    >
      <div
        style={{
          border:'1px solid #334155',
          borderRadius:10,
          padding:14,
          background:'#0f172a'
        }}
      >

        <div
          style={{
            color:'#f1f5f9',
            fontWeight:600,
            marginBottom:12
          }}
        >
          {RESOURCE_NAMES[resource]}
        </div>

        <div className="form-check mb-3">

          <input
            className="form-check-input"
            type="checkbox"
            checked={data.enabled}
            onChange={(e)=>
              update(
                'enabled',
                e.target.checked
              )
            }
          />

          <label
            className="form-check-label"
            style={{
              color:'#94a3b8'
            }}
          >
            Allow Overage
          </label>

        </div>

        <label
          className="form-label"
          style={labelStyle}
        >
          Unit Price
        </label>

        <input
          type="number"
          min="0"
          className="form-control mb-3"
          style={inputStyle}
          disabled={!data.enabled}
          value={data.unitPrice}
          onChange={(e)=>
            update(
              'unitPrice',
              Number(e.target.value)
            )
          }
        />

        <label
          className="form-label"
          style={labelStyle}
        >
          Policy Override
        </label>

        <select
          className="form-select"
          style={inputStyle}
          disabled={!data.enabled}
          value={
            data.policyOverride ??
            ''
          }
          onChange={(e)=>
            update(
              'policyOverride',
              e.target.value || null
            )
          }
        >

          <option value="">
            Use Global Policy
          </option>

          {POLICY_OPTIONS.map(p=>(
            <option
              key={p.value}
              value={p.value}
            >
              {p.label}
            </option>
          ))}

        </select>

      </div>
    </div>
  );
}

export default function PlanOverageSection({
  form,
  setForm,
}) {

  return (

    <div className="col-12">

      <div
        style={{
          color:'#94a3b8',
          fontSize:'0.85rem',
          fontWeight:600,
          marginBottom:12
        }}
      >
        Overage Settings
      </div>

      <div className="mb-3">

        <label
          className="form-label"
          style={labelStyle}
        >
          Default Policy
        </label>

        <select
          className="form-select"
          style={inputStyle}
          value={form.overagePolicy}
          onChange={(e)=>
            setForm(prev=>({
              ...prev,
              overagePolicy:e.target.value
            }))
          }
        >

          {POLICY_OPTIONS.map(p=>(
            <option
              key={p.value}
              value={p.value}
            >
              {p.label}
            </option>
          ))}

        </select>

      </div>

      <div className="row g-3">

        {Object.entries(form.overages).map(
          ([resource,data])=>(
            <ResourceCard
              key={resource}
              resource={resource}
              data={data}
              form={form}
              setForm={setForm}
            />
          )
        )}

      </div>

    </div>

  );

}