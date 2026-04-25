import { useForm } from "react-hook-form"
import { useAuth } from "../context/AuthContext";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from "../schemas/registerSchema";
import { IoPersonAdd, IoLogIn, IoEyeSharp, IoEyeOffSharp } from 'react-icons/io5'
import Tooltip from "@mui/material/Tooltip";
import ReCAPTCHA from "react-google-recaptcha";

const BC = (size, extra = {}) => ({ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: size, ...extra });
const DM = (size, weight = 400, extra = {}) => ({ fontFamily: "'DM Sans', sans-serif", fontWeight: weight, fontSize: size, ...extra });

function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(registerSchema) });
    const { signUp, isAuthenticated, errors: registerErrors } = useAuth();
    const navigate = useNavigate();
    const [passwordShown, setPasswordShown] = useState(false);
    const [passwordConfirmShown, setPasswordConfirmShown] = useState(false);
    const [captchaValue, setCaptchaValue] = useState(null);

    useEffect(() => {
        if (isAuthenticated) navigate('/');
    }, [isAuthenticated]);

    const onSubmit = handleSubmit(async (values) => { signUp(values); });

    const inputStyle = (hasError) => ({
        ...DM(14),
        background: '#fafaf8',
        border: hasError ? '1.5px solid #dc2626' : '1px solid #e5e0d8',
        color: '#0f1f35',
        borderRadius: 6,
        padding: '11px 14px',
        width: '100%',
        outline: 'none',
        boxSizing: 'border-box',
    });

    const labelStyle = {
        ...DM(10, 600, { textTransform: 'uppercase', letterSpacing: '1.5px', color: '#8a9bb0', display: 'block', marginBottom: 6 })
    };

    return (
        <div style={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafaf8', padding: '48px 16px', boxSizing: 'border-box' }}>
            <div style={{ width: '100%', maxWidth: 440, background: '#fff', border: '1px solid #e5e0d8', borderRadius: 14, boxShadow: '0 4px 24px rgba(15,31,53,0.08)', padding: '40px 36px' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <p style={DM(11, 600, { color: '#8a9bb0', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 8 })}>GDLCG</p>
                    <h1 style={BC("36px", { color: '#0f1f35', margin: '0 0 6px' })}>CREAR CUENTA</h1>
                    <p style={DM(13, 400, { color: '#8a9bb0', margin: 0 })}>Regístrate para comenzar</p>
                </div>

                {/* Errores */}
                {registerErrors.map((error, i) => (
                    <div key={i} style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 6, padding: '10px 14px', marginBottom: 12, ...DM(12, 400, { color: '#dc2626' }) }}>
                        {error}
                    </div>
                ))}

                {/* Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <label style={labelStyle}>Nombre de Usuario</label>
                        <input type="text" style={inputStyle(errors.username)} placeholder="Tu nombre de usuario" {...register("username")} />
                        {errors.username && <span style={DM(11, 400, { color: '#dc2626', display: 'block', marginTop: 4 })}>{errors.username.message}</span>}
                    </div>

                    <div>
                        <label style={labelStyle}>Correo Electrónico</label>
                        <input type="email" style={inputStyle(errors.email)} placeholder="tu@email.com" {...register("email")} />
                        {errors.email && <span style={DM(11, 400, { color: '#dc2626', display: 'block', marginTop: 4 })}>{errors.email.message}</span>}
                    </div>

                    <div>
                        <label style={labelStyle}>Contraseña</label>
                        <div style={{ position: 'relative' }}>
                            <input type={passwordShown ? "text" : "password"} style={{ ...inputStyle(errors.password), paddingRight: 44 }} placeholder="••••••••" {...register("password")} />
                            <button type="button" onClick={() => setPasswordShown(!passwordShown)}
                                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8a9bb0', display: 'flex' }}>
                                {passwordShown ? <IoEyeSharp size={18} /> : <IoEyeOffSharp size={18} />}
                            </button>
                        </div>
                        {errors.password && <span style={DM(11, 400, { color: '#dc2626', display: 'block', marginTop: 4 })}>{errors.password.message}</span>}
                    </div>

                    <div>
                        <label style={labelStyle}>Confirmar Contraseña</label>
                        <div style={{ position: 'relative' }}>
                            <input type={passwordConfirmShown ? "text" : "password"} style={{ ...inputStyle(errors.confirm), paddingRight: 44 }} placeholder="••••••••" {...register("confirm")} />
                            <button type="button" onClick={() => setPasswordConfirmShown(!passwordConfirmShown)}
                                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8a9bb0', display: 'flex' }}>
                                {passwordConfirmShown ? <IoEyeSharp size={18} /> : <IoEyeOffSharp size={18} />}
                            </button>
                        </div>
                        {errors.confirm && <span style={DM(11, 400, { color: '#dc2626', display: 'block', marginTop: 4 })}>{errors.confirm.message}</span>}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 4 }}>
                        <ReCAPTCHA sitekey="6LecBSwsAAAAAFQBXUtBTwpmOI8phCK604vlKEwU" onChange={(v) => setCaptchaValue(v)} theme="light" />
                    </div>

                    <Tooltip title={captchaValue ? "Registrar" : "Completa el reCAPTCHA"}>
                        <span style={{ display: 'block' }}>
                            <button type="button" onClick={onSubmit} disabled={!captchaValue}
                                style={{
                                    width: '100%', padding: '12px', borderRadius: 6, border: 'none',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                    cursor: captchaValue ? 'pointer' : 'not-allowed',
                                    background: captchaValue ? '#0f1f35' : '#e5e0d8',
                                    transition: 'background 0.2s',
                                    ...DM(12, 600, { color: captchaValue ? '#fff' : '#8a9bb0', textTransform: 'uppercase', letterSpacing: '1.5px' })
                                }}
                                onMouseEnter={e => { if (captchaValue) e.currentTarget.style.background = '#1d4b8a'; }}
                                onMouseLeave={e => { if (captchaValue) e.currentTarget.style.background = '#0f1f35'; }}
                            >
                                <IoPersonAdd size={16} /> Crear Cuenta
                            </button>
                        </span>
                    </Tooltip>
                </div>

                {/* Footer */}
                <div style={{ borderTop: '1px solid #e5e0d8', marginTop: 24, paddingTop: 20, textAlign: 'center' }}>
                    <p style={DM(12, 400, { color: '#8a9bb0', margin: 0 })}>
                        ¿Ya tienes una cuenta?{' '}
                        <Link to='/login' style={{ ...DM(12, 600, { color: '#1d4b8a', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }) }}>
                            Inicia sesión aquí <IoLogIn size={14} />
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
