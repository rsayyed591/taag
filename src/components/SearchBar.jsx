"use client"

import { useState } from "react"

function SearchBar({ onSearch, onFilter }) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch?.(value)
  }

  return (
    <div className="relative w-[333px] my-5 md:w-full md:my-6">
      {/* Search Bar Container */}
      <div className="flex items-center w-full px-2 pb-1 border-b border-[#979797]">
        {/* Search Icon */}
        <img src="/icons/search.svg" alt="Search" className="w-[15px] h-[15px] ml-2 md:w-[18px] md:h-[18px] md:ml-3" />

        {/* Input Field */}
        <input
          type="text"
          placeholder="Search by name, amount, etc."
          value={searchTerm}
          onChange={handleSearch}
          className="flex-1 px-2 sub-header focus:outline-none md:px-3 md:text-lg"
        />

        {/* Vertical Line */}
        <div className="w-[26px] h-0 border border-gray-300 rotate-90 md:w-[30px]"></div>

        {/* Filter Button */}
        <button onClick={() => onFilter?.()} className="p-2 md:p-3">
          <img src="/icons/filter.svg" alt="Filter" className="w-[12px] h-[15px] md:w-[15px] md:h-[18px]" />
        </button>
      </div>
    </div>
  )
}

export default SearchBar
