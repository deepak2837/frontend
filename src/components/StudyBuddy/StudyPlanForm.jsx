import React, { useState } from 'react';
import styles from './StudyPlanForm.module.css';

const MEDICAL_SUBJECTS = [
  { value: 'anatomy', label: 'Anatomy' },
  { value: 'physiology', label: 'Physiology' },
  { value: 'biochemistry', label: 'Biochemistry' },
  { value: 'pathology', label: 'Pathology' },
  { value: 'pharmacology', label: 'Pharmacology' },
  { value: 'microbiology', label: 'Microbiology' },
  { value: 'forensic_medicine', label: 'Forensic Medicine' },
  { value: 'community_medicine', label: 'Community Medicine' }
];

const STUDY_TIME_SLOTS = [
  { value: 'early_morning', label: 'Early Morning (5-8 AM)' },
  { value: 'morning', label: 'Morning (8-12 PM)' },
  { value: 'afternoon', label: 'Afternoon (12-5 PM)' },
  { value: 'evening', label: 'Evening (5-8 PM)' },
  { value: 'night', label: 'Night (8-11 PM)' }
];

const StudyPlanForm = ({ onSubmit, onCancel, isLoading = false }) => {
  const [config, setConfig] = useState({
    examDate: '',
    dailyStudyHours: 6,
    studyDaysPerWeek: 6,
    subjectPriorities: {},
    weakAreas: [],
    preferredStudyTimes: [],
    enableSpacedRepetition: true
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    
    if (!config.examDate) {
      newErrors.examDate = 'Exam date is required';
    } else {
      const examDate = new Date(config.examDate);
      const today = new Date();
      if (examDate <= today) {
        newErrors.examDate = 'Exam date must be in the future';
      }
    }
    
    const hours = parseInt(config.dailyStudyHours);
    if (isNaN(hours) || hours < 1 || hours > 16) {
      newErrors.dailyStudyHours = 'Daily study hours must be between 1 and 16';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    onSubmit(config);
  };

  const handleSubjectPriorityChange = (subject, priority) => {
    setConfig(prev => ({
      ...prev,
      subjectPriorities: {
        ...prev.subjectPriorities,
        [subject]: priority
      }
    }));
  };

  const handleWeakAreaToggle = (subject) => {
    setConfig(prev => ({
      ...prev,
      weakAreas: prev.weakAreas.includes(subject)
        ? prev.weakAreas.filter(area => area !== subject)
        : [...prev.weakAreas, subject]
    }));
  };

  const handleStudyTimeToggle = (timeSlot) => {
    setConfig(prev => ({
      ...prev,
      preferredStudyTimes: prev.preferredStudyTimes.includes(timeSlot)
        ? prev.preferredStudyTimes.filter(time => time !== timeSlot)
        : [...prev.preferredStudyTimes, timeSlot]
    }));
  };

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>📅</div>
            <div>
              <h2>Create Study Plan</h2>
              <p>Configure your personalized study schedule</p>
            </div>
          </div>
          <button onClick={onCancel} className={styles.closeButton}>
            Close
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Basic Configuration */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <span>🎯</span>
              Basic Configuration
            </h3>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Target Exam Date *</label>
                <input
                  type="date"
                  value={config.examDate}
                  onChange={(e) => setConfig(prev => ({ ...prev, examDate: e.target.value }))}
                  className={styles.input}
                />
                {errors.examDate && (
                  <p className={styles.error}>{errors.examDate}</p>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label>Daily Study Hours</label>
                <input
                  type="number"
                  min="1"
                  max="16"
                  value={config.dailyStudyHours || ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : parseInt(e.target.value) || 6;
                    setConfig(prev => ({ ...prev, dailyStudyHours: value }));
                  }}
                  className={styles.input}
                />
                {errors.dailyStudyHours && (
                  <p className={styles.error}>{errors.dailyStudyHours}</p>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Study Days Per Week</label>
              <select
                value={config.studyDaysPerWeek || 6}
                onChange={(e) => setConfig(prev => ({ ...prev, studyDaysPerWeek: parseInt(e.target.value) || 6 }))}
                className={styles.select}
              >
                <option value={5}>5 days (Weekdays only)</option>
                <option value={6}>6 days (Monday to Saturday)</option>
                <option value={7}>7 days (All week)</option>
              </select>
            </div>
          </div>

          {/* Subject Priorities */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <span>⚙️</span>
              Subject Priorities
            </h3>
            
            <div className={styles.subjectGrid}>
              {MEDICAL_SUBJECTS.map(subject => (
                <div key={subject.value} className={styles.subjectItem}>
                  <span className={styles.subjectLabel}>{subject.label}</span>
                  <select
                    value={config.subjectPriorities[subject.value] || 3}
                    onChange={(e) => handleSubjectPriorityChange(subject.value, parseInt(e.target.value) || 3)}
                    className={styles.prioritySelect}
                  >
                    <option value={1}>Low</option>
                    <option value={2}>Below Average</option>
                    <option value={3}>Average</option>
                    <option value={4}>High</option>
                    <option value={5}>Very High</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Weak Areas */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              Weak Areas (Need Extra Focus)
            </h3>
            
            <div className={styles.checkboxGrid}>
              {MEDICAL_SUBJECTS.map(subject => (
                <label key={subject.value} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={config.weakAreas.includes(subject.value)}
                    onChange={() => handleWeakAreaToggle(subject.value)}
                    className={styles.checkbox}
                  />
                  <span>{subject.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preferred Study Times */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <span>🕐</span>
              Preferred Study Times
            </h3>
            
            <div className={styles.checkboxGrid}>
              {STUDY_TIME_SLOTS.map(timeSlot => (
                <label key={timeSlot.value} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={config.preferredStudyTimes.includes(timeSlot.value)}
                    onChange={() => handleStudyTimeToggle(timeSlot.value)}
                    className={styles.checkbox}
                  />
                  <span>{timeSlot.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Advanced Options */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Advanced Options</h3>
            
            <label className={styles.advancedOption}>
              <input
                type="checkbox"
                checked={config.enableSpacedRepetition}
                onChange={(e) => setConfig(prev => ({ ...prev, enableSpacedRepetition: e.target.checked }))}
                className={styles.checkbox}
              />
              <div>
                <span className={styles.optionTitle}>Enable Spaced Repetition</span>
                <p className={styles.optionDescription}>Automatically schedule review sessions for better retention</p>
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <button
              type="button"
              onClick={onCancel}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? 'Generating Plan...' : 'Generate Study Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudyPlanForm;
