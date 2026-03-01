const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004';

class API {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  // Set auth token in localStorage
  setToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  // Remove auth token from localStorage
  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  // Make API request
  async request(endpoint, options = {}) {
    const token = this.getToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}/api${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      
      // Handle network errors specifically
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your internet connection or try again later.');
      }
      
      throw error;
    }
  }

  // Authentication endpoints
  async signup(userData) {
    const response = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async signin(credentials) {
    const response = await this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async getCurrentUser() {
    return await this.request('/auth/me');
  }

  // Quiz endpoints
  async generateQuiz(quizData) {
    return await this.request('/quiz/generate', {
      method: 'POST',
      body: JSON.stringify(quizData),
    });
  }

  async submitQuiz(quizData) {
    return await this.request('/quiz/submit', {
      method: 'POST',
      body: JSON.stringify(quizData),
    });
  }

  // Study plan endpoints
  async generateStudyPlan(planData) {
    return await this.request('/study-plan/generate', {
      method: 'POST',
      body: JSON.stringify(planData),
    });
  }

  async completeTask(taskData) {
    return await this.request('/study-plan/complete-task', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  // User endpoints
  async updateProfile(profileData) {
    return await this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getUserStats() {
    return await this.request('/user/stats');
  }

  // Logout
  logout() {
    this.removeToken();
    this.clearDemoMode();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }

  // Check if user is in demo mode
  isDemoMode() {
    if (typeof window !== 'undefined') {
      const demoUser = localStorage.getItem('demoUser');
      return !!demoUser;
    }
    return false;
  }

  // Get demo user data
  getDemoUser() {
    if (typeof window !== 'undefined') {
      const demoUser = localStorage.getItem('demoUser');
      return demoUser ? JSON.parse(demoUser) : null;
    }
    return null;
  }

  // Clear demo mode
  clearDemoMode() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('demoUser');
      localStorage.removeItem('token');
    }
  }
}

export default new API(); 