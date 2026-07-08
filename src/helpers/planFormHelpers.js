//no need now
//src/helpers/planFormHelpers.js
export const POLICY_OPTIONS = [
  {
    value: 'hardLimit',
    label: 'Hard Limit',
  },
  {
    value: 'allowOverage',
    label: 'Allow Overage',
  },
  {
    value: 'contactSales',
    label: 'Contact Sales',
  },
];

// export const FEATURE_FIELDS = [
//   {
//     key: 'attendance',
//     label: 'Attendance',
//   },
//   {
//     key: 'payroll',
//     label: 'Payroll',
//   },
//   {
//     key: 'gps',
//     label: 'GPS',
//   },
//   {
//     key: 'faceRecognition',
//     label: 'Face Recognition',
//   },
//   {
//     key: 'reports',
//     label: 'Reports',
//   },
//   {
//     key: 'api',
//     label: 'API',
//   },
//   {
//     key: 'exportExcel',
//     label: 'Export Excel',
//   },
// ];

export const RESOURCE_FIELDS = [
  'employees',
  'branches',
  'admins',
];

export function formatLimit(value) {
  return value == null ? 'Unlimited' : value;
}

export function createEmptyPlan(){

return{

name:'',
slug:'',
description:'',

price:'',
currency:'EGP',

durationDays:30,

isTrial:false,

sortOrder:0,

maxEmployees:'',
maxBranches:'',
maxAdmins:'',

unlimitedEmployees:false,
unlimitedBranches:false,
unlimitedAdmins:false,

overagePolicy:'hardLimit',

overages:{

employees:{
enabled:false,
unitPrice:0,
policyOverride:null,
},

branches:{
enabled:false,
unitPrice:0,
policyOverride:null,
},

admins:{
enabled:false,
unitPrice:0,
policyOverride:null,
},

},

// features:{

// attendance:false,
// payroll:false,
// gps:false,
// faceRecognition:false,
// reports:false,
// api:false,
// exportExcel:false,

// customFeatures:{},

// },

};

}

export function normalizePlan(plan) {
  const empty = createEmptyPlan();

  if (!plan) return empty;

  return {
    ...empty,

    ...plan,

    unlimitedEmployees:
      plan.limits?.maxEmployees == null,

    unlimitedBranches:
      plan.limits?.maxBranches == null,

    unlimitedAdmins:
      plan.limits?.maxAdmins == null,

    maxEmployees:
      plan.limits?.maxEmployees ?? '',

    maxBranches:
      plan.limits?.maxBranches ?? '',

    maxAdmins:
      plan.limits?.maxAdmins ?? '',

    overagePolicy:
      plan.overagePolicy ??
      'hardLimit',

    overages:{

employees:{
enabled:
plan.overages?.employees?.enabled ??
false,

unitPrice:
plan.overages?.employees?.unitPrice ??
0,

policyOverride:
plan.overages?.employees?.policyOverride ??
null,

},

branches:{
enabled:
plan.overages?.branches?.enabled ??
false,

unitPrice:
plan.overages?.branches?.unitPrice ??
0,

policyOverride:
plan.overages?.branches?.policyOverride ??
null,

},

admins:{
enabled:
plan.overages?.admins?.enabled ??
false,

unitPrice:
plan.overages?.admins?.unitPrice ??
0,

policyOverride:
plan.overages?.admins?.policyOverride ??
null,

},

},

//    features:{

// attendance:
// plan.features?.attendance ??
// false,

// payroll:
// plan.features?.payroll ??
// false,

// gps:
// plan.features?.gps ??
// false,

// faceRecognition:
// plan.features?.faceRecognition ??
// false,

// reports:
// plan.features?.reports ??
// false,

// api:
// plan.features?.api ??
// false,

// exportExcel:
// plan.features?.exportExcel ??
// false,

// customFeatures:
// plan.features?.customFeatures ??
// {},

// },
  };
}

export function buildPayload(form) {
  return {
    name: form.name.trim(),

    slug: form.slug.trim(),

    description:
      form.description || null,

    price:
      Number(form.price),

    currency:
      form.currency,

    durationDays:
      Number(form.durationDays),

    isTrial:
      form.isTrial,

    sortOrder:
      Number(form.sortOrder),

    limits: {
      maxEmployees:
        form.unlimitedEmployees
          ? null
          : Number(form.maxEmployees),

      maxBranches:
        form.unlimitedBranches
          ? null
          : Number(form.maxBranches),

      maxAdmins:
        form.unlimitedAdmins
          ? null
          : Number(form.maxAdmins),
    },

    overagePolicy:
      form.overagePolicy,

    overages:
      form.overages,

    // features:
    //   form.features,
  };
}

export function validatePlan(form) {
  const errors = [];

  if (!form.name.trim())
    errors.push('Plan name is required');

  if (!form.slug.trim())
    errors.push('Slug is required');

  if (Number(form.price) < 0)
    errors.push('Price must be positive');

  if (Number(form.durationDays) < 1)
    errors.push('Duration must be greater than zero');

  RESOURCE_FIELDS.forEach((resource) => {
    const overage =
      form.overages[resource];

    if (
      overage.enabled &&
      Number(overage.unitPrice) < 0
    ) {
      errors.push(
        `${resource} overage price cannot be negative`
      );
    }
  });

  return errors;
}

// export function enabledFeatures(features = {}) {
//   return Object.entries(features)
//     .filter(([k, v]) => k !== 'customFeatures' && v)
//     .map(([k]) => k);
// }