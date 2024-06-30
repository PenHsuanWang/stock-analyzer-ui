// src/components/basic/DataSendingDialog.js

import React from 'react';
import '../../styles/DataSendingDialog.css';

const DataSendingDialog = ({ onClose, title, children }) => {
  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <div className="dialog-header">{title}</div>
        <div className="dialog-body">{children}</div>
        <button className="dialog-close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default DataSendingDialog;



