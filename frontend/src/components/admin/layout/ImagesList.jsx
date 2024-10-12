import React, { useEffect, useState } from "react";
import { formatSize } from "../../../utils/formatHelper";

const ImagesList = ({ imagesPreview }) => {
  const [data, setData] = useState(
    imagesPreview.length > 0
      ? {
          columns: [
            { label: "#", field: "id" },
            { label: "Tên Ảnh", field: "name" },
            { label: "Xem Trước", field: "preview" },
            { label: "Kích Thước", field: "size" },
            { label: "Loại Ảnh", field: "type" },
          ],
          rows: [],
        }
      : {
          columns: [
            { label: "#", field: "id" },
            { label: "Tên Ảnh", field: "name" },
            { label: "Xem Trước", field: "preview" },
            { label: "Kích Thước", field: "size" },
            { label: "Loại Ảnh", field: "type" },
          ],
          rows: [
            {
              name: "Trống",
              preview: (
                <img
                  width={50}
                  height={50}
                  src={"/images/empty.jpg"}
                  alt={"Trống"}
                />
              ),
              size: "Trống",
              type: "Trống",
            },
          ],
        }
  );

  useEffect(() => {
    if (imagesPreview.length > 0) {
      const rows = imagesPreview.map((image, index) => ({
        id: index + 1,
        name: image.name,
        preview: (
          <img width={50} height={50} src={image.url} alt={image.name} />
        ),
        size: formatSize(image.size),
        type: image.type,
      }));
      setData((prevData) => ({ ...prevData, rows }));
    }
  }, [imagesPreview]);

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
    </div>
  );
};

export default ImagesList;
