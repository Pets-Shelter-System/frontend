import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../components/context/AuthContext";

const BASE_URL = "https://petmarket.runasp.net/api/Animals";
const IMG_BASE = "https://petmarket.runasp.net";

// ── Helpers ──────────────────────────────────────────────

const Field = ({ label, children }) => (
  <div style={{ marginBottom: "1rem" }}>
    {label && (
      <label style={{
        display: "block", fontSize: "12px", fontWeight: 600,
        letterSpacing: "0.08em", textTransform: "uppercase",
        color: "#011749", marginBottom: "6px",
        fontFamily: "'Inter', sans-serif",
      }}>
        {label}
      </label>
    )}
    {children}
  </div>
);

const inputStyle = {
  width: "100%", padding: "9px 12px", fontSize: "14px",
  background: "#f7f7f7", border: "0.5px solid #d0d5e8",
  borderRadius: "8px", color: "#011749", outline: "none",
  fontFamily: "'Inter', sans-serif", letterSpacing: "0.03em",
};

const sectionHeading = {
  fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em",
  textTransform: "uppercase", color: "#011749",
  marginBottom: "12px", fontFamily: "'Inter', sans-serif",
};

// ── LevelDots ────────────────────────────────────────────

const LevelDots = ({ value, onChange }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <button
        key={i}
        type="button"
        onClick={() => onChange(i)}
        style={{
          width: "22px", height: "22px", borderRadius: "50%",
          border: i <= value ? "1.5px solid #E7A01C" : "1.5px solid #ccc",
          background: i <= value ? "#E7A01C" : "#f5f5f5",
          cursor: "pointer", transition: "all 0.15s", padding: 0,
        }}
      />
    ))}
    <span style={{ fontSize: "11px", color: "#011749", marginLeft: "4px", fontFamily: "'Inter', sans-serif" }}>
      {value} / 5
    </span>
  </div>
);

// ── Badge ────────────────────────────────────────────────

const Badge = ({ children, color }) => {
  const colors = {
    teal: { bg: "#E1F5EE", text: "#0F6E56" },
    coral: { bg: "#FAECE7", text: "#993C1D" },
    blue: { bg: "#E6F1FB", text: "#011749" },
    purple: { bg: "#EEEDFE", text: "#3C3489" },
  };
  const c = colors[color] || colors.blue;
  return (
    <span style={{
      fontSize: "11px", fontWeight: 600, padding: "4px 10px",
      borderRadius: "99px", background: c.bg, color: c.text,
      letterSpacing: "0.04em", fontFamily: "'Inter', sans-serif",
    }}>
      {children}
    </span>
  );
};

// ── Main Component ───────────────────────────────────────

