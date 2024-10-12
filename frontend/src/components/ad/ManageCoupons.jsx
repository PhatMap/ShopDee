import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "../layout/DataTable";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCoupons,
  deleteCoupon,
  toggleStatus,
} from "../../actions/couponActions";
import Pagination from "react-js-pagination";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  DELETE_COUPON_RESET,
  UPDATE_COUPON_RESET,
  TOGGLE_STATUS_RESET,
  CREATE_COUPON_RESET,
  CLEAR_ERRORS,
} from "../../constants/couponConstants";

const ManageCoupons = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, coupons, totalCoupons, success, isStatusUpdated } =
    useSelector(
      (state) => state.coupon // Ensure this matches the slice name in your root reducer
    );

  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [show, setShow] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);

  const [status, setStatus] = useState("all");
  const [role, setRole] = useState("all");

  useEffect(() => {
    if (isStatusUpdated) {
      toast.success("Cập nhật trạng thái thành công");
      dispatch({ type: TOGGLE_STATUS_RESET });
      dispatch(getAllCoupons(currentPage, keyword, status, role));
    }
  }, [dispatch, isStatusUpdated, currentPage, keyword, status, role]);

  useEffect(() => {
    dispatch(getAllCoupons(currentPage, keyword, status, role));

    if (success) {
      toast.success("Xóa Thành Công Phiếu Giảm Giá");
      dispatch({ type: DELETE_COUPON_RESET });
      dispatch({ type: UPDATE_COUPON_RESET });
      dispatch({ type: CREATE_COUPON_RESET });
    }

    if (error) {
      toast.error(error);
      dispatch({ type: CLEAR_ERRORS });
    }
  }, [dispatch, success, error, currentPage, keyword, status, role]);
  const deleteHandler = (id) => {
    setShow(true);
    setCouponToDelete(id);
  };

  const confirmDelete = () => {
    dispatch(deleteCoupon(couponToDelete));
    dispatch(getAllCoupons(currentPage, keyword));
    setShow(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    dispatch(getAllCoupons(1, keyword, status, role));
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setCurrentPage(1);
    dispatch(getAllCoupons(1, keyword, e.target.value, role));
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setCurrentPage(1);
    dispatch(getAllCoupons(1, keyword, status, e.target.value));
  };

  const cancelDelete = () => {
    setShow(false);
    setCouponToDelete(null);
  };
  const handleBanCoupon = (id) => {
    dispatch(toggleStatus(id));
  };

  const setCoupons = () => {
    const data = {
      columns: [
        {
          label: "Phần trăm giảm",
          field: "percentage",
        },
        {
          label: "Vai trò",
          field: "role",
        },
        {
          label: "Mô tả",
          field: "description",
        },
        {
          label: "Số lượng",
          field: "quantity",
        },
        {
          label: "Hạn sử dụng",
          field: "expiry",
        },
        {
          label: "Tác vụ",
          field: "action",
        },
      ],
      rows: [],
    };

    if (coupons && coupons.length > 0) {
      coupons.forEach((coupon) => {
        data.rows.push({
          percentage: `${coupon.percentage}%`,
          role: coupon.role,
          description: coupon.description,
          quantity: coupon.quantity,
          expiry: new Date(coupon.expiry).toLocaleDateString(),
          action: (
            <Fragment>
              <div className="flex-horizontal">
                <Link
                  to={`/admin/coupon/update/${coupon._id}`}
                  className="btn btn-primary py-1 px-2"
                >
                  <i className="fa fa-pencil"></i>
                </Link>
                <button
                  className="btn btn-danger py-1 px-2 ml-2"
                  onClick={() => deleteHandler(coupon._id)}
                >
                  <i className="fa fa-trash"></i>
                </button>
                <button
                  className="btn btn-warning py-1 ml-2"
                  onClick={() => handleBanCoupon(coupon._id)}
                >
                  <i
                    className={`fa ${
                      coupon.status === "active" ? "fa fa-unlock" : "fa fa-lock"
                    }`}
                  ></i>
                </button>
              </div>
            </Fragment>
          ),
        });
      });
    } else {
      data.rows.push({
        percentage: "Trống",
        role: "Trống",
        description: "Trống",
        quantity: "Trống",
        expiry: "Trống",
        action: "Trống",
      });
    }

    return data;
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Fragment>
      <ToastContainer />
      <div className="admin-layout">
        <div className="admin-container">
          <div className="flex-center-screen">
            <div className="manage-category-head">
              <h1>Quản lý Phiếu Giảm Giá</h1>
            </div>
            <div className="head-model-1">
              <button onClick={() => history("/admin/addUser")}>
                <i className="fa fa-plus"></i> <p>Thêm Phiếu Giảm Giá</p>
              </button>
              <input
                className="search-input-2"
                type="search"
                placeholder="Search here..."
                onChange={(e) => handleSearch(e)}
              />
              <div className="select-bar-4">
                <select value={status} onChange={handleStatusChange}>
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Ngưng hoạt động</option>
                </select>
                <select value={role} onChange={handleRoleChange}>
                  <option value="all">Tất cả vai trò</option>
                  <option value="admin">Admin</option>
                  <option value="admin">admin</option>
                </select>
              </div>
            </div>
            <DataTable data={setCoupons()} />
            <Pagination
              activePage={currentPage}
              itemsCountPerPage={10}
              totalItemsCount={totalCoupons}
              onChange={handlePageChange}
              nextPageText={"Next"}
              prevPageText={"Prev"}
              firstPageText={"First"}
              lastPageText={"Last"}
              itemClass="page-item"
              linkClass="page-link"
            />
          </div>
        </div>
      </div>
      {show && (
        <div className="delete-notify-container">
          <div className="delete-notify-form">
            <h1 style={{ marginBottom: "20px" }}>Xóa Phiếu Giảm Giá Này?</h1>
            <div className="delete-notify-btn-container">
              <button
                className="delete-notify-btn-container-yes"
                onClick={confirmDelete}
              >
                Yes
              </button>
              <button
                className="delete-notify-btn-container-no"
                onClick={cancelDelete}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ManageCoupons;
