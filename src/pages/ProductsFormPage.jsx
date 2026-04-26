import { useForm, Controller } from 'react-hook-form';
import uploadIcon from '../assets/addphoto.svg';
import React, { useState, useRef, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useNavigate, useParams } from 'react-router-dom';
import { IoBagCheck, IoAddCircle, IoTrash } from 'react-icons/io5';
import { Upload, Loader, CheckCircle, XCircle, X, Plus } from 'lucide-react';
import { productSchema } from '../schemas/createProductSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

const BC = (size, extra = {}) => ({ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: size, ...extra });
const DM = (size, weight = 400, extra = {}) => ({ fontFamily: "'DM Sans', sans-serif", fontWeight: weight, fontSize: size, ...extra });

const CATEGORIAS = ['tops', 'leggings', 'shorts', 'calzado', 'sudaderas', 'pants', 'accesorios'];
const TALLAS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const TALLAS_ACCESORIOS = ['Único', 'Pequeño', 'Mediano', 'Grande'];

const INPUT_STYLE = {
    ...DM(13), background: '#fafaf8', border: '1px solid #e5e0d8',
    borderRadius: 6, padding: '10px 14px', color: '#0f1f35',
    outline: 'none', width: '100%', boxSizing: 'border-box',
};
const LABEL_STYLE = DM(10, 600, {
    textTransform: 'uppercase', letterSpacing: '1.5px',
    color: '#8a9bb0', display: 'block', marginBottom: 6,
});
const ERROR_STYLE = DM(11, 400, { color: '#dc2626', display: 'block', marginTop: 4 });

