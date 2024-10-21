import { set } from "mongoose";
import React, { Fragment, useEffect, useState } from "react";

const Variant = ({ selectedUnit, unitValues }) => {
  const [checkList, setCheckList] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [value, setValue] = useState("");
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (selectedUnit === "size" && unitValues && Array.isArray(unitValues)) {
      const sizeLength = unitValues.length;
      setCheckList(new Array(sizeLength).fill(false));
    }
  }, [selectedUnit, unitValues]);

  useEffect(() => {
    console.log(checkList);
  }, [checkList]);

  const handleCheckbox = (index) => {
    setCheckList((prevList) => {
      const newList = [...prevList];
      newList[index] = !newList[index];
      return newList;
    });
  };

  const handlerValue = (e) => {
    let inputValue = e.target.value.replace(/\./g, "");

    if (!isNaN(inputValue) && inputValue !== "") {
      const numericValue = parseFloat(inputValue);
      if (numericValue >= 0) {
        setValue(numericValue);
      } else {
        setValue(-numericValue);
      }
    } else {
      setValue("");
    }
  };

  return (
    <Fragment>
      <div className="chart-container-1">
        <div className="new-product-form-group-4">
          {selectedUnit === "size"
            ? unitValues && (
                <div className="new-product-form-group-3">
                  <label htmlFor="selection_field">Chọn loại đơn vị</label>
                  <div className="select-bar-5">
                    {unitValues.map((value, index) => (
                      <label
                        className={`${checkList[index] ? "selected" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={checkList[index]}
                          onChange={() => handleCheckbox(index)}
                          hidden={true}
                        />
                        <p>{value}</p>
                        <img
                          src="/images/checked.png"
                          width={10}
                          height={10}
                          className="pin"
                          hidden={!checkList[index]}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )
            : unitValues && (
                <Fragment>
                  <div className="new-product-form-group-3">
                    <label htmlFor="selection_field">Chọn loại đơn vị</label>
                    <select
                      className={`form-control `}
                      id="value_selection_field"
                      value={selectedValue}
                      onChange={(e) => selectedValue(e.target.value)}
                    >
                      <option value="">Chọn đơn vị</option>
                      {unitValues.map((value, index) => (
                        <option key={index} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="new-product-form-group-3">
                    <label htmlFor="value_field">Giá trị</label>
                    <input
                      type="text"
                      className={`form-control`}
                      placeholder="Nhập giá trị"
                      value={value}
                      onChange={(e) => handlerValue(e)}
                    />
                  </div>
                </Fragment>
              )}
        </div>
      </div>

      <div className="chart-container-1">
        <div className="new-product-form-group-4">
          <label htmlFor="mau_field">Tên mẫu</label>
          <input
            type="text"
            className={`form-control`}
            placeholder="Nhập tên mẫu"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default Variant;
