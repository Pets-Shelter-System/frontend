import React from "react";
import { useNavigate } from "react-router-dom";

const MyAnimalCard = ({ animal, type }) => {
  const navigate = useNavigate();

  const getImageUrl = (animalObj) => {
    let path = animalObj?.photos?.[0]?.imageUrl;
    if (!path) {
      path = animalObj?.imageUrl || 
             animalObj?.image || 
             animalObj?.photoUrl || 
             animalObj?.animalPictureUrl;
    }
    
    if (!path) return "https://via.placeholder.com/400x300?text=No+Image";
    
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `https://petmarket.runasp.net${cleanPath}`;
  };

  const imageUrl = getImageUrl(animal);

  return (
    <div className="bg-white rounded-[28px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group p-6 flex flex-col items-center text-center w-full max-w-[340px]">
      <div className="aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-gray-50 mb-6 flex items-center justify-center">
        <img
          src={imageUrl}
          alt={animal.name}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="space-y-2 mb-6">
        <h3 className="text-xl font-bold text-[#F8B63D]">{animal.name}</h3>
        <p className="text-sm text-gray-400 font-medium">Cairo, Egypt</p>
      </div>

      <button
        onClick={() => navigate(`/profile/my-animals/${animal.id}`, { state: { type } })}
        className="px-8 py-2.5 border-2 border-[#011749] text-[#011749] rounded-full font-bold text-sm hover:bg-[#011749] hover:text-white transition-all shadow-sm active:scale-[0.98]"
      >
        View Animal
      </button>
    </div>
  );
};

export default MyAnimalCard;
