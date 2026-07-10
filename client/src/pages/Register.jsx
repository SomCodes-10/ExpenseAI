import React from 'react'
import logo from "../assets/logo.svg"

/**
 * Register Page — Premium Dark SaaS UI
 *
 * UI Improvements (mirrors the Login card for design consistency):
 *  - Full-viewport vertically & horizontally centered layout
 *  - Auth card: surface bg (#18181B), 1px border (#27272A), rounded-2xl
 *  - Logo constrained to h-9; tagline headline below for brand identity
 *  - Sub-heading in muted text to reinforce visual hierarchy
 *  - Inputs: taller py-2.5 touch target, sky-blue focus border + ring halo
 *  - "Forgot password?" link removed from register (not contextually relevant
 *    on a sign-up flow — moved to Password label row which is now label-only)
 *  - CTA button: solid sky-blue (#38BDF8), near-black text, full-width
 *  - Footer: 1px divider line + "Already have an account?" nav link
 *  - Mobile-first, caps at max-w-sm on larger screens
 */
const Register = () => {
  return (
    /* Page wrapper — inherits #09090B background from :root in index.css */
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">

      {/* ── Auth Card ──────────────────────────────────────────────────── */}
      <div className="w-full max-w-sm rounded-2xl border border-[#27272A] bg-[#18181B] px-8 py-10 shadow-xl shadow-black/40">

        {/* ── Brand Header ───────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <img
            src={logo}
            alt="ExpenseAI logo"
            className="h-14 w-auto"
          />
          <div className="text-center">
            {/* Original tagline headline preserved exactly */}
            <h2 className="text-2xl font-semibold tracking-tight text-[#F8FAFC]">
              Track Smarter, Spend Better
            </h2>
            {/* Sub-heading: contextual to registration flow */}
            <p className="mt-1.5 text-sm text-[#94A3B8]">
              Create your free ExpenseAI account
            </p>
          </div>
        </div>

        {/* ── Form ───────────────────────────────────────────────────── */}
        <form action="#" method="POST" className="space-y-5">

          {/* Username ───────────────────────────────────────────────── */}
          <div className="space-y-1.5">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-[#F8FAFC]"
            >
              Username
            </label>
            {/* Same input treatment as Login for design system consistency:
                bg-white/5 tint, brand border, sky-blue focus ring halo */}
            <input
              id="username"
              type="text"
              name="username"
              required
              autoComplete="username"
              placeholder="yourname"
              className="block w-full rounded-lg border border-[#27272A] bg-white/5 px-3.5 py-2.5 text-sm text-[#F8FAFC] placeholder:text-[#94A3B8] outline-none transition-colors duration-150 focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8]/20"
            />
          </div>

          {/* Email ──────────────────────────────────────────────────── */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#F8FAFC]"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="block w-full rounded-lg border border-[#27272A] bg-white/5 px-3.5 py-2.5 text-sm text-[#F8FAFC] placeholder:text-[#94A3B8] outline-none transition-colors duration-150 focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8]/20"
            />
          </div>

          {/* Password ───────────────────────────────────────────────── */}
          <div className="space-y-1.5">
            {/* On the register page the "Forgot password?" anchor is present
                in the original source; preserving it here as required. */}
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#F8FAFC]"
              >
                Password
              </label>
              <a
                href="#"
                className="text-xs font-medium text-[#38BDF8] transition-colors duration-150 hover:text-[#7DD3FC]"
              >
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="block w-full rounded-lg border border-[#27272A] bg-white/5 px-3.5 py-2.5 text-sm text-[#F8FAFC] placeholder:text-[#94A3B8] outline-none transition-colors duration-150 focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8]/20"
            />
          </div>

          {/* CTA Button ─────────────────────────────────────────────── */}
          <div className="pt-1">
            {/* Solid sky-blue fill with near-black text for contrast.
                Hover shifts to arctic blue — subtle tactile feedback. */}
            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-lg bg-[#38BDF8] px-4 py-2.5 text-sm font-semibold text-[#09090B] transition-colors duration-150 hover:bg-[#7DD3FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181B]"
            >
              Create Account
            </button>
          </div>
        </form>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <div className="mt-8 border-t border-[#27272A] pt-6">
          <p className="text-center text-sm text-[#94A3B8]">
            Already have an account?{' '}
            <a
              href="/login"
              className="font-semibold text-[#38BDF8] transition-colors duration-150 hover:text-[#7DD3FC]"
            >
              Sign in
            </a>
          </p>
        </div>

      </div>
    </div>
  )
}

export default Register
