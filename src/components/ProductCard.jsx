import React, { useState, useEffect } from "react";
import { useProducts } from "../context/ProductContext";
import { useAuth } from '../context/AuthContext';
import { Link } from "react-router-dom";
import { IoTrashBinSharp, IoPencilSharp, IoBagAddSharp, IoHeartOutline, IoHeart } from "react-icons/io5";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";
import { addFavoriteRequest, removeFavoriteRequest, getFavoritesRequest } from "../api/auth";

function ProductCard({ product }) {
    const { deleteProduct, addToCart, incProduct, cart } = useProducts();
    const { isAdmin, isAuthenticated } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (isAuthenticated && !isAdmin) {
            checkIfFavorite();
        }
    }, [isAuthenticated, isAdmin]);

    const checkIfFavorite = async () => {
        try {
            const response = await getFavoritesRequest();
            const favorites = response.data;
            setIsFavorite(favorites.some(fav => fav._id === product._id));
        } catch (error) {
            console.error("Error al verificar favoritos:", error);
        }
    };

    const toggleFavorite = async () => {
        try {
            if (isFavorite) {
                await removeFavoriteRequest(product._id);
                setIsFavorite(false);
                toast.success("Producto quitado de favoritos");
            } else {
                await addFavoriteRequest(product._id);
                setIsFavorite(true);
                toast.success("Producto agregado a favoritos");
            }
        } catch (error) {
            console.error("Error al actualizar favoritos:", error);
            toast.error(error.response?.data?.message?.[0] || "Error al actualizar favoritos");
        }
    };

    const addingProduct = (product) => {
        const existingProduct = cart.find((cartItem) => cartItem._id === product._id);

        if (!existingProduct) {
            addToCart(product);
            toast.success("Producto agregado al carrito");
        } else {
            if (existingProduct.toSell >= existingProduct.quantity) {
                toast.warn('Ha alcanzado el máximo de ' + existingProduct.quantity + ' productos en stock');
                return;
            } else {
                incProduct(product._id);
                toast.success("Producto agregado al carrito")
            }
        }
    };

    return (
        <div className="fashion-card group relative">
            {/* Badge de descuento (si aplica) */}
            {product.discount && (
                <div className="absolute top-3 left-3 z-10 discount-badge">
                    {product.discount}% OFF
                </div>
            )}

            {/* Botón de favorito - Solo visible para usuarios autenticados no admin */}
            {isAuthenticated && !isAdmin && (
                <button
                    onClick={toggleFavorite}
                    className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full hover:bg-gray-100 transition-all shadow-md"
                >
                    {isFavorite ? (
                        <IoHeart size={20} className="text-red-500" />
                    ) : (
                        <IoHeartOutline size={20} className="text-gray-700" />
                    )}
                </button>
            )}

            {/* Imagen del producto */}
            <Link to={isAdmin ? `/products/${product._id}` : '#'} className="block">
                <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
            </Link>

            {/* Info del producto */}
            <div className="p-4">
                <h3 className="text-sm tracking-wide mb-2 line-clamp-2" style={{ fontWeight: 500 }}>
                    {product.name}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                    {product.discount ? (
                        <>
                            <span className="text-sm font-medium">${(product.price * (1 - product.discount / 100)).toFixed(2)}</span>
                            <span className="text-sm text-gray-400 line-through">${product.price}</span>
                        </>
                    ) : (
                        <span className="text-sm font-medium">${product.price}</span>
                    )}
                </div>

                <p className="text-xs text-gray-500 mb-3">Stock: {product.quantity}</p>

                {/* Botones de admin o usuario */}
                {isAdmin ? (
                    <div className="flex gap-2">
                        <Tooltip title="Eliminar">
                            <button
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded transition-colors text-sm"
                                onClick={() => deleteProduct(product._id)}
                            >
                                <IoTrashBinSharp className="mx-auto" />
                            </button>
                        </Tooltip>
                        <Tooltip title="Editar">
                            <Link
                                to={`/products/${product._id}`}
                                className="flex-1 bg-black hover:bg-gray-800 text-white py-2 rounded transition-colors flex items-center justify-center text-sm"
                            >
                                <IoPencilSharp />
                            </Link>
                        </Tooltip>
                    </div>
                ) : (
                    <Tooltip title="Agregar al carrito">
                        <button
                            className="w-full btn-primary py-2 text-xs flex items-center justify-center gap-2"
                            onClick={() => addingProduct(product)}
                        >
                            <IoBagAddSharp size={16} />
                            AGREGAR AL CARRITO
                        </button>
                    </Tooltip>
                )}
            </div>
        </div>
    )
}

export default ProductCard