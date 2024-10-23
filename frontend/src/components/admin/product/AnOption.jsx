import React from "react";

const Antemp = ({
  index,
  temp,
  onDelete,
  onDragStart,
  onDragEnter,
  onDragEnd,
  draggedItem,
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragEnter={(e) => onDragEnter(e, index)}
      onDragEnd={onDragEnd}
      className={`h-fit border-x border-t border-solid border-slate-300  p-3 flex flex-col gap-2 ${
        index === 0 ? "rounded-t-xl" : ""
      } ${draggedItem === index ? "bg-slate-100" : ""}`}
    >
      <div className="h-fit flex flex-col gap-2">
        <h1 className="text-slate-500 font-semibold text-md">{temp.name}</h1>
        <ul className="flex gap-2">
          {temp.values.map((value, index) => (
            <li
              key={index}
              className="bg-slate-200 text-slate-600 font-semibold text-sm py-1 px-2 rounded-2xl"
            >
              {value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Antemp;
