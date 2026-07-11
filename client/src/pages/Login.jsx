import React from 'react';
import { Button } from '@/components/ui/button';
import logo from '../assets/logo.svg';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from "../validation/auth.schema"
import apiClient from "../lib/axios"

const Login = () => {

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit =async(data)=>{
      try{
          const response = await apiClient.post("/auth/login",data);
          console.log("Login Successful:", response.data);
      }catch(error){
        console.log(error)
      }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm rounded-2xl border border-[#27272A] bg-[#18181B] px-8 py-10 shadow-xl shadow-black/40">
        <div className="mb-8 flex flex-col items-center gap-4">
          <img src={logo} alt="ExpenseAI logo" className="h-16 w-auto" />
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-[#F8FAFC]">
              Welcome Back
            </h2>
            <p className="mt-1.5 text-sm text-[#94A3B8]">
              Sign in to your SpendWise account
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} action="#" method="POST" className="space-y-5">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#F8FAFC]"
            >
              Email address
            </label>
            <input
              type="email"
              {...register("email")}
              autoComplete="email"
              placeholder="abc@example.com"
              className={`block w-full rounded-lg border bg-white/5 px-3.5 py-2.5 text-sm text-[#F8FAFC] placeholder:text-[#94A3B8] outline-none transition-colors duration-150 focus:ring-2 
              ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-[#27272A] focus:border-[#38BDF8] focus:ring-[#38BDF8]/20'}`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
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
             
              type="password"
              
              {...register("password")}
              autoComplete="current-password"
              placeholder="••••••••"
              className="block w-full rounded-lg border border-[#27272A] bg-white/5 px-3.5 py-2.5 text-sm text-[#F8FAFC] placeholder:text-[#94A3B8] outline-none transition-colors duration-150 focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8]/20 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>
          <div className="pt-1">
            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-lg bg-[#38BDF8] px-4 py-2.5 text-sm font-semibold text-[#09090B] transition-colors duration-150 hover:bg-[#7DD3FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181B]"
            >
              Sign in
            </button>
          </div>
        </form>
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
  );
};

export default Login;
