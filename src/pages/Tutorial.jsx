import React, { useState } from "react";

// Helper component for individual FAQ items
const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mb-4">
      <button
        className="flex justify-between items-center w-full px-4 py-2 text-left text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none focus:shadow-outline"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">{question}</span>
        <span>{isOpen ? "-" : "+"}</span>
      </button>
      {isOpen && (
        <div className="mt-2 px-4 py-2 bg-white rounded-b-lg">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

function Tutorial() {
  const [activeTab, setActiveTab] = useState("introduction");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="sidebar bg-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
        <a href="#" className="text-black text-2xl font-semibold uppercase hover:text-gray-700">Corn Inspection</a>
        {/* Navigation Links */}
        <nav>
          <button onClick={() => setActiveTab("introduction")} className={`block w-full text-left py-2.5 px-4 rounded transition duration-200 ${activeTab === "introduction" ? "bg-blue-500 text-white" : "hover:bg-blue-500 hover:text-white"}`}>Introduction</button>
          <button onClick={() => setActiveTab("result")} className={`block w-full text-left py-2.5 px-4 rounded transition duration-200 ${activeTab === "result" ? "bg-blue-500 text-white" : "hover:bg-blue-500 hover:text-white"}`}>การอ่านผล</button>
        </nav>
      </div>

      {/* Content Area */}
      <div className="content flex-1 p-10 text-2xl font-bold">
        {activeTab === "introduction" && (
          <>
            <h1>Introduction to Corn Inspection</h1>
            <video controls className="max-w-6xl mx-auto m-4">
              <source src="./public/videos/Tutorial.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </>
        )}

        {activeTab === "result" && (
          <>
            <h1>การอ่านผล</h1>
            <div className="max-w-6xl mx-auto m-4">
                <img src="./src/assets/พื้นที่แสดงภาพ.jpg" alt="Result Interpretation" className="w-full h-auto shadow-lg rounded" />
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Tutorial;
