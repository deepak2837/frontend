"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Generate.module.css';
import Headings from '@/components/Headings/Headings';
import { studyBuddyApi } from '@/services/studyBuddyApi';
import useAuthStore from '@/store/authStore';

const GeneratePage = () => {
  const router = useRouter();
  const { getToken } = useAuthStore();
  const [prompt, setPrompt] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const examplePrompts = [
    "Explain the cardiac cycle with diagrams and key points",
    "Create study materials on respiratory system anatomy",
    "Generate questions on pharmacology of antibiotics",
    "Summarize pathophysiology of diabetes mellitus"
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a topic or prompt');
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
      setGenerating(true);
      setError(null);

      const response = await studyBuddyApi.generateFromPrompt(
        prompt,
        sessionName || `Prompt: ${prompt.substring(0, 50)}...`
      );

      // Navigate to processing status page
      router.push(`/studybuddy/session/${response.data.sessionId}`);
    } catch (err) {
      console.error('Generation failed:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(err.response?.data?.message || 'Generation failed. Please try again.');
      }
      setGenerating(false);
    }
  };

  const useExamplePrompt = (example) => {
    setPrompt(example);
  };

  return (
    <div className="container">
      <div className={styles.generatePage}>
        <Headings
          title="Generate Study Materials"
          text="Enter a topic or question to generate comprehensive study content"
        />

        <div className={styles.generateCard}>
          <div className={styles.sessionNameInput}>
            <label htmlFor="sessionName">Session Name (Optional)</label>
            <input
              id="sessionName"
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="e.g., Cardiovascular System Review"
              disabled={generating}
            />
          </div>

          <div className={styles.promptInput}>
            <label htmlFor="prompt">Topic or Prompt</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter a medical topic, concept, or question you want to study..."
              rows={6}
              disabled={generating}
            />
            <div className={styles.charCount}>
              {prompt.length} characters
            </div>
          </div>

          <div className={styles.examples}>
            <h3>Example Prompts</h3>
            <div className={styles.examplesList}>
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => useExamplePrompt(example)}
                  className={styles.exampleButton}
                  disabled={generating}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          {generating && (
            <div className={styles.generatingMessage}>
              <div className={styles.spinner}></div>
              <p>Generating study materials...</p>
            </div>
          )}

          <div className={styles.actions}>
            <button
              onClick={() => router.back()}
              className={styles.cancelButton}
              disabled={generating}
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              className={styles.generateButton}
              disabled={generating || !prompt.trim()}
            >
              {generating ? 'Generating...' : 'Generate Materials'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratePage;
