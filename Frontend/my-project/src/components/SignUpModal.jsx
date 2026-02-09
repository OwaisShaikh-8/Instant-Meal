import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useAuth from "../hooks/use-auth";
// 1️⃣ Zod schema
const signupSchema = z
  .object({
    fullname: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    companyName: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignUpModal = ({ isOpen, setIsOpen, openLoginModal }) => {
  const [role, setRole] = useState("customer");

  // 2️⃣ React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const { signupUser, isSignupLoading } = useAuth();

  // 4️⃣ Submit handler
  const onSubmit = async (data) => {
    const payload = {
      fullname: data.fullname,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      role,
      ...(role === "vendor" && { companyName: data.companyName }),
    };

    signupUser(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 relative max-w-md w-full">
        {/* Close Button */}
        <button
          type="button"
          className="absolute top-4 right-4 btn btn-sm btn-circle bg-white/80 hover:bg-white text-gray-600 border-none shadow-md"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#2D3748] mb-2">
            Create an Account
          </h2>
          <p className="text-sm text-gray-500">
            Join InstantMeal as a{" "}
            <span className="font-semibold text-[#FFA31A]">
              {role === "user" ? "Food Lover" : "Restaurant Partner"}
            </span>
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`flex-1 py-3 rounded-xl font-medium transition ${
              role === "user"
                ? "bg-white text-[#FFA31A] shadow"
                : "text-gray-500"
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setRole("vendor")}
            className={`flex-1 py-3 rounded-xl font-medium transition ${
              role === "vendor"
                ? "bg-white text-[#FFA31A] shadow"
                : "text-gray-500"
            }`}
          >
            Vendor
          </button>
        </div>

        {/* Signup Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full bg-gray-50 text-gray-800 rounded-xl px-5 py-4 border-0 focus:ring-2 focus:ring-[#FFA31A]/50 outline-none shadow-sm placeholder-gray-400 hover:ring-2 hover:ring-[#FFA31A]/30 transition-all duration-200"
            {...register("fullname")}
          />
          {errors.fullname && (
            <span className="text-red-500 text-xs">
              {errors.fullname.message}
            </span>
          )}

          <input
            type="email"
            placeholder="Email Address"
            className="w-full bg-gray-50 text-gray-800 rounded-xl px-5 py-4 border-0 focus:ring-2 focus:ring-[#FFA31A]/50 outline-none shadow-sm placeholder-gray-400 hover:ring-2 hover:ring-[#FFA31A]/30 transition-all duration-200"
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email.message}</span>
          )}

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-gray-50 text-gray-800 rounded-xl px-5 py-4 border-0 focus:ring-2 focus:ring-[#FFA31A]/50 outline-none shadow-sm placeholder-gray-400 hover:ring-2 hover:ring-[#FFA31A]/30 transition-all duration-200"
            {...register("password")}
          />
          {errors.password && (
            <span className="text-red-500 text-xs">
              {errors.password.message}
            </span>
          )}

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full bg-gray-50 text-gray-800 rounded-xl px-5 py-4 border-0 focus:ring-2 focus:ring-[#FFA31A]/50 outline-none shadow-sm placeholder-gray-400 hover:ring-2 hover:ring-[#FFA31A]/30 transition-all duration-200"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-xs">
              {errors.confirmPassword.message}
            </span>
          )}

          {role === "vendor" && (
            <input
              type="text"
              placeholder="Business Name"
              className="w-full bg-gray-50 text-gray-800 rounded-xl px-5 py-4 border-0 focus:ring-2 focus:ring-[#FFA31A]/50 outline-none shadow-sm placeholder-gray-400 hover:ring-2 hover:ring-[#FFA31A]/30 transition-all duration-200"
              {...register("companyName")}
            />
          )}

          <button
            type="submit"
            disabled={isSignupLoading}
            className="bg-gradient-to-r from-[#FFA31A] to-[#FF8A00] text-white font-semibold py-4 rounded-xl shadow-md hover:shadow-lg mt-2"
          >
            {isSignupLoading
              ? "Creating Account..."
              : role === "user"
              ? "Create User Account"
              : "Create Vendor Account"}
          </button>
        </form>
        {/* Footer */}
        <div className="text-center mt-6">
          <button
            type="button"
            className="text-[#FFA31A] font-semibold hover:text-[#e98f00]"
            onClick={() => {
              setIsOpen(false);
              openLoginModal();
            }}
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SignUpModal);
