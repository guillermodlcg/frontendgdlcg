import React from "react";
import { Link } from "react-router-dom";
import { IoCart, IoShirt, IoSparkles, IoCheckmarkCircle } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";

function HomePage() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Minimalista */}
            <section className="relative py-32" style={{backgroundColor: '#f5f5f0'}}>
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-7xl md:text-8xl mb-6" style={{fontFamily: 'Cormorant Garamond', fontWeight: 300, letterSpacing: '0.15em', color: '#1a1a1a'}}>
                            OLDCHICK
                        </h1>
                        <p className="text-sm tracking-widest mb-4" style={{color: '#666', letterSpacing: '0.2em'}}>
                            COLECCIÓN PRIMAVERA 2025
                        </p>
                        <p className="text-base text-gray-600 mb-12 max-w-xl mx-auto" style={{lineHeight: '1.8'}}>
                            Elegancia atemporal en cada prenda. Descubre nuestra exclusiva colección de ropa 
                            diseñada para realzar tu estilo único.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {!isAuthenticated ? (
                                <>
                                    <Link
                                        to="/register"
                                        className="btn-primary px-10 py-3"
                                    >
                                        COMPRAR AHORA
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="px-10 py-3 border border-gray-900 hover:bg-gray-900 hover:text-white transition-all"
                                        style={{fontSize: '0.875rem', letterSpacing: '0.08em', fontWeight: 500}}
                                    >
                                        INICIAR SESIÓN
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    to="/getallproducts"
                                    className="btn-primary px-10 py-3 flex items-center gap-2"
                                >
                                    <IoCart />
                                    VER COLECCIÓN
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Grid - Estilo JULIO */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl text-center mb-16" style={{fontFamily: 'Cormorant Garamond', fontWeight: 400, letterSpacing: '0.1em'}}>
                        CATEGORÍAS
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {[
                            {name: 'VESTIDOS', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'},
                            {name: 'BLUSAS', img: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400'},
                            {name: 'PANTALONES', img: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400'},
                            {name: 'ABRIGOS', img: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400'},
                            {name: 'FALDAS', img: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400'},
                            {name: 'JEANS', img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400'},
                            {name: 'BLAZERS', img: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400'},
                            {name: 'ACCESORIOS', img: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400'}
                        ].map((category, index) => (
                            <Link
                                key={index}
                                to="/getallproducts"
                                className="group relative overflow-hidden aspect-[3/4] fashion-card"
                            >
                                <img 
                                    src={category.img} 
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-end justify-center pb-6">
                                    <span className="text-white text-sm tracking-widest font-medium">{category.name}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features - Minimalista */}
            <section className="py-20" style={{backgroundColor: '#f5f5f0'}}>
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto text-center">
                        <div>
                            <IoShirt className="text-4xl mx-auto mb-4" style={{color: '#1a1a1a'}} />
                            <h3 className="text-lg mb-3" style={{fontFamily: 'Cormorant Garamond', fontWeight: 500, letterSpacing: '0.05em'}}>
                                Diseños Únicos
                            </h3>
                            <p className="text-sm text-gray-600" style={{lineHeight: '1.7'}}>
                                Prendas exclusivas que realzan tu elegancia
                            </p>
                        </div>
                        <div>
                            <IoSparkles className="text-4xl mx-auto mb-4" style={{color: '#1a1a1a'}} />
                            <h3 className="text-lg mb-3" style={{fontFamily: 'Cormorant Garamond', fontWeight: 500, letterSpacing: '0.05em'}}>
                                Calidad Premium
                            </h3>
                            <p className="text-sm text-gray-600" style={{lineHeight: '1.7'}}>
                                Materiales cuidadosamente seleccionados
                            </p>
                        </div>
                        <div>
                            <IoCheckmarkCircle className="text-4xl mx-auto mb-4" style={{color: '#1a1a1a'}} />
                            <h3 className="text-lg mb-3" style={{fontFamily: 'Cormorant Garamond', fontWeight: 500, letterSpacing: '0.05em'}}>
                                Envío Gratuito
                            </h3>
                            <p className="text-sm text-gray-600" style={{lineHeight: '1.7'}}>
                                En compras superiores a $1000 MXN
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;