import React, { useState, useRef, useEffect } from "react";
import sample_image from "../assets/background.png";
import predictionAPIService from "../services/PredictionAPI";
import cameraAPIService from "../services/CameraAPI";
import { classColors, classThai } from "../assets/ClassMapping.js";
import useInterfaceResult from "../services/InterfaceResultAPI";

const ImageStreaming = ({ setSampleWeight, setOutputData, clearAll, interfaceData, setRefreshFlag }) => {
  const [image, setImage] = useState(sample_image);
  const [error, setError] = useState("");
  const [logMessage, setLogMessage] = useState("Ready to capture");
  const [boundingBoxes, setBoundingBoxes] = useState([]);
  const imageRef = useRef();
  const { fetchInterfaceResult } = useInterfaceResult();

  const handleCapture = async (e) => {
    e.preventDefault();
    try {
      setLogMessage("Pending Corn Sample");
      clearStates();
      setLogMessage("Starting capture process...");
      const cameraToken = await cameraAPIService.login();
      setLogMessage("Logged into camera service successfully.");
      if (!cameraToken) {
        throw new Error("Login failed, cannot capture image");
      }

      const response = await cameraAPIService.captureImage();
      console.log('cameraAPIService-response', response);
      setLogMessage("Image capture initiated...");
      if (!response || response.image === undefined) {
        console.error("Invalid or missing image data in response:", response);
        throw new Error("Invalid response received from camera service");
      }

      setLogMessage("Image captured successfully.");
      const imageBase64 = `data:image/jpeg;base64,${response.image}`;
      const blob = await fetch(imageBase64).then(res => res.blob());
      const imageURL = URL.createObjectURL(blob);
      setImage(imageURL);
      console.log("New Image URL:", imageURL);
      setSampleWeight(response.sampleWeight);

      try {
        new URL(imageURL); // This will throw an error if the URL is invalid
        const imageBlob = await fetch(imageURL).then((r) => r.blob());
        const formData = new FormData();
        formData.append(
          "information",
          JSON.stringify({ weight: response.sampleWeight })
        );
        formData.append("image_file", imageBlob, "image");
        setLogMessage("Preparing image for prediction...");

        // Check for an existing access token first
        let storedToken = sessionStorage.getItem("predictAccessToken");
        if (!storedToken) {
          console.log("No valid token found, attempting to login.");
          await predictionAPIService.login();
          storedToken = sessionStorage.getItem("predictAccessToken");
        }
        setLogMessage("Processing image prediction...");

        const predictionResponse = await predictionAPIService.predictImage(
          response.sampleWeight,
          imageBlob,
          interfaceData
        );
        if (predictionResponse && predictionResponse.output_data) {
          setOutputData(predictionResponse.output_data);
          updateBoundingBoxes(predictionResponse.output_data);
          setLogMessage("Image prediction completed successfully.");

          // Fetch interface data after prediction using values from interfaceData
          fetchInterfaceResult(
            interfaceData.inslot,
            interfaceData.batch,
            interfaceData.material,
            interfaceData.plant,
            interfaceData.operationNo
          );

          // Trigger refresh flag to update InterfaceData
          setRefreshFlag(prev => !prev);

        } else {
          console.error("Prediction API response:", predictionResponse);
          throw new Error("Prediction process failed.");
        }
      } catch (err) {
        console.error("Error during prediction process:", err);
        setError("Prediction process failed: " + err.message);
        setLogMessage(`Error during prediction: ${err.message}`);
      }
    } catch (err) {
      console.error("Error in handleCapture:", err);
      setError(err.message);
      setLogMessage(`Error: ${err.message}`);
    }
  };

  const clearStates = () => {
    setImage(sample_image);
    setSampleWeight(0);
    setBoundingBoxes([]);
    setLogMessage([]);
    setError("");
    setLogMessage("Ready to capture");
    clearAll();
  };

  const updateBoundingBoxes = (output_data) => {
    const boxes = output_data.map((box) => ({
      x1: box.bounding_box.x1,
      y1: box.bounding_box.y1,
      x2: box.bounding_box.x2,
      y2: box.bounding_box.y2,
      class: box.class,
      confidence: box.confidence.toFixed(2),
    }));
    setBoundingBoxes(boxes);
  };

  useEffect(() => {
    console.log("useEffect start");
    if (imageRef.current) {
      console.log(
        "Displayed Image dimensions:",
        imageRef.current.offsetWidth,
        imageRef.current.offsetHeight
      );
    }
    console.log("useEffect end");
  }, [image]);

  return (
    <>
      <div>
        <div className="relative bg-gray-200 w-900 h-700 font-custom m-3 border border-slate-300">
          <img
            ref={imageRef}
            src={image}
            alt="Captured"
            className=" flex justify-center items-center w-900 h-700 aspect-video rounded-lg"
          />
          {boundingBoxes.map((box, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                left: `${box.x1}px`,
                top: `${box.y1}px`,
                width: `${box.x2 - box.x1}px`,
                height: `${box.y2 - box.y1}px`,
                border: `2px solid ${classColors[box.class] || "white"}`,
              }}
            >
              <p
                style={{
                  color: "white",
                  fontSize: "0.5em",
                  margin: "0",
                  backgroundColor: `${classColors[box.class] || "white"}`,
                  padding: "2px",
                  opacity: 0.7,
                  borderRadius: "3px",
                  position: "absolute",
                  top: "-20px", // Positioning the label above the bounding box
                  left: "0",
                  maxWidth: `${box.x2}px`, // Optional: to ensure the label doesn't extend beyond the box width
                  overflow: "", // Optional: prevents text overflow
                  whiteSpace: "nowrap", // Optional: keeps the text in a single line
                  textOverflow: "ellipsis", // Optional: adds an ellipsis if the text is too long
                }}
              >
                {classThai[box.class] || "Unknown"}:
                {Math.round(box.confidence * 100)}%
              </p>
            </div>
          ))}
        </div>
        <div>
          <div
            className="grid max-w-lg grid-cols-2 gap-4 p-1 mx-auto"
            role="group"
          >
            <button
              type="button"
              onClick={clearStates}
              className="btn btn-outline btn-accent rounded-full text-basic font-bold w-full text-xl"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleCapture}
              className="btn btn-outline btn-secondary rounded-full text-basic font-bold w-full text-xl"
            >
              <span className=""></span>
              Capture
            </button>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div className="text-sm text-teal-500">
            <p className="text-center">{logMessage}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageStreaming;
