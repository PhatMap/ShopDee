import React, { useMemo } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import AdminLogin from "./Login";
import AdminDashboard from "./Dashboard";
import ManageUsers from "./ManageUsers";
import Sidebar from "./Sidebar";
import AddUser from "./AddUser";
import UpdateUser from "./UpdateUser";
import ManageCategories from "./ManageCategories";
import UpdateCategory from "./UpdateCategory";
import ManageProducts from "./ManageProducts";
import ManageCoupons from "./ManageCoupons";
import NewCoupon from "./NewCoupon";

const Centre = () => {
  const location = useLocation();

  const showSidebar = useMemo(() => {
    const sidebarPaths = [
      "/test/users",
      "/test/dashboard",
      "/test/categories",
      "/test/products",
      "/test/coupons",
    ];
    return sidebarPaths.some((path) => location.pathname.startsWith(path));
  }, [location.pathname]);

  return (
    <div className={`Centre-container background-2`}>
      {showSidebar && <Sidebar path={location.pathname} />}
      <div className="Centre">
        <Routes>
          <Route path="login" element={<AdminLogin />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="addUser" element={<AddUser />} />
          <Route path="user/:id" element={<UpdateUser />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="category/update/:id" element={<UpdateCategory />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="coupons" element={<ManageCoupons />} />
          <Route path="/coupon/new" element={<NewCoupon />} />
        </Routes>
      </div>
    </div>
  );
};

export default Centre;
