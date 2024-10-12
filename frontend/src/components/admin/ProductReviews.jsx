import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getReviewsInProduct,
  deleteReview,
  clearErrors,
  getProducts,
} from "../../actions/productActions";
import { DELETE_REVIEW_RESET } from "../../constants/productConstants";
import { formatToVNDWithVND } from "../../utils/formatHelper";
import Pagination from "react-js-pagination";
import DataTable from "../layout/DataTable";

const ProductReviews = () => {
  const { reviews, totalReviews, loading, error } = useSelector(
    (state) => state.reviewsInProduct
  );
  const { isDeleted, error: deleteError } = useSelector(
    (state) => state.review
  );
  const { categories: allCategories } = useSelector((state) => state.category);

  const { products, productsCount } = useSelector((state) => state.products);

  const [productId, setProductId] = useState("");
  const history = useNavigate();
  const dispatch = useDispatch();
  const [approved, setApproved] = useState("");
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPreloader, setShowPreloader] = useState(true);
  const [itemsPerPage] = useState(3);
  const [currentPageReviews, setcurrentPageReviews] = useState(1);
  const resPerPage = 10;

  useEffect(() => {
    dispatch(getProducts({}));
    if (productId) {
      dispatch(getReviewsInProduct(productId, currentPageReviews, resPerPage));
    }
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
      history("/shop/products");
    }

    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [
    dispatch,
    error,
    deleteError,
    isDeleted,
    history,
    approved,
    keyword,
    currentPageReviews,
    currentPage,
    productId,
  ]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    dispatch(getProducts({}));
  };

  const handleApprovedChange = (e) => {
    setApproved(e.target.value);
    setCurrentPage(1);
    dispatch(getProducts({}));
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
          label: "Đánh Giá",
          field: "ratings",
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
        ratings: product.ratings,
        actions: (
          <button
            className="btn btn-primary py-1 px-2"
            onClick={() => {
              console.log("product._id", product._id);
              setProductId(product._id);
              setCurrentProduct(product);
              dispatch(getReviewsInProduct(product._id, "1", "10"));
            }}
          >
            Xem Đánh Giá
          </button>
        ),
      });
    });

    return data;
  };

  return (
    <Fragment>
      <MetaData title={"Product Reviews"} />
      <ToastContainer />
      {showPreloader ? (
        <Loader />
      ) : (
        <div className="admin-layout">
          <div className="admin-container">
            <div className="flex-center-screen">
              <h1
                className="my-4"
                style={{
                  fontSize: "40px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Quản Lý Đánh Giá
              </h1>
              <div>
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    marginRight: "10px",
                  }}
                />
                <select
                  value={approved}
                  onChange={handleApprovedChange}
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="">Tất cả vai trò</option>
                  <option value="waiting">Chưa Gửi</option>
                  <option value="pending">Đang Xử Lý</option>
                  <option value="approved">Đã Duyệt</option>
                  <option value="rejected">Chưa Duyệt</option>
                </select>
              </div>

              {!loading ? <DataTable data={setProducts()} /> : <Loader />}

              <Pagination
                activePage={currentPage}
                itemsCountPerPage={itemsPerPage}
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
    </Fragment>
  );
};

export default ProductReviews;
