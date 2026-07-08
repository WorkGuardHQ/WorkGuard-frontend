// import Toast from '../ui/Toast';

// function OverageConfirmationToast({
//   warning,
//   onConfirm,
//   onClose,
// }) {
//   if (!warning) return null;

//   const amount =
//     warning.additionalCost ??
//     (warning.unitPrice || 0) *
//       (warning.extraUnits || 1);

//   const resourceName = {
//     employees: 'employee',
//     branches: 'branch',
//     admins: 'admin',
//   }[warning.resource] || 'resource';

//   return (
//     <Toast
//       show={true}
//       type="warning"
//       onClose={onClose}
//       onConfirm={onConfirm}
//       confirmText="Continue"
//       cancelText="Cancel"
//       message={
//   warning.message ??
// `You are about to exceed your subscription limit.

// This ${resourceName} will add an extra charge of ${amount} ${warning.currency} to your next renewal invoice.

// Do you want to continue?`
// }
// //       message={
// // `You are about to exceed your subscription limit.

// // This ${resourceName} will add an extra charge of ${amount} ${warning.currency} to your next renewal invoice.

// // Do you want to continue?`
// //       }
//     />
//   );
// }

// export default OverageConfirmationToast;

import Toast from '../ui/Toast';

const RESOURCE_LABELS = {
  employees: 'Employee',
  admins: 'Admin',
  branches: 'Branch',
};

function OverageConfirmationToast({
  warning,
  onConfirm,
  onClose,
}) {
  if (!warning) return null;

  const warnings = Array.isArray(warning)
    ? warning
    : [warning];

  const currency = warnings[0]?.currency || '';

  const total = warnings.reduce(
    (sum, w) =>
      sum +
      (
        w.additionalCost ??
        (w.unitPrice || 0) * (w.extraUnits || 1)
      ),
    0
  );

  const message = `Your action exceeds your current subscription.

Additional monthly charges:

${warnings
  .map((w) => {
    const amount =
      w.additionalCost ??
      (w.unitPrice || 0) * (w.extraUnits || 1);

    const slots = w.extraUnits || 1;

    return `• ${slots} additional ${RESOURCE_LABELS[w.resource] || 'resource'} ${slots > 1 ? 'slots' : 'slot'}
  +${amount} ${currency} / month`;
  })
  .join('\n\n')}

──────────────────────
Total: ${total} ${currency} / month

These charges will be added to your next renewal invoice.

Do you want to continue?`;

  return (
    <Toast
      show={true}
      type="warning"
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText="Continue"
      cancelText="Cancel"
      message={message}
    />
  );
}

export default OverageConfirmationToast;

// import Toast from '../ui/Toast';

// const RESOURCE_LABELS = {
//   employees: 'Employees',
//   admins: 'Admins',
//   branches: 'Branches',
// };

// function OverageConfirmationToast({
//   warning,
//   onConfirm,
//   onClose,
// }) {
//   if (!warning) return null;

//   const warnings = Array.isArray(warning)
//     ? warning
//     : [warning];

//   const total = warnings.reduce(
//     (sum, w) =>
//       sum +
//       (
//         w.additionalCost ??
//         (w.unitPrice || 0) * (w.extraUnits || 1)
//       ),
//     0
//   );

//   const message = `Your action exceeds your current subscription.

// Additional monthly charges:

// ${warnings
//   .map(w => {
//     const amount =
//       w.additionalCost ??
//       (w.unitPrice || 0) * (w.extraUnits || 1);

//     const qty = w.extraUnits || 1;

//     return `• ${qty} ${RESOURCE_LABELS[w.resource] || w.resource}   +${amount} ${w.currency}`;
//   })
//   .join('\n')}

// ──────────────────────
// Total: ${total} ${warnings[0]?.currency || ''} / month

// These charges will be added to your next renewal invoice.

// Do you want to continue?`;

//   return (
//     <Toast
//       show={true}
//       type="warning"
//       onClose={onClose}
//       onConfirm={onConfirm}
//       confirmText="Continue"
//       cancelText="Cancel"
//       message={message}
//     />
//   );
// }

// export default OverageConfirmationToast;