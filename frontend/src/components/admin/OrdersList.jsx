import React, { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "../layout/DataTable";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import Pagination from "react-js-pagination";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {
  allOrders,
  deleteOrder,
  clearErrors,
} from "../../actions/orderActions";
import { DELETE_ORDER_RESET } from "../../constants/orderConstants";
import { formatToVNDWithVND } from "../../utils/formatHelper";

const OrdersList = () => {
  const { loading, error, orders, totalOrders, filteredOrdersCount } =
    useSelector((state) => state.allOrders);
  const { isDeleted } = useSelector((state) => state.order);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [resPerPage] = useState(10);
  const [showPreloader, setShowPreloader] = useState(true);

  const statusTranslations = {
    Processing: "Xử Lý",
    canceled: "Đơn đã Hủy",
    "Order Confirmed": "Xác Nhận",
    Shipping: "Giao Hàng",
    Delivered: "Hoàn Thành",
  };

  useEffect(() => {
    dispatch(allOrders(currentPage, keyword, status, resPerPage));

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("Xóa Đơn Hàng Thành Công");
      navigate("/admin/orders");
      dispatch({ type: DELETE_ORDER_RESET });
    }

    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [dispatch, error, isDeleted, navigate, currentPage, keyword, status]);

  const deleteOrderHandler = (id, orderStatus) => {
    if (orderStatus === "Delivered") {
      toast.error("Không thể xóa đơn hàng hoàn thành.");
      return;
    }
    setDeleteOrderId(id);
    setShowModal(true);
  };

  const handleDeleteConfirmed = (id) => {
    dispatch(deleteOrder(id));
    setShowModal(false);
  };

  const setOrders = () => {
    const data = {
      columns: [
        { label: "Tên Khách Hàng", field: "name", sort: "asc" },
        { label: "Số Sản Phẩm", field: "numofItems", sort: "asc" },
        { label: "Tổng Tiền", field: "amount", sort: "asc" },
        { label: "Trạng thái đơn", field: "status", sort: "asc" },
        { label: "Tác vụ", field: "actions" },
      ],
      rows: [],
    };

    orders.forEach((order) => {
      data.rows.push({
        name: order.userName,
        numofItems: order.orderItems.length,
        amount: `${formatToVNDWithVND(order.totalPrice)}`,
        status: (
          <p
            style={{
              color: order.orderStatus === "Delivered" ? "green" : "red",
            }}
          >
            {statusTranslations[order.orderStatus]}
          </p>
        ),
        actions: (
          <Fragment>
            <Link
              to={`/shop/order/${order._id}`}
              className="btn btn-primary py-1 px-2"
            >
              <i className="fa fa-eye"></i>
            </Link>
            <button
              className="btn btn-danger py-1 px-2 ml-2"
              onClick={() => deleteOrderHandler(order._id, order.orderStatus)}
            >
              <i className="fa fa-trash"></i>
            </button>
          </Fragment>
        ),
      });
    });

    return data;
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadOrders();
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setCurrentPage(1);
    loadOrders();
  };

  return (
    <Fragment>
      <MetaData title={"All Orders"} />
      <ToastContainer />
      {showPreloader ? (
        <Loader />
      ) : (
        <div className="admin-layout">
          <div className="admin-container">
            <div className="flex-center-screen">
              <div className="manage-category-head">
                <h1>Quản Lý Đơn Hàng</h1>
              </div>
              <div className="flex-horizental">
                <div className="manage-category-form-btns">
                  <input
                    type="search"
                    className="search-input-1"
                    placeholder="Tìm kiếm đơn hàng..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
                <div className="select-bar-4">
                  <select value={status} onChange={handleStatusChange}>
                    <option value="">Tất cả trạng thái</option>
                    <option value="Processing">Xử Lý</option>
                    <option value="canceled">Đơn đã Hủy</option>
                    <option value="Order Confirmed">Xác Nhận</option>
                    <option value="Shipping">Giao Hàng</option>
                    <option value="Delivered">Hoàn Thành</option>
                  </select>
                </div>
              </div>
              {!loading ? <DataTable data={setOrders()} /> : <Loader />}
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resPerPage}
                totalItemsCount={filteredOrdersCount}
                onChange={handlePageChange}
                nextPageText={"Next"}
                prevPageText={"Prev"}
                firstPageText={"First"}
                lastPageText={"Last"}
                itemClass="page-item"
                linkClass="page-link"
                pageRangeDisplayed={5}
              />
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default OrdersList;
