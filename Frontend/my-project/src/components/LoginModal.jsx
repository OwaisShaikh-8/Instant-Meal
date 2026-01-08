import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useAuth from "../hooks/use-auth";
// 1️⃣ Zod schema for login
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const LoginModal = ({ isOpen, setIsOpen, openRegisterModal }) => {
  
    const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });


const {loginUser, isLoginLoading} = useAuth()

  // 4️⃣ Form submit
  const onSubmit = async (data) => {
    loginUser(data)
  }
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
          <h2 className="text-3xl font-bold text-[#2D3748] mb-2">Welcome Back</h2>
          <p className="text-sm text-gray-500">
            Sign in to your <span className="font-semibold text-[#FFA31A]">InstantMeal</span> account
          </p>
        </div>

        {/* Login Form */}
        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full bg-gray-50 text-gray-800 rounded-xl px-5 py-4 border-0 focus:ring-2 focus:ring-[#FFA31A]/50 outline-none shadow-sm"
            {...register("email")}
          />
          {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-gray-50 text-gray-800 rounded-xl px-5 py-4 border-0 focus:ring-2 focus:ring-[#FFA31A]/50 outline-none shadow-sm"
            {...register("password")}
          />
          {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}

          <button
            type="submit"
            disabled={isLoginLoading}
            className="bg-gradient-to-r from-[#FFA31A] to-[#FF8A00] text-white font-semibold py-4 rounded-xl shadow-md hover:shadow-lg mt-2"
          >
            {isLoginLoading ? "Logging in..." : "Login to Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 text-gray-500 text-sm">New to InstantMeal?</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <button
            type="button"
            className="text-[#FFA31A] font-semibold hover:text-[#e98f00] transition-colors flex items-center justify-center mx-auto"
            onClick={() => {
              setIsOpen(false);
              openRegisterModal(); // open create account modal
            }}
          >
            Create an account
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};


export default React.memo(LoginModal);
