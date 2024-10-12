import React, { Fragment } from "react";
import MetaData from "../layout/MetaData";

const ChoicesPick = () => {
  return (
    <Fragment>
      <MetaData title={"Help"} />
      <div className="help-product-options-container">
        <h2 className="main-heading">Giải thích về Phép chọn sản phẩm</h2>

        <div className="help-alert">
          <h3 className="help-alert-title">Phép chọn là gì?</h3>
          <p>
            Phép chọn là các tùy chọn mà khách hàng có thể lựa chọn khi mua một
            sản phẩm. Chúng giúp xác định chính xác phiên bản sản phẩm mà khách
            hàng muốn mua.
          </p>
        </div>

        <div className="help-section">
          <h3 className="help-sub-heading">1. Hai phép chọn</h3>
          <p>Khi sản phẩm có hai đặc tính cần lựa chọn kết hợp.</p>
          <ul className="help-option-list">
            <li>Ví dụ: Màu sắc và Kích cỡ</li>
            <li>Ví dụ: Kiểu dáng và Thể tích</li>
          </ul>
          <p>
            Trong trường hợp này, khách hàng cần chọn cả hai đặc tính để xác
            định sản phẩm cụ thể. Ví dụ: Áo màu đỏ, cỡ L hoặc Bình nước kiểu thể
            thao, thể tích 500ml.
          </p>
        </div>

        <div className="help-section">
          <h3 className="help-sub-heading">2. Một phép chọn</h3>
          <p>Khi sản phẩm chỉ có một đặc tính cần lựa chọn.</p>
          <ul className="help-option-list">
            <li>Ví dụ: Chỉ chọn Màu sắc</li>
            <li>Ví dụ: Chỉ chọn Kích cỡ</li>
            <li>Ví dụ: Chỉ chọn Khối lượng</li>
          </ul>
          <p>
            Trong trường hợp này, khách hàng chỉ cần chọn một đặc tính để xác
            định sản phẩm cụ thể. Ví dụ: Túi xách màu đen hoặc Gạo gói 5kg.
          </p>
        </div>

        <div className="help-alert alert-info">
          <h3 className="help-alert-title">Lưu ý quan trọng</h3>
          <p>
            Việc thiết lập phép chọn đúng cách giúp quản lý hàng tồn kho hiệu
            quả và tạo trải nghiệm mua sắm tốt cho khách hàng. Mỗi kết hợp của
            phép chọn có thể có giá, số lượng tồn kho và mã SKU riêng.
          </p>
        </div>
      </div>
    </Fragment>
  );
};

export default ChoicesPick;
