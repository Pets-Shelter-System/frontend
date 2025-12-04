import axios from "axios";
import Slider from "react-slick";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { IoCartOutline, IoHeartOutline } from "react-icons/io5";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ProductDetails() {
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formStars, setFormStars] = useState(5);
  const [formContent, setFormContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const baseUrl = "http://petmarket.runasp.net";

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  async function GetProductDetails() {
    try {
      const { data } = await axios.get(`${baseUrl}/api/Products/${id}`);
      setProductDetails(data?.data || null);
    } catch (err) {
      console.log(err);
      setProductDetails(null);
    }
  }

  async function GetRatings() {
    try {
      const { data } = await axios.get(`${baseUrl}/api/Ratings/${id}`);
      const arr = Array.isArray(data?.data) ? data.data : [];
      setRatings(arr);
      if (arr.length > 0) {
        const sum = arr.reduce((s, r) => s + (Number(r.stars) || 0), 0);
        setAvgRating(Number((sum / arr.length).toFixed(1)));
      } else {
        setAvgRating(0);
      }
    } catch (err) {
      console.log(err);
      setRatings([]);
      setAvgRating(0);
    }
  }

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([GetProductDetails(), GetRatings()]).finally(() =>
      setLoading(false)
    );
  }, [id]);

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
      await axios.post(`${baseUrl}/api/Ratings`, payload, { headers });
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

  const photos = Array.isArray(productDetails.photos)
    ? productDetails.photos
    : [];

  const imgSrc = (photo) => {
    if (!photo?.imageName) return "/default.png";
    return photo.imageName.startsWith("http")
      ? photo.imageName
      : `${baseUrl}${photo.imageName}`;
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

  const reviewsFromApi = ratings.length
    ? ratings.map((r) => ({
        id: r.id,
        name: r.userName ?? "Anonymous",
        content: r.content ?? r.comment ?? "",
        rating: Number(r.stars ?? 0),
        time: r.reviewTime ?? null,
      }))
    : [];

  const formatDate = (iso) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("en-GB");
    } catch {
      return iso;
    }
  };

  const relatedProducts = [productDetails, productDetails, productDetails];

  return (
    <div className="min-h-screen bg-[#F3F5FB] py-10">
      <div className="max-w-6xl mx-auto px-4 mt-8 mt-20">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            <div className="w-full lg:w-1/2">
              <div className="bg-[#F4F4F4] rounded-2xl p-4 sm:p-6 h-full flex items-center">
                {photos.length > 0 ? (
                  <Slider key={photos.length} {...settings} className="w-full">
                    {photos.map((photo, idx) => (
                      <div
                        key={idx}
                        className="w-full h-[260px] sm:h-[320px] lg:h-[360px] flex items-center justify-center"
                      >
                        <img
                          src={imgSrc(photo)}
                          alt={productDetails.name}
                          className="max-h-full w-auto object-contain rounded-xl"
                          onError={(e) =>
                            (e.currentTarget.src = "/default.png")
                          }
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <div className="w-full h-[260px] sm:h-[320px] lg:h-[360px] flex items-center justify-center bg-gray-200 rounded-xl">
                    <img
                      src="/default.png"
                      alt="no image"
                      className="max-h-full object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex flex-col justify-between px-1">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#011749] mb-2 text-center lg:text-left">
                  {productDetails.name}
                </h1>
                <div className="flex flex-col items-center lg:items-start gap-1 mb-3">
                  {renderStars(avgRating || productDetails.rating, "text-2xl")}
                  <div className="text-sm text-gray-500 mt-1">
                    {ratings.length > 0
                      ? `${avgRating} (${ratings.length} reviews)`
                      : productDetails.rating
                      ? `Rating: ${productDetails.rating}`
                      : ""}
                  </div>
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-4 text-center lg:text-left">
                  {productDetails.categoryName || "Accessories"}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6 text-center lg:text-left">
                  {productDetails.description ||
                    "No description is available for this product."}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                <p className="text-2xl sm:text-3xl font-bold text-[#011749] text-center sm:text-left">
                  EGP {productDetails.price}
                </p>
                <div className="flex justify-center sm:justify-end gap-3">
                  <button className="px-6 sm:px-8 py-3 bg-[#011749] text-white rounded-xl flex items-center gap-2 text-sm sm:text-base font-semibold hover:bg-opacity-90 transition shadow-md">
                    <IoCartOutline className="text-lg sm:text-2xl" />
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-12">
        <div className="text-center mb-8">
          <span className="text-3xl">🐾</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#011749] mt-2">
            Related Product
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map((p, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300"
            >
              <div className="relative mb-4">
                <div className="absolute right-2 top-2 flex flex-col gap-2 z-10">
                  <button className="w-8 h-8 bg-[#E7A01C] rounded-full flex items-center justify-center shadow-md">
                    <IoCartOutline className="text-white text-lg" />
                  </button>
                  <button className="w-8 h-8 bg-[#E7A01C] rounded-full flex items-center justify-center shadow-md">
                    <IoHeartOutline className="text-white text-lg" />
                  </button>
                </div>
                <div className="bg-[#F4F4F4] rounded-lg p-3 flex items-center justify-center h-40">
                  <img
                    src={imgSrc(p.photos?.[0])}
                    alt={p.name}
                    className="max-h-full object-contain rounded-lg"
                    onError={(e) => (e.currentTarget.src = "/default.png")}
                  />
                </div>
              </div>
              <div className="mb-2">{renderStars(p.rating)}</div>
              <h3 className="font-bold text-base text-[#011749] truncate">
                {p.name}
              </h3>
              <p className="text-xs text-gray-500 mb-2">
                Comfortable & Adjustable
              </p>
              <span className="font-extrabold text-[#011749] block text-sm">
                EGP {p.price}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-12 mb-20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🐾</span>
            <h2 className="text-2xl font-bold text-[#011749]">Reviews</h2>
          </div>
          <button
            onClick={() => setIsReviewOpen(true)}
            className="bg-[#011749] text-white px-4 py-2 rounded-md text-sm shadow"
          >
            WRITE A REVIEW
          </button>
        </div>

        {reviewsFromApi.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviewsFromApi.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl shadow-md p-4 flex gap-4"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#011749] text-white flex items-center justify-center font-bold">
                    {rev.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#011749]">
                        {rev.name}
                      </p>
                      <div className="text-yellow-400 text-sm">
                        {renderStars(rev.rating, "text-base")}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatDate(rev.time)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-3">{rev.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
