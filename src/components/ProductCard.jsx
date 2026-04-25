import React, { useState, useEffect, useRef } from "react";
import { useProducts } from "../context/ProductContext";
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from "react-router-dom";
import { IoTrashBinSharp, IoPencilSharp } from "react-icons/io5";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";
import { addFavoriteRequest, removeFavoriteRequest, getFavoritesRequest } from "../api/auth";

const BC = (size, extra = {}) => ({ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: size, ...extra });
const DM = (size, weight = 400, extra = {}) => ({ fontFamily: "'DM Sans', sans-serif", fontWeight: weight, fontSize: size, ...extra });

function ProductCard({ product }) {
    const { deleteProduct, addToCart, incProduct, cart } = useProducts();
    const { isAdmin, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const intervalRef = useRef(null);

    const images = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : product.image
            ? [product.image]
            : [];

    useEffect(() => {
        if (isAuthenticated && !isAdmin) checkIfFavorite();
    }, [isAuthenticated, isAdmin]);

    const checkIfFavorite = async () => {
        try {
            const response = await getFavoritesRequest();
            setIsFavorite(response.data.some(fav => fav._id === product._id));
        } catch (error) {
            console.error("Error al verificar favoritos:", error);
        }
    };

    const toggleFavorite = async () => {
        try {
            if (isFavorite) {
                await removeFavoriteRequest(product._id);
                setIsFavorite(false);
                toast.success("Quitado de favoritos");
            } else {
                await addFavoriteRequest(product._id);
                setIsFavorite(true);
                toast.success("Agregado a favoritos");
            }
        } catch (error) {
            toast.error(error.response?.data?.message?.[0] || "Error al actualizar favoritos");
        }
    };

    const addingProduct = (product) => {
        if (!isAuthenticated) {
            localStorage.setItem('pendingCartProduct', JSON.stringify(product));
            navigate('/login');
            return;
        }
        const existingProduct = cart.find((cartItem) => cartItem._id === product._id);
        if (!existingProduct) {
            addToCart(product);
            toast.success("Producto agregado al carrito");
        } else {
            if (existingProduct.toSell >= existingProduct.quantity) {
                toast.warn('Stock máximo: ' + existingProduct.quantity);
                return;
            }
            incProduct(product._id);
            toast.success("Producto agregado al carrito");
        }
    };

    return (
        <div
            onMouseEnter={() => {
                setHovered(true);
                if (images.length > 1) {
                    intervalRef.current = setInterval(() => {
                        setCurrentImageIndex(prev => (prev + 1) % images.length);
                    }, 800);
                }
            }}
            onMouseLeave={() => {
                setHovered(false);
                clearInterval(intervalRef.current);
                setCurrentImageIndex(0);
            }}
            style={{
                background: '#ffffff',
                border: '0.5px solid #B5D4F4',
                borderRadius: 12,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                boxShadow: hovered ? '0 4px 16px rgba(4,44,83,0.10)' : '0 1px 4px rgba(4,44,83,0.05)',
                transform: hovered ? 'translateY(-4px)' : 'translateY(0)'
            }}
        >
            {/* Favorito */}
            {isAuthenticated && !isAdmin && (
                <button onClick={toggleFavorite} style={{
                    position: 'absolute', top: 10, right: 10, zIndex: 10,
                    width: 32, height: 32, borderRadius: '50%',
                    background: '#fff', border: '0.5px solid #B5D4F4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', padding: 6
                }}>
                    {isFavorite ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#185FA5" stroke="#185FA5" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    )}
                </button>
            )}

            {/* Imagen */}
            <div style={{width: '100%', height: 220, overflow: 'hidden', borderRadius: '12px 12px 0 0', position: 'relative'}}>
                <img src={images[currentImageIndex] || ''} alt={product.name}
                    style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s ease'}} />
                {images.length > 1 && (
                    <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4 }}>
                        {images.map((_, i) => (
                            <div key={i} style={{
                                width: i === currentImageIndex ? 16 : 6,
                                height: 6, borderRadius: 3,
                                background: i === currentImageIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                                transition: 'all 0.3s ease'
                            }} />
                        ))}
                    </div>
                )}
            </div>

            {/* Info */}
            <div style={{padding: '12px 14px', display: 'flex', flexDirection: 'column', flex: 1}}>
                <p style={DM(10, 500, { letterSpacing: 3, color: '#185FA5', textTransform: 'uppercase', marginBottom: 4 })}>
                    {product.categoria}
                </p>
                <h3 style={DM(14, 500, { color: '#111', marginBottom: 6, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.4rem' })}>
                    {product.name}
                </h3>
                <p style={DM(16, 500, { color: '#042C53', marginBottom: 4 })}>
                    ${product.price.toLocaleString('es-MX')}
                </p>
                <p style={DM(11, 400, { color: '#888', marginBottom: 12 })}>
                    Stock: {product.quantity}
                </p>

                {isAdmin ? (
                    <div style={{display: 'flex', gap: 8, marginTop: 'auto'}}>
                        <Tooltip title="Eliminar">
                            <button onClick={() => deleteProduct(product._id)}
                                style={{width: 36, height: 36, borderRadius: 6, background: 'rgba(239,68,68,0.08)', border: '0.5px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0}}>
                                <IoTrashBinSharp size={14} color="#ef4444" />
                            </button>
                        </Tooltip>
                        <Tooltip title="Editar">
                            <Link to={`/products/${product._id}`}
                                style={{flex: 1, height: 36, borderRadius: 6, background: '#f0f5fb', border: '0.5px solid #B5D4F4', color: '#042C53', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, textDecoration: 'none', ...DM(12, 500)}}>
                                <IoPencilSharp size={12} />
                                Editar
                            </Link>
                        </Tooltip>
                    </div>
                ) : (
                    <button onClick={() => addingProduct(product)}
                        style={{
                            background: '#042C53', color: '#fff',
                            ...DM(11, 500, { letterSpacing: 2, textTransform: 'uppercase' }),
                            border: 'none', borderRadius: '0 0 12px 12px',
                            padding: 12, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            margin: '0 -14px -12px -14px', width: 'calc(100% + 28px)',
                            transition: 'background 0.2s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#185FA5'}
                        onMouseLeave={e => e.currentTarget.style.background = '#042C53'}
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                        AGREGAR
                    </button>
                )}
            </div>
        </div>
    );
}

export default ProductCard;
