import React, { useEffect } from 'react';
import useResultToSAP from '../services/resultToSAPApi';

const FetchInspections = () => {
  const { fetchInterfaceResult, result, error, isLoading } = useResultToSAP();

  useEffect(() => {
    fetchInterfaceResult('12345', 'batch1', 'material1', 'plant1', 'operation1');
  }, [fetchInterfaceResult]);

  return (
    <div>
      <h1>Inspections</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {result && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Request Ref</th>
              <th>Insp Lot</th>
              <th>Plant</th>
              <th>Operation</th>
              <th>Sample No</th>
              <th>MIC PHYS003</th>
              <th>MIC PHYS004</th>
              <th>MIC PHYS005</th>
              <th>MIC PHYS006</th>
              <th>MIC PHYS007</th>
              <th>MIC PHYS008</th>
              <th>MIC PHYS009</th>
              <th>Status</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {result.map(inspection => (
              <tr key={inspection.id}>
                <td>{inspection.id}</td>
                <td>{inspection.request_ref}</td>
                <td>{inspection.insp_lot}</td>
                <td>{inspection.plant}</td>
                <td>{inspection.operation}</td>
                <td>{inspection.sample_no}</td>
                <td>{inspection.mic_phys003}</td>
                <td>{inspection.mic_phys004}</td>
                <td>{inspection.mic_phys005}</td>
                <td>{inspection.mic_phys006}</td>
                <td>{inspection.mic_phys007}</td>
                <td>{inspection.mic_phys008}</td>
                <td>{inspection.mic_phys009}</td>
                <td>{inspection.status}</td>
                <td>{inspection.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FetchInspections;
