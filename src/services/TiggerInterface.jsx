import axios from "axios";

// BASE URL for the Interface API
const INTERFACE_ENDPOINT = import.meta.env.VITE_REACT_APP_RESULT_TO_SAP_ENDPOINT;
const apiClient = axios.create({
  baseURL: INTERFACE_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});

const useInterfaceAPIService = () => {
  const login = async (username) => {
    console.log("Attempting login with:", username);
    try {
      const response = await apiClient.post("/api/auth/login", { username });
      const interfaceToken = response.data.token; // More meaningful name for the token
      sessionStorage.setItem("interfaceToken", interfaceToken);
      console.log("Interface token received and stored:", interfaceToken);
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Login failed, please check the credentials and network.");
    }
  };

  const validatePayload = (payload) => {
    const requiredFields = ["batch", "material", "plant", "operation", "miccode", "result"];
    for (let field of requiredFields) {
      if (!payload[field] || (field === "result" && typeof payload[field] !== 'number')) {
        console.error("Validation error: Missing or invalid field", field);
        return false;
      }
    }
    return true;
  };

  const sendPayload = async (payload) => {
    const interfaceToken = sessionStorage.getItem("interfaceToken");
    if (!interfaceToken) {
      console.error("No interface token found, initiating login.");
      throw new Error("Authentication required. Please login.");
    }

    if (!validatePayload(payload)) {
      throw new Error("Payload validation failed. Please check the data.");
    }

    try {
      const response = await apiClient.post(
        "/api/quality-data",
        payload,
        { headers: { Authorization: `Bearer ${interfaceToken}` } }
      );
      console.log("Payload sent successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error sending payload:", error);
      throw new Error("Error sending data, please try again.");
    }
  };

  return { login, sendPayload };
};

export default useInterfaceAPIService;
