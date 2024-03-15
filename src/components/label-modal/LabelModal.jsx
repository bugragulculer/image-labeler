// Component for displaying a modal to input a label.

import { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Input } from "antd";

const LabelModal = ({ open, onConfirm, onCancel }) => {
  const [labelText, setLabelText] = useState("");

  const handleOk = () => {
    onConfirm(labelText);
    setLabelText("");
  };

  const handleCancel = () => {
    onCancel();
    setLabelText("");
  };

  return (
    <Modal
      title="Label the Selection"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Input
        value={labelText}
        onChange={(e) => setLabelText(e.target.value)}
        placeholder="Enter label"
      />
    </Modal>
  );
};

LabelModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default LabelModal;
