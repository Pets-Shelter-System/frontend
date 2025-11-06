import React from "react";

const FilterPopup = ({
  show,
  closing,
  uniqueTypes,
  uniqueCategories,
  tempTypes,
  tempCategories,
  toggleValue,
  setTempTypes,
  setTempCategories,
  applyFilters,
  closePopup,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className={`
          bg-white rounded-xl shadow-2xl 
          w-[90%] max-w-[420px] p-6 relative
          ${
            closing
              ? "animate-[fadeOut_0.25s_ease-out]"
              : "animate-[fadeIn_0.25s_ease-out]"
          }
        `}
      >
        <button
          onClick={closePopup}
          className="absolute top-3 right-3 text-[#011749] text-2xl font-bold hover:scale-110 transition"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-center mb-5 text-[#011749]">
          Filters
        </h2>

        <div className="grid grid-cols-2 gap-4 text-[#011749]">
          <div>
            <h3 className="font-bold mb-2">Categories</h3>
            <div className="space-y-2">
              {uniqueCategories.map((cat) => (
                <label key={cat} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={tempCategories.includes(cat)}
                    onChange={() =>
                      toggleValue(cat, tempCategories, setTempCategories)
                    }
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-2">Animal Types</h3>
            <div className="space-y-2">
              {uniqueTypes.map((t) => (
                <label key={t} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={tempTypes.includes(t)}
                    onChange={() => toggleValue(t, tempTypes, setTempTypes)}
                  />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={applyFilters}
          className="
            bg-[#E7A01C] w-full py-2 mt-6 
            rounded-full text-white font-semibold 
            hover:scale-[1.03] transition
          "
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPopup;
