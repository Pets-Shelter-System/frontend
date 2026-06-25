import axios from "axios";
import Slider from "react-slick";
import React, { useContext, useEffect, useState , useMemo, useCallback} from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
// import { IoCartOutline, IoHeartOutline } from "react-icons/io5";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import Swal from "sweetalert2";
import { CartContext } from "../components/context/CartContext";
import { FavoriteContext } from "../components/context/FavoriteContext";
import { toast } from "react-hot-toast";
import { IoCartOutline, IoHeartOutline, IoHeart } from "react-icons/io5";
import api from "../API/api";
export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const BASE_URL = "https://petmarket.runasp.net";

  // Contexts
  const { addToCart } = useContext(CartContext);
  const { toggleFavorite, isFavorite } = useContext(FavoriteContext);

  // States
  const [productDetails, setProductDetails] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  // Review Form state
  const [formName, setFormName] = useState("");
  const [formStars, setFormStars] = useState(5);
  const [formContent, setFormContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const photos = useMemo(() => {
    return Array.isArray(productDetails?.photos) ? productDetails.photos : [];
  }, [productDetails]);

  const reviewsFromApi = useMemo(() => {
    return ratings.length
      ? ratings.map((r) => ({
        id: r.id,
        name: r.userName ?? "Anonymous",
        content: r.content ?? r.comment ?? "",
        rating: Number(r.stars ?? 0),
        time: r.reviewTime ?? null,
      }))
      : [];
  }, [ratings]);

  const settings = {
    dots: true,
    infinite: photos.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const GetProductDetails = useCallback(async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/Products/${id}`);
      setProductDetails(data?.data || null);
    } catch (err) {
      console.error(err);
      setProductDetails(null);
    }
  }, [id]);

  const GetRatings = useCallback(async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/Ratings/${id}`);
      const arr = Array.isArray(data?.data) ? data.data : [];
      setRatings(arr);
      if (arr.length > 0) {
        const sum = arr.reduce((s, r) => s + (Number(r.stars) || 0), 0);
        setAvgRating(Number((sum / arr.length).toFixed(1)));
      } else {
        setAvgRating(0);
      }
    } catch (err) {
      console.error(err);
      setRatings([]);
      setAvgRating(0);
    }
  }, [id]);

  const GetRelatedProducts = useCallback(async (categoryId) => {
    try {
      const { data } = await api.get("/Products");
      const allProducts = Array.isArray(data?.data) ? data.data : [];
      const filtered = allProducts
        .filter((p) => p.categoryId === categoryId && p.id !== Number(id))
        .slice(0, 3);
      setRelatedProducts(filtered);
    } catch (err) {
      console.error("Related products error:", err);
    }
  }, [id]);

  const handleAddToCart = useCallback(async (product, e) => {
    if (e) e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    setIsAddingToCart(true);
    try {
      const success = await addToCart(product);
      if (success) {
        toast.success("Added to cart");
      } else {
        toast.error("Failed to add");
      }
    } catch (err) {
      toast.error("Failed to add");
    } finally {
      setIsAddingToCart(false);
    }
  }, [addToCart, navigate]);

  const handleFavoriteAction = useCallback(async (product, e) => {
    if (e) e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to manage favorites");
      navigate("/login");
      return;
    }

    if (isFavoriteLoading) return;
    setIsFavoriteLoading(true);
    try {
      await toggleFavorite(product);
    } catch (err) {
      toast.error("Failed to update favorite");
    } finally {
      setIsFavoriteLoading(false);
    }
  }, [toggleFavorite, navigate, isFavoriteLoading]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([GetProductDetails(), GetRatings()]).finally(() =>
      setLoading(false)
    );
  }, [id, GetProductDetails, GetRatings]);

  useEffect(() => {
    if (productDetails?.categoryId) {
      GetRelatedProducts(productDetails.categoryId);
    }
  }, [productDetails?.categoryId, GetRelatedProducts]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    if (!formName.trim()) {
      setSubmitError("Please enter your name.");
      return;
    }
    if (!formContent.trim()) {
      setSubmitError("Please enter your review content.");
      return;
    }
    if (formStars < 1 || formStars > 5) {
      setSubmitError("Stars must be between 1 and 5.");
      return;
    }
    setSubmitting(true);
    const payload = {
      productId: Number(id),
      stars: Number(formStars),
      content: formContent,
      userName: formName,
    };
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      await axios.post(`${BASE_URL}/api/Ratings`, payload, { headers });
      await GetRatings();
      setFormName("");
      setFormContent("");
      setFormStars(5);
      setIsReviewOpen(false);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        setSubmitError(
          "Unauthorized to submit review — please log in or refresh your session."
        );
      } else if (status === 400) {
        setSubmitError(err?.response?.data?.message || "Bad request.");
      } else {
        setSubmitError(
          err?.response?.data?.message || "Failed to submit review. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !productDetails) return <Spinner />;


  const imgSrc = (photo) => {
    const name = typeof photo === 'string' ? photo : photo?.imageName;
    if (!name) return "/default.png";
    return name.startsWith("http")
      ? name
      : `${BASE_URL}${name}`;
  };

  const renderStars = (rating = 0, size = "text-xl") => {
    const n = Math.min(5, Math.max(0, Math.round(Number(rating) || 0)));
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`${size} ${i < n ? "text-yellow-400" : "text-gray-200"}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("en-GB");
    } catch {
      return iso;
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F5FB] pt-24 pb-12">
      <main className="max-w-7xl mx-auto px-4">
        {/* Main Product Card */}
        <div className="bg-white rounded-[32px] shadow-sm overflow-hidden p-6 sm:p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12">
            
            {/* Image Section */}
            <div className="relative group">
              <div className="aspect-[4/3] bg-[#F6F7F9] rounded-[24px] overflow-hidden flex items-center justify-center min-h-[260px] sm:min-h-[360px] lg:min-h-[440px]">
                {photos.length > 0 ? (
                  <Slider {...settings} className="w-full h-full product-slider">
                    {photos.map((photo, idx) => (
                      <div key={idx} className="w-full h-[260px] sm:h-[320px] lg:h-[440px] outline-none">
                        <div className="w-full h-full flex items-center justify-center p-4">
                          <img
                            src={imgSrc(photo)}
                            alt={productDetails.name}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => (e.currentTarget.src = "/default.png")}
                          />
                        </div>
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-8 text-gray-300">
                    <img src="/default.png" alt="default" className="max-w-[200px] opacity-20" />
                  </div>
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="flex flex-col justify-between py-2">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#011749] mb-4">
                  {productDetails.name}
                </h1>
                
                <div className="flex items-center gap-3 mb-6">
                  {renderStars(avgRating || productDetails.rating, "text-2xl")}
                  <span className="text-sm font-medium text-gray-500">
                    {ratings.length > 0 ? `(${ratings.length} reviews)` : (avgRating ? `${avgRating} Rating` : "No reviews yet")}
                  </span>
                </div>

                <div className="inline-block px-4 py-1.5 rounded-full bg-[#01174910] text-[#011749] text-sm font-bold opacity-70 mb-6 capitalize">
                  {productDetails.categoryName || "Pet Supplies"}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#011749]">Description</h3>
                  <p className="text-[#011749] opacity-80 leading-relaxed text-base lg:text-lg whitespace-pre-line">
                    {productDetails.description || "Every pet deserves the best care. This premium product is selected for quality and reliability, ensuring your furry friend gets exactly what they need for a happy, healthy life."}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Price</span>
                    <p className="text-3xl lg:text-5xl font-black text-[#011749]">
                      EGP {productDetails.price}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 sm:max-w-md">
                    <button
                      onClick={(e) => handleFavoriteAction(productDetails, e)}
                      disabled={isFavoriteLoading}
                      className={`h-[56px] px-6 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 ${
                        isFavorite(productDetails.id)
                          ? "bg-red-50 border-red-100 text-red-500"
                          : "bg-white border-gray-100 text-[#011749] hover:bg-gray-50"
                      }`}
                    >
                      {isFavorite(productDetails.id) ? (
                        <IoHeart className="text-2xl" />
                      ) : (
                        <IoHeartOutline className="text-2xl" />
                      )}
                    </button>

                    <button
                      onClick={(e) => handleAddToCart(productDetails, e)}
                      disabled={isAddingToCart}
                      className="h-[56px] flex-1 bg-[#011749] text-white px-8 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#0a276b] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#01174920]"
                    >
                      <IoCartOutline className="text-2xl" />
                      {isAddingToCart ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-[#011749] flex items-center gap-3">
                <span className="text-orange-400 text-4xl">🐾</span>
                Related Products
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    navigate(`/product/${p.id}`);
                    window.scrollTo(0, 0);
                  }}
                  className="bg-white p-5 rounded-[28px] shadow-sm border border-transparent hover:border-orange-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer flex flex-col min-h-[420px]"
                >
                  <div className="relative aspect-[4/3] bg-[#F6F7F9] rounded-[20px] overflow-hidden mb-5">
                    <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={(e) => handleFavoriteAction(p, e)}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-[#011749] hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        {isFavorite(p.id) ? <IoHeart className="text-lg text-red-500" /> : <IoHeartOutline className="text-lg" />}
                      </button>
                      <button 
                        onClick={(e) => handleAddToCart(p, e)}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-[#011749] hover:bg-orange-50 hover:text-orange-500 transition-colors"
                      >
                        <IoCartOutline className="text-lg" />
                      </button>
                    </div>
                    <div className="w-full h-full flex items-center justify-center p-4">
                      <img
                        src={imgSrc(p.photos?.[0])}
                        alt={p.name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => (e.currentTarget.src = "/default.png")}
                      />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-1 mb-2">
                       {renderStars(p.rating, "text-xs")}
                    </div>
                    <h3 className="font-bold text-lg text-[#011749] mb-2 line-clamp-2 leading-tight">
                      {p.name}
                    </h3>
                    <p className="text-xs text-[#011749] opacity-70 mb-4 line-clamp-2">
                      {p.categoryName || "Accessories"}
                    </p>
                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                      <span className="font-black text-[#011749] text-xl">
                        EGP {p.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews Section */}
        <section className="mt-24 mb-20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center">
                 <span className="text-3xl">💬</span>
              </div>
              <div>
                <h2 className="text-3xl font-black text-[#011749]">Real Reviews</h2>
                <p className="text-sm font-medium text-gray-500">From our pet-loving community</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsReviewOpen(true)}
              className="bg-[#011749] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#0a276b] transition-all shadow-lg shadow-[#01174910] text-sm tracking-wide"
            >
              WRITE A REVIEW
            </button>
          </div>

          {reviewsFromApi.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-100">
               <p className="text-gray-400 font-medium">Be the first to review this product!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {reviewsFromApi.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-[24px] shadow-sm p-6 flex gap-5 border border-gray-50 hover:border-orange-100 transition-colors h-full"
                >
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-[#01174910] text-[#011749] flex items-center justify-center font-black text-xl">
                      {rev.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-[#011749]">
                          {rev.name}
                        </p>
                        <div className="mt-1">
                          {renderStars(rev.rating, "text-sm")}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-gray-300 uppercase tracking-tighter">
                        {formatDate(rev.time)}
                      </span>
                    </div>
                    <p className="text-sm text-[#011749] opacity-80 mt-3 italic leading-relaxed">
                      "{rev.content}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {isReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              if (!submitting) {
                setIsReviewOpen(false);
                setSubmitError(null);
              }
            }}
          />
          <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#011749]">Write a review</h3>
              <button
                onClick={() => {
                  if (!submitting) {
                    setIsReviewOpen(false);
                    setSubmitError(null);
                  }
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Your name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E7A01C]"
                  placeholder="Your name"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Stars</label>
                <select
                  value={formStars}
                  onChange={(e) => setFormStars(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-md px-3 py-2"
                  disabled={submitting}
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Very Good</option>
                  <option value={3}>3 - Good</option>
                  <option value={2}>2 - Fair</option>
                  <option value={1}>1 - Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Review</label>
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 h-28 resize-none"
                  placeholder="Write your review..."
                  disabled={submitting}
                />
              </div>

              {submitError && (
                <p className="text-sm text-red-600">{submitError}</p>
              )}

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!submitting) {
                      setIsReviewOpen(false);
                      setSubmitError(null);
                    }
                  }}
                  className="px-4 py-2 rounded-md border border-gray-200"
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-[#011749] text-white font-semibold disabled:opacity-60"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
