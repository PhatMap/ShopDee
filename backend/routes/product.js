const express = require("express");
const router = express.Router();

const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
  getShopProducts,
  uploadImages,
  getAdminProducts,
  updateProductBasic,
  getReviewsInProduct,
  getProductCategories,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newProduct);

router
  .route("/admin/uploadImages")
  .post(isAuthenticatedUser, authorizeRoles("admin"), uploadImages);

router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router
  .route("/admin/product/update/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProductBasic);

router.route("/products").get(getProducts);
router.route("/product/:id").get(getSingleProduct);
router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("shopkeeadminper"), getShopProducts);

router.route("/review").put(isAuthenticatedUser, createProductReview);
router.route("/reviews").get(isAuthenticatedUser, getProductReviews);
router.route("/reviews").delete(isAuthenticatedUser, deleteReview);
router.route("/ReviewsInProduct").get(getReviewsInProduct);
router.route("/admin/products").get(isAuthenticatedUser, getAdminProducts);
router.route("/product/coupon/categories").post(getProductCategories);

module.exports = router;
