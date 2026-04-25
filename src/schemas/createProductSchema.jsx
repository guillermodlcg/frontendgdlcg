import { z } from 'zod';

const CATEGORIAS = ['tops', 'leggings', 'shorts', 'calzado', 'sudaderas', 'accesorios'];
const TALLAS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const TALLAS_ACCESORIOS = ['Único', 'Pequeño', 'Mediano', 'Grande'];

export const productSchema = z.object({
    name: z.string('Nombre del producto requerido')
    .min(3, {error:"El nombre del producto debe de tener minimo 3 caracteres"}),
    price: z.string()
    .transform( (val)=> parseFloat(val))
    .pipe (
        z.number('Precio del producto requerido')
        .positive('El precio debe de ser mayor a 0')
        .refine( (val) => !isNaN(val), { error: 'El precio debe ser un número válido' })
    ),
    quantity: z.string()
    .transform( (val)=> parseInt(val))
    .pipe (
        z.number('Cantidad del producto requerida')
        .int({error:'Cantidad del producto requerida'})
        .min(0, {error: 'La cantidad debe ser mayor o igual a 0'})
        .refine((val) => !isNaN(val), { error: 'La cantidad debe ser un número válido'})
    ),
    description: z.string('Descripción del producto requerida')
        .min(10, {error: "La descripción debe tener mínimo 10 caracteres"}),
    categoria: z.enum(CATEGORIAS, {
        errorMap: () => ({ message: 'Categoría inválida' })
    }),
    tallas: z.array(z.string())
        .min(0, {error: 'Tallas inválidas'})
        .optional()
        .default([]),
    colores: z.array(z.string().min(1))
        .min(1, {error: 'Debe agregar al menos un color'}),
}).refine(
    (data) => {
        // Si no es accesorio, debe tener al menos una talla
        if (data.categoria !== 'accesorios') {
            return data.tallas && data.tallas.length > 0;
        }
        return true;
    },
    {
        message: 'Debe seleccionar al menos una talla',
        path: ['tallas'],
    }
);//Fin de ProductSchema