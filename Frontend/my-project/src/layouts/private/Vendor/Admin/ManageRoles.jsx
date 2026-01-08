import React, { useState } from 'react';
import { UserPlus, X, AlertCircle, Users, CheckCircle } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Zod validation schema
const roleSchema = z.object({
  admin: z.object({
    person: z.string().min(3, 'Name must be at least 3 characters').max(50, 'Name too long'),
    secretKey: z.string().min(8, 'Secret key must be at least 8 characters'),
  }),
  manager: z.object({
    person: z.string().min(3, 'Name must be at least 3 characters').max(50, 'Name too long'),
    secretKey: z.string().min(8, 'Secret key must be at least 8 characters'),
  }),
  chef: z.object({
    person: z.string().min(3, 'Name must be at least 3 characters').max(50, 'Name too long'),
    secretKey: z.string().min(8, 'Secret key must be at least 8 characters'),
  }),
  deliveryPartner: z.object({
    person: z.string().min(3, 'Name must be at least 3 characters').max(50, 'Name too long'),
    secretKey: z.string().min(8, 'Secret key must be at least 8 characters'),
  }),
});

const ManageRoles = () => {
  const [addRolesActive, setAddRolesActive] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      admin: { person: '', secretKey: '' },
      manager: { person: '', secretKey: '' },
      chef: { person: '', secretKey: '' },
      deliveryPartner: { person: '', secretKey: '' },
    },
  });

  const onSubmit = async (data) => {
    console.log('Roles submitted:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setAddRolesActive(false);
      reset();
    }, 2000);
  };

  const roles = [
    { id: 'admin', label: 'Admin', name: 'admin' },
    { id: 'manager', label: 'Manager', name: 'manager' },
    { id: 'chef', label: 'Chef', name: 'chef' },
    { id: 'deliveryPartner', label: 'Delivery Partner', name: 'deliveryPartner' },
  ];

  return (
    <div className="max-w-full">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-8 h-8 text-gray-700" />
        <h3 className="text-3xl font-light text-gray-800">Manage Roles</h3>
      </div>
    
      {!addRolesActive && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200">
          <div className="flex items-start gap-4 mb-6">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-red-700 mb-2">Important Notice</h4>
              <p className="text-red-600 leading-relaxed">
                For large-scale food businesses, assigning roles like Admin, Manager, Chef, and Delivery Partner helps streamline workflows and improve efficiency. Each role will have access to a dedicated dashboard with specific permissions.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setAddRolesActive(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#FFA31A] to-[#FF8C00] px-6 py-3 rounded-xl text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <UserPlus className="w-5 h-5" />
            Assign Roles
          </button>
        </div>
      )}
      
      {addRolesActive && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-[#FFA31A] to-[#FF8C00] p-6 flex items-center justify-between">
            <div>
              <h4 className="text-2xl font-semibold text-white mb-1">Assign Roles & Credentials</h4>
              <p className="text-white/90 text-sm">Configure access for your team members</p>
            </div>
            <button 
              onClick={() => {
                setAddRolesActive(false);
                reset();
              }}
              className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-300"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {roles.map((role) => (
                <div 
                  key={role.id} 
                  className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-[#FFA31A] rounded-full"></div>
                    <h5 className="text-lg font-semibold text-gray-800">{role.label}</h5>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Person Name
                      </label>
                      <Controller
                        name={`${role.name}.person`}
                        control={control}
                        render={({ field }) => (
                          <input 
                            {...field}
                            type="text"
                            placeholder="Enter full name"
                            className={`w-full bg-white px-4 py-3 rounded-xl border ${
                              errors[role.name]?.person 
                                ? 'border-red-500 focus:ring-red-200' 
                                : 'border-gray-300 focus:border-[#FFA31A] focus:ring-[#FFA31A]/20'
                            } outline-none focus:ring-2 transition-all duration-300`}
                          />
                        )}
                      />
                      {errors[role.name]?.person && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors[role.name].person.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Secret Key
                      </label>
                      <Controller
                        name={`${role.name}.secretKey`}
                        control={control}
                        render={({ field }) => (
                          <input 
                            {...field}
                            type="password"
                            placeholder="Enter secret key"
                            className={`w-full bg-white px-4 py-3 rounded-xl border ${
                              errors[role.name]?.secretKey 
                                ? 'border-red-500 focus:ring-red-200' 
                                : 'border-gray-300 focus:border-[#FFA31A] focus:ring-[#FFA31A]/20'
                            } outline-none focus:ring-2 transition-all duration-300`}
                          />
                        )}
                      />
                      {errors[role.name]?.secretKey && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors[role.name].secretKey.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className={`w-full mt-8 bg-gradient-to-r from-[#FFA31A] to-[#FF8C00] text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : submitSuccess ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Saved Successfully!
                </>
              ) : (
                'Save Role Assignments'
              )}
            </button>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    <span className="font-semibold">Note:</span> After assigning these roles, a role-based system will be activated in your business. Each role will have access to their own customized dashboard with specific permissions and features relevant to their responsibilities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRoles;