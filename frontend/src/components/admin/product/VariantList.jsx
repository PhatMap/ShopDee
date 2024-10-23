import React, { useEffect, useState } from "react";

const VariantList = ({ options }) => {
  const [combinations, setCombinations] = useState([]);

  useEffect(() => {
    console.log("Run: ", options.length);
    setCombinations(getCombinations(options, options.length));
  }, [options]);

  useEffect(() => {
    setCombinations(getCombinations(options, options.length));
  }, []);

  useEffect(() => {
    console.log("HereEEEEEEEEEEEEEEEEEEEE: ", combinations);
    console.log("options: ", options);
  }, [combinations]);

  function getCombinations(options, type) {
    let combinations = [];

    function generateCombo(currentCombo, start) {
      if (currentCombo.length === type) {
        console.log("g: ", currentCombo);
        combinations.push([...currentCombo]);
        return;
      }

      for (let i = 0; i < options[start].values.length; i++) {
        generateCombo([...currentCombo, options[start].values[i]], start + 1);
      }
    }

    generateCombo([], 0);
    return combinations;
  }

  const data = {
    columns: [
      {
        label: "Ảnh",
        field: "image",
      },
      {
        label: "Tổ hợp",
        field: "combination",
      },
      {
        label: "Giá",
        field: "price",
      },
      {
        label: "Số lượng",
        field: "stock",
      },
    ],
    rows: [
      {},
      // combinations.map((combination) => ({
      //   image: combination.image.url,
      //   combinations: combination,
      //   price: combination.price,
      //   stock: combination.stock,
      // })),
    ],
  };

  return (
    <table className="my-table ">
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

export default VariantList;
