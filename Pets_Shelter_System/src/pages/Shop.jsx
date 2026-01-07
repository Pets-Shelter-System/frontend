import {  useContext, useEffect, useState } from "react";
import api from "../API/api";
import { IoCartOutline, IoHeartOutline, IoHeart } from "react-icons/io5";
import { LuFilter, LuSlidersHorizontal } from "react-icons/lu";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import FilterPopup from "../components/FilterPopup";
import Pagination from "../components/Pagination";
import Spinner from "../components/Spinner";
import { CounterContext } from "../components/context/CounterContext";
import { CartContext } from "../components/context/CartContext";
import toast from "react-hot-toast";
import { FavoriteContext } from "../components/context/FavoriteContext";


const Shop = () => {
   let {addToCart} = useContext(CartContext)
  let {counter,setcounter} = useContext(CounterContext)
  const [allProducts, setAllProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(null);

  const [showFilter, setShowFilter] = useState(false);
  const [closingFilter, setClosingFilter] = useState(false);

  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [tempTypes, setTempTypes] = useState([]);
  const [tempCategories, setTempCategories] = useState([]);
const { toggleFavorite, isFavorite } = useContext(FavoriteContext);
  const pageSize = 12;

  const navigate = useNavigate(); 

  const handleProductClick = (id) => {
    navigate(`/shop/product/${id}`);
  };

  const toggleValue = (value, list, setList) => {
    setList(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
    );
  };

//   async function addProdToCart(prod) {
//     let response = await addToCart(prod);
//     console.log(response);
    
//     if (response.data.statusCode === 200) {
//       toast.success( response.data.message);
//     }else{
//       toast.error("Failed to add to cart");
//     }
//   }

//   const handleCartClick = (productId) => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     Swal.fire({
//       icon: "warning",
//       title: "Login required",
//       text: "Please login or sign up to add items to cart",
//     }).then(() => navigate("/login"));

//     return;
//   }

//   // TODO: Add to cart API
//   console.log("User is logged in → add to cart", productId);
// };


const handleAddToCart = async (product) => {
  const token = localStorage.getItem("token");
  if (!token) {
    Swal.fire({
      icon: "warning",
      title: "Login required",
      text: "Please login or sign up to add items to cart",
    }).then(() => navigate("/login"));
    return;
  }

  try {
    await addToCart(product); // فعليًا بتضيف المنتج للكارت
    setcounter(counter + 1);                  // تحديث العداد
  } catch (err) {
    // Error is handled in addToCart
  }
};



  useEffect(() => {
    const fetchAllPages = async () => {
      let items = [];
      let current = 1;
      let total = 1;

      while (current <= total) {
        const res = await api.get(
          `/Products?pageNumber=${current}&pageSize=20${
            sort ? `&sort=${sort}` : ""
          }`
        );
        items = [...items, ...res.data.data.items];
        total = res.data.data.totalPages;
        current++;
      }

      setAllProducts(items);
    };

    fetchAllPages();
  }, [sort]);

  const uniqueTypes = [...new Set(allProducts.map((p) => p.petTypeName))];
  const uniqueCategories = [...new Set(allProducts.map((p) => p.categoryName))];

  let filtered = [...allProducts];

  if (search.trim()) {
    filtered = filtered.filter((p) =>
      p.petTypeName.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (selectedTypes.length > 0) {
    filtered = filtered.filter((p) => selectedTypes.includes(p.petTypeName));
  }

  if (selectedCategories.length > 0) {
    filtered = filtered.filter((p) =>
      selectedCategories.includes(p.categoryName)
    );
  }

  const totalFiltered = filtered.length;
  const totalPages = Math.ceil(totalFiltered / pageSize);
  const showPagination = totalFiltered > pageSize;

  const displayed = showPagination
    ? filtered.slice((page - 1) * pageSize, page * pageSize)
    : filtered;

  return (
    <div className="px-4 md:px-10 lg:px-20 py-28">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <SearchBar search={search} setSearch={setSearch} />

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setTempTypes(selectedTypes);
              setTempCategories(selectedCategories);
              setShowFilter(true);
            }}
            className="px-8 py-3 bg-login-btn rounded-full text-white flex items-center gap-2"
          >
            <LuFilter className="text-xl" />
            Filter
          </button>

          <div className="relative group">
            <button className="px-8 py-3 bg-login-btn rounded-full text-white flex items-center gap-2">
              <LuSlidersHorizontal className="text-xl" />
              Sort
            </button>

            <div className="absolute hidden group-hover:flex flex-col mt-2 w-44 right-0 bg-white shadow rounded-xl z-50">
              <button
                onClick={() => {
                  setSort(3);
                  setPage(1);
                }}
                className="px-4 py-2 bg-login-btn text-white rounded-t-xl"
              >
                Price: Low → High
              </button>

              <button
                onClick={() => {
                  setSort(4);
                  setPage(1);
                }}
                className="px-4 py-2 bg-login-btn text-white rounded-b-xl"
              >
                Price: High → Low
              </button>
            </div>
          </div>
        </div>
      </div>

      <FilterPopup
        show={showFilter}
        closing={closingFilter}
        uniqueTypes={uniqueTypes}
        uniqueCategories={uniqueCategories}
        tempTypes={tempTypes}
        tempCategories={tempCategories}
        toggleValue={toggleValue}
        setTempTypes={setTempTypes}
        setTempCategories={setTempCategories}
        closePopup={() => {
          setClosingFilter(true);
          setTimeout(() => {
            setShowFilter(false);
            setClosingFilter(false);
          }, 250);
        }}
        applyFilters={() => {
          setSelectedTypes(tempTypes);
          setSelectedCategories(tempCategories);
          setPage(1);

          setClosingFilter(true);
          setTimeout(() => {
            setShowFilter(false);
            setClosingFilter(false);
          }, 250);
        }}
      />

      {filtered.length === 0 && (
        // <p className="text-center text-xl text-[#011749] mt-10 font-bold">
        //   No products match your filters.
        // </p>
        <Spinner/>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
        {displayed.map((product) => (
          <div
            key={product.id}
            className="bg-[#F4F4F4] p-4 rounded-xl shadow relative"
          >
            <div className="absolute right-3 top-3 flex flex-col z-20">
              <button onClick={() => handleAddToCart(product)} className="w-8 h-8 bg-[#E7A01C] rounded-full flex justify-center items-center mr-2 mt-4">
                <IoCartOutline className="text-white text-lg" />
              </button>
              
              <button
  onClick={() => toggleFavorite(product)}
  className="w-8 h-8 bg-[#E7A01C] rounded-full flex justify-center items-center mt-4"
>
  {isFavorite(product.id) ? (
    <IoHeart className="text-red-600 text-lg" />
  ) : (
    <IoHeartOutline className="text-white text-lg" />
  )}
</button>
            </div>

            <img
              onClick={() => handleProductClick(product.id)}
              src={`http://petmarket.runasp.net${product.photos[0]?.imageName}`}
              className="rounded-lg h-80 w-full object-cover mb-4 cursor-pointer"
              alt={product.name}
            />

            <div className="text-yellow-400 text-lg">
              {"★".repeat(Math.round(product.rating))}
            </div>

            <h3 className="font-bold text-lg text-[#011749]">{product.name}</h3>
            <p className="text-sm text-[#011749]">{product.description}</p>

            <span className="font-bold text-[#011749] mt-2 block">
              EGP {product.price}
            </span>
          </div>
        ))}
      </div>

      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
};

export default Shop;
