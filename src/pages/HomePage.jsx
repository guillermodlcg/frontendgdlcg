import React from "react";
import { Link } from "react-router-dom";
import { IoCart, IoShirt, IoSparkles, IoCheckmarkCircle } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";

function HomePage() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Hero Section - Minimalista */}
            <section className="relative py-24 md:py-32 min-h-[80vh] flex items-center bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-6 w-full">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-6xl md:text-8xl lg:text-9xl mb-6 text-gray-900 dark:text-white" style={{fontFamily: 'Cormorant Garamond', fontWeight: 300, letterSpacing: '0.15em'}}>
                            OLDCHICK
                        </h1>
                        <p className="text-xs md:text-sm tracking-widest mb-6 text-gray-600 dark:text-gray-400" style={{letterSpacing: '0.2em'}}>
                            COLECCIÓN PRIMAVERA 2025
                        </p>
                        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto px-4" style={{lineHeight: '1.9'}}>
                            Elegancia atemporal en cada prenda. Descubre nuestra exclusiva colección de ropa 
                            diseñada para realzar tu estilo único.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 px-4">
                            {!isAuthenticated ? (
                                <>
                                    <Link
                                        to="/register"
                                        className="btn-primary px-8 md:px-12 py-3 md:py-4 text-sm rounded-none inline-block"
                                    >
                                        COMPRAR AHORA
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="px-8 md:px-12 py-3 md:py-4 border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all inline-block rounded-none"
                                        style={{fontSize: '0.875rem', letterSpacing: '0.08em', fontWeight: 500}}
                                    >
                                        INICIAR SESIÓN
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    to="/getallproducts"
                                    className="btn-primary px-8 md:px-12 py-3 md:py-4 flex items-center justify-center gap-2 text-sm rounded-none"
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
            <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl text-center mb-12 md:mb-16 text-gray-900 dark:text-white" style={{fontFamily: 'Cormorant Garamond', fontWeight: 400, letterSpacing: '0.1em'}}>
                        CATEGORÍAS
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto px-4">
                        {[
                            {name: 'VESTIDOS', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', category: 'vestidos'},
                            {name: 'BLUSAS', img: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400', category: 'blusas'},
                            {name: 'PANTALONES', img: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400', category: 'pantalones'},
                            {name: 'ABRIGOS', img: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400', category: 'abrigos'},
                            {name: 'FALDAS', img: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400', category: 'faldas'},
                            {name: 'TRAJES', img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400', category: 'trajes'},
                            {name: 'ACCESORIOS', img: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400', category: 'accesorios'}
                        ].map((category, index) => (
                            <Link
                                key={index}
                                to={`/getallproducts?categoria=${category.category}`}
                                className="group relative overflow-hidden aspect-[3/4] fashion-card rounded-none"
                            >
                                <img 
                                    src={category.img} 
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-300 flex items-end justify-center pb-8">
                                    <span className="text-white text-xs md:text-sm tracking-widest font-semibold drop-shadow-lg">{category.name}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features - Minimalista */}
            <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto text-center px-4">
                        <div>
                            <IoShirt className="text-4xl mx-auto mb-4 text-gray-900 dark:text-white" />
                            <h3 className="text-lg mb-3 text-gray-900 dark:text-white" style={{fontFamily: 'Cormorant Garamond', fontWeight: 500, letterSpacing: '0.05em'}}>
                                Diseños Únicos
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400" style={{lineHeight: '1.7'}}>
                                Prendas exclusivas que realzan tu elegancia
                            </p>
                        </div>
                        <div>
                            <IoSparkles className="text-4xl mx-auto mb-4 text-gray-900 dark:text-white" />
                            <h3 className="text-lg mb-3 text-gray-900 dark:text-white" style={{fontFamily: 'Cormorant Garamond', fontWeight: 500, letterSpacing: '0.05em'}}>
                                Calidad Premium
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400" style={{lineHeight: '1.7'}}>
                                Materiales cuidadosamente seleccionados
                            </p>
                        </div>
                        <div>
                            <IoCheckmarkCircle className="text-4xl mx-auto mb-4 text-gray-900 dark:text-white" />
                            <h3 className="text-lg mb-3 text-gray-900 dark:text-white" style={{fontFamily: 'Cormorant Garamond', fontWeight: 500, letterSpacing: '0.05em'}}>
                                Envío Gratuito
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400" style={{lineHeight: '1.7'}}>
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