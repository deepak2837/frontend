"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import StudyPlannerViewer from '@/components/StudyBuddy/StudyPlannerViewer';
import StudyPlanForm from '@/components/StudyBuddy/StudyPlanForm';
import { studyBuddyApi } from '@/services/studyBuddyApi';
import styles from './StudyBuddy.module.css';

const StudyPlannerPage = () => {
  const router = useRouter();
  const { isAuthenticated, getUser } = useAuthStore();
  const user = getUser(); // Get decrypted user
  
  const [currentSessionId] = useState('user-plan');
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [planGenerating, setPlanGenerating] = useState(false);
  const [planExists, setPlanExists] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [successMessage, setSuccessMessage] = useState(null);
  const [checkingPlan, setCheckingPlan] = useState(false);
  const [mounted, setMounted] = useState(false);
  const hasCheckedPlan = useRef(false);
  const isCheckingRef = useRef(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check authentication and redirect if needed
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  // Check if user has a study plan - only run once on mount and when refreshKey changes
  useEffect(() => {
    if (mounted && isAuthenticated && user && !hasCheckedPlan.current && !isCheckingRef.current) {
      checkUserPlan();
    }
  }, [mounted, isAuthenticated, refreshKey]);

  const checkUserPlan = async () => {
    if (isCheckingRef.current) return; // Prevent multiple simultaneous calls
    
    isCheckingRef.current = true;
    setCheckingPlan(true);
    
    try {
      const response = await studyBuddyApi.getUserStudyPlans(1);
      if (response?.plans && response.plans.length > 0) {
        setPlanExists(true);
      } else {
        setPlanExists(false);
      }
      hasCheckedPlan.current = true;
    } catch (error) {
      // Handle 404 gracefully - it just means no plans exist yet
      if (error?.response?.status === 404) {
        console.log('No study plans found (404) - this is normal for new users');
        setPlanExists(false);
      } else {
        console.error('Failed to check user plan:', error);
        setPlanExists(false);
      }
      hasCheckedPlan.current = true;
    } finally {
      setCheckingPlan(false);
      isCheckingRef.current = false;
    }
  };

  const handleCreatePlan = () => {
    setShowPlanForm(true);
  };

  const handlePlanFormSubmit = async (config) => {
    setPlanGenerating(true);
    try {
      await studyBuddyApi.generateStudyPlan(currentSessionId, config);
      setShowPlanForm(false);
      setPlanExists(true);
      setSuccessMessage('Study plan created successfully! 🎉');
      hasCheckedPlan.current = false; // Reset check flag
      setRefreshKey(prev => prev + 1);

      // Auto-hide success message
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error('Failed to generate study plan:', error);
      alert('Failed to generate study plan. Please try again.');
    } finally {
      setPlanGenerating(false);
    }
  };

  const handlePlanFormCancel = () => {
    setShowPlanForm(false);
  };

  // Show loading while mounting or checking plan
  if (!mounted || checkingPlan) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingIcon}>
          <div className={styles.spinner}></div>
          <span className={styles.calendarIcon}>📅</span>
        </div>
        <p className={styles.loadingText}>Loading Study Planner...</p>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className={styles.studyPlannerPage}>
      <div className={styles.studyPlannerContainer}>
        {/* Header */}
        <div className={styles.header}>
          <button
            onClick={() => router.push('/')}
            className={styles.backButton}
          >
            ← Back to Home
          </button>
          <button
            onClick={() => {
              hasCheckedPlan.current = false;
              setRefreshKey(prev => prev + 1);
            }}
            className={styles.refreshButton}
          >
            🔄 Refresh
          </button>
        </div>

        {/* Page Title */}
        <div className={styles.pageTitle}>
          <div className={styles.titleIcon}>
            <span>📅</span>
          </div>
          <h1>Study Planner</h1>
          <p>Manage your personalized study schedule and track progress</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className={styles.successMessage}>
            <div className={styles.successContent}>
              <span className={styles.successIcon}>✅</span>
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className={styles.closeButton}
            >
              ✕
            </button>
          </div>
        )}

        {/* Main Content */}
        {planExists ? (
          <div className={styles.planContent}>
            {/* Study Plan Viewer */}
            <StudyPlannerViewer key={refreshKey} sessionId={currentSessionId} />

            {/* Update/Create New Button */}
            <div className={styles.updateButtonContainer}>
              <button
                onClick={handleCreatePlan}
                className={styles.updateButton}
              >
                <span>🔄</span>
                <span>Update Study Plan</span>
              </button>
            </div>
          </div>
        ) : (
          /* No Plan - Show Create Option */
          <div className={styles.noPlanCard}>
            <div className={styles.noPlanIcon}>📅</div>
            <h2>No Study Plan Yet</h2>
            <p>
              Create a personalized study plan to organize your learning journey and track your progress.
            </p>
            <button
              onClick={handleCreatePlan}
              className={styles.createButton}
            >
              <span>➕</span>
              <span>Create Study Plan</span>
            </button>
          </div>
        )}

        {/* Study Plan Form Modal */}
        {showPlanForm && (
          <StudyPlanForm
            onSubmit={handlePlanFormSubmit}
            onCancel={handlePlanFormCancel}
            isLoading={planGenerating}
          />
        )}

        {/* Help Section */}
        <div className={styles.helpSection}>
          <h3>About Study Planner</h3>
          <div className={styles.helpGrid}>
            <div className={styles.helpItem}>
              <h4>📅 Daily Tasks</h4>
              <p>View and complete daily study tasks tailored to your goals</p>
            </div>
            <div className={styles.helpItem}>
              <h4>📊 Progress Tracking</h4>
              <p>Track your study streaks and overall progress</p>
            </div>
            <div className={styles.helpItem}>
              <h4>🎯 Exam Preparation</h4>
              <p>Aligned with your target exam date for optimal scheduling</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlannerPage;
