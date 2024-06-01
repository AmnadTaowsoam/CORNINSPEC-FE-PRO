import { useState, useCallback } from 'react';

const useResultToSAP = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Accessing the base API URL from environment variables
  const apiUrl = import.meta.env.VITE_REACT_APP_RESULT_TO_SAP_ENDPOINT || 'http://localhost:8008';

  // Login function to retrieve and store tokens
  const login = useCallback(async () => {
    const loginUrl = `${apiUrl}/api/auth/login`;
    const credentials = {
      apiKey: import.meta.env.VITE_REACT_APP_API_KEY,
      apiSecret: import.meta.env.VITE_REACT_APP_API_SECRET
    };

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      sessionStorage.setItem('sapResultAccessToken', data.accessToken);
      sessionStorage.setItem('sapResultRefreshToken', data.refreshToken);
      return true;
    } catch (error) {
      console.error('Login error:', error.message);
      setError(`Login error: ${error.message}`);
      return false;
    }
  }, [apiUrl]);
  
  const fetchInterfaceResult = useCallback(async (inslot, batch, material, plant, operationno) => {
    setIsLoading(true);
    setError('');

    const loggedIn = await login();
    if (!loggedIn) {
      setIsLoading(false);
      return;
    }

    const queryUrl = `${apiUrl}/interfaces/search?inslot=${inslot}&batch=${batch}&material=${material}&plant=${plant}&operationno=${operationno}`;
    const accessToken = sessionStorage.getItem('sapResultAccessToken');

    try {
      const response = await fetch(queryUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setError(`Failed to fetch: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, login]);

  return { fetchInterfaceResult, result, error, isLoading };
};

export default useResultToSAP;
