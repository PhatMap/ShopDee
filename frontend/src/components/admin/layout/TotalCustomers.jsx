import React from "react";

const TotalCustomers = () => {
  const data = { total: 23, percent: 4 };

  return (
    <div className="section-container section-container-customer">
      <div className="section-icon-container section-icon-container-customer">
        <i className="fa fa-users"></i>
      </div>
      <div className="section-content-container">
        <h1>{data.total}</h1>
        <div className="section-content">
          <p className="section-content-mark-1">Tổng Người Dùng</p>
          <p className="section-content-mark-2">
            +{data.percent}% so với hôm qua
          </p>
        </div>
      </div>
    </div>
  );
};

export default TotalCustomers;
