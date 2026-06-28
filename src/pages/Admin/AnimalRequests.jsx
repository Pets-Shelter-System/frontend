import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../components/context/AuthContext";
import { IoArrowBack } from "react-icons/io5";
import { toast } from "react-hot-toast";

const BASE_URL = "https://petmarket.runasp.net/api/Admin/GetAllApplications";
const IMG_BASE = "https://petmarket.runasp.net";

const AnimalRequests = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "Adoption";
  const { token } = useContext(AuthContext);

  const [applications, setApplications] = useState([]);
  const [animalImage, setAnimalImage] = useState("");

  // States for detailed view modal and accept/reject actions
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState("most-recent");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [animalInfo, setAnimalInfo] = useState(null);

  const fetchApplications = () => {
    const endpoint = type === "Foster"
      ? `https://petmarket.runasp.net/api/Admin/GetAllFosterApplications`
      : BASE_URL;

    axios
      .get(`${endpoint}?search=${name}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data.data.pagedResult.items;
        setApplications(data);
        setAnimalImage(data[0]?.animalPictureUrl || "");
      })
      .catch((err) => {
        console.error("Error fetching applications:", err);
      });
  };

  useEffect(() => {
    if (token) {
      fetchApplications();
    }
  }, [name, token]);

  useEffect(() => {
    if (applications.length > 0) {
      const animalId = applications[0]?.animalId;
      if (animalId) {
        const url = type === "Foster"
          ? `https://petmarket.runasp.net/api/FosterAnimals/${animalId}`
          : `https://petmarket.runasp.net/api/Animals/${animalId}`;
        axios
          .get(url)
          .then((res) => {
            setAnimalInfo(res.data.data || res.data);
          })
          .catch((err) => {
            console.error("Error fetching animal details:", err);
          });
      }
    }
  }, [applications, type]);

  const handleViewDetails = async (id) => {
    try {
      const res = await axios.get(`https://petmarket.runasp.net/api/Admin/GetApplication/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedApp(res.data.data);
      setAdminNotes(res.data.data.adminNotes || "");
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching application details:", err);
      toast.error("Failed to load application details.");
    }
  };

  const handleAction = async (actionType) => {
    if (!selectedApp) return;
    setIsSubmitting(true);
    try {
      const endpoint = `https://petmarket.runasp.net/api/Admin/applications/${selectedApp.id}/${actionType}`;
      await axios.post(
        endpoint,
        { adminNotes },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(`Application successfully ${actionType}ed!`);
      setShowModal(false);
      fetchApplications(); // Reload list to update status
    } catch (err) {
      console.error(`Error performing action ${actionType}:`, err);
      toast.error(
        err.response?.data?.message || `Failed to ${actionType} application.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const sortedApplications = [...applications].sort((a, b) => {
    if (sortBy === "most-recent") {
      return new Date(b.submittedAt) - new Date(a.submittedAt);
    } else if (sortBy === "oldest") {
      return new Date(a.submittedAt) - new Date(b.submittedAt);
    }
    return 0;
  });

  return (
    <div className="font-inter text-[#011749] p-6 bg-[#F8F9FA] shadow-sm">

      <button
        onClick={() => navigate("/admin/requests")}
        className="flex items-center gap-2 text-sm mb-6 text-gray-500 hover:translate-x-[-4px] transition"
      >
        <IoArrowBack />
        Back to Request
      </button>

      {/* 🔥 HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-end gap-6 mb-10">

        {/* Title */}
        <div>
          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight break-words">
            {name}
          </h1>
          <p className="text-gray-400 mt-2">
            Viewing all application activity for this resident
          </p>
        </div>

        {/* Animal Card */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm w-full lg:w-[400px]">

          <img
            src={
              animalImage
                ? IMG_BASE + animalImage
                : "https://via.placeholder.com/100"
            }
            className="w-24 h-24 rounded-lg object-cover"
          />

          <div className="flex-1">
            <span className="text-xs text-gray-400 uppercase">
              {animalInfo ? (animalInfo.petTypeName || animalInfo.petType || "Unknown Breed") : "Loading..."}
            </span>

            <h3 className="font-bold text-lg mt-1">
              {animalInfo ? (animalInfo.ageYears != null ? `${animalInfo.ageYears} Years Old` : "N/A") : "..."}
            </h3>

            <div className="flex gap-4 mt-2 text-xs text-gray-400">
              <span className="uppercase">
                Weight: {animalInfo ? (animalInfo.weightKg || animalInfo.weight ? `${animalInfo.weightKg || animalInfo.weight}kg` : "N/A") : "..."}
              </span>
              <span className="uppercase">
                Vaccinated: {animalInfo ? (animalInfo.isVaccinated ? "Yes" : (animalInfo.isVaccinated === false ? "No" : "N/A")) : "..."}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* 🔥 TABLE CARD */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 sm:px-8 py-5 bg-gray-50 gap-4">
          <h2 className="font-bold text-lg">
            Pending & Active Requests
          </h2>

          <div className="relative flex items-center gap-2 text-xs">
            <span className="text-gray-500 font-medium">Sort by:</span>
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="bg-white text-gray-700 font-semibold px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm hover:border-gray-300 transition-all flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-[#011749] min-w-[125px] justify-between cursor-pointer"
              >
                <span>{sortBy === "most-recent" ? "Most Recent" : "Oldest"}</span>
                <span className={`transition-transform duration-200 text-gray-400 text-[10px] ${isSortOpen ? "rotate-180" : "rotate-0"}`}>
                  ▼
                </span>
              </button>

              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                  <div className="absolute right-0 mt-1 w-full bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 text-xs">
                    <button
                      onClick={() => {
                        setSortBy("most-recent");
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors font-semibold ${
                        sortBy === "most-recent" ? "text-blue-600 bg-blue-50/50" : "text-gray-600"
                      }`}
                    >
                      Most Recent
                    </button>
                    <button
                      onClick={() => {
                        setSortBy("oldest");
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors font-semibold ${
                        sortBy === "oldest" ? "text-blue-600 bg-blue-50/50" : "text-gray-600"
                      }`}
                    >
                      Oldest
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Table Wrapper */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm min-w-[800px]">

          <thead className="text-xs text-gray-400 uppercase">
            <tr>
              <th className="px-8 py-4 text-left">Applicant</th>
              <th className="px-8 py-4 text-left">Request Type</th>
              <th className="px-8 py-4 text-left">Date Submitted</th>
              <th className="px-8 py-4 text-left">Current Status</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {sortedApplications.map((item) => (
              <tr
                key={item.id}
                className="border-t hover:bg-gray-50 transition"
              >

                {/* Applicant */}
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">

                    <img
                      src={
                        item.applicantPicture
                          ? IMG_BASE + item.applicantPicture
                          : `https://ui-avatars.com/api/?name=${item.applicantFirstName}`
                      }
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    <div>
                      <p className="font-semibold">
                        {item.applicantFirstName} {item.applicantLastName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.applicantEmail}
                      </p>
                    </div>

                  </div>
                </td>

                {/* Type */}
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    type === "Foster"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-blue-100 text-blue-600"
                  }`}>
                    {type === "Foster" ? "FOSTER" : "ADOPTION"}
                  </span>
                </td>

                {/* Date */}
                <td className="px-8 py-5 text-gray-600">
                  {new Date(item.submittedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>

                {/* Status */}
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2 text-xs font-bold">

                    <span
                      className={`w-2 h-2 rounded-full ${item.statusName === "Pending"
                          ? "bg-yellow-400"
                          : item.statusName === "Approved"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                    />

                    <span
                      className={
                        item.statusName === "Pending"
                          ? "text-yellow-600"
                          : item.statusName === "Approved"
                            ? "text-green-600"
                            : "text-red-600"
                      }
                    >
                      {item.statusName.toUpperCase()}
                    </span>

                  </div>
                </td>

                {/* Actions */}
                <td className="px-8 py-5 text-right">
                  <button
                    onClick={() => handleViewDetails(item.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-[#011749] hover:text-blue-600 transition"
                    title="View Request Details"
                  >
                    👁
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

          </table>
        </div>
      </div>

      {/* 🔥 BOTTOM CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mt-10">

        <div className="bg-[#011749] text-white p-6 rounded-xl">
          <h4 className="font-bold text-lg mb-2">
            Application Velocity
          </h4>
          <p className="text-sm text-gray-200">
            This animal receives high interest compared to others.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl">
          <h4 className="font-bold mb-4 text-sm uppercase">
            Required Documents
          </h4>
          <ul className="text-sm text-gray-500 space-y-2">
            <li>✔ Proof of Residence</li>
            <li>✔ Vet References</li>
            <li>○ Home Photo Tour</li>
          </ul>
        </div>

        <div className="bg-[#425F8A] text-white p-6 rounded-xl">
          <h4 className="font-bold text-lg mb-2">
            Internal Note
          </h4>
          <p className="text-sm text-blue-100">
            Prioritize experienced owners and active homes.
          </p>
        </div>

      </div>

      {/* Detailed Request Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col transform scale-100 transition-all duration-300">
            {/* Modal Header */}
            <div className="px-5 py-3 bg-[#011749] text-white flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold">{type === "Foster" ? "Foster Details" : "Application Details"}</h2>
                <p className="text-[10px] text-blue-200 mt-0.5">ID: {selectedApp.id} • Submitted on {new Date(selectedApp.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/80 hover:text-white text-xl font-bold leading-none p-1 focus:outline-none"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-4 custom-scrollbar flex-1 text-[#011749]">
              {/* Main Info Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Section: Applicant Information */}
                <div className="border border-gray-200 p-3 rounded-lg">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 border-b pb-1">Applicant Info</h3>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-gray-700">
                    <p className="col-span-2"><span className="text-gray-400">Full Name:</span> <span className="font-semibold text-[#011749]">{selectedApp.firstName} {selectedApp.lastName}</span></p>
                    <p className="col-span-2"><span className="text-gray-400">Email:</span> <span className="font-medium text-[#011749]">{selectedApp.email}</span></p>
                    <p><span className="text-gray-400">Phone:</span> <span className="font-medium text-[#011749]">{selectedApp.phoneNumber}</span></p>
                    <p className="col-span-2"><span className="text-gray-400">Address:</span> <span>{selectedApp.address}, {selectedApp.city}, {selectedApp.country} {selectedApp.zipCode}</span></p>
                  </div>
                </div>

                {/* Section: Animal Details */}
                <div className="border border-gray-200 p-3 rounded-lg">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 border-b pb-1">Animal Requested</h3>
                  <div className="flex gap-3 text-xs">
                    {selectedApp.animalPictureUrl ? (
                      <img
                        src={`https://petmarket.runasp.net${selectedApp.animalPictureUrl}`}
                        alt={selectedApp.animalName}
                        className="w-12 h-12 rounded object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-[10px] text-gray-400">No Image</div>
                    )}
                    <div>
                      <h4 className="font-bold text-[#011749]">{selectedApp.animalName}</h4>
                      <p className="text-gray-500 line-clamp-2 mt-0.5 whitespace-pre-line leading-relaxed text-[11px]">{selectedApp.animalDescription}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Household & Pet Care Info Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Section: Household */}
                <div className="border border-gray-200 p-3 rounded-lg">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 border-b pb-1">Household Details</h3>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {selectedApp.householdInfo?.details || "No details provided."}
                  </p>
                </div>

                {/* Section: Pet Care Plan */}
                <div className="border border-gray-200 p-3 rounded-lg">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 border-b pb-1">Care Plan</h3>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Responsible</span>
                      <span className="font-medium text-gray-700">{selectedApp.petCareInfo?.responsiblePerson || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Alone Time</span>
                      <span className="font-medium text-gray-700">{selectedApp.petCareInfo?.aloneTimeDetails || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Living Env</span>
                      <span className="font-medium text-gray-700">{selectedApp.petCareInfo?.livingEnvironment || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Reason</span>
                      <span className="font-medium text-gray-700">{selectedApp.petCareInfo?.adoptionReason || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferences Section */}
              <div className="border border-gray-200 p-3 rounded-lg">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 border-b pb-1">Preferences & Conditions</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedApp.preferences && Object.entries(selectedApp.preferences).map(([key, val]) => {
                    if (val) {
                      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                      return (
                        <span key={key} className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-medium text-gray-600">
                          {label}
                        </span>
                      );
                    }
                    return null;
                  })}
                  {(!selectedApp.preferences || !Object.values(selectedApp.preferences).some(v => v)) && (
                    <span className="text-xs text-gray-400">No preference tags selected.</span>
                  )}
                </div>
              </div>

              {/* Agreement and Status */}
              <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border border-gray-200 text-xs">
                <div>
                  <span className="text-gray-400 mr-2">Agreement:</span>
                  <span className={selectedApp.agreement?.accepted ? "text-emerald-600 font-bold" : "text-amber-500 font-bold"}>
                    {selectedApp.agreement?.accepted ? "✓ Accepted" : "✗ Not Accepted"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 mr-2">Status:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedApp.status === 2 ? "bg-emerald-100 text-emerald-700" :
                    selectedApp.status === 3 ? "bg-red-100 text-red-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {selectedApp.status === 2 ? "Approved" : selectedApp.status === 3 ? "Rejected" : "Pending"}
                  </span>
                </div>
              </div>

              {/* Admin Note Input */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#011749]">
                  Admin Decision Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Provide decision comments here..."
                  className="w-full min-h-[60px] bg-gray-50 focus:bg-white border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg p-2 text-xs outline-none transition"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-gray-50 border-t flex flex-col sm:flex-row justify-between items-center gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1.5 border rounded-lg text-gray-500 hover:bg-gray-100 text-xs font-semibold w-full sm:w-auto"
                disabled={isSubmitting}
              >
                Close Details
              </button>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleAction("reject")}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-[#BA1A1A] hover:bg-[#a61717] text-white rounded-lg font-bold text-xs shadow-sm transition disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Reject"}
                </button>
                <button
                  onClick={() => handleAction("accept")}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-[#047857] hover:bg-[#035a41] text-white rounded-lg font-bold text-xs shadow-sm transition disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Accept"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AnimalRequests;