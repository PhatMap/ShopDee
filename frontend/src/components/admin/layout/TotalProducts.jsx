import React from "react";
import { formatToNumber } from "../../../utils/formatHelper";
import CustomPagination from "./CustomPagination";

const TotalProducts = () => {
  const data = {
    columns: [
      { label: "#", field: "id" },
      { label: "Tên Sản Phẩm", field: "name" },
      { label: "Số Lượng Bán Ra", field: "quantity" },
      { label: "Tổng Doanh Thu", field: "price" },
    ],
    rows: [
      {
        id: 1,
        name: "Sản Phẩm 1",
        quantity: 10,
        price: formatToNumber(100000),
      },
      {
        id: 2,
        name: "Sản Phẩm 2",
        quantity: 20,
        price: formatToNumber(200000),
      },
      {
        id: 3,
        name: "Sản Phẩm 3",
        quantity: 30,
        price: formatToNumber(300000),
      },
      {
        id: 4,
        name: "Sản Phẩm 4",
        quantity: 40,
        price: formatToNumber(400000),
      },
      {
        id: 5,
        name: "Sản Phẩm 5",
        quantity: 50,
        price: formatToNumber(500000),
      },
      {
        id: 6,
        name: "Sản Phẩm 6",
        quantity: 50,
        price: formatToNumber(500000),
      },
      {
        id: 7,
        name: "Sản Phẩm 7",
        quantity: 50,
        price: formatToNumber(500000),
      },
      {
        id: 8,
        name: "Sản Phẩm 8",
        quantity: 50,
        price: formatToNumber(500000),
      },
    ],
  };
  return (
    <div className="table-1-container">
      <div>
        <table className="table-1">
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
      </div>
      <div>
        <CustomPagination />
      </div>
    </div>
  );
};

export default TotalProducts;
