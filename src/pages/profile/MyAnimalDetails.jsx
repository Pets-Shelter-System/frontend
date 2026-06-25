import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/context/AuthContext";
import api from "../../API/api";
import Spinner from "../../components/Spinner";
import { toast } from "react-hot-toast";
import { 
  IoArrowBack, 
  IoCalendarOutline, 
  IoPawOutline, 
  IoMaleFemaleOutline, 
  IoScaleOutline, 
  IoColorPaletteOutline,
  IoInformationCircleOutline
} from "react-icons/io5";

const MyAnimalDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState(location.state?.type || null);

  const fetchAnimalDetails = async () => {
    if (!token) return;
    setLoading(true);
    
    try {
      // 1. If type is known from navigation state
      if (type) {
        const endpoint = type === "adoption" ? `/Animals/${id}` : `/FosterAnimals/${id}`;
        const res = await api.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnimal(res.data?.data || res.data);
      } else {
        // 2. Fallback for refresh case: Try Adoption first
        try {
          const res = await api.get(`/Animals/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAnimal(res.data?.data || res.data);
          setType("adoption");
        } catch (err) {
          // 3. If Adoption fails, try Foster
          const res = await api.get(`/FosterAnimals/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAnimal(res.data?.data || res.data);
          setType("foster");
        }
      }
    } catch (err) {
      console.error("Failed to fetch animal details:", err);
      toast.error("Failed to load animal details.");
      // Option: navigate back if all fail
      // navigate("/profile/my-animals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimalDetails();
  }, [id, token]);

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><Spinner /></div>;
  if (!animal) return (
    <div className="text-center py-20 bg-white rounded-[32px] shadow-sm">
      <h3 className="text-xl font-bold text-[#011749]">Animal not found</h3>
      <button onClick={() => navigate("/profile/my-animals")} className="mt-4 text-[#011749] font-medium underline">Back to list</button>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "available": return "bg-green-100 text-green-600";
      case "pending": return "bg-orange-100 text-orange-600";
      case "rejected": return "bg-red-100 text-red-600";
      case "completed": return "bg-blue-100 text-blue-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const images = animal.photos || [];
  const mainImage = images[0]?.imageUrl ? `https://petmarket.runasp.net${images[0].imageUrl}` : "https://via.placeholder.com/800x600?text=No+Image";

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={() => navigate("/profile/my-animals")}
        className="flex items-center gap-2 text-gray-400 hover:text-[#011749] transition-colors font-semibold group"
      >
        <div className="p-2 rounded-full bg-white shadow-sm group-hover:bg-[#011749] group-hover:text-white transition-all">
            <IoArrowBack size={20} />
        </div>
        Back to My Animals
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Image & Basic Info */}
        <div className="lg:col-span-12 space-y-8">
            <div className="bg-white rounded-[32px] p-4 shadow-sm border border-gray-100 overflow-hidden">
                <div className="aspect-[21/9] md:aspect-[21/7] rounded-[24px] overflow-hidden bg-gray-100">
                    <img src={mainImage} alt={animal.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-[#011749]">{animal.name}</h1>
                        <p className="text-gray-400 font-medium text-lg capitalize">{type} Record</p>
                    </div>
                    <span className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${getStatusColor(animal.status)}`}>
                        {animal.status || "Unknown Status"}
                    </span>
                </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard icon={<IoPawOutline />} label="Breed" value={animal.petTypeName || animal.breed || "N/A"} />
            <StatCard icon={<IoCalendarOutline />} label="Age" value={`${animal.ageYears || 0} Years`} />
            <StatCard icon={<IoMaleFemaleOutline />} label="Gender" value={animal.gender || "N/A"} />
            <StatCard icon={<IoScaleOutline />} label="Weight" value={animal.size || "Unknown"} />
            <StatCard icon={<IoColorPaletteOutline />} label="Color" value={animal.color || "Various"} />
        </div>

        {/* Content Sections */}
        <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-center gap-3 text-[#011749]">
                    <div className="p-2 bg-[#01174910] rounded-lg"><IoInformationCircleOutline size={20} /></div>
                    <h2 className="text-xl font-bold">About {animal.name}</h2>
                </div>
                <p className="text-gray-500 leading-relaxed text-lg">
                    {animal.description || "No detailed description available for this animal."}
                </p>
            </div>
        </div>

        <div className="lg:col-span-4">
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-6 sticky top-24">
                <h2 className="text-xl font-bold text-[#011749] border-b pb-4 border-gray-50 uppercase tracking-widest text-[10px]">Record Details</h2>
                <div className="space-y-4">
                    <DetailItem label="Application Type" value={type} />
                    <DetailItem label="Animal ID" value={`#${animal.id || 'N/A'}`} />
                    <DetailItem label="Record Status" value={animal.status} />
                    <DetailItem label="Date Updated" value={new Date().toLocaleDateString()} />
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
    <div className="bg-white p-6 rounded-[28px] shadow-sm border border-gray-50 flex flex-col items-center text-center gap-2 hover:border-[#01174920] transition-colors">
        <div className="text-[#011749] opacity-40">{icon}</div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-[#011749] font-bold">{value}</p>
    </div>
);

const DetailItem = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400 font-medium">{label}</span>
        <span className="text-[#011749] font-bold capitalize">{value || 'N/A'}</span>
    </div>
);

export default MyAnimalDetails;
