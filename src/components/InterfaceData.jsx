import React, { useEffect } from 'react';
import useInterfaceResult from '../services/InterfaceResultAPI';
import useResultToSAP from '../services/resultToSAPApi';

function InterfaceData({ refreshFlag, interfaceData, clearAll }) {
  const { fetchInterfaceResult, result, error, isLoading } = useInterfaceResult();
  const { sendResultToSAP, resultSent, errorSAP, isLoadingSAP } = useResultToSAP();

  useEffect(() => {
    const fetchData = () => {
      fetchInterfaceResult(
        interfaceData.inslot,
        interfaceData.batch,
        interfaceData.material,
        interfaceData.plant,
        interfaceData.operationNo
      );
    };

    fetchData(); // Initial fetch
  }, [fetchInterfaceResult, refreshFlag, interfaceData]);  // Dependency array includes refreshFlag

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  const calculateAverage = (item) => {
    const params = ["phys0003", "phys0004", "phys0005", "phys0006", "phys0007", "phys0008", "phys0009"];
    const total = params.reduce((sum, param) => sum + parseFloat(item[param] || 0), 0);
    return (total / params.length).toFixed(2);
  };

  const handleStartInterface = () => {
    sendResultToSAP(
      interfaceData.inslot,
      interfaceData.batch,
      interfaceData.material,
      interfaceData.plant,
      interfaceData.operationNo
    );
    console.log('sendResultToSAP:', sendResultToSAP)
  };

  return (
    <div className="container mx-auto p-4">
      <div className="overflow-x-auto">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Parameter</th>
              {result?.map((item, index) => (
                <th key={index}>{item.id}</th>
              ))}
              <th>Avg</th>
            </tr>
          </thead>
          <tbody>
            {["phys0003", "phys0004", "phys0005", "phys0006", "phys0007", "phys0008", "phys0009"].map((param) => (
              <tr key={param}>
                <td>{param.toUpperCase()}</td>
                {result?.map((item, index) => (
                  <td key={index}>{formatNumber(item[param])}</td>
                ))}
                <td>{result && formatNumber(result.map(item => item[param]).reduce((sum, val) => sum + parseFloat(val || 0), 0) / result.length)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-4">
        <button onClick={handleStartInterface} className="btn btn-outline btn-primary rounded-2xl text-sm">
          {isLoadingSAP ? 'Sending...' : 'Start Interface'}
        </button>
      </div>
      {errorSAP && <div className="text-red-500 mt-2">Error: {errorSAP}</div>}
    </div>
  );
}

function formatNumber(value) {
  const number = parseFloat(value);
  if (!isNaN(number) && isFinite(number)) {
    return number.toFixed(2);
  }
  return "";
}

export default InterfaceData;
