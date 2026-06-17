import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../components/context/AuthContext";
import { CartContext } from "../components/context/CartContext";
import { FavoriteContext } from "../components/context/FavoriteContext";
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
    IoCloudUploadOutline,
    IoTrashOutline
} from "react-icons/io5";

import { FaCamera } from "react-icons/fa";

const Profile = () => {
    const { token, user, setUser, logout } = useContext(AuthContext);
    const { setCartItems } = useContext(CartContext);
    const { setFavorites } = useContext(FavoriteContext);
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
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [isDeletingPhoto, setIsDeletingPhoto] = useState(false);
    const [isFetchingPhoto, setIsFetchingPhoto] = useState(false);

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
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [activeTab, setActiveTab] = useState("upload");
    const [photoVersion, setPhotoVersion] = useState(Date.now());

    const [showPassword, setShowPassword] = useState(false);

    const fetchUserInfo = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const res = await api.get("/Account/userinfo", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfileData(res.data);

            // Sync context user
            const updatedUser = {
                ...user,
                ...res.data,
                pictureUrl: res.data.personalPicture // Navbar uses pictureUrl
            };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

        } catch (err) {
            console.error("Failed to fetch user info", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, [token]);

    const fetchCurrentPhoto = async () => {
        if (!token) return;
        setIsFetchingPhoto(true);
        try {
            const res = await api.get("/Account/picture", {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update profileData with fresh picture info
            if (res.data) {
                const picturePath = typeof res.data === 'string'
                    ? res.data
                    : res.data.personalPicture;

                if (picturePath && typeof picturePath === 'string') {
                    const freshInfo = {
                        ...profileData,
                        personalPicture: picturePath
                    };
                    setProfileData(freshInfo);

                    // Sync context
                    const updatedUser = {
                        ...user,
                        pictureUrl: picturePath
                    };
                    setUser(updatedUser);
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                }
            }
        } catch (err) {
            console.error("Failed to fetch photo", err);
        } finally {
            setIsFetchingPhoto(false);
        }
    };

    useEffect(() => {
        if (isPhotoModalOpen && activeTab === "view") {
            fetchCurrentPhoto();
        }
    }, [isPhotoModalOpen, activeTab]);

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
            await fetchUserInfo();

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
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
        });
        setIsResetPasswordOpen(true);
    };

    const passwordValidations = {
        length: resetForm.newPassword.length >= 12,
        special: /[!@#$%^&*(),.?":{}|<>]/.test(resetForm.newPassword)
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        // 1. All fields required
        if (!resetForm.oldPassword || !resetForm.newPassword || !resetForm.confirmPassword) {
            Swal.fire({ icon: "warning", title: "Missing Fields", text: "Please fill in all password fields." });
            return;
        }

        // 2. newPassword === confirmPassword
        if (resetForm.newPassword !== resetForm.confirmPassword) {
            Swal.fire({ icon: "warning", title: "Validation Error", text: "New password and confirmation do not match" });
            return;
        }

        // 3. Complexity validation (keeping existing one)
        if (!passwordValidations.length || !passwordValidations.special) {
            Swal.fire({ icon: "warning", title: "Weak Password", text: "Please meet the password requirements." });
            return;
        }

        setResetLoading(true);
        try {
            await api.post("/Account/forget-password", {
                oldPassword: resetForm.oldPassword,
                newPassword: resetForm.newPassword,
                confirmPassword: resetForm.confirmPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Password updated successfully. Please login again.",
                timer: 3000,
                showConfirmButton: false
            });

            setIsResetPasswordOpen(false);

            // Success Flow: logout, clear states, navigate
            setTimeout(() => {
                logout();
                setCartItems([]);
                setFavorites([]);
                navigate("/login");
            }, 1000);

        } catch (err) {
            if (err.response?.data?.message?.toLowerCase().includes("old password") ||
                err.response?.data?.message === "Old password invalid") {
                Swal.fire({ icon: "warning", title: "Access Denied", text: "Old password is incorrect" });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Update Failed",
                    text: err.response?.data?.message || "Something went wrong while updating password"
                });
            }
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
        setIsUploadingPhoto(true);
        try {
            const formData = new FormData();
            formData.append("Picture", selectedImage);

            await api.post("/Account/picture", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            await fetchUserInfo();

            Swal.fire({ icon: "success", title: "Updated", text: "Profile picture updated!", timer: 2000, showConfirmButton: false });
            setIsPhotoModalOpen(false);
            // Reset modal states
            setSelectedImage(null);
            setPreviewUrl(null);
            setPhotoVersion(Date.now());
            setActiveTab("upload");
        } catch (err) {
            Swal.fire({ icon: "error", title: "Failed", text: err.response?.data?.message || "Failed to update picture" });
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    const handleDeletePhoto = async () => {
        setIsDeletingPhoto(true);
        try {
            await api.delete("/Account/picture", {
                headers: { Authorization: `Bearer ${token}` }
            });

            await fetchUserInfo();

            setPhotoVersion(Date.now());
            // Switch to view tab as requested
            setActiveTab("view");
        } catch (err) {
            Swal.fire({ icon: "error", title: "Failed", text: err.response?.data?.message || "Failed to delete picture" });
        } finally {
            setIsDeletingPhoto(false);
        }
    };

    const handleClosePhotoModal = () => {
        setIsPhotoModalOpen(false);
        setSelectedImage(null);
        setPreviewUrl(null);
        setActiveTab("upload");
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

    const imageUrl = (profileData?.personalPicture && typeof profileData.personalPicture === "string")
        ? (profileData.personalPicture.startsWith("http")
            ? profileData.personalPicture
            : `https://petmarket.runasp.net${profileData.personalPicture}`) +
        `${profileData.personalPicture.includes('?') ? '&' : '?'}v=${photoVersion}`
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
                            <ActionCard icon={<IoBasketOutline />} title="Orders" description="Track your recent pet shop orders" onClick={() => navigate("/profile/orders")} />
                            <ActionCard icon={<IoDocumentTextOutline />} title="Applications" description="Check status of adoption forms" onClick={() => navigate("/profile/applications")} />
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
                            <div className="relative">
                                <FormInput
                                    label="Old Password"
                                    type={showPassword ? "text" : "password"}
                                    value={resetForm.oldPassword}
                                    onChange={(v) => setResetForm({ ...resetForm, oldPassword: v })}
                                    icon={<IoKeyOutline />}
                                />
                            </div>
                            <div className="relative">
                                <FormInput
                                    label="New Password"
                                    type={showPassword ? "text" : "password"}
                                    value={resetForm.newPassword}
                                    onChange={(v) => setResetForm({ ...resetForm, newPassword: v })}
                                    icon={<IoShieldCheckmarkOutline />}
                                />
                            </div>
                            <div className="relative">
                                <FormInput
                                    label="Confirm New Password"
                                    type={showPassword ? "text" : "password"}
                                    value={resetForm.confirmPassword}
                                    onChange={(v) => setResetForm({ ...resetForm, confirmPassword: v })}
                                    icon={<IoKeyOutline />}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-[38px] text-gray-400 hover:text-[#011749] transition-colors"
                                >
                                    {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                                </button>
                            </div>

                            <div className="bg-[#f8f9fb] p-6 rounded-2xl space-y-3">
                                <ValidationItem label="At least 12 characters" passed={passwordValidations.length} />
                                <ValidationItem label="One specialized character" passed={passwordValidations.special} />
                            </div>

                            <button
                                type="submit"
                                disabled={resetLoading}
                                className="w-full bg-[#011749] text-white py-4 rounded-2xl font-bold shadow-xl disabled:opacity-50 hover:opacity-90 transition-all active:scale-[0.98]"
                            >
                                {resetLoading ? "Updating..." : "Update Password"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* PHOTO UPLOAD MODAL (ENHANCED) */}
            {isPhotoModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClosePhotoModal}></div>
                    <div className="bg-white rounded-[32px] w-full max-w-[700px] relative z-10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

                        {/* Fixed Header */}
                        <div className="p-8 pb-4 flex justify-between items-start shrink-0">
                            <div>
                                <h2 className="text-2xl font-bold text-[#011749]">Update Profile Picture</h2>
                                <p className="text-gray-400 text-sm mt-1">Upload a new photo, view your current picture, or remove it.</p>
                            </div>
                            <button onClick={handleClosePhotoModal} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
                                <IoCloseOutline size={28} />
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="flex-1 overflow-y-auto px-8 py-2 custom-scrollbar flex flex-col items-center">

                            {/* Avatar Preview */}
                            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-50 shadow-inner mb-8 bg-gray-50 flex items-center justify-center shrink-0">
                                {previewUrl ? (
                                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                ) : (profileData?.personalPicture && typeof profileData.personalPicture === "string") ? (
                                    <img
                                        src={(profileData.personalPicture.startsWith("http")
                                            ? profileData.personalPicture
                                            : `https://petmarket.runasp.net${profileData.personalPicture}`) +
                                            `${profileData.personalPicture.includes('?') ? '&' : '?'}v=${photoVersion}`}
                                        className="w-full h-full object-cover"
                                        alt="Current Profile"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[#011749] text-white flex items-center justify-center text-5xl font-bold">
                                        {profileData.firstName?.[0]?.toUpperCase() || "U"}
                                    </div>
                                )}
                            </div>

                            {/* Tab Switcher (Applications Style Segmented) */}
                            <div className="w-full flex p-1 bg-[#F6F7F9] rounded-2xl mb-8 border border-gray-100 shrink-0">
                                {[
                                    { id: "upload", label: "Upload Photo", icon: <IoCloudUploadOutline /> },
                                    { id: "view", label: "View Photo", icon: <IoEyeOutline /> },
                                    { id: "delete", label: "Delete Photo", icon: <IoTrashOutline className="text-red-500" /> }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === tab.id
                                            ? "bg-[#011749] text-white shadow-lg"
                                            : "text-gray-400 hover:text-gray-600"
                                            }`}
                                    >
                                        <span className={activeTab === tab.id ? "text-white" : tab.id === "delete" ? "text-red-500" : ""}>
                                            {tab.id === "delete" && activeTab !== "delete" ? <IoTrashOutline /> : tab.icon}
                                        </span>
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="w-full flex-1 pb-6 py-4">
                                {activeTab === "upload" && (
                                    <div
                                        onClick={() => !isUploadingPhoto && fileInputRef.current?.click()}
                                        className={`w-full border-2 border-dashed rounded-3xl p-10 flex flex-col items-center gap-4 cursor-pointer transition-all ${isUploadingPhoto ? "opacity-50 cursor-not-allowed" : "border-gray-200 hover:bg-gray-50 hover:border-[#011749]"
                                            }`}
                                    >
                                        <IoCloudUploadOutline size={40} className="text-gray-300" />
                                        <div className="text-center">
                                            <p className="text-base font-bold text-[#011749]">Click to upload <span className="font-normal text-gray-400">or drag and drop</span></p>
                                            <p className="text-xs text-gray-400 mt-1">JPG, JPEG, or PNG formats</p>
                                        </div>
                                        <button className="bg-[#011749] text-white px-6 py-2 rounded-xl text-sm font-bold mt-2">Choose File</button>
                                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} disabled={isUploadingPhoto} />
                                    </div>
                                )}

                                {activeTab === "view" && (
                                    <div className="w-full flex flex-col items-center gap-6">
                                        {isFetchingPhoto ? (
                                            <div className="animate-pulse flex flex-col items-center gap-2">
                                                <div className="w-12 h-12 bg-gray-100 rounded-full" />
                                                <p className="text-xs text-gray-400">Loading your photo...</p>
                                            </div>
                                        ) : profileData?.personalPicture ? (
                                            <div className="w-full space-y-6 text-center">
                                                <p className="text-sm font-medium text-gray-500 italic">Your profile picture is visible to other users.</p>
                                                <div className="flex gap-4">
                                                    <button onClick={() => setActiveTab("upload")} className="flex-1 py-3 text-[#011749] font-bold border-2 border-gray-100 rounded-2xl hover:bg-gray-50 transition-all text-sm">Replace Photo</button>
                                                    <button onClick={() => setActiveTab("delete")} className="flex-1 py-3 text-red-500 font-bold border-2 border-red-50 rounded-2xl hover:bg-red-50 transition-all text-sm">Delete Photo</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center space-y-2">
                                                <p className="text-xl font-bold text-[#011749]">No profile picture available</p>
                                                <p className="text-sm text-gray-400">Upload a photo to help others recognize you.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === "delete" && (
                                    <div className="w-full bg-red-50/30 border border-red-100 rounded-3xl p-8 flex flex-col items-center text-center space-y-4">
                                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                                            <IoTrashOutline size={32} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-[#011749]">Remove current photo?</h4>
                                            <p className="text-sm text-gray-500 mt-1">You can upload a new one anytime.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sticky Footer */}
                        <div className="p-8 pt-6 border-t border-gray-50 sticky bottom-0 bg-white grid grid-cols-2 gap-4 shrink-0">
                            <button
                                onClick={handleClosePhotoModal}
                                className="py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-all"
                            >
                                Cancel
                            </button>

                            {activeTab === "upload" && (
                                <button
                                    onClick={handleUploadPhoto}
                                    disabled={!selectedImage || isUploadingPhoto}
                                    className="bg-[#011749] text-white py-4 rounded-2xl font-bold shadow-xl shadow-[#01174920] disabled:opacity-50  transition-all"
                                >
                                    {isUploadingPhoto ? "Uploading..." : "Save Photo"}
                                </button>
                            )}

                            {activeTab === "delete" && (
                                <button
                                    onClick={handleDeletePhoto}
                                    disabled={!profileData?.personalPicture || isDeletingPhoto}
                                    className="bg-red-500 text-white py-4 rounded-2xl font-bold shadow-xl shadow-red-200 disabled:opacity-50 transition-all"
                                >
                                    {isDeletingPhoto ? "Deleting..." : "Delete Photo"}
                                </button>
                            )}

                            {activeTab === "view" && (
                                <button
                                    onClick={handleClosePhotoModal}
                                    className="bg-[#011749] text-white py-4 rounded-2xl font-bold shadow-xl shadow-[#01174920] transition-all"
                                >
                                    Close Modal
                                </button>
                            )}
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
