import React, { useCallback, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import AddOption from "./AddOption";
import AnOption from "./AnOption";

const OptionList = () => {
  const [options, setOptions] = useState([]);
  const placeholder = [
    { name: "Kích thước", values: "X / L / XL..." },
    { name: "Màu sắc", values: "Đỏ, Xanh, Vàng..." },
    { name: "Chất liệu", values: "Cotton, Polyester..." },
  ];

  function handleNewSection() {
    if (options.length >= 3) {
      return;
    }
    setOptions([...options, { done: false, name: "", values: [""] }]);
  }

  const handleDeleteOption = useCallback((index) => {
    setOptions(options.filter((_, i) => i !== index));
  });

  return (
    <div className="w-full h-fit bg-white border border-solid border-slate-300 rounded-xl p-3 flex flex-col gap-3">
      <span className="text-slate-600 font-semibold">Biến thể</span>
      <div className="w-full">
        {options.length > 0
          ? [...Array(options.length)].map((_, index) =>
              options[index].done ? (
                <AnOption key={index} index={index} option={options[index]} />
              ) : (
                <AddOption
                  key={index}
                  index={index}
                  placeholder={placeholder[index]}
                  handleDeleteOption={handleDeleteOption}
                  setOptions={setOptions}
                  options={options}
                />
              )
            )
          : ""}
        <button
          onClick={handleNewSection}
          className={`flex items-center gap-1 px-2 py-1 hover:bg-[#f5f5f5] focus:outline-none font-semibold text-sm ${
            options.length > 0
              ? "w-full border border-b border-solid border-slate-300 rounded-b-xl"
              : "rounded-md w-fit"
          }`}
        >
          <FiPlusCircle /> Thêm lựa chọn như kích thước hoặc màu
        </button>
      </div>
    </div>
  );
};

export default OptionList;
