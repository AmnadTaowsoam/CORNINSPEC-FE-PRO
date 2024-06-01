import React, { useState } from "react";
import Information from "./Information";

const QRCodeReader = ({ setInterfaceData, clearAll }) => {
  const [inputText, setInputText] = useState("");
  const [formData, setFormData] = useState({
    queue: "",
    date_receive: "",
    inslot: "",
    batch: "",
    plant: "",
    material: "",
    vendor: "",
    operationno: "",
  });
  const [shouldClear, setShouldClear] = useState(false);

  const handleAddClick = (e) => {
    e.preventDefault();

    // Check if the form should be cleared from the last operation
    if (shouldClear) {
      setFormData({
        queue: "",
        date_receive: "",
        inslot: "",
        batch: "",
        plant: "",
        material: "",
        vendor: "",
        operationno: "",
      });
      setShouldClear(false);
    }

    // Process new input
    const parts = inputText.split(",").map(part => part.trim());
    if (parts.length >= 8) {
      const data = {
          queue: parts[0],
          date_receive: parts[1],
          inslot: parts[2],
          batch: parts[3],
          plant: parts[4],
          material: parts[5],
          vendor: parts[6],
          operationno: parts[7],
      };
      setFormData(data);
      setInterfaceData({
          inslot: data.inslot,
          operationNo: data.operationno,
          batch: data.batch,
          material: data.material,
          plant: data.plant,
      });
      setShouldClear(true);  // Prepare to clear on next click
      setInputText("");
    } else {
      console.error("Invalid input. Please provide all 8 parts.");
    }
  };

  const handleFormDataChange = (key, value) => {
    if (!shouldClear) {  // Only allow changes if we are not about to clear
      setFormData((prevFormData) => ({
        ...prevFormData,
        [key]: value,
      }));
    }
  };

  return (
    <>
      <div className="container mx-auto font-custom">
        <form>
          <div className="grid gap-1 m-1">
            <div className="flex">
              <input
                type="text"
                className="border border-gray-300 rounded-lg py-2 px-2 w-full text-sm "
                placeholder=">>>Scan QRCode "
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button
                className="btn btn-outline btn-primary rounded-2xl ml-2 text-sm"
                onClick={handleAddClick}
              >
                Split Text
              </button>
            </div>
          </div>
        </form>
        <div>
          <Information
            formData={formData}
            onFormDataChange={handleFormDataChange}
            clearAll={clearAll}
          />
        </div>
      </div>
    </>
  );
};

export default QRCodeReader;
