import React from "react";

const SearchBar = ({ search, setSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search animal type"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="
        w-full md:w-1/3
        px-5 py-3
        rounded-xl
        border-[2px]
        border-[#E7A01C]
        shadow-sm
        focus:outline-none
        focus:ring-2
        focus:ring-[#E7A01C]
        text-[#011749]
      "
    />
  );
};

export default SearchBar;
