import { useForm } from "react-hook-form"
import { useAuth } from "../context/AuthContext"
import React, { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "../schemas/loginSchema"
import { IoPersonAdd, IoLogIn, IoEyeSharp, IoEyeOffSharp } from "react-icons/io5"
import Tooltip from "@mui/material/Tooltip"
import ReCaptcha from "react-google-recaptcha";

function LoginPage() {
    const { register, handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(loginSchema)
    });
    const { signIn, isAuthenticated, errors: loginErrors, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [passwordShown, setPasswordShown] = useState(false);
    const [ captchaValue, setCaptchaValue ] = useState(null);

    const togglePasswordVisibility = () => {
        setPasswordShown(passwordShown ? false : true);
    }

    useEffect(() => {
        if(isAuthenticated === false) return;

        if (isAuthenticated && isAdmin)
            navigate('/products');
        else
            navigate('/getallproducts');

    }, [isAuthenticated, isAdmin]); //Fin de UseEffect

    const onSubmit = handleSubmit(async (values) => {
        if (!captchaValue) {
            alert("Por favor completa el reCAPTCHA");
            return;
        }
        console.log(values);
        signIn(values);
    });//Fin de onSubmit

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4" aria-hidden="false">
            <div className="card-gradient max-w-md w-full p-8 rounded-2xl shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold gradient-text mb-2">Bienvenido</h1>
                    <p className="text-gray-400">Inicia sesión para continuar</p>
                </div>

                {
                    Array.isArray(loginErrors) && loginErrors.map((error, i) => (
                        <div className='bg-red-500/10 border border-red-500 p-3 my-2 text-red-300 rounded-lg' key={i}>
                            {error}
                        </div>
                    ))
                }
                {
                    loginErrors && !Array.isArray(loginErrors) && (
                        <div className='bg-red-500/10 border border-red-500 p-3 my-2 text-red-300 rounded-lg'>
                            {loginErrors.toString()}
                        </div>
                    )
                }
                
                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input 
                            type="email"
                            className='w-full glass-effect text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
                            style={{ border: errors.email ? '2px solid rgb(239 68 68)' : '1px solid rgba(255,255,255,0.1)' }}
                            placeholder="tu@email.com"
                            {...register("email")}
                        />
                        {errors.email && (
                            <span className="text-red-400 text-sm mt-1 block">{errors.email.message}</span>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
                        <div className="relative">
                            <input
                                type={passwordShown ? "text" : "password"}
                                className='w-full glass-effect text-white px-4 py-3 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
                                style={{ border: errors.password ? '2px solid rgb(239 68 68)' : '1px solid rgba(255,255,255,0.1)' }}
                                placeholder="••••••••"
                                {...register("password")}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {passwordShown ? (
                                    <IoEyeSharp size={22} />
                                ) : (
                                    <IoEyeOffSharp size={22} />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="text-red-400 text-sm mt-1 block">{errors.password.message}</span>
                        )}
                    </div>

                    <div className="flex justify-center">
                        <ReCaptcha
                            sitekey="6Lc_0ygsAAAAANLEZ93vRF_NXLDMBe2sAw0dFdPO"
                            onChange={(value) => setCaptchaValue(value)}
                            aria-hidden="false"
                            theme="dark"
                        />
                    </div>

                    <Tooltip title={captchaValue ? "Iniciar sesión" : "Completa el reCAPTCHA"}>
                        <span className="block">
                            <button 
                                type="submit"
                                disabled={!captchaValue}
                                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 
                                    ${captchaValue 
                                        ? 'btn-primary text-white cursor-pointer' 
                                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                <IoLogIn size={24} />
                                Iniciar Sesión
                            </button>
                        </span>
                    </Tooltip>
                </form>
                
                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-gray-400">
                        ¿No tienes una cuenta?{' '}
                        <Link to='/register' className='text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 transition-colors'>
                            Regístrate aquí
                            <IoPersonAdd size={20} />
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;