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
  IoInformationCircleOutline,
  IoPersonOutline,
  IoHomeOutline,
  IoPaw,
  IoPerson,
  IoHome
} from "react-icons/io5";

const MyAnimalDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState(location.state?.type || null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const fetchAnimalDetails = async () => {
    if (!token) return;
    setLoading(true);
    
    try {
      if (type) {
        const endpoint = type === "adoption" ? `/Animals/${id}` : `/FosterAnimals/${id}`;
        const res = await api.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnimal(res.data?.data || res.data);
      } else {
        try {
          const res = await api.get(`/Animals/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAnimal(res.data?.data || res.data);
          setType("adoption");
        } catch (err) {
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

  const getStatusText = () => {
    if (animal.status) return animal.status;
    if (type === "adoption") {
      return animal.isAdopted ? "Adopted" : "Available";
    } else {
      return animal.isAdopted || animal.isFostered ? "Fostered" : "Available";
    }
  };

  const getStatusColor = (statusText) => {
    switch (statusText?.toLowerCase()) {
      case "available": return "bg-green-100 text-green-600";
      case "adopted": return "bg-blue-100 text-blue-600";
      case "fostered": return "bg-purple-100 text-purple-600";
      case "pending": return "bg-orange-100 text-orange-600";
      case "rejected": return "bg-red-100 text-red-600";
      case "completed": return "bg-blue-100 text-blue-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const decodeImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/800x600?text=No+Image";
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `https://petmarket.runasp.net${cleanPath}`;
  };

  const photos = (() => {
    if (animal.photos && animal.photos.length > 0) {
      return animal.photos;
    }
    const fallbackPath = animal.imageUrl || animal.image || animal.photoUrl || animal.animalPictureUrl;
    if (fallbackPath) {
      return [{ imageUrl: fallbackPath }];
    }
    return [];
  })();

  const mainImage = photos[activePhotoIndex] ? decodeImageUrl(photos[activePhotoIndex].imageUrl) : "https://via.placeholder.com/800x600?text=No+Image";
  const statusText = getStatusText();

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
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-[32px] p-4 shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-[250px] md:h-[380px] w-full rounded-[24px] overflow-hidden bg-[#F8F9FA] flex items-center justify-center">
                    <img 
                      src={mainImage} 
                      alt={animal.name} 
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/800x600?text=No+Image";
                      }}
                      className="max-h-full max-w-full object-contain" 
                    />
                </div>
                
                {/* Thumbnails list */}
                {photos.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto mt-4 py-2 justify-center">
                        {photos.map((photo, index) => (
                            <button
                                key={photo.id || index}
                                onClick={() => setActivePhotoIndex(index)}
                                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                                    activePhotoIndex === index ? "border-[#011749] scale-105 shadow-sm" : "border-transparent opacity-75 hover:opacity-100"
                                }`}
                            >
                                <img
                                    src={decodeImageUrl(photo.imageUrl)}
                                    alt=""
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/150?text=Error";
                                    }}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Right Column: Name & record details */}
        <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 h-full flex flex-col justify-between gap-6">
                <div>
                    <div className="flex justify-between items-start gap-4 border-b pb-6 border-gray-50">
                        <div>
                            <h1 className="text-3xl font-bold text-[#011749]">{animal.name}</h1>
                            <p className="text-gray-400 font-medium text-sm mt-1 capitalize">{type} Record</p>
                        </div>
                        <span className={`px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(statusText)}`}>
                            {statusText}
                        </span>
                    </div>

                    <div className="space-y-4 mt-6">
                        <DetailItem label="Application Type" value={type} />
                        <DetailItem label="Animal ID" value={`#${animal.id || 'N/A'}`} />
                        <DetailItem label="Record Status" value={statusText} />
                        <DetailItem label="Date Created" value={new Date(animal.createdAt || Date.now()).toLocaleDateString()} />
                    </div>
                </div>

                <div className="border-t pt-6 border-gray-50 flex items-center justify-between text-xs text-gray-400">
                    <span>* Registered asset record file.</span>
                </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard icon={<IoPawOutline size={20} />} label="Breed" value={animal.petTypeName || animal.breed || "N/A"} />
            <StatCard icon={<IoCalendarOutline size={20} />} label="Age" value={`${animal.ageYears || 0} Years`} />
            <StatCard icon={<IoMaleFemaleOutline size={20} />} label="Gender" value={animal.gender || "N/A"} />
            <StatCard icon={<IoScaleOutline size={20} />} label="Weight" value={animal.weightKg ? `${animal.weightKg} kg` : "N/A"} />
            <StatCard icon={<IoInformationCircleOutline size={20} />} label="Size" value={animal.size || "Unknown"} />
        </div>

        {/* Content Sections */}
        <div className="lg:col-span-12 space-y-8">
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-center gap-3 text-[#011749]">
                    <div className="p-2 bg-[#01174910] rounded-lg"><IoInformationCircleOutline size={20} /></div>
                    <h2 className="text-xl font-bold">About {animal.name}</h2>
                </div>
                <p className="text-gray-500 leading-relaxed text-lg whitespace-pre-line">
                    {animal.description || "No detailed description available for this animal."}
                </p>
            </div>
        </div>

        {/* Friendliness & Training Levels */}
        {(animal.animalsFriendlyLevel !== undefined || animal.childrenFriendlyLevel !== undefined || animal.houseTrainedLevel !== undefined) && (
            <div className="lg:col-span-12 bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-[#011749] mb-6 flex items-center gap-2">
                    <IoPawOutline className="text-[#F8B63D]" /> Compatibility & House Training
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {animal.animalsFriendlyLevel !== undefined && (
                        <div className="p-6 bg-[#F8F9FA] rounded-[24px] flex flex-col items-center justify-center text-center border border-gray-50">
                            <p className="font-bold text-[#011749] mb-3 text-sm">Animal-Friendly</p>
                            <div className="flex gap-1.5 text-[#F8B63D]">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    i < animal.animalsFriendlyLevel ? (
                                        <IoPaw key={i} size={22} className="text-[#F8B63D]" />
                                    ) : (
                                        <IoPawOutline key={i} size={22} className="text-gray-300" />
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                    {animal.childrenFriendlyLevel !== undefined && (
                        <div className="p-6 bg-[#F8F9FA] rounded-[24px] flex flex-col items-center justify-center text-center border border-gray-50">
                            <p className="font-bold text-[#011749] mb-3 text-sm">Children-Friendly</p>
                            <div className="flex gap-1.5 text-[#F8B63D]">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    i < animal.childrenFriendlyLevel ? (
                                        <IoPerson key={i} size={22} className="text-[#F8B63D]" />
                                    ) : (
                                        <IoPersonOutline key={i} size={22} className="text-gray-300" />
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                    {animal.houseTrainedLevel !== undefined && (
                        <div className="p-6 bg-[#F8F9FA] rounded-[24px] flex flex-col items-center justify-center text-center border border-gray-50">
                            <p className="font-bold text-[#011749] mb-3 text-sm">House Trained</p>
                            <div className="flex gap-1.5 text-[#F8B63D]">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    i < animal.houseTrainedLevel ? (
                                        <IoHome key={i} size={22} className="text-[#F8B63D]" />
                                    ) : (
                                        <IoHomeOutline key={i} size={22} className="text-gray-300" />
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}

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
