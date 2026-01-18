import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useAuth from "../hooks/use-auth";
import useRoles from "../hooks/use-roles";
// 1️⃣ Zod schema (only secretKey)
const secretKeySchema = z.object({
  secretKey: z.string().min(1, "Secret key is required"),
});

const VerifyRoleModal = ({ isOpen, setIsOpen, roleName }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(secretKeySchema),
  });
  const { changeActiveRole, isSwitchRoleLoading } = useRoles();

  const { loggedInUser } = useAuth();
  // 2️⃣ Submit handler
  const onSubmit = async (data) => {
    const payload = {
      userId: loggedInUser._id,
      roleName: roleName.toLowerCase(),
      ...data,
    };
    console.log(payload);
    await changeActiveRole(payload);
    setIsOpen(false);
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
            Secure Access
          </h2>
          <p className="text-sm text-gray-500">
            Enter your secret key to continue
          </p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Role Name */}
          <label className="text-xl font-semibold text-gray-700 text-center">
            {roleName}
          </label>

          {/* Secret Key Input */}
          <input
            type="password"
            placeholder="Enter your secret key"
            className="w-full bg-gray-50 text-gray-800 rounded-xl px-5 py-4 border-0 focus:ring-2 focus:ring-[#FFA31A]/50 outline-none shadow-sm"
            {...register("secretKey")}
          />
          {errors.secretKey && (
            <span className="text-red-500 text-xs">
              {errors.secretKey.message}
            </span>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSwitchRoleLoading}
            className="bg-gradient-to-r from-[#FFA31A] to-[#FF8A00] text-white font-semibold py-4 rounded-xl shadow-md hover:shadow-lg mt-2"
          >
            {isSwitchRoleLoading ? "Verifying..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default React.memo(VerifyRoleModal);