function ProductsFormPage() {
    const { register, handleSubmit, control, setValue, getValues, watch,
        formState: { errors } } = useForm({
            resolver: zodResolver(productSchema),
            defaultValues: { tallas: [], colores: [''], description: '', categoria: 'tops' }
        });

    const [selectedImages, setSelectedImages] = useState([]);
    const inputImage = useRef(null);
    const { createProduct, getProducts, getProductById, updateProductNoUpdateImage, updateProduct, errors: productErrors } = useProducts();
    const navigate = useNavigate();
    const params = useParams();
    const [updateImage, setUpdateImage] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [colores, setColores] = useState(['']);
    const [uploadState, setUploadState] = useState('idle'); // 'idle' | 'uploading' | 'success' | 'error'

    const BASE_BTN = {
        padding: '11px 24px', borderRadius: 6, border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        width: '100%', transition: 'all 0.2s ease',
        ...DM(12, 600, { textTransform: 'uppercase', letterSpacing: '1.5px' })
    };

    const selectedCategoria = watch('categoria');
    const selectedTallas = watch('tallas');
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
                        setValue('categoria', product.categoria || 'tops');
                        setValue('tallas', product.tallas || []);
                        setColores(product.colores || ['']);
                        setValue('colores', product.colores || ['']);
                        setSelectedImages(product.images?.length > 0
                            ? product.images.map(url => ({ url, file: null }))
                            : product.image
                                ? [{ url: product.image, file: null }]
                                : []);
                        setIsUpdating(true);
                    } else {
                        navigate('/products');
                    }
                } catch (error) {
                    navigate('/products');
                }
            }
        }
        loadProduct();
    }, []);

    const handleTallaChange = (talla) => {
        const currentTallas = getValues('tallas') || [];
        if (currentTallas.includes(talla)) {
            setValue('tallas', currentTallas.filter(t => t !== talla));
        } else {
            setValue('tallas', [...currentTallas, talla]);
        }
    };

    const handleAddColor = () => setColores([...colores, '']);

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

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        const newPreviews = files.map(f => ({ file: f, url: URL.createObjectURL(f) }));
        setSelectedImages(prev => [...prev, ...newPreviews]);
        setUpdateImage(true);
    };

    const handleRemoveImage = (index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = handleSubmit(async (data) => {
        if (uploadState === 'uploading') return;

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("price", data.price);
        formData.append("quantity", data.quantity);
        formData.append("description", data.description);
        formData.append("categoria", data.categoria);
        formData.append("tallas", JSON.stringify(data.tallas));
        formData.append("colores", JSON.stringify(data.colores));

        if (selectedImages.length === 0) {
            toast.error(isUpdating ? "No se ha seleccionado una imagen para actualizar" : "No se ha seleccionado una imagen");
            return;
        }

        setUploadState('uploading');

        try {
            if (params.id) {
                if (!updateImage) {
                    const updateData = {
                        name: data.name, price: parseFloat(data.price),
                        quantity: parseInt(data.quantity), image: getValues('image'),
                        description: data.description, categoria: data.categoria,
                        tallas: data.tallas, colores: data.colores,
                    };
                    await updateProductNoUpdateImage(params.id, updateData);
                } else {
                    selectedImages.forEach(img => {
                        if (img.file) formData.append('images', img.file);
                        else formData.append('existingImages', img.url);
                    });
                    await updateProduct(params.id, formData);
                }
            } else {
                selectedImages.forEach(img => {
                    if (img.file) formData.append('images', img.file);
                    else formData.append('existingImages', img.url);
                });
                await createProduct(formData);
            }

            setUploadState('success');
            setTimeout(() => {
                setUploadState('idle');
                navigate('/products');
            }, 1500);
        } catch (err) {
            setUploadState('error');
            setTimeout(() => setUploadState('idle'), 3000);
        }
    });

    return (
        <div style={{ background: '#fafaf8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px', boxSizing: 'border-box' }}>
            <div style={{ width: '100%', maxWidth: 680, background: '#fff', border: '1px solid #e5e0d8', borderRadius: 14, boxShadow: '0 4px 24px rgba(15,31,53,0.08)', padding: '40px 40px' }}>

                <h1 style={BC("32px", { color: '#0f1f35', margin: '0 0 28px' })}>
                    {isUpdating ? "ACTUALIZAR PRODUCTO" : "AGREGAR PRODUCTO"}
                </h1>

                {productErrors.map((err, i) => (
                    <div key={i} style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 6, padding: '10px 14px', marginBottom: 16, ...DM(12, 400, { color: '#dc2626' }) }}>
                        {err}
                    </div>
                ))}

                <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{
                    pointerEvents: uploadState === 'uploading' ? 'none' : 'auto',
                    opacity: uploadState === 'uploading' ? 0.65 : 1,
                    transition: 'opacity 0.2s ease',
                    display: 'flex', flexDirection: 'column', gap: 20
                  }}>

                    {/* Nombre */}
                    <div>
                        <label style={LABEL_STYLE}>Nombre del producto</label>
                        <input type="text" style={INPUT_STYLE} placeholder="Ej: Leggings Platinum Elite" {...register("name")} autoFocus />
                        {errors.name && <span style={ERROR_STYLE}>{errors.name.message}</span>}
                    </div>

                    {/* Descripción */}
                    <div>
                        <label style={LABEL_STYLE}>Descripción</label>
                        <textarea style={{ ...INPUT_STYLE, minHeight: 100, resize: 'vertical' }} placeholder="Descripción detallada del producto..." {...register("description")} />
                        {errors.description && <span style={ERROR_STYLE}>{errors.description.message}</span>}
                    </div>

                    {/* Precio / Cantidad / Categoría */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                        <div>
                            <label style={LABEL_STYLE}>Precio</label>
                            <input type="number" step="0.10" min="0" style={INPUT_STYLE} placeholder="99.99" {...register("price")} />
                            {errors.price && <span style={ERROR_STYLE}>{errors.price.message}</span>}
                        </div>
                        <div>
                            <label style={LABEL_STYLE}>Cantidad</label>
                            <input type="number" step="1" min="0" style={INPUT_STYLE} placeholder="10" {...register("quantity")} />
                            {errors.quantity && <span style={ERROR_STYLE}>{errors.quantity.message}</span>}
                        </div>
                        <div>
                            <label style={LABEL_STYLE}>Categoría</label>
                            <select style={{ ...INPUT_STYLE, textTransform: 'capitalize' }} {...register("categoria")}>
                                {CATEGORIAS.map(cat => (
                                    <option key={cat} value={cat} style={{ textTransform: 'capitalize' }}>{cat}</option>
                                ))}
                            </select>
                            {errors.categoria && <span style={ERROR_STYLE}>{errors.categoria.message}</span>}
                        </div>
                    </div>

                    {/* Tallas — chips */}
                    <div>
                        <label style={LABEL_STYLE}>
                            {isAccesorio ? 'Tamaños disponibles (opcional)' : 'Tallas disponibles'}
                            {!isAccesorio && <span style={{ color: '#dc2626', marginLeft: 4 }}>*</span>}
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {(isAccesorio ? TALLAS_ACCESORIOS : TALLAS).map(talla => {
                                const active = selectedTallas?.includes(talla);
                                return (
                                    <button key={talla} type="button" onClick={() => handleTallaChange(talla)}
                                        style={{
                                            border: active ? '1px solid #0f1f35' : '1px solid #e5e0d8',
                                            background: active ? '#0f1f35' : '#fff',
                                            color: active ? '#fff' : '#4a5568',
                                            borderRadius: 4, padding: '6px 12px', cursor: 'pointer',
                                            transition: 'all 0.15s', ...DM(11, 600),
                                        }}>
                                        {talla}
                                    </button>
                                );
                            })}
                        </div>
                        {isAccesorio && <span style={DM(11, 400, { color: '#8a9bb0', display: 'block', marginTop: 6 })}>Para accesorios puedes dejar esto vacío o seleccionar "Único"</span>}
                        {errors.tallas && !isAccesorio && <span style={ERROR_STYLE}>{errors.tallas.message}</span>}
                    </div>

                    {/* Colores */}
                    <div>
                        <label style={LABEL_STYLE}>Colores disponibles</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {colores.map((color, index) => (
                                <div key={index} style={{ display: 'flex', gap: 8 }}>
                                    <input type="text" value={color} onChange={e => handleColorChange(index, e.target.value)}
                                        style={{ ...INPUT_STYLE, flex: 1 }} placeholder="ej: Negro, Blanco, Platino" />
                                    {colores.length > 1 && (
                                        <button type="button" onClick={() => handleRemoveColor(index)}
                                            style={{ border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.06)', borderRadius: 6, padding: '0 12px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                            <IoTrash size={16} color="#dc2626" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={handleAddColor}
                                style={{ border: '1px solid #e5e0d8', background: '#fafaf8', borderRadius: 6, padding: '8px 14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start', ...DM(12, 600, { color: '#0f1f35' }) }}>
                                <IoAddCircle size={16} color="#1d4b8a" /> Agregar color
                            </button>
                        </div>
                        {errors.colores && <span style={ERROR_STYLE}>{errors.colores.message}</span>}
                    </div>

                    <div>
                        <label style={LABEL_STYLE}>Imágenes del producto</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 10 }}>
                            {selectedImages.map((img, index) => (
                                <div key={index} style={{ position: 'relative', height: 120, borderRadius: 8, overflow: 'hidden', border: '1px solid #e5e0d8' }}>
                                    <img
                                        src={typeof img === 'string' ? img : img.url}
                                        alt={`imagen-${index}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <button type="button" onClick={() => handleRemoveImage(index)}
                                        style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: '50%', background: '#0f1f35', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <X size={12} color="#fff" strokeWidth={2.5} />
                                    </button>
                                </div>
                            ))}
                            <div onClick={() => inputImage.current.click()}
                                style={{ height: 120, borderRadius: 8, border: '2px dashed #e5e0d8', background: '#fafaf8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 6 }}>
                                <Plus size={20} color="#8a9bb0" strokeWidth={1.5} />
                                <span style={DM(11, 600, { color: '#8a9bb0', textAlign: 'center' })}>Agregar imagen</span>
                            </div>
                        </div>
                        <Controller
                            name="image"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="file"
                                    ref={inputImage}
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    multiple
                                />
                            )}
                        />
                    </div>

                    {/* Botones */}
                    </div>{/* end blocking div */}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                        {uploadState === 'idle' && (
                            <button type="submit"
                                style={{ ...BASE_BTN, background: '#0f1f35', color: '#fff', cursor: 'pointer' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#1d4b8a'}
                                onMouseLeave={e => e.currentTarget.style.background = '#0f1f35'}>
                                <Upload size={18} strokeWidth={1.5} />
                                {isUpdating ? 'Actualizar Producto' : 'Subir Producto'}
                            </button>
                        )}
                        {uploadState === 'uploading' && (
                            <button type="button" disabled
                                style={{ ...BASE_BTN, background: '#1a3a6b', color: '#fff', cursor: 'not-allowed', opacity: 0.85 }}>
                                <Loader size={18} strokeWidth={1.5} className="spin-icon" />
                                Subiendo producto...
                            </button>
                        )}
                        {uploadState === 'success' && (
                            <button type="button" disabled
                                style={{ ...BASE_BTN, background: '#16a34a', color: '#fff', cursor: 'default', animation: 'fadeInScale 0.3s ease' }}>
                                <CheckCircle size={18} strokeWidth={1.5} />
                                Producto subido exitosamente
                            </button>
                        )}
                        {uploadState === 'error' && (
                            <button type="button" disabled
                                style={{ ...BASE_BTN, background: '#dc2626', color: '#fff', cursor: 'default', animation: 'fadeInScale 0.3s ease' }}>
                                <XCircle size={18} strokeWidth={1.5} />
                                Error — Intenta de nuevo
                            </button>
                        )}
                        <button type="button" onClick={() => navigate('/products')}
                            style={{ ...BASE_BTN, border: '1px solid #e5e0d8', background: '#fafaf8', color: '#0f1f35', cursor: 'pointer' }}>
                            <X size={18} strokeWidth={1.5} /> Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProductsFormPage;
