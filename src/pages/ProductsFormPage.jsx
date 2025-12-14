import { useForm, Controller } from 'react-hook-form';
import uploadIcon from '../assets/addphoto.svg';
import React, { useState, useRef, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useNavigate, useParams } from 'react-router-dom';
import { IoBagAdd, IoCloseSharp, IoBagCheck, IoAddCircle, IoTrash } from 'react-icons/io5';
import { productSchema } from '../schemas/createProductSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import Tooltip from '@mui/material/Tooltip';
import { toast } from 'react-toastify';

const CATEGORIAS = ['vestidos', 'blusas', 'pantalones', 'faldas', 'trajes', 'abrigos', 'accesorios'];
const TALLAS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const TALLAS_ACCESORIOS = ['Único', 'Pequeño', 'Mediano', 'Grande'];

function ProductsFormPage() {
    const { register, handleSubmit, control, setValue, getValues, watch,
        formState: { errors } } = useForm({
            resolver: zodResolver(productSchema),
            defaultValues: {
                tallas: [],
                colores: [''],
                description: '',
                categoria: 'vestidos'
            }
        });
    const [selectedImage, setSelectedImage] = useState(uploadIcon);
    const inputImage = useRef(null);
    const {
        createProduct,
        getProducts,
        getProductById,
        updateProductNoUpdateImage,
        updateProduct,
        errors: productErrors
    } = useProducts();
    const navigate = useNavigate();
    const params = useParams();
    const [updateImage, setUpdateImage] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [colores, setColores] = useState(['']);
    
    // Watch para ver la categoría seleccionada
    const selectedCategoria = watch('categoria');
    const selectedTallas = watch('tallas');
    
    // Determinar si es accesorio
    const isAccesorio = selectedCategoria === 'accesorios';

    useEffect(() => {
        async function loadProduct() {
            if (params.id) {
                try {
                    const product = await getProductById(params.id);

                    if (product && product.name) {
                        setValue('name', product.name);
                        setValue('price', product.price + "");
                        setValue('quantity', product.quantity + "");
                        setValue('image', product.image);
                        setValue('description', product.description || '');
                        setValue('categoria', product.categoria || 'vestidos');
                        setValue('tallas', product.tallas || []);
                        setColores(product.colores || ['']);
                        setValue('colores', product.colores || ['']);
                        setSelectedImage(product.image);
                        setIsUpdating(true);
                    } else {
                        console.error("Producto no encontrado o inválido");
                        navigate('/products');
                    }
                } catch (error) {
                    console.error("Error al cargar producto:", error);
                    navigate('/products');
                }
            }
        };

        loadProduct();
        
    }, []);

    // Watch para tallas seleccionadas
    const handleTallaChange = (talla) => {
        const currentTallas = getValues('tallas') || [];
        if (currentTallas.includes(talla)) {
            setValue('tallas', currentTallas.filter(t => t !== talla));
        } else {
            setValue('tallas', [...currentTallas, talla]);
        }
    };

    const handleAddColor = () => {
        setColores([...colores, '']);
    };

    const handleRemoveColor = (index) => {
        const newColores = colores.filter((_, i) => i !== index);
        setColores(newColores);
        setValue('colores', newColores.filter(c => c.trim() !== ''));
    };

    const handleColorChange = (index, value) => {
        const newColores = [...colores];
        newColores[index] = value;
        setColores(newColores);
        setValue('colores', newColores.filter(c => c.trim() !== ''));
    };

    const onSubmit = handleSubmit(async (data) => {
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("price", data.price);
        formData.append("quantity", data.quantity);
        formData.append("description", data.description);
        formData.append("categoria", data.categoria);
        formData.append("tallas", JSON.stringify(data.tallas));
        formData.append("colores", JSON.stringify(data.colores));

        const imageValue = getValues('image');

        if (imageValue === undefined) {
            if (isUpdating)
                toast.error("No se ha seleccionado una imagen para actualizar el producto");
            else
                toast.error("No se ha seleccionado una imagen para el nuevo producto");
            return;
        }

        formData.append('image', imageValue);

        if (params.id) {
            if (!updateImage) {
                const updateData = {
                    "name": data.name,
                    "price": parseFloat(data.price),
                    "quantity": parseInt(data.quantity),
                    "image": imageValue,
                    "description": data.description,
                    "categoria": data.categoria,
                    "tallas": data.tallas,
                    "colores": data.colores
                }
                updateProductNoUpdateImage(params.id, updateData);
            } else {
                updateProduct(params.id, formData);
            }
        } else {
            createProduct(formData);
        }

        await getProducts();
        navigate('/products');

    });


    const handleImageClick = () => {
        inputImage.current.click();
    };

    const handleImageChange = (e, field) => {
        const file = e.target.files[0];

        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            field.onChange(file);
            setUpdateImage(true);
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen py-8' style={{background: '#0a0a0a'}}>
            <div className='rounded-lg max-w-2xl w-full p-8 mx-4' style={{background: '#1a1a1a', border: '1px solid #2a2a2a'}}>
                <h1 className='text-3xl font-bold mb-6 text-white' style={{fontFamily: 'Cormorant Garamond', letterSpacing: '0.05em'}}>
                    {isUpdating ? "Actualizar Producto" : "Agregar Producto"}
                </h1>
                {
                    productErrors.map((err, i) => (
                        <div className='bg-red-500/20 border border-red-500 p-3 my-2 text-red-200 rounded-lg' key={i}>
                            {err}
                        </div>
                    ))}

                <form onSubmit={onSubmit}>
                    {/* Nombre del producto */}
                    <div className='mb-4'>
                        <label className='block mb-2 font-medium text-sm tracking-wide' style={{color: '#d4d4d4'}}>
                            Nombre del producto
                        </label>
                        <input type='text'
                            className='w-full text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all'
                            style={{background: '#0f0f0f', border: '1px solid #2a2a2a'}}
                            placeholder='Vestido de noche elegante'
                            {...register("name")}
                            autoFocus
                        />
                        {errors.name && (
                            <span className='text-red-400 text-sm'>{errors.name.message}</span>
                        )}
                    </div>

                    {/* Descripción */}
                    <div className='mb-4'>
                        <label className='block mb-2 font-medium text-sm tracking-wide' style={{color: '#d4d4d4'}}>
                            Descripción
                        </label>
                        <textarea
                            className='w-full text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all min-h-[100px]'
                            style={{background: '#0f0f0f', border: '1px solid #2a2a2a'}}
                            placeholder='Descripción detallada del producto...'
                            {...register("description")}
                        />
                        {errors.description && (
                            <span className='text-red-400 text-sm'>{errors.description.message}</span>
                        )}
                    </div>

                    {/* Grid para Precio, Cantidad y Categoría */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
                        {/* Precio */}
                        <div>
                            <label className='block mb-2 font-medium text-sm tracking-wide' style={{color: '#d4d4d4'}}>
                                Precio
                            </label>
                            <input type='number'
                                step="0.10"
                                min="0"
                                className='w-full text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all'
                                style={{background: '#0f0f0f', border: '1px solid #2a2a2a'}}
                                placeholder='99.99'
                                {...register("price")}
                            />
                            {errors.price && (
                                <span className='text-red-400 text-sm'>{errors.price.message}</span>
                            )}
                        </div>

                        {/* Cantidad */}
                        <div>
                            <label className='block mb-2 font-medium text-sm tracking-wide' style={{color: '#d4d4d4'}}>
                                Cantidad
                            </label>
                            <input type='number'
                                step="1"
                                min="0"
                                className='w-full text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all'
                                style={{background: '#0f0f0f', border: '1px solid #2a2a2a'}}
                                placeholder='10'
                                {...register("quantity")}
                            />
                            {errors.quantity && (
                                <span className='text-red-400 text-sm'>{errors.quantity.message}</span>
                            )}
                        </div>

                        {/* Categoría */}
                        <div>
                            <label className='block mb-2 font-medium text-sm tracking-wide' style={{color: '#d4d4d4'}}>
                                Categoría
                            </label>
                            <select
                                className='w-full text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all capitalize'
                                style={{background: '#0f0f0f', border: '1px solid #2a2a2a'}}
                                {...register("categoria")}
                            >
                                {CATEGORIAS.map(cat => (
                                    <option key={cat} value={cat} className='capitalize' style={{background: '#1a1a1a'}}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                            {errors.categoria && (
                                <span className='text-red-400 text-sm'>{errors.categoria.message}</span>
                            )}
                        </div>
                    </div>

                    {/* Tallas */}
                    <div className='mb-4'>
                        <label className='block mb-2 font-medium text-sm tracking-wide' style={{color: '#d4d4d4'}}>
                            {isAccesorio ? 'Tamaños disponibles (opcional)' : 'Tallas disponibles'}
                            {!isAccesorio && <span className='text-red-400 ml-1'>*</span>}
                        </label>
                        <div className='flex flex-wrap gap-3 p-4 rounded' style={{background: '#0f0f0f', border: '1px solid #2a2a2a'}}>
                            {(isAccesorio ? TALLAS_ACCESORIOS : TALLAS).map(talla => (
                                <label key={talla} className='flex items-center space-x-2 cursor-pointer'>
                                    <input
                                        type="checkbox"
                                        checked={selectedTallas?.includes(talla)}
                                        onChange={() => handleTallaChange(talla)}
                                        className='w-4 h-4 accent-amber-500'
                                    />
                                    <span className='text-white font-medium'>{talla}</span>
                                </label>
                            ))}
                        </div>
                        {isAccesorio && (
                            <p className='text-xs text-gray-400 mt-1'>Para accesorios como collares, aretes, etc., puedes dejar esto vacío o seleccionar "Único"</p>
                        )}
                        {errors.tallas && !isAccesorio && (
                            <span className='text-red-400 text-sm'>{errors.tallas.message}</span>
                        )}
                    </div>

                    {/* Colores */}
                    <div className='mb-4'>
                        <label className='block mb-2 font-medium text-sm tracking-wide' style={{color: '#d4d4d4'}}>
                            Colores disponibles
                        </label>
                        <div className='space-y-2'>
                            {colores.map((color, index) => (
                                <div key={index} className='flex gap-2'>
                                    <input
                                        type='text'
                                        value={color}
                                        onChange={(e) => handleColorChange(index, e.target.value)}
                                        className='flex-1 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all'
                                        style={{background: '#0f0f0f', border: '1px solid #2a2a2a'}}
                                        placeholder='ej: Negro, Blanco, Rojo'
                                    />
                                    {colores.length > 1 && (
                                        <button
                                            type='button'
                                            onClick={() => handleRemoveColor(index)}
                                            className='px-3 py-2 rounded transition-colors'
                                            style={{background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)'}}
                                        >
                                            <IoTrash size={20} className='text-red-400' />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type='button'
                                onClick={handleAddColor}
                                className='flex items-center gap-2 px-4 py-2 rounded transition-colors text-white'
                                style={{border: '1px solid #2a2a2a', background: '#0f0f0f'}}
                            >
                                <IoAddCircle size={20} style={{color: 'var(--gold)'}} />
                                <span>Agregar color</span>
                            </button>
                        </div>
                        {errors.colores && (
                            <span className='text-red-400 text-sm'>{errors.colores.message}</span>
                        )}
                    </div>

                    {/* Imagen del producto */}
                    <div className='py-4 my-4'>
                        <label className='block mb-2 font-medium text-sm tracking-wide' style={{color: '#d4d4d4'}}>
                            Imagen del producto
                        </label>
                        <div className='p-4 rounded' style={{background: '#0f0f0f', border: '1px solid #2a2a2a'}}>
                            <img
                                src={selectedImage}
                                alt='Imagen seleccionada'
                                className='max-h-[300px] w-full object-contain cursor-pointer rounded hover:opacity-80 transition-opacity'
                                onClick={handleImageClick}
                            />
                        </div>

                        <Controller
                            name="image"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="file"
                                    ref={inputImage}
                                    onChange={(e) => handleImageChange(e, field)}
                                    className='hidden'
                                    accept="image/*"
                                />
                            )}
                        />
                    </div>

                    {/* Botones de acción */}
                    <div className='flex gap-3 mt-6'>
                        <Tooltip title={isUpdating ? "Actualizar" : "Agregar"}>
                            {isUpdating ? (
                                <button className='flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all elegant-shadow'
                                    style={{
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    }}
                                    type='submit'
                                >
                                    <IoBagCheck size={24} />
                                    <span>Actualizar</span>
                                </button>
                            ) : (
                                <button className='btn-primary flex items-center gap-2 px-6 py-3'
                                    type='submit'
                                >
                                    <IoBagAdd size={24} />
                                    <span>Agregar</span>
                                </button>
                            )}
                        </Tooltip>
                        
                        <Tooltip title="Cancelar">
                            <button className='flex items-center gap-2 px-6 py-3 rounded transition-colors text-white font-medium'
                                style={{border: '1px solid #2a2a2a', background: '#0f0f0f'}}
                                type="button"
                                onClick={() => navigate('/products')}
                            >
                                <IoCloseSharp size={24} />
                                <span>Cancelar</span>
                            </button>
                        </Tooltip>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default ProductsFormPage;
