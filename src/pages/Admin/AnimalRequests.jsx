import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../components/context/AuthContext";
import { IoArrowBack } from "react-icons/io5";

const BASE_URL = "https://petmarket.runasp.net/api/Admin/GetAllApplications";
const IMG_BASE = "https://petmarket.runasp.net";

const AnimalRequests = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [applications, setApplications] = useState([]);
  const [animalImage, setAnimalImage] = useState("");

  useEffect(() => {
    axios
      .get(`${BASE_URL}?search=${name}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data.data.pagedResult.items;
        setApplications(data);
        setAnimalImage(data[0]?.animalPictureUrl || "");
      });
  }, [name]);

  return (
    <div className="font-inter text-[#011749] p-6 bg-[#F8F9FA] shadow-sm">

      <button
        onClick={() => navigate("/admin/requests")}
        className="flex items-center gap-2 text-sm mb-6 text-gray-500 hover:translate-x-[-4px] transition"
      >
        <IoArrowBack />
        Back to Registry
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
              Golden Retriever
            </span>

            <h3 className="font-bold text-lg mt-1">
              2.5 Years Old
            </h3>

            <div className="flex gap-4 mt-2 text-xs text-gray-400">
              <span className="uppercase">Weight: 28kg</span>
              <span className="uppercase">Vaccinated: Yes</span>
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

          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400 uppercase">Sort by:</span>
            <select className="bg-white px-3 py-1 rounded-lg outline-none border border-gray-100">
              <option>Most Recent</option>
            </select>
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
            {applications.map((item) => (
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
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                    ADOPTION
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
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
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

    </div>
  );
};

export default AnimalRequests;