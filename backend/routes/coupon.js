const express = require("express");
const router = express.Router();
const {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAllCoupons,
  toggleStatus,
  getActiveCoupons,
} = require("../controllers/couponController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.route("/coupon/create").post(isAuthenticatedUser, createCoupon);
router
  .route("/coupon/update/:couponId")
  .put(isAuthenticatedUser, authorizeRoles("admin", "admin"), updateCoupon);
router
  .route("/coupon/delete/:couponId")
  .delete(isAuthenticatedUser, authorizeRoles("admin", "admin"), deleteCoupon);
router
  .route("/admin/coupons")
  .get(isAuthenticatedUser, authorizeRoles("admin", "admin"), getAllCoupons);
router.route("/coupon/toggle-status/:couponId").put(toggleStatus);
router.route("/coupons/active").get(getActiveCoupons);
module.exports = router;
