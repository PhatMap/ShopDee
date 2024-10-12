import React from "react";

const TotalOrders = () => {
  const data = { total: 263, percent: 5 };

  return (
    <div className="section-container section-container-order">
      <div className="section-icon-container section-icon-container-order">
        <i className="fa fa-cart-arrow-down"></i>
      </div>
      <div className="section-content-container">
        <h1>{data.total}</h1>
        <div className="section-content">
          <p className="section-content-mark-1">Tổng Đơn Hàng</p>
          <p className="section-content-mark-2">
            +{data.percent}% so với hôm qua
          </p>
        </div>
      </div>
    </div>
  );
};

export default TotalOrders;
