import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../components/context/AuthContext";
import AnimalForm from "../../components/admin/AnimalForm";
import Spinner from "../../components/Spinner";

const EditFoster = () => {
    const { id } = useParams();
    const { token } = useContext(AuthContext);
    const [animal, setAnimal] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnimal = async () => {
            try {
                const res = await axios.get(`https://petmarket.runasp.net/api/FosterAnimals/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Flexible data parsing to handle different API structures
                const fetchedData = res.data?.data || res.data;
                
                if (fetchedData) {
                    setAnimal(fetchedData);
                } else {
                    console.error("Animal data not found in response:", res.data);
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                if (err.response?.status === 404) {
                    console.warn(`Animal with ID ${id} not found on server.`);
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchAnimal();
    }, [id, token]);

    if (loading) return <div className="h-screen flex items-center justify-center"><Spinner /></div>;
    if (!animal) return <div className="p-8 text-center text-gray-500">Animal not found</div>;

    return (
        <div className="p-6">
            <AnimalForm type="foster" mode="edit" initialData={animal} />
        </div>
    );
};

export default EditFoster;
