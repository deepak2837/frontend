"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import { studyBuddyApi } from '@/services/studyBuddyApi';
import styles from './StudyMaterialGenerator.module.css';
import { FiUpload, FiEdit3, FiClock, FiFileText } from 'react-icons/fi';

const StudyMaterialGeneratorPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState('upload');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  // File upload state
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Topic input state
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSessions();
    }
  }, [isAuthenticated]);

  const fetchSessions = async () => {
    try {
      const response = await studyBuddyApi.getUserSessions();
      setSessions(response.data || response || []);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      setSessions([]); // Set empty array on error
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      formData.append('processingMode', 'ai_only');
      
      // Use first file name as session name (remove extension)
      const fileName = files[0].name || 'Uploaded File';
      const sessionName = fileName.replace(/\.[^/.]+$/, '') || 'Study Session';
      formData.append('sessionName', sessionName);

      const response = await studyBuddyApi.uploadFiles(formData);
      router.push(`/studybuddy/session/${response.data.sessionId}`);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const handleTopicGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setGenerating(true);
    try {
      // Use first 50 chars of topic as session name
      const sessionName = topic.trim().substring(0, 50);
      const response = await studyBuddyApi.generateFromPrompt({ 
        prompt: topic,
        sessionName 
      });
      router.push(`/studybuddy/session/${response.data.sessionId}`);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate materials');
    } finally {
      setGenerating(false);
    }
  };

  const topicSuggestions = [
    "Cardiovascular system anatomy",
    "Diabetes mellitus pathophysiology", 
    "Pharmacology of antibiotics",
    "Respiratory system physiology",
    "Neuroanatomy basics",
    "Renal physiology",
    "Gastrointestinal disorders",
    "Endocrine system",
    "Hematology basics",
    "Immunology concepts"
  ];

  const searchKeywords = [
    "Anatomy", "Physiology", "Pharmacology", "Pathology", "Biochemistry",
    "Microbiology", "Surgery", "Medicine", "Pediatrics", "Obstetrics"
  ];

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-fuchsia-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Study Materials Generator
          </h1>
          <p className="text-gray-600 text-sm">
            Transform your content into comprehensive study materials
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all text-sm ${
                activeTab === 'upload'
                  ? 'bg-white text-pink-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FiUpload className="w-4 h-4" />
              <span>Upload Files</span>
            </button>
            <button
              onClick={() => setActiveTab('topic')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all text-sm ${
                activeTab === 'topic'
                  ? 'bg-white text-pink-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FiEdit3 className="w-4 h-4" />
              <span>Enter Topic</span>
            </button>
          </div>

          {/* Upload Tab Content */}
          {activeTab === 'upload' && (
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-pink-400 hover:bg-pink-50/30 transition-all cursor-pointer"
                onClick={() => document.getElementById('file-upload').click()}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-fuchsia-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiUpload className="w-8 h-8 text-white" />
                </div>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.pptx"
                  onChange={(e) => setFiles(Array.from(e.target.files))}
                  className="hidden"
                  id="file-upload"
                />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Drop files here or click to browse
                </p>
                <p className="text-xs text-gray-500">
                  PDF, Images, PowerPoint • Max 50MB per file
                </p>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FiFileText className="w-4 h-4 text-pink-600" />
                        </div>
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                        className="text-red-500 hover:text-red-700 text-sm font-medium ml-3"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={files.length === 0 || uploading}
                className="w-full bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Uploading...
                  </span>
                ) : (
                  'Generate Study Materials'
                )}
              </button>
            </form>
          )}

          {/* Topic Tab Content */}
          {activeTab === 'topic' && (
            <form onSubmit={handleTopicGenerate} className="space-y-4">
              <div>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter your medical topic here... (e.g., Cardiovascular system anatomy, Diabetes pathophysiology)"
                  className="w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-sm resize-none"
                />
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-3 font-medium">💡 Quick suggestions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {topicSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTopic(suggestion)}
                      className="px-3 py-2 bg-gradient-to-r from-pink-50 to-fuchsia-50 text-pink-700 rounded-lg text-xs font-medium hover:from-pink-100 hover:to-fuchsia-100 transition-all text-left border border-pink-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!topic.trim() || generating}
                className="w-full bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {generating ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Generating...
                  </span>
                ) : (
                  'Generate Study Materials'
                )}
              </button>
            </form>
          )}

          {/* What Gets Generated */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-600 text-center mb-4">
              ✨ AI generates comprehensive study materials including:
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: '❓', label: 'MCQs', color: 'from-blue-50 to-blue-100' },
                { icon: '📊', label: 'Mock Tests', color: 'from-purple-50 to-purple-100' },
                { icon: '🧠', label: 'Mnemonics', color: 'from-pink-50 to-pink-100' },
                { icon: '📋', label: 'Cheat Sheets', color: 'from-green-50 to-green-100' },
                { icon: '📖', label: 'Notes', color: 'from-yellow-50 to-yellow-100' },
                { icon: '🎴', label: 'Flashcards', color: 'from-orange-50 to-orange-100' }
              ].map((item, idx) => (
                <div key={idx} className={`flex flex-col items-center justify-center p-3 bg-gradient-to-br ${item.color} rounded-xl`}>
                  <span className="text-2xl mb-1">{item.icon}</span>
                  <span className="text-xs font-medium text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Session History */}
        {sessions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Sessions</h2>
            <div className="space-y-2">
              {sessions.slice(0, 8).map((session) => (
                <div
                  key={session.sessionId}
                  onClick={() => router.push(`/studybuddy/session/${session.sessionId}`)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group border border-transparent hover:border-pink-200"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-fuchsia-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <FiFileText className="w-5 h-5 text-pink-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-800 text-sm truncate">{session.sessionName}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <FiClock className="w-3 h-3" />
                          {new Date(session.createdAt).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full font-medium ${
                          session.processingStatus === 'completed' ? 'bg-green-100 text-green-700' :
                          session.processingStatus === 'processing' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {session.processingStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-400 group-hover:text-pink-500 transition-colors">
                    →
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMaterialGeneratorPage;
