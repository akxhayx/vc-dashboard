import React, { useCallback } from 'react';
import { motion } from 'framer-motion';

const FileUpload = ({ onFileUpload, isProcessing }) => {
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <motion.div
      className="file-upload"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="upload-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="17 8 12 3 7 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="12" y1="3" x2="12" y2="15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h2>Upload Portfolio Data</h2>
      <p>Drop your CSV file here or click to browse</p>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileInput}
        disabled={isProcessing}
        id="file-input"
      />
      <label htmlFor="file-input" className="upload-button">
        {isProcessing ? 'Processing...' : 'Choose File'}
      </label>
      <div className="upload-requirements">
        <span>Required columns:</span>
        <span className="req-item">Startup, Revenue_Monthly, Users, CAC, Expenses, ARR, LTV, Burn_Rate</span>
      </div>
    </motion.div>
  );
};

export default FileUpload;
