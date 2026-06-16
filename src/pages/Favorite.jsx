import { useContext } from "react";
import { FavoriteContext } from "../components/context/FavoriteContext";
import { IoHeart } from "react-icons/io5";

export default function Favorite() {
  const { favorites, toggleFavorite } = useContext(FavoriteContext);

  if (!favorites.length) {
    return (
      <div className="pt-32 text-center text-xl text-gray-500">
        No favorite products yet 💔
      </div>
    );
  }

  return (
    <div className="pt-28 px-10 flex flex-wrap justify-center gap-6">
      {favorites.map((product) => (
        <div
          key={product.id}
          className="bg-[#F4F4F4] p-4 rounded-xl shadow relative flex flex-col items-center text-center w-60"
        >
          {/* زر الإزالة من المفضلة */}
          <button
            onClick={() => toggleFavorite(product)}
            className="absolute top-3 right-3 text-red-600 text-xl"
          >
            <IoHeart />
          </button>

          {/* الصورة */}
          <img
            src={`http://petmarket.runasp.net${product.photos?.[0]?.imageName}`}
            alt={product.name}
            className="rounded-lg h-40 w-full object-cover mb-4"
          />

          {/* اسم المنتج */}
          <h3 className="font-bold text-[#011749] text-lg">{product.name}</h3>

          {/* الوصف */}
          <p className="text-sm text-gray-600 mb-2">{product.description}</p>

          {/* السعر */}
          <span className="font-bold text-[#011749] text-lg">
            EGP {product.price}
          </span>
        </div>
      ))}
    </div>
  );
}
