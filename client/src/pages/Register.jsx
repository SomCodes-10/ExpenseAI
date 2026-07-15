import React from 'react';
import logo from '../assets/logo.svg';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../validation/auth.schema';
import apiClient from '../lib/axios';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { setErrorMap } from 'zod/v3';

const Register = () => {
  const navigate = useNavigate();
  const loginAuth = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await apiClient.post('/auth/register', data);
      if (response.data.token) {
        loginAuth(response.data.user || null, response.data.token);
        console.log('Account was created and user was logged in automatically');
        navigate('/dashboard');
      } else {
        alert('Account successfully created! Please login.');
        navigate('/login');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || 'Registration failed. Try again!';
      setError('root', { type: 'manual', message: errorMessage });
    }
  };

  return (
    /* Page wrapper */
    <div
      style={{
        position: 'relative',
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '48px 16px',
        background: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 50%, #F0FDFF 100%)',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Google Fonts + keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sw-reg-card { animation: fadeSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) both; }
        .sw-reg-input::placeholder { color: #94A3B8; }
        .sw-reg-input:focus { outline: none; }
        .sw-reg-btn:active { transform: scale(0.98) !important; }
      `}</style>

      {/* ── Decorative blobs ───────────────────────────────────────── */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '-140px', left: '-100px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56,189,248,0.13) 0%, transparent 70%)',
        filter: 'blur(48px)', pointerEvents: 'none',
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: '-160px', right: '-120px',
        width: '560px', height: '560px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(103,232,249,0.12) 0%, transparent 70%)',
        filter: 'blur(56px)', pointerEvents: 'none',
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', top: '30%', right: '12%',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(167,243,208,0.10) 0%, transparent 70%)',
        filter: 'blur(36px)', pointerEvents: 'none',
      }} />

      {/* ── Auth Card ─────────────────────────────────────────────── */}
      <div
        className="sw-reg-card"
        style={{
          position: 'relative', zIndex: 1,
          width: '100%', maxWidth: '456px',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1.5px solid rgba(186,230,253,0.55)',
          borderRadius: '22px',
          padding: '44px 40px 36px',
          boxShadow:
            '0 0 0 1px rgba(255,255,255,0.9) inset,' +
            '0 4px 6px -2px rgba(0,0,0,0.04),' +
            '0 24px 64px -8px rgba(14,165,233,0.10)',
        }}
      >
        {/* ── Brand Header ────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px', gap: '16px' }}>
          {/* Logo icon pill */}
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 55%, #67E8F9 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(14,165,233,0.30)',
          }}>
            {/* Inline SVG — coin / finance icon */}
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="14" cy="14" r="11" stroke="rgba(255,255,255,0.85)" strokeWidth="2"/>
              <path d="M14 7v2M14 19v2M10.5 11.5c0-1.38 1.12-2.5 3.5-2.5s3.5 1.12 3.5 2.5c0 1.5-1.5 2-3.5 2.5s-3.5 1.2-3.5 2.5c0 1.38 1.12 2.5 3.5 2.5s3.5-1.12 3.5-2.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div style={{ textAlign: 'center' }}>
            {/* App name */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', marginBottom: '10px' }}>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.3px' }}>
                SpendWise
              </span>
              <span style={{
                fontSize: '10.5px', fontWeight: 600, color: '#0EA5E9',
                background: 'linear-gradient(135deg, #E0F2FE, #BAE6FD)',
                border: '1px solid rgba(14,165,233,0.22)',
                borderRadius: '6px', padding: '2px 7px', letterSpacing: '0.3px',
              }}>
                AI
              </span>
            </div>
            {/* Original tagline headline */}
            <h1 style={{ fontSize: '23px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.5px', margin: '0 0 7px' }}>
              Track Smarter, Spend Better
            </h1>
            {/* Sub-heading */}
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.55, margin: 0 }}>
              Build better financial habits.
            </p>
          </div>
        </div>

        {/* ── Form ────────────────────────────────────────────────── */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          action="#"
          method="POST"
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {/* Username ──────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="username"
              style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register('username')}
              autoComplete="username"
              placeholder="yourname"
              className="sw-reg-input"
              style={{
                width: '100%', borderRadius: '10px', boxSizing: 'border-box',
                border: errors.username ? '1.5px solid #F87171' : '1.5px solid #E2E8F0',
                background: errors.username ? '#FFF8F8' : '#FAFBFC',
                padding: '11.5px 14px', fontSize: '14px', color: '#0F172A',
                outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              onFocus={e => {
                e.target.style.borderColor = errors.username ? '#F87171' : '#38BDF8';
                e.target.style.boxShadow = errors.username
                  ? '0 0 0 3px rgba(248,113,113,0.13)'
                  : '0 0 0 3px rgba(56,189,248,0.14)';
              }}
              onBlur={e => {
                e.target.style.borderColor = errors.username ? '#F87171' : '#E2E8F0';
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.username && (
              <p style={{ fontSize: '12px', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '4px', margin: 0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email ──────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="email"
              style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              autoComplete="email"
              placeholder="you@example.com"
              className="sw-reg-input"
              style={{
                width: '100%', borderRadius: '10px', boxSizing: 'border-box',
                border: errors.email ? '1.5px solid #F87171' : '1.5px solid #E2E8F0',
                background: errors.email ? '#FFF8F8' : '#FAFBFC',
                padding: '11.5px 14px', fontSize: '14px', color: '#0F172A',
                outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              onFocus={e => {
                e.target.style.borderColor = errors.email ? '#F87171' : '#38BDF8';
                e.target.style.boxShadow = errors.email
                  ? '0 0 0 3px rgba(248,113,113,0.13)'
                  : '0 0 0 3px rgba(56,189,248,0.14)';
              }}
              onBlur={e => {
                e.target.style.borderColor = errors.email ? '#F87171' : '#E2E8F0';
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.email && (
              <p style={{ fontSize: '12px', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '4px', margin: 0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password ───────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* On the register page the "Forgot password?" anchor is present
                in the original source; preserving it here as required. */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label
                htmlFor="password"
                style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}
              >
                Password
              </label>
            </div>
            <input
              id="password"
              type="password"
              {...register('password')}
              autoComplete="current-password"
              placeholder="••••••••"
              className="sw-reg-input"
              style={{
                width: '100%', borderRadius: '10px', boxSizing: 'border-box',
                border: errors.password ? '1.5px solid #F87171' : '1.5px solid #E2E8F0',
                background: errors.password ? '#FFF8F8' : '#FAFBFC',
                padding: '11.5px 14px', fontSize: '14px', color: '#0F172A',
                outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              onFocus={e => {
                e.target.style.borderColor = errors.password ? '#F87171' : '#38BDF8';
                e.target.style.boxShadow = errors.password
                  ? '0 0 0 3px rgba(248,113,113,0.13)'
                  : '0 0 0 3px rgba(56,189,248,0.14)';
              }}
              onBlur={e => {
                e.target.style.borderColor = errors.password ? '#F87171' : '#E2E8F0';
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.password && (
              <p style={{ fontSize: '12px', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '4px', margin: 0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Root / server error */}
          {errors.root && (
            <div style={{
              borderRadius: '10px', border: '1px solid rgba(248,113,113,0.28)',
              background: 'rgba(255,243,243,0.9)', padding: '11px 14px',
              textAlign: 'center', fontSize: '13.5px', color: '#DC2626',
            }}>
              {errors.root.message}
            </div>
          )}

          {/* CTA Button ─────────────────────────────────────────────── */}
          <div style={{ paddingTop: '4px' }}>
            {/* Solid sky-blue fill with near-black text for contrast.
                Hover shifts to arctic blue — subtle tactile feedback. */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="sw-reg-btn"
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                borderRadius: '11px',
                background: isSubmitting
                  ? 'linear-gradient(135deg, #BAE6FD, #93C5FD)'
                  : 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 60%, #67E8F9 100%)',
                padding: '13px 20px',
                fontSize: '15px', fontWeight: 600, color: '#fff',
                border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
                boxShadow: '0 4px 16px rgba(14,165,233,0.35)',
                letterSpacing: '-0.1px',
              }}
              onMouseEnter={e => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(-1.5px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(14,165,233,0.42)';
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(14,165,233,0.35)';
              }}
            >
              {isSubmitting ? (
                <>
                  <svg style={{ width: '16px', height: '16px', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" />
                    <path d="M12 3a9 9 0 0 1 9 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  Creating account…
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #F1F5F9', textAlign: 'center' }}>
          <p style={{ fontSize: '13.5px', color: '#64748B', margin: 0 }}>
            Already have an account?{' '}
            <a
              href="/login"
              style={{ fontWeight: 600, color: '#0EA5E9', textDecoration: 'none' }}
              onMouseEnter={e => (e.target.style.color = '#0284C7')}
              onMouseLeave={e => (e.target.style.color = '#0EA5E9')}
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
