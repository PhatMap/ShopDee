import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({
  isAdmin,
  isadmin,
  isCustomer,
  component: Component,
  ...rest
}) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  return (
    <Fragment>
      {loading === false &&
        (() => {
          if (isAuthenticated === false) {
            navigate("/login");
            return null;
          }

          if (isAdmin === true && user.role !== "admin") {
            navigate("/");
            return null;
          }

          if (isadmin === true && user.role !== "admin") {
            navigate("/");
            return null;
          }

          if (isCustomer === true && user.role !== "customer") {
            navigate("/");
            return null;
          }

          return <Component {...rest} />;
        })()}
    </Fragment>
  );
};

export default ProtectedRoute;
