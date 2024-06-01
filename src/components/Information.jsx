import React from "react";

const Information = ({ formData, onFormDataChange }) => {
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    onFormDataChange(name, value);
  };

  return (
    <>
      <div className="ml-2 mr-2">
        <form>
          <div className="grid grid-cols-2 gap-1 gap-y-0.5">
            <div>
              <label htmlFor="queue" className="w- text-xs font-medium text-gray-900 dark:text-black">
                Queue:
              </label>
              <input
                type="text"
                id="queue"
                name="queue"
                className="block w-full p-1 text-gray-900 border border-gray-300 rounded-lg sm:text-xs"
                value={formData.queue || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="inslot" className="w-20 text-xs font-medium text-gray-900 dark:text-black">
                Inspection Lot:
              </label>
              <input
                type="text"
                id="inslot"
                name="inslot"
                className="block w-full p-1 text-gray-900 border border-gray-300 rounded-lg sm:text-xs"
                value={formData.inslot || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="date_receive" className="w-20 text-xs font-medium text-gray-900 dark:text-black">
                Date_receive:
              </label>
              <input
                type="text"
                id="date_receive"
                name="date_receive"
                className="block w-full p-1 text-gray-900 border border-gray-300 rounded-lg sm:text-xs"
                value={formData.date_receive || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="batch" className="w-20 text-xs font-medium text-gray-900 dark:text-black">
                Batch:
              </label>
              <input
                type="text"
                id="batch"
                name="batch"
                className="block w-full p-1 text-gray-900 border border-gray-300 rounded-lg sm:text-xs"
                value={formData.batch || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="plant" className="w-20 text-xs font-medium text-gray-900 dark:text-black">
                Plant:
              </label>
              <input
                type="text"
                id="plant"
                name="plant"
                className="block w-full p-1 text-gray-900 border border-gray-300 rounded-lg sm:text-xs"
                value={formData.plant || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="material" className="w-20 text-xs font-medium text-gray-900 dark:text-black">
                Material:
              </label>
              <input
                type="text"
                id="material"
                name="material"
                className="block w-full p-1 text-gray-900 border border-gray-300 rounded-lg sm:text-xs"
                value={formData.material || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="vendor" className="w-20 text-xs font-medium text-gray-900 dark:text-black">
                Vendor:
              </label>
              <input
                type="text"
                id="vendor"
                name="vendor"
                className="block w-full p-1 text-gray-900 border border-gray-300 rounded-lg sm:text-xs"
                value={formData.vendor || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="operation" className="w-20 text-xs font-medium text-gray-900 dark:text-black">
                Operation:
              </label>
              <input
                type="text"
                id="operation"
                name="operationno"
                className="block w-full p-1 text-gray-900 border border-gray-300 rounded-lg sm:text-xs"
                value={formData.operationno || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Information;
