import React, { useState } from "react";
import { MdOutlineDragIndicator } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import { set } from "mongoose";

const AddOption = ({
  index,
  placeholder,
  handleDeleteOption,
  setTemp,
  temp,
  onDragStart,
  onDragEnter,
  onDragEnd,
  draggedItem,
  options,
  setOptions,
}) => {
  const [dragged, setDragged] = useState(false);

  return (
    <div
      draggable={dragged}
      onDragStart={(e) => onDragStart(e, index)}
      onDragEnter={(e) => onDragEnter(e, index)}
      onDragEnd={onDragEnd}
      className={`h-fit border-x border-t border-solid border-slate-300  p-3 flex flex-col gap-2 ${
        index === 0 ? "rounded-t-xl" : ""
      } ${draggedItem === index ? "bg-slate-100" : ""}`}
    >
      <div className="flex pl-4 w-full">
        <div className=" w-full flex flex-col gap-3">
          <div className="flex flex-col gap-1 ">
            <span className="text-slate-600 font-semibold">Tên lựa chọn</span>
            <div className="relative w-full">
              <input
                className=" w-full px-3 py-2 border border-solid border-slate-300 rounded-md focus:outline-blue-400 "
                placeholder={placeholder.name}
                value={temp[index].name}
                onChange={(e) => {
                  const newOptions = [...temp];
                  newOptions[index].name = e.target.value;
                  setTemp(newOptions);
                }}
              />
              <MdOutlineDragIndicator
                className="text-slate-400 absolute top-3 -left-7"
                onMouseDown={() => setDragged(true)}
                onMouseUp={() => setDragged(false)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-slate-600 font-semibold">Giá trị</span>
            {temp[index].values &&
              [...Array(temp[index].values.length)].map((_, i) => (
                <div className="w-full relative" key={i}>
                  <input
                    className="w-full px-3 py-2 border border-solid border-slate-300 rounded-md focus:outline-blue-400"
                    placeholder={placeholder.values}
                    value={temp[index].values[i]}
                    onChange={(e) => {
                      const newOptions = [...temp];
                      newOptions[index].values[i] = e.target.value;
                      if (i === temp[index].values.length - 1) {
                        newOptions[index].values.push("");
                      }
                      setTemp(newOptions);
                    }}
                  />
                  {temp[index].values.length > 1 &&
                    temp[index].values[i].length !== 0 && (
                      <FaRegTrashAlt
                        className="absolute top-3.5 right-5 hover:text-red-700 cursor-pointer"
                        onClick={() => {
                          const newOptions = [...temp];
                          newOptions[index].values.splice(i, 1);
                          setTemp(newOptions);
                        }}
                      />
                    )}
                </div>
              ))}
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => handleDeleteOption(index)}
              className="shadow-inner border border-solid border-slate-300 px-2 py-1 rounded-md text-red-800 font-semibold focus:outline-none hover:bg-slate-100"
            >
              Xóa
            </button>
            <button
              type="button"
              onClick={() => {
                const newOptions = [...temp];
                newOptions[index].values.pop();
                newOptions[index].done = true;
                setTemp(newOptions);
                setOptions(newOptions);
              }}
              className="border border-solid border-slate-300 px-2 py-1 rounded-md bg-black text-white font-semibold focus:outline-none hover:bg-slate-700"
            >
              Thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOption;
