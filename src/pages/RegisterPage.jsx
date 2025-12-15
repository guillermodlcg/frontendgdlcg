import { useForm } from "react-hook-form"
import { useAuth } from "../context/AuthContext";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from "../schemas/registerSchema";
import { IoPersonAdd, IoLogIn, IoEyeSharp, IoEyeOffSharp } from 'react-icons/io5'
import Tooltip from "@mui/material/Tooltip";
import ReCAPTCHA from "react-google-recaptcha";

function RegisterPage() {
    const { register, handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(registerSchema)
    });
    const { signUp, isAuthenticated, errors: registerErrors } = useAuth();
    const navigate = useNavigate();
    const [passwordShown, setPasswordShown] = useState(false);
    const [passwordConfirmShown, setPasswordConfirmShown] = useState(false);
    const [captchaValue, setCaptchaValue] = useState(null);

    const togglePasswordVisibility = () => {
        setPasswordShown(passwordShown ? false : true);
    }

    const togglePasswordConfirmVisibility = () => {
        setPasswordConfirmShown(passwordConfirmShown ? false : true);
    }

    useEffect(() => {

        if (isAuthenticated)
            navigate('/');

    }, [isAuthenticated]);//Fin de UseEffect

    const onSubmit = handleSubmit(async (values) => {
        console.log(values);
        signUp(values);
    });//Fin de handlesubmit

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4" aria-hidden="false">
            <div className="card-gradient max-w-md w-full p-8 rounded-2xl shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold gradient-text mb-2">Crear Cuenta</h1>
                    <p className="text-gray-400">Regístrate para comenzar</p>
                </div>

                {
                    registerErrors.map((error, i) => (
                        <div className='bg-red-500/10 border border-red-500 p-3 my-2 text-red-300 rounded-lg' key={i}>
                            {error}
                        </div>
                    ))
                }

                <form onSubmit={onSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Nombre de Usuario</label>
                        <input 
                            type="text"
                            className='w-full glass-effect text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
                            style={{ border: errors.username ? '2px solid rgb(239 68 68)' : '1px solid rgba(255,255,255,0.1)' }}
                            placeholder="Tu nombre de usuario"
                            {...register("username")}
                        />
                        {errors.username && (
                            <span className="text-red-400 text-sm mt-1 block">{errors.username.message}</span>
                        )}
                    </div>

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
                                className="w-full glass-effect text-white px-4 py-3 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                style={{ border: errors.password ? "2px solid rgb(239 68 68)" : "1px solid rgba(255,255,255,0.1)" }}
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

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Confirmar Contraseña</label>
                        <div className="relative">
                            <input
                                type={passwordConfirmShown ? "text" : "password"}
                                className="w-full glass-effect text-white px-4 py-3 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                style={{ border: errors.confirm ? "2px solid rgb(239 68 68)" : "1px solid rgba(255,255,255,0.1)" }}
                                placeholder="••••••••"
                                {...register("confirm")}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordConfirmVisibility}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {passwordConfirmShown ? (
                                    <IoEyeSharp size={22} />
                                ) : (
                                    <IoEyeOffSharp size={22} />
                                )}
                            </button>
                        </div>
                        {errors.confirm && (
                            <span className="text-red-400 text-sm mt-1 block">{errors.confirm.message}</span>
                        )}
                    </div>

                    <div className="flex justify-center">
                        <ReCAPTCHA
                            sitekey="6LecBSwsAAAAAFQBXUtBTwpmOI8phCK604vlKEwU"
                            onChange={(value) => setCaptchaValue(value)}
                            aria-hidden="false"
                            theme="dark"
                        />
                    </div>

                    <Tooltip title={captchaValue ? "Registrar" : "Completa el reCAPTCHA"}>
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
                                <IoPersonAdd size={24} />
                                Crear Cuenta
                            </button>
                        </span>
                    </Tooltip>
                </form>
                
                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-gray-400">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to='/login' className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 transition-colors">
                            Inicia sesión aquí
                            <IoLogIn size={20} />
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
export default RegisterPage