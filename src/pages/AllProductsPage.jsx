import React, { useEffect, useState } from "react";
import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useSearchParams } from "react-router-dom";

const CATEGORIAS = [
    { value: 'vestidos', label: 'Vestidos' },
    { value: 'blusas', label: 'Blusas' },
    { value: 'pantalones', label: 'Pantalones' },
    { value: 'faldas', label: 'Faldas' },
    { value: 'trajes', label: 'Trajes' },
    { value: 'abrigos', label: 'Abrigos' },
    { value: 'accesorios', label: 'Accesorios' }
];

const TALLAS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const RANGOS_PRECIO = [
    { value: '0-500', label: '$0-$500' },
    { value: '500-1000', label: '$500-$1000' },
    { value: '1000-2000', label: '$1000-$2000' },
    { value: '2000-5000', label: '$2000-$5000' },
    { value: '5000+', label: '$5000+' }
];

function AllProductsPage() {
    const { products, getAllProducts } = useProducts();
    const [searchParams, setSearchParams] = useSearchParams();
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(false);
    const [showFiltersSidebar, setShowFiltersSidebar] = useState(true); // Para desktop
    
    // Estados de filtros
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTallas, setSelectedTallas] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState('');
    const [availableColors, setAvailableColors] = useState([]);

    useEffect(() => {
        getAllProducts();
    }, []);

    // Cargar categoría de URL
    useEffect(() => {
        const categoria = searchParams.get('categoria');
        if (categoria && CATEGORIAS.some(cat => cat.value === categoria)) {
            setSelectedCategories([categoria]);
        }
    }, [searchParams]);

    // Extraer colores únicos de los productos
    useEffect(() => {
        if (products.length > 0) {
            const colorsSet = new Set();
            products.forEach(product => {
                if (product.colores && Array.isArray(product.colores)) {
                    product.colores.forEach(color => {
                        if (color && color.trim()) {
                            colorsSet.add(color.trim().toLowerCase());
                        }
                    });
                }
            });
            setAvailableColors(Array.from(colorsSet).sort());
        }
    }, [products]);

    // Filtrar productos
    const filteredProducts = products.filter(product => {
        // Filtro por categoría
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.categoria)) {
            return false;
        }
        
        // Filtro por talla
        if (selectedTallas.length > 0) {
            const hasMatchingSize = product.tallas?.some(talla => selectedTallas.includes(talla));
            if (!hasMatchingSize) return false;
        }
        
        // Filtro por color
        if (selectedColors.length > 0) {
            const hasMatchingColor = product.colores?.some(color => 
                selectedColors.includes(color.trim().toLowerCase())
            );
            if (!hasMatchingColor) return false;
        }

        // Filtro por rango de precio
        if (selectedPriceRange) {
            const price = product.price;
            switch (selectedPriceRange) {
                case '0-500':
                    if (price > 500) return false;
                    break;
                case '500-1000':
                    if (price < 500 || price > 1000) return false;
                    break;
                case '1000-2000':
                    if (price < 1000 || price > 2000) return false;
                    break;
                case '2000-5000':
                    if (price < 2000 || price > 5000) return false;
                    break;
                case '5000+':
                    if (price < 5000) return false;
                    break;
            }
        }
        
        return true;
    });

    // Ordenar productos
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'name':
                return a.name.localeCompare(b.name);
            case 'newest':
            default:
                return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });

    const toggleCategory = (category) => {
        setSelectedCategories(prev => 
            prev.includes(category) 
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const toggleTalla = (talla) => {
        setSelectedTallas(prev => 
            prev.includes(talla) 
                ? prev.filter(t => t !== talla)
                : [...prev, talla]
        );
    };

    const toggleColor = (color) => {
        setSelectedColors(prev => 
            prev.includes(color) 
                ? prev.filter(c => c !== color)
                : [...prev, color]
        );
    };

    const clearAllFilters = () => {
        setSelectedCategories([]);
        setSelectedTallas([]);
        setSelectedColors([]);
        setSelectedPriceRange('');
        setSortBy('newest');
        setSearchParams({});
    };

    const applyFilters = () => {
        setShowFilters(false);
    };

    const activeFiltersCount = selectedCategories.length + selectedTallas.length + selectedColors.length + (selectedPriceRange ? 1 : 0);

    if (products.length === 0)
        return (
            <div className="text-center py-20 bg-white dark:bg-gray-900 min-h-screen">
                <h1 className="text-2xl text-gray-600 dark:text-gray-400">No hay productos para listar</h1>
            </div>
        )

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen">
            {/* Breadcrumb */}
            <div className="border-b border-gray-200 dark:border-gray-700 py-4 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6">
                    <p className="text-xs tracking-widest text-gray-500 dark:text-gray-400 uppercase">
                        INICIO / <span className="text-gray-900 dark:text-white font-medium">PRODUCTOS</span>
                    </p>
                </div>
            </div>

            {/* Title */}
            <div className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                <h1 className="text-5xl md:text-6xl text-center tracking-widest text-gray-900 dark:text-white mb-4" style={{fontFamily: 'Cormorant Garamond', fontWeight: 300, letterSpacing: '0.1em'}}>
                    PRODUCTOS
                </h1>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 tracking-wider">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'PRODUCTO' : 'PRODUCTOS'}
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
                <div className="flex gap-8 relative">
                    {/* Botón toggle para desktop */}
                    <button
                        onClick={() => setShowFiltersSidebar(!showFiltersSidebar)}
                        className="hidden lg:flex fixed left-4 top-1/2 z-40 bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-3 rounded-full shadow-xl hover:scale-110 transition-transform"
                        style={{ transform: 'translateY(-50%)' }}
                    >
                        {showFiltersSidebar ? <IoChevronBack size={20} /> : <IoChevronForward size={20} />}
                    </button>

                    {/* Botón FILTROS para móvil */}
                    <button
                        onClick={() => setShowFilters(true)}
                        className="lg:hidden w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 text-sm tracking-widest font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-lg rounded-lg"
                    >
                        FILTROS {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                    </button>

                    {/* Sidebar de Filtros */}
                    <aside className={`
                        ${showFilters ? 'fixed' : 'hidden'} lg:block
                        ${!showFiltersSidebar ? 'lg:hidden' : ''}
                        lg:relative
                        inset-0 lg:inset-auto
                        w-full lg:w-80
                        bg-white dark:bg-gray-900
                        z-50 lg:z-auto
                        overflow-y-auto
                        flex-shrink-0
                        shadow-2xl lg:shadow-none
                        transition-all duration-300
                    `}>
                        <div className="h-full lg:h-auto bg-white dark:bg-gray-900 lg:border border-gray-200 dark:border-gray-700 rounded-none lg:rounded-2xl overflow-hidden shadow-xl">
                            {/* Header */}
                            <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 tracking-wide">Filtros</h2>
                                <button 
                                    onClick={() => setShowFilters(false)}
                                    className="lg:hidden p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                                >
                                    <IoClose size={24} className="text-gray-900 dark:text-white" />
                                </button>
                            </div>

                            <div className="px-8 py-10 space-y-12">
                                {/* ORDENAR POR */}
                                <div>
                                    <h3 className="text-base font-semibold mb-6 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600 pb-3">Ordenar por</h3>
                                    <div className="space-y-4">
                                        {[
                                            { value: 'newest', label: 'Recomendados' },
                                            { value: 'price-high', label: 'Precio mayor' },
                                            { value: 'price-low', label: 'Precio menor' }
                                        ].map(option => (
                                            <label key={option.value} className="flex items-center gap-4 cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={sortBy === option.value}
                                                    onChange={() => setSortBy(option.value)}
                                                    className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-sm accent-gray-700 dark:accent-gray-300 cursor-pointer"
                                                />
                                                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                                    {option.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* PRECIO */}
                                <div>
                                    <h3 className="text-base font-semibold mb-6 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600 pb-3">Precio</h3>
                                    <div className="space-y-4">
                                        {RANGOS_PRECIO.map(rango => (
                                            <label key={rango.value} className="flex items-center gap-4 cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPriceRange === rango.value}
                                                    onChange={() => setSelectedPriceRange(
                                                        selectedPriceRange === rango.value ? '' : rango.value
                                                    )}
                                                    className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-sm accent-gray-700 dark:accent-gray-300 cursor-pointer"
                                                />
                                                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                                    {rango.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* CATEGORÍA */}
                                <div>
                                    <h3 className="text-base font-semibold mb-6 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600 pb-3">Categoría</h3>
                                    <div className="space-y-4">
                                        {CATEGORIAS.map(cat => (
                                            <label key={cat.value} className="flex items-center gap-4 cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(cat.value)}
                                                    onChange={() => toggleCategory(cat.value)}
                                                    className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-sm accent-gray-700 dark:accent-gray-300 cursor-pointer"
                                                />
                                                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium capitalize">
                                                    {cat.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* TALLA */}
                                <div>
                                    <h3 className="text-base font-semibold mb-6 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600 pb-3">Talla</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {TALLAS.map(talla => (
                                            <button
                                                key={talla}
                                                onClick={() => toggleTalla(talla)}
                                                className={`
                                                    min-w-[52px] px-5 py-3 text-sm font-semibold border-2 rounded-lg transition-all duration-200 hover:scale-105
                                                    ${selectedTallas.includes(talla)
                                                        ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 border-gray-800 dark:border-gray-200 shadow-md'
                                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-gray-600 dark:hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                    }
                                                `}
                                            >
                                                {talla}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* COLOR */}
                                {availableColors.length > 0 && (
                                    <div>
                                        <h3 className="text-base font-semibold mb-6 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600 pb-3">Color</h3>
                                        <div className="space-y-4">
                                            {availableColors.map(color => (
                                                <label key={color} className="flex items-center gap-4 cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedColors.includes(color)}
                                                        onChange={() => toggleColor(color)}
                                                        className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-sm accent-gray-700 dark:accent-gray-300 cursor-pointer"
                                                    />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium uppercase">
                                                        {color}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer con botones */}
                            <div className="px-8 py-6 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 flex gap-4">
                                <button
                                    onClick={clearAllFilters}
                                    className="flex-1 py-4 px-6 text-sm font-semibold border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-200 rounded-xl hover:shadow-md"
                                >
                                    Limpiar
                                </button>
                                <button
                                    onClick={applyFilters}
                                    className="flex-1 py-4 px-6 text-sm font-semibold bg-gray-800 dark:bg-gray-200 hover:bg-gray-900 dark:hover:bg-gray-100 text-white dark:text-gray-900 transition-all duration-200 rounded-xl shadow-md hover:shadow-lg"
                                >
                                    Aplicar
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className={`flex-1 transition-all duration-300 ${!showFiltersSidebar ? 'lg:ml-0' : ''}`}>
                        {sortedProducts.length === 0 ? (
                            <div className="text-center py-32 px-6">
                                <div className="max-w-md mx-auto">
                                    <h2 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-200 mb-4 font-light" style={{fontFamily: 'Cormorant Garamond'}}>
                                        No se encontraron productos
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        No hay productos que coincidan con los filtros seleccionados
                                    </p>
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-sm underline hover:opacity-60 transition-opacity font-medium"
                                    >
                                        Limpiar filtros
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                {sortedProducts.map((product) => (
                                    <ProductCard product={product} key={product._id} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllProductsPage