import { useForm } from "react-hook-form"
import { useAuth } from "../context/AuthContext"
import React, { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "../schemas/loginSchema"
import { IoPersonAdd, IoLogIn, IoEyeSharp, IoEyeOffSharp } from "react-icons/io5"
import Tooltip from "@mui/material/Tooltip"
import ReCaptcha from "react-google-recaptcha";
import { useProducts } from "../context/ProductContext";

const BC = (size, extra = {}) => ({ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: size, ...extra });
const DM = (size, weight = 400, extra = {}) => ({ fontFamily: "'DM Sans', sans-serif", fontWeight: weight, fontSize: size, ...extra });

function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) });
    const { signIn, isAuthenticated, errors: loginErrors, isAdmin } = useAuth();
    const { addToCart } = useProducts();
    const navigate = useNavigate();
    const [passwordShown, setPasswordShown] = useState(false);
    const [captchaValue, setCaptchaValue] = useState(null);

    useEffect(() => {
        if (isAuthenticated === false) return;
        if (isAuthenticated) {
            const pending = localStorage.getItem('pendingCartProduct');
            if (pending) {
                const product = JSON.parse(pending);
                addToCart(product);
                localStorage.removeItem('pendingCartProduct');
                toast.success(`"${product.name}" agregado al carrito`);
            }
            if (isAdmin) navigate('/products');
            else navigate('/');
        }
    }, [isAuthenticated, isAdmin]);

    const onSubmit = handleSubmit(async (values) => {
        if (!captchaValue) { alert("Por favor completa el reCAPTCHA"); return; }
        signIn(values);
    });

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
            <div style={{ width: '100%', maxWidth: 420, background: '#fff', border: '1px solid #e5e0d8', borderRadius: 14, boxShadow: '0 4px 24px rgba(15,31,53,0.08)', padding: '40px 36px' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <p style={DM(11, 600, { color: '#8a9bb0', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 8 })}>GDLCG</p>
                    <h1 style={BC("36px", { color: '#0f1f35', margin: '0 0 6px' })}>BIENVENIDO</h1>
                    <p style={DM(13, 400, { color: '#8a9bb0', margin: 0 })}>Inicia sesión para continuar</p>
                </div>

                {/* Errores */}
                {Array.isArray(loginErrors) && loginErrors.map((error, i) => (
                    <div key={i} style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 6, padding: '10px 14px', marginBottom: 12, ...DM(12, 400, { color: '#dc2626' }) }}>
                        {error}
                    </div>
                ))}

                {/* Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div>
                        <label style={labelStyle}>Email</label>
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

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <ReCaptcha sitekey="6LecBSwsAAAAAFQBXUtBTwpmOI8phCK604vlKEwU" onChange={(v) => setCaptchaValue(v)} theme="light" />
                    </div>

                    <Tooltip title={captchaValue ? "Iniciar sesión" : "Completa el reCAPTCHA"}>
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
                                <IoLogIn size={16} /> Iniciar Sesión
                            </button>
                        </span>
                    </Tooltip>
                </div>

                {/* Footer */}
                <div style={{ borderTop: '1px solid #e5e0d8', marginTop: 24, paddingTop: 20, textAlign: 'center' }}>
                    <p style={DM(12, 400, { color: '#8a9bb0', margin: 0 })}>
                        ¿No tienes una cuenta?{' '}
                        <Link to='/register' style={{ ...DM(12, 600, { color: '#1d4b8a', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }) }}>
                            Regístrate aquí <IoPersonAdd size={14} />
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
