import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar-wrapper">
      <nav className="sidebar-form">
        <ul className="sidebar-element-container">
          <li>
            <Link to="/admin/dashboard" className="sidebar-element">
              <i className="fa fa-tachometer"></i> Thống kê
            </Link>
          </li>

          <li>
            <Link to="/admin/products" className="sidebar-element">
              <i className="fa fa-product-hunt"></i> Quản lý Sản Phẩm
            </Link>
          </li>

          <li>
            <Link to="/admin/orders" className="sidebar-element">
              <i className="fa fa-shopping-basket"></i> Quản lý Đơn Hàng
            </Link>
          </li>

          <li>
            <Link to="/admin/reviews" className="sidebar-element">
              <i className="fa fa-star"></i> Quản lý Đánh Giá
            </Link>
          </li>

          <li>
            <Link to="/" className="sidebar-element" style={{ color: "red" }}>
              <i className="fa fa-user"></i> Thoát
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
