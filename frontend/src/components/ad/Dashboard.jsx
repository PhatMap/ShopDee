import React from "react";
import Userchart from "./chart/Userchart";

const Dashboard = () => {
  return (
    <div className="admin-layout">
      <div className="admin-container">
        <div className="flex-center-screen">
          <Userchart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
