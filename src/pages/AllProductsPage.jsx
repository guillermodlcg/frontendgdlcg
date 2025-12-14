import React, { useEffect, useState } from "react";
import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import { IoFunnel } from "react-icons/io5";

function AllProductsPage() {
    const { products, getAllProducts } = useProducts();
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        getAllProducts();
    }, []);

    if (products.length === 0)
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl text-gray-600">No hay productos para listar</h1>
            </div>
        )

    return (
        <div className="bg-white min-h-screen">
            {/* Breadcrumb */}
            <div className="border-b border-gray-200 py-4">
                <div className="container mx-auto px-6">
                    <p className="text-xs tracking-wider text-gray-600">
                        INICIO / <span className="text-black">PRODUCTOS</span>
                    </p>
                </div>
            </div>

            {/* Title */}
            <div className="py-12">
                <h1 className="text-5xl text-center tracking-wider" style={{fontFamily: 'Cormorant Garamond', fontWeight: 400}}>
                    PRODUCTOS
                </h1>
            </div>

            {/* Filters & Sort Bar */}
            <div className="border-b border-gray-200 py-4">
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <button className="flex items-center gap-2 text-sm tracking-wider hover:opacity-60 transition-opacity">
                        <IoFunnel size={16} />
                        FILTROS
                    </button>
                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="text-sm tracking-wider border-none bg-transparent focus:outline-none cursor-pointer"
                    >
                        <option value="newest">MÁS RECIENTES</option>
                        <option value="price-low">PRECIO: MENOR A MAYOR</option>
                        <option value="price-high">PRECIO: MAYOR A MENOR</option>
                        <option value="name">NOMBRE A-Z</option>
                    </select>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard product={product} key={product._id} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AllProductsPage