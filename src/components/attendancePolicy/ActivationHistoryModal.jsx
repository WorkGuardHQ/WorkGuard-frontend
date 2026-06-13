import ActivationHistoryList from './ActivationHistoryList';

const ActivationHistoryModal = ({ show, policy, onClose }) => {
  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />

      <div className="modal d-block">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">
                <i className="fas fa-history me-2" />
                Activation History
              </h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              <ActivationHistoryList policyId={policy._id} 
              timezone={policy.display?.timezone} />
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ActivationHistoryModal;
