import React from "react";
import AnimalForm from "../../components/admin/AnimalForm";

const AddFoster = () => {
    return (
        <div className="p-6">
            <AnimalForm type="foster" mode="create" />
        </div>
    );
};

export default AddFoster;
