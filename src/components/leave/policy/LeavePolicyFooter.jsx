import React from "react";
import { useTranslation } from "react-i18next";

export default function LeavePolicyFooter() {
  const { t } = useTranslation();

  return (
   <div className="alert alert-secondary small mt-4">
    <strong>{t('leavePolicies.rules.title')}:</strong>
    <ul className="mb-0 mt-2">

       <li>{t("leavePolicies.rules.leaveYearResetNote1")}</li>

  <li>{t("leavePolicies.rules.priority")}</li>
   <li>{t("leavePolicies.rules.branches")}</li>

        <li>{t("leavePolicies.rules.noAutoBalance")}</li>
        <li>{t("leavePolicies.rules.futureOnly")}</li>
        <li>{t("leavePolicies.rules.yearBased")}</li>
         <li>{t("leavePolicies.rules.carryover")}</li>

        {/*
        <li>{t("leavePolicies.rules.sick")}</li> */}
        <li>{t("leavePolicies.rules.payrollLock")}</li>
        {/* <li>{t("leavePolicies.rules.audit")}</li> */}
    </ul>
  </div>

  );
}

