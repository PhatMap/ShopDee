import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Userschart from "./chart/UsersChart";
import TotalSales from "./layout/TotalSales";
import TotalOrders from "./layout/TotalOrders";
import TotalCustomers from "./layout/TotalCustomers";
import MonthlySales from "./chart/MonthlySales";
import ProductsPie from "./chart/ProductsPie";
import TotalProducts from "./layout/TotalProducts";

const Dashboard = () => {
  const dispatch = useDispatch();

  return (
    <Fragment>
      <div className="dashboard-container">
        <div className="horizontal-4">
          <div className="chart-container-1">
            <div className="label-1">
              <h4>Doanh Số Hôm Nay</h4>
              <p>Tóm tắt doanh số</p>
            </div>
            <div className="horizontal-2">
              <TotalSales />
              <TotalOrders />
              <TotalCustomers />
            </div>
          </div>
          <div className="chart-container-1">
            <div className="label-1">
              <h4>Tỉ Trọng Sản Phẩm</h4>
              <p>Tóm tắt phầm chiếm</p>
            </div>
            <div className="horizontal-2">
              <ProductsPie />
            </div>
          </div>
        </div>
        <div className="chart-container-3">
          <div className="vertical-1">
            <div className="label-1">
              <h4>Doanh Số Hôm Nay</h4>
              <p>Tóm tắt doanh số</p>
            </div>
            <MonthlySales />
          </div>
          <div className="vertical-1">
            <div className="label-1">
              <h4>Sản Phẩm Bán Chạy</h4>
              <p>Tóm tắt lượng bán</p>
            </div>
            <TotalProducts />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Dashboard;
