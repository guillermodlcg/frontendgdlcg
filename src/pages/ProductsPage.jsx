import React, { useEffect } from "react";
import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import { IoBagAdd } from "react-icons/io5";

const BC = (size, extra = {}) => ({ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: size, ...extra });
const DM = (size, weight = 400, extra = {}) => ({ fontFamily: "'DM Sans', sans-serif", fontWeight: weight, fontSize: size, ...extra });

function ProductsPage() {
    const { products, getProducts } = useProducts();

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <div style={{ background: "#fafaf8", minHeight: "100vh", padding: "40px 48px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <h1 style={BC("36px", { color: "#0f1f35", margin: 0, letterSpacing: "2px" })}>
                    MIS PRODUCTOS
                </h1>
                <Link
                    to="/add-product"
                    style={{
                        display: "flex", alignItems: "center", gap: 8,
                        background: "#0f1f35", color: "#fff",
                        border: "none", borderRadius: 4,
                        padding: "10px 18px", textDecoration: "none",
                        ...DM(11, 600, { textTransform: "uppercase", letterSpacing: "1.5px" })
                    }}
                >
                    <IoBagAdd size={16} />
                    AGREGAR
                </Link>
            </div>

            {products.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 20px" }}>
                    <p style={DM(13, 400, { color: "#8a9bb0", marginBottom: 16 })}>
                        No hay productos registrados
                    </p>
                    <Link to="/add-product" style={{
                        background: "#0f1f35", color: "#fff",
                        padding: "10px 24px", borderRadius: 4, textDecoration: "none",
                        ...DM(11, 600, { textTransform: "uppercase", letterSpacing: "1.5px" })
                    }}>
                        AGREGAR PRIMER PRODUCTO
                    </Link>
                </div>
            ) : (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: 20
                }}>
                    {products.map((product) => (
                        <ProductCard product={product} key={product._id} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductsPage;
