import axios from "axios";

// Token Management Service
const tokenService = {
  getToken() {
    return sessionStorage.getItem("predictAccessToken");
  },
  setToken(accessToken, refreshToken) {
    sessionStorage.setItem("predictAccessToken", accessToken);
    sessionStorage.setItem("predictRefreshToken", refreshToken);
  },
  clearToken() {
    sessionStorage.removeItem("predictAccessToken");
    sessionStorage.removeItem("predictRefreshToken");
  }
};

// Helper function for error handling
function handleAxiosError(error) {
  if (axios.isAxiosError(error)) {
    const responseError = error.response
      ? `API error: ${error.response.data.message}, Status: ${error.response.status}`
      : "API server did not respond";
    const setupError = error.request
      ? "No response received from the API server."
      : `Error setting up API request: ${error.message}`;
    console.error("Axios error:", responseError || setupError);
    throw new Error(responseError || setupError);
  } else {
    console.error("Unexpected error:", error.message);
    throw error;
  }
}

// Create a custom Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_PREDICT_ENDPOINT,
});

apiClient.interceptors.request.use(
  config => {
    const token = tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 401) {
      try {
        await predictionAPIService.login();
        return apiClient.request(error.config);
      } catch (refreshError) {
        tokenService.clearToken();
        console.error("Failed to refresh token", refreshError);
      }
    }
    handleAxiosError(error);
    return Promise.reject(error);
  }
);

const predictionAPIService = {
  async login() {
    const apiKey = import.meta.env.VITE_REACT_APP_API_KEY;
    const apiSecret = import.meta.env.VITE_REACT_APP_API_SECRET;

    if (!apiKey || !apiSecret) {
      const errorMessage = "Missing API credentials";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    try {
      const { data } = await apiClient.post("/login", {
        api_key: apiKey,
        api_secret: apiSecret
      });

      if (data.accessToken) {
        console.log("Login successful");
        tokenService.setToken(data.accessToken, data.refreshToken);
        return data.accessToken;
      } else {
        throw new Error("Failed to get token");
      }
    } catch (error) {
      handleAxiosError(error);
    }
  },

  async predictImage(sampleWeight, imageBlob, interfaceData) {
    const formData = new FormData();
    formData.append("information", JSON.stringify({ weight: sampleWeight, ...interfaceData }));
    formData.append("image_file", imageBlob);

    try {
      const { data } = await apiClient.post("/predict", formData);
      return data;
    } catch (error) {
      handleAxiosError(error);
    }
  }
};

export default predictionAPIService;
