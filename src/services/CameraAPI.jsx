import axios from "axios";

// Assuming environment variables are set up correctly
const username = import.meta.env.VITE_REACT_USER_NAME;
const password = import.meta.env.VITE_REACT_USER_PASSWORD;
const machineIp = import.meta.env.VITE_MACHINE_IP;

const cameraAPIService = {
  login: async () => {
    console.log('Machine IP for login:', machineIp);
    if (!machineIp) {
      throw new Error("No machine IP found in environment variables");
    }

    const getTokenUrl = `${machineIp}:9000/login`;
    const loginData = { username, password };

    try {
      const response = await axios.post(getTokenUrl, loginData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data && response.data.access_token) {
        console.log("Camera login successful");
        sessionStorage.setItem("cameraAccessToken", response.data.access_token); // Store token in sessionStorage
        return response.data.access_token;
      } else {
        throw new Error("Failed to obtain token");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  captureImage: async () => {
    const token = sessionStorage.getItem("cameraAccessToken"); // Retrieve token from sessionStorage
    if (!machineIp || !token) {
      throw new Error(`No machine IP or token found`);
    }
  
    const captureUrl = `${machineIp}:9000/capture`;
    console.log("captureUrl:", captureUrl);
  
    return axios.post(
        captureUrl,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Use token in Authorization header
          },
        }
      )
      .then(response => {
        // Ensure response includes both 'image' and 'sampleWeight'
        if (response.data && response.data.image && response.data.sampleWeight !== undefined) {
          console.log("Image and sample weight data received:", response.data);
          return response.data; // Return the whole data object
        } else {
          console.error("Capture response missing data:", response.data);
          throw new Error("Failed to capture image data");
        }
      })
      .catch(error => {
        console.error("Capture error:", error);
        throw error;
      });
  },
  
};

export default cameraAPIService;
