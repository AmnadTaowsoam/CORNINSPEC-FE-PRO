import { useState, useCallback } from 'react';

const useResultToSAP = () => {
  const [resultSent, setResultSent] = useState(null);
  const [error, setError] = useState('');
  const [isLoadingSAP, setIsLoadingSAP] = useState(false);
  const apiUrl = import.meta.env.VITE_REACT_APP_RESULT_TO_SAP_ENDPOINT || 'http://localhost:8008';

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
      return false;
    }
  }, [apiUrl]);
  
  const sendResultToSAP = useCallback(async (inslot, batch, material, plant, operationno) => {
    setIsLoadingSAP(true);
    setError('');

    try {
      const loggedIn = await login();
      if (!loggedIn) {
        setError('Login failed');
        setIsLoadingSAP(false);
        return;
      }

      const sendUrl = `${apiUrl}/interfaces/physical-data`;
      const accessToken = sessionStorage.getItem('sapResultAccessToken');
      const payload = {
        inslot,
        batch,
        material,
        plant,
        operationno
      };

      const response = await fetch(sendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send result to SAP');
      }

      const data = await response.json();
      setResultSent(data);
    } catch (error) {
      setError(`Failed to send: ${error.message}`);
    } finally {
      setIsLoadingSAP(false);
    }
  }, [apiUrl, login]);

  return { sendResultToSAP, resultSent, error, isLoadingSAP };
};

export default useResultToSAP;
