import { useState, useCallback } from 'react';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`HTTP ${response.status}: ${errBody}`);
      }

      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  return { fetchData, loading, error };
};

export const useAuth = () => {
  const { fetchData, loading, error } = useApi();

  const login = async (credentials) => {
    return fetchData('http://127.0.0.1:8000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  };

  const signup = async (userData) => {
    return fetchData('http://127.0.0.1:8000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  };

  const logout = async () => {
    return fetchData('http://127.0.0.1:8000/api/auth/logout', {
      method: 'POST',
    });
  };

  return { login, signup, logout, loading, error };
};

export const useChatbot = () => {
  const { fetchData } = useApi();

  const sendMessage = async (userId, prompt) => {
    return fetchData('http://127.0.0.1:8000/api/chatbot/message', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, prompt }),
    });
  };

  const getHistory = async (userId) => {
    return fetchData(`http://127.0.0.1:8000/api/chatbot/history?user_id=${userId}`);
  };

  return { sendMessage, getHistory };
};