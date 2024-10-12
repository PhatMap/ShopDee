import React from "react";
import { formatToVNDWithVND } from "../../../utils/formatHelper";

const TotalSales = () => {
  const data = { total: 50000000, percent: 8 };

  return (
    <div className="section-container section-container-sale">
      <div className="section-icon-container section-icon-container-sale">
        <i className="fa fa-bar-chart"></i>
      </div>
      <div className="section-content-container">
        <h1>{formatToVNDWithVND(data.total)}</h1>
        <div className="section-content">
          <p className="section-content-mark-1">Tổng Doanh Thu</p>
          <p className="section-content-mark-2">
            +{data.percent}% so với hôm qua
          </p>
        </div>
      </div>
    </div>
  );
};

export default TotalSales;