const EditAnimal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    size: "",
    gender: "",
    ageYears: "",
    weightKg: "",
    petTypeId: "",
    description: "",
    animalsFriendlyLevel: 1,
    childrenFriendlyLevel: 1,
    houseTrainedLevel: 1,
  });

  const [photos, setPhotos] = useState([]);
  const [activePhoto, setActivePhoto] = useState(0);
  const [petTypeName, setPetTypeName] = useState("");
  const [animalId, setAnimalId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.data;
        setFormData({
          name: data.name || "",
          size: data.size || "",
          gender: data.gender || "",
          ageYears: data.ageYears ?? "",
          weightKg: data.weightKg ?? "",
          petTypeId: data.petTypeId || "",
          description: data.description || "",
          animalsFriendlyLevel: data.animalsFriendlyLevel || 1,
          childrenFriendlyLevel: data.childrenFriendlyLevel || 1,
          houseTrainedLevel: data.houseTrainedLevel || 1,
        });
        setPhotos(data.photos || []);
        setPetTypeName(data.petTypeName || "");
        setAnimalId(data.id);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchAnimal();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();
      form.append("Id", id);
      form.append("Name", formData.name);
      form.append("Description", formData.description);
      form.append("AgeYears", Number(formData.ageYears));
      form.append("Size", formData.size);
      form.append("WeightKg", Number(formData.weightKg));
      form.append("Gender", formData.gender);
      form.append("PetTypeId", Number(formData.petTypeId));
      form.append("AnimalsFriendlyLevel", formData.animalsFriendlyLevel);
      form.append("ChildrenFriendlyLevel", formData.childrenFriendlyLevel);
      form.append("HouseTrainedLevel", formData.houseTrainedLevel);

      // 👇 مهم
      // لو عندك صور
      // form.append("Photos", file)

      await axios.put(`${BASE_URL}/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Animal updated successfully",
        confirmButtonColor: "#011749",
      });

      navigate("/admin/animals");

    } catch (err) {
      console.log(err.response?.data);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Bad Request",
      });
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "4rem", color: "#011749", fontFamily: "'Inter', sans-serif" }}>
        Loading...
      </div>
    );
  }

  const mainPhotoUrl =
    photos.length > 0
      ? IMG_BASE + photos[activePhoto]?.imageUrl
      : "https://via.placeholder.com/400x400?text=No+Photo";

  return (
    <div style={{
      maxWidth: "1100px", margin: "0 auto", padding: "2rem 1rem",
      fontFamily: "'Inter', sans-serif", letterSpacing: "0.04em",
    }}>

      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate("/admin/animals")}
        style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          fontSize: "13px", color: "#011749", background: "none", border: "none",
          cursor: "pointer", padding: "6px 0", marginBottom: "1.5rem",
          fontFamily: "'Inter', sans-serif", letterSpacing: "0.04em", fontWeight: 500,
        }}
      >
        ← All Animals
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "1.5rem", alignItems: "start" }}>

        {/* ── Left: Photo Panel ── */}
        <div style={{ position: "sticky", top: "1rem" }}>

          {/* Main Photo */}
          <div style={{
            width: "100%", aspectRatio: "1/1", borderRadius: "12px",
            border: "0.5px solid #d0d5e8", overflow: "hidden", background: "#f7f7f7",
          }}>
            <img
              src={mainPhotoUrl}
              alt={formData.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
            />
          </div>

          {/* Thumbnails */}
          {photos.length > 1 && (
            <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
              {photos.map((p, i) => (
                <div
                  key={p.id}
                  onClick={() => setActivePhoto(i)}
                  style={{
                    width: "56px", height: "56px", borderRadius: "8px",
                    border: i === activePhoto ? "2px solid #011749" : "0.5px solid #d0d5e8",
                    overflow: "hidden", cursor: "pointer", background: "#f7f7f7",
                  }}
                >
                  <img
                    src={IMG_BASE + p.imageUrl}
                    alt={`photo-${i}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Badges */}
          <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
            <Badge color="blue">ID #{animalId}</Badge>
            <Badge color="teal">{formData.isAdopted ? "Adopted" : "Available"}</Badge>
            {formData.gender && <Badge color="coral">{formData.gender}</Badge>}
            {petTypeName && <Badge color="purple">{petTypeName}</Badge>}
          </div>
        </div>

        {/* ── Right: Form ── */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#fff", border: "0.5px solid #d0d5e8",
            borderRadius: "12px", padding: "1.5rem",
          }}
        >
          <p style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px", color: "#011749", letterSpacing: "0.04em" }}>
            Edit Animal
          </p>
          <p style={{ fontSize: "13px", color: "#011749", opacity: 0.55, marginBottom: "1.5rem", letterSpacing: "0.03em" }}>
            {formData.name} · ID #{animalId}
          </p>

          <hr style={{ border: "none", borderTop: "0.5px solid #d0d5e8", margin: "1.2rem 0" }} />
          <p style={sectionHeading}>Basic Info</p>

          <Field label="Name">
            <input
              name="name" value={formData.name}
              onChange={handleChange} required style={inputStyle}
            />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Field label="Age (years)">
              <input
                type="number" name="ageYears" value={formData.ageYears}
                onChange={handleChange} step="0.1" min="0" style={inputStyle}
              />
            </Field>
            <Field label="Weight (kg)">
              <input
                type="number" name="weightKg" value={formData.weightKg}
                onChange={handleChange} step="0.1" min="0" style={inputStyle}
              />
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Field label="Size">
              <select name="size" value={formData.size} onChange={handleChange} style={inputStyle}>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </Field>
            <Field label="Gender">
              <select name="gender" value={formData.gender} onChange={handleChange} style={inputStyle}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </Field>
          </div>

          <hr style={{ border: "none", borderTop: "0.5px solid #d0d5e8", margin: "1.2rem 0" }} />
          <p style={sectionHeading}>Personality Levels</p>

          <Field label="Animals Friendly">
            <LevelDots
              value={formData.animalsFriendlyLevel}
              onChange={(v) => setFormData((p) => ({ ...p, animalsFriendlyLevel: v }))}
            />
          </Field>
          <Field label="Children Friendly">
            <LevelDots
              value={formData.childrenFriendlyLevel}
              onChange={(v) => setFormData((p) => ({ ...p, childrenFriendlyLevel: v }))}
            />
          </Field>
          <Field label="House Trained">
            <LevelDots
              value={formData.houseTrainedLevel}
              onChange={(v) => setFormData((p) => ({ ...p, houseTrainedLevel: v }))}
            />
          </Field>

          <hr style={{ border: "none", borderTop: "0.5px solid #d0d5e8", margin: "1.2rem 0" }} />

          <hr style={{ border: "none", borderTop: "0.5px solid #d0d5e8", margin: "1.2rem 0" }} />
          <p style={sectionHeading}>Description</p>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
          />

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "1.5rem" }}>
            <button
              type="button"
              onClick={() => navigate("/admin/animals")}
              style={{
                padding: "8px 18px", fontSize: "14px", borderRadius: "8px",
                border: "0.5px solid #d0d5e8", background: "transparent",
                color: "#011749", cursor: "pointer",
                fontFamily: "'Inter', sans-serif", letterSpacing: "0.04em", fontWeight: 500,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "8px 22px", fontSize: "14px", borderRadius: "8px",
                border: "none", background: "#011749", color: "#fff",
                cursor: "pointer", fontWeight: 600,
                fontFamily: "'Inter', sans-serif", letterSpacing: "0.04em",
              }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAnimal;