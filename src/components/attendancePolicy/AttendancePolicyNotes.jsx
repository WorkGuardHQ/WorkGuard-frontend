// components/attendancePolicy/AttendancePolicyNotes.jsx
const AttendancePolicyNotes = ({ t }) => (
  <div className="alert alert-secondary small mt-4">
    <strong>{t('attendancePolicy.rulesTitle')}:</strong>
    <ul className="mb-0 mt-2">
      <li>{t('attendancePolicy.rulePriority')}</li>
      <li>{t('attendancePolicy.ruleFirstBranch')}</li>
      <li>{t('attendancePolicy.ruleValidBranch')}</li>
     
      {/* <li>{t('attendancePolicy.ruleDisplayOnly')}</li> */}
    </ul>
  </div>
);

export default AttendancePolicyNotes;
