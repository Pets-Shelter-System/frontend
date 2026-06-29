import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../components/context/AuthContext";
import api from "../../API/api";
import Spinner from "../../components/Spinner";
import { toast } from "react-hot-toast";
import MyAnimalCard from "../../components/profile/MyAnimalCard";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import { IoPawOutline, IoArrowBack } from "react-icons/io5";

const MyAnimals = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tab, setTab] = useState("adoption");
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAnimals = async () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    try {
      const endpoint = tab === "adoption" ? "/Animals/my" : "/FosterAnimals/my";
      const res = await api.get(endpoint, {
        params: { pageNumber: page, pageSize: 6 },
        headers: { Authorization: `Bearer ${token}` }
      });

      const rawData = res.data;
      let list = [];
      let total = 1;

      if (rawData) {
        if (rawData.data) {
          if (Array.isArray(rawData.data)) {
            list = rawData.data;
          } else if (rawData.data.items && Array.isArray(rawData.data.items)) {
            list = rawData.data.items;
            total = rawData.data.totalPages || 1;
          } else if (typeof rawData.data === "object") {
            list = rawData.data.items || rawData.data.animals || [];
            total = rawData.data.totalPages || 1;
          }
        } else if (rawData.items && Array.isArray(rawData.items)) {
          list = rawData.items;
          total = rawData.totalPages || 1;
        } else if (Array.isArray(rawData)) {
          list = rawData;
        }
      }

      setAnimals(list);
      setTotalPages(total);
    } catch (err) {
      console.error("Failed to fetch animals:", err);
      setError(true);
      toast.error(`Failed to load your ${tab} animals.`);
      setAnimals([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [tab]);

  useEffect(() => {
    fetchAnimals();
  }, [tab, token, page]);

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Spinner />
    </div>
  );

  return (
    <div className="space-y-12 animate-fadeIn max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/profile")}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 text-[#011749] hover:bg-gray-50 transition-all"
          >
            <IoArrowBack size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#011749]">My Animals</h1>
            <p className="text-gray-400 text-sm">Manage and track your adoption and foster requests.</p>
          </div>
        </div>

        {/* Centered Segmented Control */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 bg-white rounded-[20px] shadow-sm border border-gray-50">
            <button
              onClick={() => setTab("adoption")}
              className={`px-10 py-3 rounded-[16px] text-sm font-bold transition-all duration-300 ${
                tab === "adoption" ? "bg-[#011749] text-white shadow-md" : "text-[#777] hover:bg-gray-50"
              }`}
            >
              Adoption
            </button>
            <button
              onClick={() => setTab("foster")}
              className={`px-10 py-3 rounded-[16px] text-sm font-bold transition-all duration-300 ${
                tab === "foster" ? "bg-[#011749] text-white shadow-md" : "text-[#777] hover:bg-gray-50"
              }`}
            >
              Foster
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="bg-white rounded-[32px] p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center gap-4">
          <div className="text-red-500 bg-red-50 p-4 rounded-full">
            <IoPawOutline size={40} />
          </div>
          <h3 className="text-xl font-bold text-[#011749]">Oops! Something went wrong</h3>
          <p className="text-gray-400 max-w-xs">We couldn't load your animals at this time. Please try again.</p>
          <button 
            onClick={fetchAnimals}
            className="mt-2 bg-[#011749] text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all"
          >
            Retry Fetch
          </button>
        </div>
      ) : animals.length > 0 ? (
        <div className="space-y-6">
          <div className="flex flex-wrap justify-center gap-6">
            {animals.map((animal) => (
              <MyAnimalCard key={animal.id} animal={animal} type={tab} />
            ))}
          </div>
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-[32px] p-12 md:p-20 text-center shadow-sm border border-gray-100 flex flex-col items-center gap-6">
          <div className="relative">
             <div className="absolute -inset-4 bg-[#F3F5FB] rounded-full animate-pulse"></div>
             <IoPawOutline size={80} className="text-[#01174920] relative" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-[#011749]">No animals found</h3>
            <p className="text-gray-400 max-w-sm">You currently don't have any animals in the {tab} category. Ready to meet a new friend?</p>
          </div>
          <button 
            onClick={() => navigate("/adoption")}
            className="bg-[#011749] text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-[#01174920] hover:scale-105 active:scale-95 transition-all"
          >
            Explore Animals
          </button>
        </div>
      )}
    </div>
  );
};

export default MyAnimals;
