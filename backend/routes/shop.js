const express = require("express");
const {
  uploadImages,
  updateShop,
  getShop,
  updateShopSection,
  deleteShopSection,
} = require("../controllers/shopController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

router
  .route("/shop/section/upload/images")
  .post(isAuthenticatedUser, authorizeRoles("admin"), uploadImages);

router
  .route("/shop/me")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateShop)
  .get(isAuthenticatedUser, authorizeRoles("admin"), getShop);

router
  .route("/shop/section")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateShopSection)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteShopSection);

module.exports = router;
