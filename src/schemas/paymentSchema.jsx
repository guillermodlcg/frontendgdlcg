import {z} from 'zod';

//Funcion para validar algoritmo de Luhn
export const validateCard = (numero) => {
    const cleanNum = numero.replace(/\D/g, '');
    let sum = 0;
    let isEven = false;

    for (let i = cleanNum.length - 1; i >= 0; i--){
        let digit = parseInt(cleanNum.charAt(i), 10);

        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        isEven = !isEven;
    }
    return sum % 10 === 0;
}; //Fin de validar 

//Esquema para recoger en tienda 
const pickupSchema = z.object({
    paymentMethod : z.literal('pickup'),
    userName: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre es demasiado largo'),
}); //Fin de pickUpSchema

const cardSchema = z.object({
    paymentMethod : z.literal('card'), 
    cardName: z.string().optional(),
    cardNumber: z.string().optional(),
    expirationDate: z.string().optional(),
    ccv: z.string().optional(),
}); //Fin de cardSchema

//Esquema combinado con union discriminada
export const paymentSchema = z.discriminatedUnion('paymentMethod',[
    pickupSchema,
    cardSchema
]); 