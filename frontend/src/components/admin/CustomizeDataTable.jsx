import React from "react";

const CustomizeDataTable = ({ data }) => {
  return (
    <table className="my-table-1">
      <thead>
        <tr>
          {data.columns.map((column, columnIndex) => (
            <th key={columnIndex}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {data.columns.map((column, cellIndex) => (
              <td key={cellIndex}>{row[column.field]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CustomizeDataTable;
