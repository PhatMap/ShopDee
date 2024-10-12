import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "react-js-pagination";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import { getCategoryAll } from "../../actions/categoryActions";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProduct,
  clearErrors,
  updateProduct,
  updateProductBasic,
  getProducts,
} from "../../actions/productActions";
import {
  DELETE_PRODUCT_RESET,
  UPDATE_PRODUCT_RESET,
} from "../../constants/productConstants";
import DeleteNotify from "../layout/DeleteNotify";
import { formatToVNDWithVND } from "../../utils/formatHelper";
import DataTable from "../layout/DataTable";

const ProductsList = () => {
  const { loading, error, products, productsCount } = useSelector(
    (state) => state.products
  );
  const {
    error: deleteError,
    isDeleted,
    isUpdated,
  } = useSelector((state) => state.product);
  const { categories: allCategories } = useSelector((state) => state.category);

  const history = useNavigate();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [id, setId] = useState("");
  const [showPreloader, setShowPreloader] = useState(true);
  const [approved, setApproved] = useState("");
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getProducts({}));
    dispatch(getCategoryAll());

    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    dispatch(getProducts({}));
    dispatch(getCategoryAll());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.error("Product deleted successfully");
      history("/admin/product");
      dispatch({ type: DELETE_PRODUCT_RESET });
    }

    if (isUpdated) {
      toast.success("Đã gửi sản phẩm để duyệt");
      dispatch({ type: UPDATE_PRODUCT_RESET });
    }
  }, [
    dispatch,
    error,
    deleteError,
    isDeleted,
    isUpdated,
    history,
    approved,
    keyword,
    currentPage,
  ]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    dispatch(getShopProducts(shop._id, approved, keyword, 1));
  };

  const handleApprovedChange = (e) => {
    setApproved(e.target.value);
    setCurrentPage(1);
    dispatch(
      getShopProducts(SHOP_1723385468288_gf585, e.target.value, keyword, 1)
    );
  };
  const setProducts = () => {
    const data = {
      columns: [
        {
          label: "Danh Mục",
          field: "category",
        },
        {
          label: "Ảnh Sản Phẩm",
          field: "image",
        },
        {
          label: "Tên Sản Phẩm",
          field: "name",
        },
        {
          label: "Giá",
          field: "price",
        },
        {
          label: "Tổng Số Lượng",
          field: "totalStock",
        },
        {
          label: "Duyệt",
          field: "approved",
        },
        {
          label: "Trạng Thái",
          field: "status",
        },
        {
          label: "Tác Vụ",
          field: "actions",
        },
      ],
      rows: [],
    };
    const categoryMap = allCategories.reduce((acc, category) => {
      acc[category._id] = category.vietnameseName;
      return acc;
    }, {});

    products.forEach((product) => {
      data.rows.push({
        category: categoryMap[product.category] || "Trống",
        image: (
          <img
            src={product.images[0].url}
            alt={product.name}
            style={{ width: "50px", height: "50px" }}
          />
        ),
        name: product.name,
        price: `${formatToVNDWithVND(product.price)}`,
        totalStock: product.totalStock,
        approved:
          product.approved === "approved"
            ? "Đã Duyệt"
            : product.approved === "rejected"
            ? "Chưa Duyệt"
            : product.approved === "pending"
            ? "Đang Xử Lý"
            : "Chưa Gửi",
        status: product.status === "active" ? "Hoạt Động" : "Bị Ngưng",
        actions: (
          <Fragment>
            <div className="flex-horizontal">
              <Link
                to={`/shop/product/${product._id}`}
                className="btn btn-primary py-1 px-2"
              >
                <i className="fa fa-pencil"></i>
              </Link>
              <button
                className="btn btn-danger py-1 px-2 ml-2"
                onClick={() => {
                  setShow(true);
                  setId(product._id);
                }}
              >
                <i className="fa fa-trash"></i>
              </button>
              <button
                className="btn btn-info py-1 px-2 ml-2"
                onClick={() => {
                  if (
                    product.approved === "waiting" ||
                    product.approved === "rejected"
                  ) {
                    handleSend(product._id);
                  }
                }}
              >
                <i className="fa fa-send"></i>
              </button>
            </div>
          </Fragment>
        ),
      });
    });

    return data;
  };
  const handleSend = (id) => {
    const productData = new FormData();
    productData.set("approved", "pending");
    dispatch(updateProductBasic(id, productData));
  };
  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id));
  };

  return (
    <Fragment>
      <MetaData title={"All Products"} />
      {showPreloader ? (
        <Loader />
      ) : (
        <div className="admin-layout">
          <div className="admin-container">
            <div className="flex-center-screen">
              <div className="product-list-container">
                <div className="manage-category-head">
                  <h1>Quản Lý Sản Phẩm</h1>
                </div>
                <div className="flex-horizental">
                  <div className="manage-category-form-btns">
                    <button onClick={() => history("/admin/product")}>
                      <i className="fa fa-plus"></i> <p>Thêm Sản Phẩm</p>
                    </button>
                    <input
                      className="search-input-1"
                      type="search"
                      placeholder="Tìm kiếm sản phẩm..."
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                    />
                  </div>
                  <div className="select-bar-4">
                    <select value={approved} onChange={handleApprovedChange}>
                      <option value="">Tất cả trạng thái</option>
                      <option value="waiting">Chưa Gửi</option>
                      <option value="pending">Đang Xử Lý</option>
                      <option value="approved">Đã Duyệt</option>
                      <option value="rejected">Chưa Duyệt</option>
                    </select>
                  </div>
                </div>
              </div>
              {!loading ? <DataTable data={setProducts()} /> : <Loader />}
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={10}
                totalItemsCount={productsCount}
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
      )}

      {show && (
        <DeleteNotify func={deleteProductHandler} paras={[id]} show={setShow} />
      )}
    </Fragment>
  );
};

export default ProductsList;
