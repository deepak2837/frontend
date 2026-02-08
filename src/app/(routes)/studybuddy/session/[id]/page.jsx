"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiFileText, FiClock } from 'react-icons/fi';
import styles from './SessionDetails.module.css';
import Headings from '@/components/Headings/Headings';
import { studyBuddyApi } from '@/services/studyBuddyApi';
import MockTestInterface from '@/components/StudyBuddy/MockTestInterface';
import MockTestResults from '@/components/StudyBuddy/MockTestResults';
import MockTestDialog from '@/components/StudyBuddy/MockTestDialog';
import FlipFlashcard from '@/components/StudyBuddy/FlipFlashcard';
import FlashcardStudyMode from '@/components/StudyBuddy/FlashcardStudyMode';
import { renderMarkdown } from '@/utils/markdown';

const SessionDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id;

  const [session, setSession] = useState(null);
  const [status, setStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('questions');
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // Recent sessions
  const [recentSessions, setRecentSessions] = useState([]);

  // Mock test state
  const [selectedTest, setSelectedTest] = useState(null);
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [testQuestions, setTestQuestions] = useState([]);
  const [testResults, setTestResults] = useState(null);

  useEffect(() => {
    if (sessionId) {
      fetchSessionData();
      fetchRecentSessions();
      const interval = setInterval(checkProcessingStatus, 3000);
      return () => clearInterval(interval);
    }
  }, [sessionId]);

  const fetchRecentSessions = async () => {
    try {
      const response = await studyBuddyApi.getUserSessions();
      const allSessions = response.data || response || [];
      // Filter out current session and show last 5
      setRecentSessions(allSessions.filter(s => s.sessionId !== sessionId).slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch recent sessions:', error);
    }
  };

  const fetchSessionData = async () => {
    try {
      const sessionData = await studyBuddyApi.getSessionDetails(sessionId);
      setSession(sessionData.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch session:', err);
      setError('Failed to load session');
      setLoading(false);
    }
  };

  const checkProcessingStatus = async () => {
    try {
      const statusData = await studyBuddyApi.getProcessingStatus(sessionId);
      setStatus(statusData.data);

      if (statusData.data.status === 'completed') {
        fetchAllContent();
      } else if (statusData.data.status === 'failed') {
        console.error('Processing failed:', statusData.data.errorMessage);
      }
    } catch (err) {
      console.error('Failed to check status:', err);
    }
  };

  const fetchAllContent = async () => {
    try {
      const [questions, mockTests, mnemonics, cheatSheets, notes, flashcards] = await Promise.all([
        studyBuddyApi.getQuestions(sessionId).catch(() => ({ data: [] })),
        studyBuddyApi.getMockTests(sessionId).catch(() => ({ data: [] })),
        studyBuddyApi.getMnemonics(sessionId).catch(() => ({ data: [] })),
        studyBuddyApi.getCheatSheets(sessionId).catch(() => ({ data: [] })),
        studyBuddyApi.getNotes(sessionId).catch(() => ({ data: [] })),
        studyBuddyApi.getFlashcards(sessionId).catch(() => ({ data: [] }))
      ]);

      setContent({
        questions: questions.data || questions || [],
        mockTests: mockTests.data || mockTests || [],
        mnemonics: mnemonics.data || mnemonics || [],
        cheatSheets: cheatSheets.data || cheatSheets || [],
        notes: notes.data || notes || [],
        flashcards: flashcards.data || flashcards || []
      });
    } catch (err) {
      console.error('Failed to fetch content:', err);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <button onClick={() => router.push('/studybuddy')} className={styles.backButton}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isProcessing = status?.status === 'processing' || status?.status === 'pending';
  const isFailed = status?.status === 'failed';
  const isCompleted = status?.status === 'completed';

  // Mock test handlers
  const handleStartTest = (test) => {
    setSelectedTest(test);
    setShowTestDialog(true);
  };

  const handleConfirmStartTest = async () => {
    if (!selectedTest) return;

    setShowTestDialog(false);
    setLoading(true);

    try {
      // Get all questions for the test
      const questionsData = await studyBuddyApi.getQuestions(sessionId);
      const allQuestions = questionsData.data || questionsData || [];

      // Filter questions that are in the test
      let testQs = allQuestions;
      if (selectedTest.questions && selectedTest.questions.length > 0) {
        const testQuestionIds = new Set(selectedTest.questions.map(q => q.toString()));
        testQs = allQuestions.filter((q) => 
          testQuestionIds.has(q._id?.toString()) || testQuestionIds.has(q.questionId)
        );
        if (testQs.length === 0) testQs = allQuestions;
      }

      console.log('Test questions loaded:', testQs.length);
      setTestQuestions(testQs);
      setTestMode(true);
    } catch (error) {
      console.error('Failed to load test questions:', error);
      alert('Failed to start test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTest = () => {
    setShowTestDialog(false);
    setSelectedTest(null);
  };

  const handleTestSubmit = (answers, timeSpent) => {
    if (!selectedTest) return;

    const results = testQuestions.map((q) => {
      const questionId = q.questionId || q._id;
      const userAnswer = answers[questionId] || '';
      const correctAnswer = q.correctAnswer || 'A';
      const isCorrect = userAnswer === correctAnswer;

      return { questionId, userAnswer, correctAnswer, isCorrect, question: q };
    });

    setTestResults({
      results,
      timeSpent,
      totalTime: selectedTest.durationMinutes * 60
    });
    setTestMode(false);
  };

  const handleTestExit = () => {
    if (confirm('Are you sure you want to exit the test? Your progress will be lost.')) {
      setTestMode(false);
      setSelectedTest(null);
      setTestQuestions([]);
    }
  };

  const handleRetakeTest = () => {
    setTestResults(null);
    if (selectedTest) {
      setShowTestDialog(true);
    }
  };

  const handleCloseResults = () => {
    setTestResults(null);
    setSelectedTest(null);
  };

  return (
    <>
      <div className="container mx-auto px-4 max-w-5xl" style={{ display: (testMode || showTestDialog) ? 'none' : 'block' }}>
        <div className={styles.sessionPage}>
        <Headings
          title={session?.sessionName || 'Study Session'}
          text={`Created on ${new Date(session?.createdAt).toLocaleDateString()}`}
        />

        {isProcessing && (
          <div className={styles.processingCard}>
            <div className={styles.processingHeader}>
              <div className={styles.spinner}></div>
              <h3>Processing Your Materials</h3>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${status?.progress || 0}%` }}
              />
            </div>
            <p className={styles.progressText}>
              {status?.progress || 0}% complete
            </p>
            <p className={styles.processingMessage}>
              Generating questions, flashcards, mnemonics, and study materials...
            </p>
          </div>
        )}

        {isFailed && (
          <div className={styles.errorCard}>
            <h3>Processing Failed</h3>
            <p>{status?.errorMessage || 'An error occurred during processing'}</p>
            <button onClick={() => router.push('/studybuddy')} className={styles.backButton}>
              Back to Dashboard
            </button>
          </div>
        )}

        {isCompleted && (
          <div className={styles.contentSection}>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${activeTab === 'questions' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('questions')}
              >
                Questions ({content.questions?.length || 0})
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'mocktests' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('mocktests')}
              >
                Mock Tests ({content.mockTests?.length || 0})
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'flashcards' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('flashcards')}
              >
                Flashcards ({content.flashcards?.length || 0})
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'mnemonics' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('mnemonics')}
              >
                Mnemonics ({content.mnemonics?.length || 0})
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'cheatsheets' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('cheatsheets')}
              >
                Cheat Sheets ({content.cheatSheets?.length || 0})
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'notes' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('notes')}
              >
                Notes ({content.notes?.length || 0})
              </button>
            </div>

            <div className={styles.tabContent}>
              {activeTab === 'questions' && (
                <div className="max-w-4xl mx-auto">
                  <div className={styles.questionsList}>
                  {content.questions?.length === 0 ? (
                    <div className={styles.emptyState}>No questions generated yet</div>
                  ) : (
                    content.questions?.map((q, index) => (
                      <div key={q._id} className={styles.questionCard}>
                        <div className={styles.questionHeader}>
                          <span className={styles.questionNumber}>Q{index + 1}</span>
                          <span className={`${styles.difficulty} ${styles[q.difficulty]}`}>
                            {q.difficulty}
                          </span>
                        </div>
                        <p className={styles.questionText}>{q.questionText}</p>
                        <div className={styles.options}>
                          {q.options?.map((opt) => (
                            <div
                              key={opt.optionId}
                              onClick={() => setSelectedAnswers(prev => ({ ...prev, [q._id]: opt.optionId }))}
                              className={`${styles.option} ${
                                selectedAnswers[q._id] === opt.optionId 
                                  ? opt.isCorrect ? styles.correctOption : styles.wrongOption
                                  : ''
                              }`}
                              style={{ cursor: 'pointer' }}
                            >
                              <span className={styles.optionId}>{opt.optionId}.</span>
                              <span>{opt.text}</span>
                            </div>
                          ))}
                        </div>
                        {selectedAnswers[q._id] && q.explanation && (
                          <div className={styles.explanation}>
                            <strong>Explanation:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  </div>
                </div>
              )}

              {activeTab === 'mocktests' && (
                <div className="max-w-4xl mx-auto">
                  {content.mockTests?.length === 0 ? (
                    <div className={styles.emptyState}>No mock tests generated yet</div>
                  ) : (
                    <div className="grid gap-4">
                      {content.mockTests?.map((test) => (
                        <div 
                          key={test._id} 
                          className="bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-pink-400 transition-all shadow-sm hover:shadow-md"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-gray-800 mb-2">{test.testName}</h4>
                              <p className="text-sm text-gray-600 mb-3">{test.description}</p>
                              <div className="flex gap-3 flex-wrap">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  📝 {test.questions?.length || 0} Questions
                                </span>
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                  ⏱️ {test.durationMinutes} mins
                                </span>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                  🎯 {test.totalMarks} marks
                                </span>
                              </div>
                            </div>
                            <button 
                              className="bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex-shrink-0"
                              onClick={() => handleStartTest(test)}
                              style={{ position: 'relative', zIndex: 10 }}
                            >
                              Start Test →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'flashcards' && (
                <div className="max-w-4xl mx-auto">
                  {content.flashcards?.length === 0 ? (
                    <div className={styles.emptyState}>No flashcards generated yet</div>
                  ) : (
                    <FlashcardStudyMode flashcards={content.flashcards} />
                  )}
                </div>
              )}

              {activeTab === 'mnemonics' && (
                <div className="max-w-4xl mx-auto space-y-4">
                  {content.mnemonics?.length === 0 ? (
                    <div className={styles.emptyState}>No mnemonics generated yet</div>
                  ) : (
                    content.mnemonics?.map((mnemonic, index) => (
                      <div
                        key={mnemonic._id}
                        className="bg-gradient-to-br from-pink-50 to-fuchsia-50 rounded-xl p-4 border border-pink-200 shadow-md hover:shadow-lg transition-all"
                      >
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-fuchsia-500 rounded-lg flex items-center justify-center text-xl shadow-sm">🧠</div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{mnemonic.topic}</h3>
                            <span className="text-xs text-pink-600 font-medium">Mnemonic #{index + 1}</span>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 mb-3 border-l-4 border-pink-500 shadow-sm">
                          <p className="text-xl font-bold text-pink-900">"{mnemonic.mnemonicText}"</p>
                        </div>
                        <div className="bg-white/70 rounded-lg p-4 mb-3">
                          <h4 className="font-bold text-gray-900 mb-2 text-sm">📖 Explanation</h4>
                          <div className="text-gray-700 text-sm" dangerouslySetInnerHTML={{ __html: renderMarkdown(mnemonic.explanation) }} />
                        </div>
                        {mnemonic.keyTerms?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {mnemonic.keyTerms.map((term, i) => (
                              <span key={i} className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-semibold">{term}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'cheatsheets' && (
                <div className="max-w-4xl mx-auto space-y-4">
                  {content.cheatSheets?.length === 0 ? (
                    <div className={styles.emptyState}>No cheat sheets generated yet</div>
                  ) : (
                    content.cheatSheets?.map((sheet, index) => (
                      <div key={sheet._id} className="bg-white rounded-xl shadow-lg border border-pink-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-pink-500 to-fuchsia-500 p-4 text-white">
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-xl backdrop-blur-sm">📋</div>
                            <div>
                              <h3 className="text-lg font-bold">{sheet.title}</h3>
                              <p className="text-pink-100 text-xs">Cheat Sheet #{index + 1}</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-pink-50 to-fuchsia-50">
                          <div 
                            className="text-gray-800 text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(sheet.content) }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="max-w-4xl mx-auto">
                  <div className="space-y-4">
                    {content.notes?.map((note) => (
                      <div key={note._id} className="bg-white rounded-xl shadow-lg border border-pink-200 p-4">
                        <h3 className="text-xl font-bold mb-3 text-gray-900">{note.title}</h3>
                        
                        {/* Summary */}
                        {note.content?.summary && (
                          <div className="mb-3 p-3 bg-pink-50 rounded-lg border-l-4 border-pink-500">
                            <h4 className="font-bold text-pink-900 mb-2 text-sm">📝 Summary</h4>
                            <div 
                              className="text-gray-800 text-sm leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: renderMarkdown(note.content.summary) }}
                            />
                          </div>
                        )}

                        {/* Important Points */}
                        {note.content?.importantPoints?.length > 0 && (
                          <div className="mb-3">
                            <h4 className="font-bold text-gray-900 mb-2 flex items-center text-sm">
                              <span className="text-lg mr-1">⭐</span> Important Points
                            </h4>
                            <ul className="space-y-1">
                              {note.content.importantPoints.map((point, idx) => (
                                <li key={idx} className="flex items-start text-sm">
                                  <span className="text-pink-500 mr-2">•</span>
                                  <span className="text-gray-700">{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Key Definitions */}
                        {note.content?.keyDefinitions?.length > 0 && (
                          <div className="mb-3">
                            <h4 className="font-bold text-gray-900 mb-2 text-sm">📚 Key Definitions</h4>
                            <div className="space-y-1">
                              {note.content.keyDefinitions.map((def, idx) => (
                                <div key={idx} className="p-3 bg-purple-50 rounded-lg">
                                  <strong className="text-purple-700">{def.term}:</strong>{' '}
                                  <span className="text-gray-700">{def.definition}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Clinical Pearls */}
                        {note.content?.clinicalPearls?.length > 0 && (
                          <div className="mb-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                            <h4 className="font-bold text-green-900 mb-3">💎 Clinical Pearls</h4>
                            <ul className="space-y-2">
                              {note.content.clinicalPearls.map((pearl, idx) => (
                                <li key={idx} className="text-gray-700">{pearl}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Exam Tips */}
                        {note.content?.examTips?.length > 0 && (
                          <div className="mb-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                            <h4 className="font-bold text-yellow-900 mb-3">🎯 Exam Tips</h4>
                            <ul className="space-y-2">
                              {note.content.examTips.map((tip, idx) => (
                                <li key={idx} className="text-gray-700">{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Structured Sections */}
                        {note.structure?.sections?.length > 0 && (
                          <div className="space-y-4">
                            {note.structure.sections.map((section, idx) => (
                              <div key={idx} className="border-l-2 border-gray-300 pl-4">
                                <h5 className="font-bold text-lg text-gray-900 mb-2">{section.title}</h5>
                                <div 
                                  className="text-gray-700 leading-relaxed"
                                  dangerouslySetInnerHTML={{ __html: renderMarkdown(section.content) }}
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Metadata */}
                        {note.metadata && (
                          <div className="mt-6 pt-4 border-t border-gray-200 flex gap-4 text-sm text-gray-600">
                            {note.metadata.readingTimeMinutes && (
                              <span>📖 {note.metadata.readingTimeMinutes} min read</span>
                            )}
                            {note.metadata.difficulty && (
                              <span>📊 Difficulty: {note.metadata.difficulty}</span>
                            )}
                            {note.metadata.examRelevance && (
                              <span>🎯 Exam Relevance: {note.metadata.examRelevance}</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        </div>

        {/* Recent Sessions */}
        {recentSessions.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg border border-pink-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Sessions</h2>
            <div className="space-y-3">
              {recentSessions.map((sess) => (
                <div
                  key={sess.sessionId}
                  onClick={() => router.push(`/studybuddy/session/${sess.sessionId}`)}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-pink-500 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                      <FiFileText className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{sess.sessionName}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center">
                          <FiClock className="w-4 h-4 mr-1" />
                          {new Date(sess.createdAt).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          sess.processingStatus === 'completed' ? 'bg-green-100 text-green-700' :
                          sess.processingStatus === 'processing' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {sess.processingStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-400">→</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mock Test Dialog */}
      {showTestDialog && selectedTest && (
        <MockTestDialog
          testName={selectedTest.testName}
          totalQuestions={selectedTest.questions?.length || selectedTest.totalMarks || 0}
          duration={selectedTest.durationMinutes}
          onStart={handleConfirmStartTest}
          onCancel={handleCancelTest}
        />
      )}

      {/* Mock Test Interface */}
      {testMode && selectedTest && testQuestions.length > 0 && (
        <MockTestInterface
          questions={testQuestions}
          testName={selectedTest.testName}
          duration={selectedTest.durationMinutes}
          onSubmit={handleTestSubmit}
          onExit={handleTestExit}
        />
      )}

      {/* Mock Test Results */}
      {testResults && selectedTest && (
        <MockTestResults
          testName={selectedTest.testName}
          results={testResults.results}
          timeSpent={testResults.timeSpent}
          totalTime={testResults.totalTime}
          onClose={handleCloseResults}
          onRetakeTest={handleRetakeTest}
        />
      )}
    </>
  );
};

export default SessionDetailsPage;
