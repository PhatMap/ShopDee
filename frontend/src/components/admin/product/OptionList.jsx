import React, { useCallback, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import AddOption from "./AddOption";
import AnOption from "./AnOption";
import VariantList from "./VariantList";

const OptionList = () => {
  const [temp, setTemp] = useState([]);
  const [options, setOptions] = useState([]);

  const [draggedItem, setDraggedItem] = useState(null);

  const placeholder = [
    { name: "Kích thước", values: "X / L / XL..." },
    { name: "Màu sắc", values: "Đỏ, Xanh, Vàng..." },
    { name: "Chất liệu", values: "Cotton, Polyester..." },
  ];

  function handleNewSection() {
    if (temp.length >= 3) {
      return;
    }
    setTemp([...temp, { done: false, name: "", values: [""] }]);
  }

  const handleDeleteOption = useCallback(
    (index) => {
      setTemp(temp.filter((_, i) => i !== index));
    },
    [temp]
  );

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newOptions = [...temp];
    const draggedOption = newOptions[draggedItem];
    newOptions.splice(draggedItem, 1);
    newOptions.splice(index, 0, draggedOption);

    setTemp(newOptions);
    setDraggedItem(index);
  };

  const handleDragEnd = (e) => {
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className="w-full h-fit bg-white border border-solid border-slate-300 rounded-xl p-3 flex flex-col gap-3"
      onDragOver={handleDragOver}
    >
      <span className="text-slate-600 font-semibold">Biến thể</span>
      <div className="w-full">
        {temp.length > 0 &&
          [...Array(temp.length)].map((_, index) =>
            temp[index].done ? (
              <AnOption
                key={index}
                index={index}
                temp={temp[index]}
                onDelete={() => handleDeleteOption(index)}
                onDragStart={handleDragStart}
                onDragEnter={handleDragEnter}
                onDragEnd={handleDragEnd}
                draggedItem={draggedItem}
              />
            ) : (
              <AddOption
                key={index}
                index={index}
                placeholder={placeholder[index]}
                handleDeleteOption={handleDeleteOption}
                setTemp={setTemp}
                temp={temp}
                onDragStart={handleDragStart}
                onDragEnter={handleDragEnter}
                onDragEnd={handleDragEnd}
                draggedItem={draggedItem}
                options={options}
                setOptions={setOptions}
              />
            )
          )}
        <button
          onClick={handleNewSection}
          className={`flex items-center gap-1 px-2 py-1 hover:bg-[#f5f5f5] focus:outline-none font-semibold text-sm ${
            temp.length > 0
              ? "w-full border border-b border-solid border-slate-300 rounded-b-xl"
              : "rounded-md w-fit"
          }`}
        >
          <FiPlusCircle /> Thêm lựa chọn như kích thước hoặc màu
        </button>
      </div>
      {options.length > 0 && <VariantList options={options} />}
    </div>
  );
};

export default OptionList;
