import React, { useEffect, useState } from "react";
import { classThai, classColors } from "../assets/ClassMapping.js";

const PredictResult = ({ sampleWeight, output_data }) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!Array.isArray(output_data) || output_data.length === 0) {
      console.log("No output data");
      setResults([]);
      return;
    }

    const classSummaries = output_data.reduce((acc, item) => {
      const { class: classId, weight } = item;
      if (!acc[classId]) {
        acc[classId] = { weight: 0, count: 0, classId: classId };
      }
      acc[classId].weight += weight;
      acc[classId].count += 1;
      return acc;
    }, {});

    const resultsWithCalculation = Object.values(classSummaries).map(
      ({ classId, weight, count }) => {
        const percentage = (weight / sampleWeight) * 100;
        return {
          classId,
          className: classThai[classId],
          weight: weight.toFixed(1),
          percentage: percentage.toFixed(1),
          count,
        };
      }
    );

    setResults(resultsWithCalculation);
  }, [output_data, sampleWeight]);

  if (!results.length) {
    return <p>No prediction data available.</p>;
  }

  return (
    <div className="overflow-x-auto text-base py-1">
      <table className="table table-sm">
        <thead>
          <tr className="font-bold">
            <th>Class</th>
            <th>Count</th>
            <th>Weight(g)</th>
            <th>Percentage (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>S.Weight</td>
            <td>-</td>
            <td>{sampleWeight.toFixed(1)}</td>
            <td>-</td>
          </tr>
          {results.map(({ classId, className, weight, percentage, count }) => (
            <tr key={classId}>
              <td style={{ color: classColors[classId] }}>{className}</td>
              <td>{count}</td>
              <td>{weight}</td>
              <td>{percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PredictResult;
