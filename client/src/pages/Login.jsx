import React from 'react'
import { Button } from '@/components/ui/button'
import logo from "../assets/logo.svg";

/**
 * Login Page — Premium Dark SaaS UI
 *
 * UI Improvements:
 *  - Full-viewport vertically & horizontally centered layout
 *  - Auth card: surface bg (#18181B), 1px border (#27272A), rounded-2xl,
 *    generous px-8 py-10 padding — no glassmorphism or drop shadows
 *  - Logo constrained to h-9 so it never overwhelms the heading
 *  - Sub-heading in muted text (#94A3B8) to reinforce visual hierarchy
 *  - Inputs: taller py-2.5 touch target, sky-blue focus border + ring halo
 *  - "Forgot password?" right-aligned, sky-blue, transitions to arctic blue
 *  - CTA button: solid sky-blue (#38BDF8), near-black text for contrast,
 *    consistent height with inputs, subtle hover shift
 *  - Footer: separated from form by a 1px divider line (#27272A)
 *  - Mobile-first single-column, caps at max-w-sm on larger screens
 */
const Login = () => {
  return (
    /* Page wrapper — inherits #09090B background from :root in index.css */
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">

      {/* ── Auth Card ──────────────────────────────────────────────────── */}
      {/* Surface color (#18181B) lifts card off background. Border gives
          crisp definition without relying on a shadow (clean, Vercel-style). */}
      <div className="w-full max-w-sm rounded-2xl border border-[#27272A] bg-[#18181B] px-8 py-10 shadow-xl shadow-black/40">

        {/* ── Brand Header ───────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col items-center gap-4">
          {/* Logo: fixed height so aspect ratio is always preserved */}
          <img
            src={logo}
            alt="ExpenseAI logo"
            className="h-16 w-auto"
          />
          <div className="text-center">
            {/* Primary heading: tight tracking, full-brightness text */}
            <h2 className="text-2xl font-semibold tracking-tight text-[#F8FAFC]">
              Welcome Back
            </h2>
            {/* Sub-heading: muted to avoid competing with the heading */}
            <p className="mt-1.5 text-sm text-[#94A3B8]">
              Sign in to your ExpenseAI account
            </p>
          </div>
        </div>

        {/* ── Form ───────────────────────────────────────────────────── */}
        <form action="#" method="POST" className="space-y-5">

          {/* Email ──────────────────────────────────────────────────── */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#F8FAFC]"
            >
              Email address
            </label>
            {/* Input:
                - bg-white/5      barely-visible tint on the dark surface
                - border-[#27272A] consistent brand border at rest
                - focus:border-[#38BDF8] + focus:ring-2  sky-blue ring halo
                - py-2.5          ~44 px effective height (accessible touch target)
                - transition-colors smooth 150 ms state change, no jarring flash */}
            <input
              id="email"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="abc@example.com"
              className="block w-full rounded-lg border border-[#27272A] bg-white/5 px-3.5 py-2.5 text-sm text-[#F8FAFC] placeholder:text-[#94A3B8] outline-none transition-colors duration-150 focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8]/20"
            />
          </div>

          {/* Password ───────────────────────────────────────────────── */}
          <div className="space-y-1.5">
            {/* Row: label left, "Forgot password?" right — flex justify-between */}
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#F8FAFC]"
              >
                Password
              </label>
              {/* Tertiary action: smaller, sky-blue, transitions to arctic blue */}
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
          {/* pt-1 adds a tiny extra gap above the button for visual breathing room */}
          <div className="pt-1">
            {/* Solid sky-blue fill; near-black text (#09090B) for WCAG-compliant
                contrast. Hover shifts to arctic blue (#7DD3FC) — subtle but tactile.
                focus-visible ring uses offset against the card background color. */}
            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-lg bg-[#38BDF8] px-4 py-2.5 text-sm font-semibold text-[#09090B] transition-colors duration-150 hover:bg-[#7DD3FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181B]"
            >
              Sign in
            </button>
          </div>
        </form>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        {/* 1px divider visually separates nav from the form area */}
        <div className="mt-8 border-t border-[#27272A] pt-6">
          <p className="text-center text-sm text-[#94A3B8]">
            Not a member?{' '}
            <a
              href="/register"
              className="font-semibold text-[#38BDF8] transition-colors duration-150 hover:text-[#7DD3FC]"
            >
              Create an account
            </a>
          </p>
        </div>

      </div>
    </div>
  )
}

export default Login
