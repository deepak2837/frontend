import React, { useState, useEffect } from 'react';
import { studyBuddyApi } from '@/services/studyBuddyApi';
import styles from './StudyPlannerViewer.module.css';

const StudyPlannerViewer = ({ sessionId }) => {
  const [studyPlan, setStudyPlan] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStudyPlan();
  }, [sessionId]);

  const loadStudyPlan = async () => {
    setLoading(true);
    setError(null);

    try {
      const plan = await studyBuddyApi.getStudyPlan(sessionId);
      
      // If plan is null (404 response), no plan exists
      if (!plan) {
        console.log('No study plan found - user needs to create one');
        setStudyPlan(null);
        setError(null);
        setLoading(false);
        return;
      }

      setStudyPlan(plan);

      if (plan.daily_schedules && plan.daily_schedules.length > 0) {
        setSelectedDate(plan.daily_schedules[0].date);
      }

      // Load progress
      const progressData = await studyBuddyApi.getStudyProgress(plan.plan_id);
      setProgress(progressData.progress);

    } catch (error) {
      console.error('Failed to load study plan:', error);
      setError('Failed to load study plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskStatusUpdate = async (taskId, status) => {
    try {
      await studyBuddyApi.updateTaskStatus(studyPlan.plan_id, taskId, status);
      
      // Update local state immediately
      setStudyPlan(prevPlan => {
        const updatedPlan = { ...prevPlan };
        updatedPlan.daily_schedules = updatedPlan.daily_schedules.map(schedule => ({
          ...schedule,
          tasks: schedule.tasks.map(task => 
            task.task_id === taskId ? { ...task, status } : task
          )
        }));
        return updatedPlan;
      });

      // Update progress
      setProgress(prevProgress => {
        const allTasks = studyPlan.daily_schedules.flatMap(s => s.tasks);
        const completedCount = allTasks.filter(t => 
          t.task_id === taskId ? status === 'completed' : t.status === 'completed'
        ).length;
        const totalTasks = allTasks.length;
        return {
          ...prevProgress,
          completed_tasks: completedCount,
          total_tasks: totalTasks,
          overall_progress: (completedCount / totalTasks) * 100
        };
      });
    } catch (error) {
      console.error('Failed to update task status:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  const getTaskTypeIcon = (taskType) => {
    const icons = {
      review_questions: '❓',
      study_notes: '📖',
      practice_flashcards: '🎴',
      review_cheatsheet: '📋',
      mock_test: '📊',
      revision: '🔄',
    };
    return icons[taskType] || '📚';
  };

  const getSubjectColor = (subject) => {
    const colors = {
      anatomy: styles.subjectAnatomy,
      physiology: styles.subjectPhysiology,
      biochemistry: styles.subjectBiochemistry,
      pathology: styles.subjectPathology,
      pharmacology: styles.subjectPharmacology,
      microbiology: styles.subjectMicrobiology,
      forensic_medicine: styles.subjectForensic,
      community_medicine: styles.subjectCommunity,
      general: styles.subjectGeneral
    };
    return colors[subject] || colors.general;
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const selectedSchedule = studyPlan?.daily_schedules?.find(schedule => schedule.date === selectedDate);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingIcon}>
          <div className={styles.spinner}></div>
          <span className={styles.calendarIcon}>📅</span>
        </div>
        <p className={styles.loadingText}>Loading study plan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>📅</div>
        <p className={styles.errorText}>{error}</p>
        <button onClick={loadStudyPlan} className={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  if (!studyPlan) {
    return (
      <div className={styles.noPlanContainer}>
        <div className={styles.noPlanIcon}>📅</div>
        <h3>No Study Plan Yet</h3>
        <p>You haven't created a study plan for this session.</p>
        <p className={styles.noPlanHint}>Click the "Create New Study Plan" button below to get started!</p>
      </div>
    );
  }

  return (
    <div className={styles.viewer}>
      {/* Study Plan Header */}
      <div className={styles.planHeader}>
        <div className={styles.planInfo}>
          <h2>{studyPlan.plan_name}</h2>
          <div className={styles.planMeta}>
            <span>📅 {studyPlan.total_study_days} days</span>
            <span>🕐 {studyPlan.total_study_hours} hours total</span>
            <span>🎯 Created {new Date(studyPlan.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {progress && (
          <div className={styles.progressInfo}>
            <div className={styles.progressPercentage}>
              {Math.round(progress.overall_progress || 0)}%
            </div>
            <div className={styles.progressTasks}>
              {progress.completed_tasks || 0} of {progress.total_tasks || 0} tasks
            </div>
            {progress.streak_days > 0 && (
              <div className={styles.streak}>
                🔥 {progress.streak_days} day streak
              </div>
            )}
          </div>
        )}
      </div>

      {progress && (
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress.overall_progress || 0}%` }}
          ></div>
        </div>
      )}

      {/* Calendar Navigation */}
      <div className={styles.calendar}>
        <h3 className={styles.calendarTitle}>
          <span>📅</span>
          Study Schedule
        </h3>

        <div className={styles.calendarGrid}>
          {studyPlan.daily_schedules?.map((schedule) => {
            const date = new Date(schedule.date);
            const isSelected = selectedDate === schedule.date;
            const isCompleted = schedule.progress_percentage === 100;

            return (
              <button
                key={schedule.date}
                onClick={() => setSelectedDate(schedule.date)}
                className={`${styles.calendarDay} ${
                  isSelected ? styles.selected : ''
                } ${isCompleted ? styles.completed : ''}`}
              >
                <div className={styles.dayWeek}>
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={styles.dayDate}>
                  {date.getDate()}
                </div>
                <div className={styles.dayProgress}>
                  {Math.round(schedule.progress_percentage)}%
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Tasks */}
      {selectedSchedule && (
        <div className={styles.tasks}>
          <div className={styles.tasksHeader}>
            <h3>
              Tasks for {new Date(selectedSchedule.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h3>
            <div className={styles.totalTime}>
              Total: {formatDuration(selectedSchedule.total_study_time)}
            </div>
          </div>

          <div className={styles.tasksList}>
            {selectedSchedule.tasks?.map((task) => (
              <div
                key={task.task_id}
                className={`${styles.task} ${
                  task.status === 'completed' ? styles.taskCompleted :
                  task.status === 'in_progress' ? styles.taskInProgress : ''
                }`}
              >
                <div className={styles.taskContent}>
                  <button
                    onClick={() => handleTaskStatusUpdate(
                      task.task_id,
                      task.status === 'completed' ? 'pending' : 'completed'
                    )}
                    className={styles.taskCheckbox}
                  >
                    {task.status === 'completed' ? '✓' : '○'}
                  </button>

                  <div className={styles.taskDetails}>
                    <div className={styles.taskHeader}>
                      <span className={styles.taskIcon}>{getTaskTypeIcon(task.task_type)}</span>
                      <h4 className={task.status === 'completed' ? styles.taskTitleCompleted : ''}>
                        {task.title}
                      </h4>
                      <span className={`${styles.subjectBadge} ${getSubjectColor(task.subject)}`}>
                        {task.subject.replace('_', ' ')}
                      </span>
                    </div>

                    <p className={styles.taskDescription}>{task.description}</p>

                    <div className={styles.taskMeta}>
                      <span>🕐 {formatDuration(task.estimated_duration)}</span>
                      <span>📊 Priority {task.priority}</span>
                    </div>
                  </div>

                  {task.status === 'pending' && (
                    <button
                      onClick={() => handleTaskStatusUpdate(task.task_id, 'in_progress')}
                      className={styles.startButton}
                    >
                      <span>▶</span>
                      <span>Start</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {(!selectedSchedule.tasks || selectedSchedule.tasks.length === 0) && (
            <div className={styles.noTasks}>
              <div className={styles.noTasksIcon}>🎉</div>
              <p>No tasks scheduled for this day</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudyPlannerViewer;
