import React from "react";
import Modal from "react-modal";
import "./ResultModal.css";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
};
function ResultModal({ isOpen, close, startNewGame, winner }) {
  return (
    <Modal
      className="styled-modal"
      isOpen={isOpen}
      onRequestClose={close}
      style={customStyles}
      ariaHideApp={false}
    >
      <div className="modal-wrapper">
        <p className="modal-title">Game Over</p>
        <p className="modal-content">{winner}</p>

        <div className="modal-footer">
          <button className="modal-button" onClick={close}>
            Close
          </button>
          <button className="modal-button" onClick={startNewGame}>
            Start over
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ResultModal;
