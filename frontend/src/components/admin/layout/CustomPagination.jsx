import React, { useState } from "react";

const CustomPagination = () => {
  const [totalPages, setTotalPages] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [overflow, setOverflow] = useState(totalPages >= 10 ? true : false);
  const arrayLength = 5;

  const hanlderToLeft = (start) => {
    if (start) {
      setCurrentPage(1);
    } else {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        return;
      }
    }
  };

  const hanlderToRight = (end) => {
    if (end) {
      setCurrentPage(totalPages);
    } else {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      } else {
        return;
      }
    }
  };

  return (
    <div className="pagination-1-container">
      <div className="pagination-1-title">
        <p>
          Trang {currentPage} trong {totalPages}
        </p>
      </div>
      <div className="pagination-1">
        <button onClick={() => hanlderToLeft(true)}>
          <i className="fa fa-angle-double-left"></i>
        </button>
        <button onClick={() => hanlderToLeft(false)}>
          <i className="fa fa-angle-left"></i>
        </button>
        {overflow
          ? Array.from({ length: arrayLength }, (_, index) => {
              let page = index + currentPage;

              if (totalPages - currentPage < arrayLength) {
                page = totalPages - arrayLength + index + 1;
              }

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`${page === currentPage ? "active" : ""}`}
                >
                  {index === arrayLength - 2
                    ? totalPages - currentPage < arrayLength
                      ? page
                      : "..."
                    : index == arrayLength - 1
                    ? totalPages
                    : page}
                </button>
              );
            })
          : Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`${page === currentPage ? "active" : ""}`}
                >
                  {page}
                </button>
              );
            })}
        <button onClick={() => hanlderToRight(false)}>
          <i className="fa fa-angle-right"></i>
        </button>
        <button onClick={() => hanlderToRight(true)}>
          <i className="fa fa-angle-double-right"></i>
        </button>
      </div>
    </div>
  );
};

export default CustomPagination;
