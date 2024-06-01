import React, { useState } from "react";
import PredictResult from "../components/PredictResult";
import ImageSteaming from "../components/ImageSteaming";
import QRCodeReader from "../components/QRCodeReader";
import InterfaceData from "../components/InterfaceData";

const Home = () => {
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [sampleWeight, setSampleWeight] = useState(0);
  const [outputData, setOutputData] = useState([]);
  const [interfaceData, setInterfaceData] = useState({
    inslot: "",
    operationNo: "",
    batch: "",
    material: "",
    plant: ""
  });
  
  const [formData, setFormData] = useState({
    queue: "",
    inslot: "",
    batch: "",
    plant: "",
    material: "",
    vendor: "",
    operationno: "",
  });

  const [results, setResults] = useState([]);

  const handleCaptureComplete = () => {
    // Toggle the refresh flag to trigger the useEffect in InterfaceData
    setRefreshFlag((prev) => !prev);
  };

  const clearAll = () => {
    setSampleWeight(0);
    setOutputData([]);
    setResults([]);
    setFormData({
      queue: "",
      inslot: "",
      batch: "",
      plant: "",
      material: "",
      vendor: "",
      operationno: "",
    });
    // setInterfaceData({
    //   inslot: "",
    //   operationNo: "",
    //   batch: "",
    //   material: "",
    //   plant: ""
    // });
    // setRefreshFlag(false);
  };

  return (
    <>
      <div className="">
        <p className="text-center text-3xl font-bold ml-2 mt-2">
          CORN INSPECTOR PRO
        </p>
      </div>
      <div className="flex flex-row justify-center items-center">
        {/* ImageStreaming Component */}
        <div className="flex flex-col justify-start items-center basis-full p-1 m-1 card bordered h-[750px] fixed-height-card">
          <p className="text-xl font-bold self-center ">Image Steaming</p>
          <ImageSteaming
            setSampleWeight={setSampleWeight}
            setOutputData={setOutputData}
            clearAll={clearAll}
            interfaceData={interfaceData}
            setRefreshFlag={setRefreshFlag}  // Pass setRefreshFlag to ImageStreaming
          />
        </div>

        {/* QRCodeReader*/}
        <div className="basis-1/4 p-1 m-1 card bordered h-[750px] fixed-height-card">
          <p className="text-left text-xl font-bold ">Information</p>
          <QRCodeReader
                setInterfaceData={setInterfaceData}
                clearAll={clearAll}
            />

          {/* InterfaceResult */}
          <div>
            <p className="text-left text-xl font-bold mt-4">Interface Result</p>
            <InterfaceData
                interfaceData={interfaceData}
                refreshFlag={refreshFlag}
                clearAll={clearAll}
            />
          </div>
        </div>

        {/* InterfaceData Component */}
        <div className="basis-1/3 p-1 m-1 card bordered h-[750px] fixed-height-card">
          {/* PredictResult */}
          <div>
            <h3 className="card-title">Result</h3>
            <PredictResult
              sampleWeight={sampleWeight}
              output_data={outputData}
              clearAll={clearAll}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;