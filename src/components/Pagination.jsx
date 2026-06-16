import React from "react";

const Pagination = ({ page, setPage, totalPages }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-3 py-10">

      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className={`px-4 py-2 rounded-md ${
          page === 1 ? "bg-gray-300 text-gray-500" : "bg-login-btn text-white"
        }`}
      >
        Prev
      </button>

      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => setPage(i + 1)}
          className={`px-4 py-2 rounded-md ${
            page === i + 1 ? "bg-login-btn text-white" : "bg-gray-200"
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className={`px-4 py-2 rounded-md ${
          page === totalPages
            ? "bg-gray-300 text-gray-500"
            : "bg-login-btn text-white"
        }`}
      >
        Next
      </button>

    </div>
  );
};

export default Pagination;
