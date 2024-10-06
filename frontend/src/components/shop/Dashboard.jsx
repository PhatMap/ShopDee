import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";

import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import Sidebar from "./Sidebar";

import { useDispatch, useSelector } from "react-redux";

import { getShopProducts } from "../../actions/productActions";
import { allOrders, fetchOrderStats } from "../../actions/orderActions";
import { allUsers } from "../../actions/userActions";
import ChartComponent from "../Chart";
import OrderChart from "../OrderChart";
import { formatToVNDWithVND } from "../../utils/formatHelper";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.products);
  const { users } = useSelector((state) => state.allUsers);
  const {
    monthlyRevenue,
    monthlyOrderCount,
    orders,
    totalAmount,
    totalPaidAmount,
    totalPendingAmount,
    loading,
  } = useSelector((state) => state.allOrders);

  let outOfStock = 0;
  products.forEach((product) => {
    if (product.stock === 0) {
      outOfStock += 1;
    }
  });

  useEffect(() => {
    dispatch(getShopProducts());
    dispatch(fetchOrderStats());
    dispatch(allOrders());
    dispatch(allUsers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchOrderStats());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="dashboard-container">
        <div className="admin-layout">
          <div className="admin-container">
            <div className="flex-center-screen"></div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Dashboard;
