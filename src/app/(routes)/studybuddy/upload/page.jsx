"use client";
import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Upload.module.css';
import Headings from '@/components/Headings/Headings';
import { studyBuddyApi } from '@/services/studyBuddyApi';
import useAuthStore from '@/store/authStore';

const FileUploadPage = () => {
  const router = useRouter();
  const { getToken } = useAuthStore();
  const [files, setFiles] = useState([]);
  const [sessionName, setSessionName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 
                          'application/vnd.ms-powerpoint', 
                          'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
      const maxSize = 50 * 1024 * 1024; // 50MB

      if (!validTypes.includes(file.type)) {
        setError(`${file.name} is not a supported file type`);
        return false;
      }
      if (file.size > maxSize) {
        setError(`${file.name} exceeds 50MB limit`);
        return false;
      }
      return true;
    });

    setFiles(prev => [...prev, ...validFiles]);
    setError(null);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }

    // Check if user is logged in using auth store
    const token = getToken();
    if (!token) {
      setError('Please login to use this feature');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const response = await studyBuddyApi.uploadFiles(
        files,
        sessionName || `Upload ${new Date().toLocaleDateString()}`,
        'default',
        (progress) => setUploadProgress(progress)
      );

      // Navigate to processing status page
      router.push(`/studybuddy/session/${response.data.sessionId}`);
    } catch (err) {
      console.error('Upload failed:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(err.response?.data?.message || 'Upload failed. Please try again.');
      }
      setUploading(false);
    }
  };

  return (
    <div className="container">
      <div className={styles.uploadPage}>
        <Headings
          title="Upload Study Materials"
          text="Upload PDFs, images, or presentations to generate study content"
        />

        <div className={styles.uploadCard}>
          <div className={styles.sessionNameInput}>
            <label htmlFor="sessionName">Session Name (Optional)</label>
            <input
              id="sessionName"
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="e.g., Cardiology Chapter 5"
              disabled={uploading}
            />
          </div>

          <div
            className={`${styles.dropZone} ${dragActive ? styles.dragActive : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className={styles.dropZoneContent}>
              <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className={styles.dropZoneText}>
                Drag and drop files here, or click to select
              </p>
              <p className={styles.dropZoneSubtext}>
                Supports PDF, JPG, PNG, PPTX (max 50MB per file)
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.ppt,.pptx"
                onChange={handleFileInput}
                className={styles.fileInput}
                disabled={uploading}
              />
            </div>
          </div>

          {files.length > 0 && (
            <div className={styles.filesList}>
              <h3>Selected Files ({files.length})</h3>
              {files.map((file, index) => (
                <div key={index} className={styles.fileItem}>
                  <div className={styles.fileInfo}>
                    <span className={styles.fileName}>{file.name}</span>
                    <span className={styles.fileSize}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  {!uploading && (
                    <button
                      onClick={() => removeFile(index)}
                      className={styles.removeButton}
                      aria-label="Remove file"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          {uploading && (
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className={styles.progressText}>
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          <div className={styles.actions}>
            <button
              onClick={() => router.back()}
              className={styles.cancelButton}
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              className={styles.uploadButton}
              disabled={uploading || files.length === 0}
            >
              {uploading ? 'Uploading...' : 'Upload & Generate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadPage;
