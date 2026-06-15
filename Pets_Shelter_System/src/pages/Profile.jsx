import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../components/context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../API/api";
import Swal from "sweetalert2";
import {
    IoMailOutline,
    IoCallOutline,
    IoLocationOutline,
    IoShareSocialOutline,
    IoPencilOutline,
    IoBasketOutline,
    IoDocumentTextOutline,
    IoPawOutline,
    IoKeyOutline,
    IoPersonOutline,
    IoTimeOutline,
    IoShieldCheckmarkOutline,
    IoCloseOutline,
    IoEyeOutline,
    IoEyeOffOutline,
    IoCheckmarkCircleOutline,
    IoCloudUploadOutline
} from "react-icons/io5";

import { FaCamera } from "react-icons/fa";

const Profile = () => {
    const { token, user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Modals
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

    // Loading States
    const [isSaving, setIsSaving] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);

    // Form states
    const [editForm, setEditForm] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: ""
    });

    const [resetForm, setResetForm] = useState({
        email: "",
        token: "",
        password: ""
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [showPassword, setShowPassword] = useState(false);

    const fetchUserInfo = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const res = await api.get("/Account/userinfo", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfileData(res.data);
        } catch (err) {
            console.error("Failed to fetch user info", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, [token]);

    // --- Profile Edit Actions ---
    const handleOpenEditModal = () => {
        setEditForm({
            firstName: profileData?.firstName || "",
            lastName: profileData?.lastName || "",
            phoneNumber: profileData?.phoneNumber || "",
            line1: profileData?.address?.line1 || "",
            line2: profileData?.address?.line2 || "",
            city: profileData?.address?.city || "",
            state: profileData?.address?.state || "",
            postalCode: profileData?.address?.postalCode || "",
            country: profileData?.address?.country || ""
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const updatePayload = {
                firstName: editForm.firstName || null,
                lastName: editForm.lastName || null,
                phoneNumber: editForm.phoneNumber || null,
                address: {
                    line1: editForm.line1 || null,
                    line2: editForm.line2 || null,
                    city: editForm.city || null,
                    state: editForm.state || null,
                    postalCode: editForm.postalCode || null,
                    country: editForm.country || null
                }
            };

            await api.put("/Account/profile", updatePayload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Refetch fresh data
            const res = await api.get("/Account/userinfo", {
                headers: { Authorization: `Bearer ${token}` }
            });

            setProfileData(res.data);

            // Sync user safely
            const updatedUser = {
                ...user,
                ...res.data
            };

            localStorage.setItem(
                "user",
                JSON.stringify(updatedUser)
            );

            setUser(updatedUser);

            setIsEditModalOpen(false);
            Swal.fire({ icon: "success", title: "Profile Updated", timer: 2000, showConfirmButton: false });
        } catch (err) {
            Swal.fire({ icon: "error", title: "Update Failed", text: err.response?.data?.message || "Something went wrong" });
        } finally {
            setIsSaving(false);
        }
    };

    // --- Reset Password Actions ---
    const handleOpenResetModal = () => {
        setResetForm({
            email: profileData?.email || "",
            token: "",
            password: ""
        });
        setIsResetPasswordOpen(true);
    };

    const passwordValidations = {
        length: resetForm.password.length >= 12,
        special: /[!@#$%^&*(),.?":{}|<>]/.test(resetForm.password)
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!resetForm.token || !resetForm.password || !passwordValidations.length || !passwordValidations.special) {
            Swal.fire({ icon: "warning", title: "Invalid Input", text: "Please check your token and password requirements." });
            return;
        }

        setResetLoading(true);
        try {
            await api.post("/Account/reset-password", {
                email: resetForm.email,
                token: resetForm.token,
                password: resetForm.password
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Swal.fire({ icon: "success", title: "Success", text: "Password reset successful", timer: 2000, showConfirmButton: false });
            setIsResetPasswordOpen(false);
            setResetForm({ email: "", token: "", password: "" });
        } catch (err) {
            Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || "Failed to reset password" });
        } finally {
            setResetLoading(false);
        }
    };

    // --- Photo Upload Actions ---
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUploadPhoto = async () => {
        if (!selectedImage) return;
        setUploadLoading(true);
        try {
            const formData = new FormData();
            formData.append("Picture", selectedImage);

            await api.post("/Account/picture", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            const res = await api.get("/Account/userinfo", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfileData(res.data);

            // Sync user safely
            const updatedUser = {
                ...user,
                ...res.data
            };

            localStorage.setItem(
                "user",
                JSON.stringify(updatedUser)
            );

            setUser(updatedUser);

            Swal.fire({ icon: "success", title: "Updated", text: "Profile picture updated!", timer: 2000, showConfirmButton: false });
            setIsPhotoModalOpen(false);
            setSelectedImage(null);
            setPreviewUrl(null);
        } catch (err) {
            Swal.fire({ icon: "error", title: "Failed", text: err.response?.data?.message || "Failed to update picture" });
        } finally {
            setUploadLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-[#F6F7F9] min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-[#011749] font-medium">Loading Profile...</div>
            </div>
        );
    }

    if (!profileData) return null;

    const firstName = profileData.firstName || "Not provided";
    const lastName = profileData.lastName || "Not provided";
    const fullName = `${profileData.firstName || ""} ${profileData.lastName || ""}`.trim() || "User Name";
    const email = profileData.email || "Not provided";
    const phone = profileData.phoneNumber || "Not provided";
    const location = profileData.address?.city ? `${profileData.address.city}, ${profileData.address.country || ""}` : "Not provided";
    const role = profileData.roles?.[0] || "Customer";
    const username = profileData.userName ? `@${profileData.userName}` : `@user`;

    const imageUrl = profileData?.personalPicture
        ? `http://petmarket.runasp.net${profileData.personalPicture}?v=${Date.now()}`
        : null;

    const avatar = imageUrl ? (
        <img
            src={imageUrl}
            alt="Avatar"
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
                console.log("Image failed:", imageUrl);
                e.target.style.display = "none";
            }}
        />
    ) : (
        <div className="w-full h-full bg-[#011749] text-white flex items-center justify-center text-3xl font-bold rounded-full">
            {profileData.firstName?.[0]?.toUpperCase() || "U"}
        </div>
    );

    return (
        <div className="bg-[#F6F7F9] min-h-screen pt-[40px] pb-12 px-4 md:px-6 relative">
            <div className="max-w-[1200px] mx-auto space-y-8">

                {/* Hero Card */}
                <div className="bg-white rounded-[32px] p-6 md:p-10 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 relative group">
                        {avatar}
                        <button
                            onClick={() => setIsPhotoModalOpen(true)}
                            className="absolute bottom-1 right-1 bg-[#011749] text-white w-11 h-11 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all z-10"
                        >
                            <FaCamera size={18} />
                        </button>
                    </div>

                    <div className="flex-1 space-y-6 w-full text-center md:text-left">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold text-[#011749]">{fullName}</h1>
                            <p className="text-gray-400 font-medium">{username}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-y border-gray-50 text-sm">
                            <DetailRow icon={<IoMailOutline />} text={email} />
                            <DetailRow icon={<IoCallOutline />} text={phone} />
                            <DetailRow icon={<IoLocationOutline />} text={location} />
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <button
                                onClick={handleOpenEditModal}
                                className="bg-[#011749] text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:opacity-90"
                            >
                                <IoPencilOutline /> Update Personal Info
                            </button>
                            <button className="bg-white text-[#011749] border border-gray-200 px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-50">
                                <IoShareSocialOutline /> Share Profile
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Personal Details */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#01174910] p-2 rounded-lg text-[#011749]"><IoPersonOutline size={20} /></div>
                            <h2 className="text-xl font-bold text-[#011749]">Personal Details</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DetailItem label="First Name" value={firstName} />
                            <DetailItem label="Last Name" value={lastName} />
                            <DetailItem label="Email" value={email} />
                            <DetailItem label="Phone" value={phone} />
                            <DetailItem label="Role" value={role} />
                            <DetailItem label="Member Since" value="June 2024" icon={<IoTimeOutline />} />
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#01174910] p-2 rounded-lg text-[#011749]"><IoShieldCheckmarkOutline size={20} /></div>
                            <h2 className="text-xl font-bold text-[#011749]">Quick Actions</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ActionCard icon={<IoBasketOutline />} title="Orders" description="Track your recent pet shop orders" onClick={() => navigate("/order")} />
                            <ActionCard icon={<IoDocumentTextOutline />} title="Applications" description="Check status of adoption forms" />
                            <ActionCard icon={<IoPawOutline />} title="My Animals" description="View animals you have adopted" onClick={() => navigate("/adoption")} />
                            <ActionCard icon={<IoKeyOutline />} title="Reset Password" description="Update security credentials" onClick={handleOpenResetModal} />
                        </div>
                    </div>
                </div>

                {/* Address Card */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#01174910] p-2 rounded-lg text-[#011749]"><IoLocationOutline size={20} /></div>
                        <h2 className="text-xl font-bold text-[#011749]">Address Details</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <DetailItem label="Address Line 1" value={profileData?.address?.line1 || "Not provided"} full />
                        <DetailItem label="Address Line 2" value={profileData?.address?.line2 || "Not provided"} full />
                        <DetailItem label="City" value={profileData?.address?.city || "Not provided"} />
                        <DetailItem label="State" value={profileData?.address?.state || "Not provided"} />
                        <DetailItem label="Postal Code" value={profileData?.address?.postalCode || "Not provided"} />
                        <DetailItem label="Country" value={profileData?.address?.country || "Not provided"} />
                    </div>
                </div>
            </div>

            {/* EDIT PROFILE MODAL */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>
                    <div className="bg-white rounded-[32px] w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="p-8 pb-4 flex justify-between items-start">
                            <h2 className="text-2xl font-bold text-[#011749]">Edit Profile</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600"><IoCloseOutline size={28} /></button>
                        </div>
                        <form onSubmit={handleUpdateProfile} className="p-8 pt-4 space-y-6 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput label="First Name" value={editForm.firstName} onChange={(v) => setEditForm({ ...editForm, firstName: v })} />
                                <FormInput label="Last Name" value={editForm.lastName} onChange={(v) => setEditForm({ ...editForm, lastName: v })} />
                            </div>
                            <FormInput label="Phone" icon={<IoCallOutline />} value={editForm.phoneNumber} onChange={(v) => setEditForm({ ...editForm, phoneNumber: v })} />
                            <div className="space-y-6 pt-4 border-t border-gray-50">
                                <FormInput label="Address Line 1" value={editForm.line1} onChange={(v) => setEditForm({ ...editForm, line1: v })} />
                                <FormInput label="Address Line 2" value={editForm.line2} onChange={(v) => setEditForm({ ...editForm, line2: v })} />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <FormInput label="City" value={editForm.city} onChange={(v) => setEditForm({ ...editForm, city: v })} />
                                    <FormInput label="Postal Code" value={editForm.postalCode} onChange={(v) => setEditForm({ ...editForm, postalCode: v })} />
                                    <FormInput label="Country" value={editForm.country} onChange={(v) => setEditForm({ ...editForm, country: v })} />
                                </div>
                            </div>
                            <div className="pt-6 flex justify-end gap-4 border-t border-gray-50">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-8 py-3 text-gray-500 font-semibold">Cancel</button>
                                <button type="submit" disabled={isSaving} className="bg-[#011749] text-white px-10 py-3 rounded-xl font-bold disabled:opacity-50">
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* RESET PASSWORD MODAL */}
            {isResetPasswordOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsResetPasswordOpen(false)}></div>
                    <div className="bg-white rounded-[32px] w-full max-w-[500px] relative z-10 shadow-2xl p-8 space-y-6">
                        <div className="flex justify-between items-start">
                            <div className="bg-[#f2f4f7] p-3 rounded-xl text-[#011749]"><IoKeyOutline size={24} /></div>
                            <button onClick={() => setIsResetPasswordOpen(false)} className="text-gray-400 hover:text-gray-600"><IoCloseOutline size={28} /></button>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[#011749]">Reset Password</h2>
                            <p className="text-gray-400 text-sm mt-1">Please enter your new credentials below.</p>
                        </div>
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <FormInput label="Email" value={resetForm.email} onChange={() => { }} icon={<IoMailOutline />} />
                            <FormInput label="Reset Token" value={resetForm.token} onChange={(v) => setResetForm({ ...resetForm, token: v })} icon={<IoShieldCheckmarkOutline />} />
                            <div className="relative">
                                <FormInput label="New Password" type={showPassword ? "text" : "password"} value={resetForm.password} onChange={(v) => setResetForm({ ...resetForm, password: v })} icon={<IoKeyOutline />} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[38px] text-gray-400">
                                    {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                                </button>
                            </div>
                            <div className="bg-[#f8f9fb] p-6 rounded-2xl space-y-3">
                                <ValidationItem label="At least 12 characters" passed={passwordValidations.length} />
                                <ValidationItem label="One specialized character" passed={passwordValidations.special} />
                            </div>
                            <button type="submit" disabled={resetLoading} className="w-full bg-[#011749] text-white py-4 rounded-2xl font-bold shadow-xl disabled:opacity-50">
                                {resetLoading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* PHOTO UPLOAD MODAL */}
            {isPhotoModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsPhotoModalOpen(false)}></div>
                    <div className="bg-white rounded-[32px] w-full max-w-[450px] relative z-10 shadow-2xl p-8 flex flex-col items-center">
                        <div className="w-full flex justify-between items-start mb-6">
                            <h2 className="text-xl font-bold text-[#011749]">Update Profile Picture</h2>
                            <button onClick={() => setIsPhotoModalOpen(false)} className="text-gray-400 hover:text-gray-600"><IoCloseOutline size={28} /></button>
                        </div>

                        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-50 shadow-inner mb-6 bg-gray-50 flex items-center justify-center">
                            {previewUrl ? (
                                <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                            ) : avatar}
                        </div>

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors mb-6"
                        >
                            <IoCloudUploadOutline size={32} className="text-gray-400" />
                            <p className="text-sm font-medium text-gray-400 text-center">
                                <span className="text-[#011749] font-bold">Click to upload</span> or drag and drop<br />
                                JPG, JPEG, or PNG formats
                            </p>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                        </div>

                        <div className="w-full grid grid-cols-2 gap-4">
                            <button onClick={() => setIsPhotoModalOpen(false)} className="py-3 text-gray-500 font-bold border-2 border-transparent hover:bg-gray-50 rounded-xl">Cancel</button>
                            <button
                                onClick={handleUploadPhoto}
                                disabled={!selectedImage || uploadLoading}
                                className="bg-[#011749] text-white py-3 rounded-xl font-bold shadow-lg shadow-[#01174920] disabled:opacity-50"
                            >
                                {uploadLoading ? "Uploading..." : "Save Photo"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const DetailRow = ({ icon, text }) => (
    <div className="flex items-center justify-center md:justify-start gap-3 text-gray-500">
        <span className="text-[#011749]">{icon}</span>
        <span className="truncate">{text}</span>
    </div>
);

const DetailItem = ({ label, value, icon }) => (
    <div className="space-y-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <div className="flex items-center gap-2">
            {icon && <span className="text-[#F8B63D]">{icon}</span>}
            <p className="text-[#011749] font-medium truncate">{value}</p>
        </div>
    </div>
);

const FormInput = ({ label, value, onChange, icon, type = "text" }) => (
    <div className="space-y-1.5 flex-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
        <div className="relative group">
            {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#011749] transition-colors">{icon}</span>}
            <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={`w-full bg-[#f4f7f9] border-2 border-transparent rounded-[16px] py-3.5 px-4 focus:bg-white focus:border-[#01174910] focus:ring-0 text-[#011749] font-medium ${icon ? 'pl-11' : ''}`} />
        </div>
    </div>
);

const ValidationItem = ({ label, passed }) => (
    <div className={`flex items-center gap-3 text-sm font-medium ${passed ? "text-[#10b981]" : "text-gray-400"}`}>
        <IoCheckmarkCircleOutline size={18} />
        <span>{label}</span>
    </div>
);

const ActionCard = ({ icon, title, description, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center text-center p-6 rounded-[24px] border border-gray-100 hover:shadow-lg transition-all">
        <div className="text-2xl text-gray-400 mb-2">{icon}</div>
        <h3 className="font-bold text-[#011749] mb-1">{title}</h3>
        <p className="text-[10px] text-gray-400 leading-tight">{description}</p>
    </button>
);

export default Profile;
