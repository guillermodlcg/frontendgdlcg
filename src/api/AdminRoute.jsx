import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
    const { loading, isAuthenticated, isAdmin } = useAuth();

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy-900"></div>
        </div>
    );
    
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!isAdmin) return <Navigate to="/orders" replace />;

    return <Outlet />;
};

export default AdminRoute;