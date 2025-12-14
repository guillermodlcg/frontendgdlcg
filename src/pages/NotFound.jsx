import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NotFound() {
    const { isAdmin, isLoading } = useAuth();
    if (isLoading) return null;

    return (
        <Navigate
            to={isAdmin ? "/products" : "/getallproducts"}
            replace
        />
    );
}

export default NotFound