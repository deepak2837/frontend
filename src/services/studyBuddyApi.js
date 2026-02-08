import axios from 'axios';
import useAuthStore from '@/store/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests - using the same auth store as the rest of the app
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    // Get the decrypted token directly from the store
    const token = useAuthStore.getState().getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Add response interceptor to suppress 404 errors for study planner endpoints
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Suppress console errors for 404 on study planner endpoints
    if (error?.response?.status === 404 && error?.config?.url?.includes('study-plans')) {
      // Return a rejected promise without logging
      return Promise.reject(error);
    }
    // For other errors, let them through normally
    return Promise.reject(error);
  }
);

export const studyBuddyApi = {
  // Session Management
  createSession: async (sessionName) => {
    const response = await apiClient.post('/studybuddy/sessions', { sessionName });
    return response.data;
  },

  getSessions: async () => {
    const response = await apiClient.get('/studybuddy/sessions');
    return response.data;
  },

  getUserSessions: async () => {
    const response = await apiClient.get('/studybuddy/sessions');
    return response.data;
  },

  getSessionDetails: async (sessionId) => {
    const response = await apiClient.get(`/studybuddy/sessions/${sessionId}`);
    return response.data;
  },

  updateSession: async (sessionId, sessionName) => {
    const response = await apiClient.put(`/studybuddy/sessions/${sessionId}`, { sessionName });
    return response.data;
  },

  deleteSession: async (sessionId) => {
    const response = await apiClient.delete(`/studybuddy/sessions/${sessionId}`);
    return response.data;
  },

  // File Upload
  uploadFiles: async (files, sessionName, processingMode = 'default', onProgress) => {
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    formData.append('sessionName', sessionName);
    formData.append('processingMode', processingMode);

    const response = await apiClient.post('/studybuddy/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
    
    return response.data;
  },

  // Prompt-Based Generation
  generateFromPrompt: async (prompt, sessionName) => {
    const response = await apiClient.post('/studybuddy/generate', {
      prompt,
      sessionName,
    });
    return response.data;
  },

  // Processing Status
  getProcessingStatus: async (sessionId) => {
    const response = await apiClient.get(`/studybuddy/sessions/${sessionId}/status`);
    return response.data;
  },

  // Content Retrieval
  getQuestions: async (sessionId) => {
    const response = await apiClient.get(`/studybuddy/sessions/${sessionId}/questions`);
    return response.data;
  },

  getMockTests: async (sessionId) => {
    const response = await apiClient.get(`/studybuddy/sessions/${sessionId}/mock-tests`);
    return response.data;
  },

  getMnemonics: async (sessionId) => {
    const response = await apiClient.get(`/studybuddy/sessions/${sessionId}/mnemonics`);
    return response.data;
  },

  getCheatSheets: async (sessionId) => {
    const response = await apiClient.get(`/studybuddy/sessions/${sessionId}/cheat-sheets`);
    return response.data;
  },

  getNotes: async (sessionId) => {
    const response = await apiClient.get(`/studybuddy/sessions/${sessionId}/notes`);
    return response.data;
  },

  getFlashcards: async (sessionId) => {
    const response = await apiClient.get(`/studybuddy/sessions/${sessionId}/flashcards`);
    return response.data;
  },

  // Mock Test Operations
  startMockTest: async (mockTestId) => {
    const response = await apiClient.post(`/studybuddy/mock-tests/${mockTestId}/start`);
    return response.data;
  },

  submitMockTest: async (mockTestId, answers) => {
    const response = await apiClient.post(`/studybuddy/mock-tests/${mockTestId}/submit`, { answers });
    return response.data;
  },

  getMockTestResults: async (mockTestId) => {
    const response = await apiClient.get(`/studybuddy/mock-tests/${mockTestId}/results`);
    return response.data;
  },

  // Flashcard Review
  getDueFlashcards: async () => {
    const response = await apiClient.get('/studybuddy/flashcards/due');
    return response.data;
  },

  reviewFlashcard: async (flashcardId, rating, responseTime) => {
    const response = await apiClient.post(`/studybuddy/flashcards/${flashcardId}/review`, {
      rating,
      responseTime,
    });
    return response.data;
  },

  // Study Plans
  generateStudyPlan: async (sessionId, config) => {
    const response = await apiClient.post('/studybuddy/study-plans/generate', {
      session_id: sessionId,
      config: config
    }, {
      timeout: 60000, // 60 seconds timeout for AI-powered study plan generation
    });
    return response.data.data || response.data; // Handle both formats
  },

  getStudyPlan: async (sessionId) => {
    try {
      const response = await apiClient.get(`/studybuddy/study-plans/${sessionId}`);
      return response.data.data || response.data; // Handle both formats
    } catch (error) {
      // If 404, return null instead of throwing
      if (error?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  getStudyPlans: async () => {
    const response = await apiClient.get('/studybuddy/study-plans');
    return response.data;
  },

  getUserStudyPlans: async (limit = 10) => {
    try {
      const response = await apiClient.get('/studybuddy/study-plans/user-plans', {
        params: { limit }
      });
      return response.data.data || response.data; // Handle both formats
    } catch (error) {
      // If 404, return empty plans array instead of throwing
      if (error?.response?.status === 404) {
        // Suppress console error for 404 - this is expected when no plans exist
        return { plans: [] };
      }
      // Only log non-404 errors
      console.error('Error fetching study plans:', error.message);
      throw error;
    }
  },

  updateTaskStatus: async (planId, taskId, status, notes) => {
    console.log('API: Updating task', taskId, 'in plan', planId, 'to', status);
    const response = await apiClient.post('/studybuddy/study-plans/update-task', {
      plan_id: planId,
      task_id: taskId,
      status: status,
      notes: notes
    });
    console.log('API: Task update response:', response.data);
    return response.data.data || response.data;
  },

  getStudyProgress: async (planId) => {
    try {
      const response = await apiClient.get(`/studybuddy/study-plans/progress/${planId}`);
      return response.data.data || response.data; // Handle both formats
    } catch (error) {
      // If 404, return default progress
      if (error?.response?.status === 404) {
        return { 
          progress: { 
            total_tasks: 0, 
            completed_tasks: 0, 
            overall_progress: 0, 
            streak_days: 0 
          } 
        };
      }
      throw error;
    }
  },

  // Export
  exportContent: async (type, id) => {
    const response = await apiClient.get(`/studybuddy/export/${type}/${id}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default studyBuddyApi;
