import { set } from "mongoose";
import React, { Fragment, useEffect, useState } from "react";

const Variant = ({ selectedUnit, unitValues }) => {
  const [checkList, setCheckList] = useState([]);

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

  return (
    <div className="select-bar-5">
      {unitValues.map((value, index) => (
        <label className={`${checkList[index] ? "selected" : ""}`}>
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
  );
};

export default Variant;
