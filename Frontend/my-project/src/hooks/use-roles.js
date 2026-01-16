import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetRolesQuery,
  useCreateRolesMutation,
  useDeleteRoleMutation,
  useSwitchRoleMutation,
} from "../services/roles-api.js";
import { resetRoles } from "../redux/slice/roles-slice.js";
import useAuth from "./use-auth.js";

const useRoles = ({ 
  userId = null, 
} = {}) => {
  const dispatch = useDispatch();
  const { hasRoles } = useAuth();

  // 📦 Redux state
  const allRoles = useSelector((state) => state.roles.allRoles);
  const activeRole = useSelector((state) => state.roles.activeRole);

  // 🔹 Queries (with conditional fetching)
  const { 
    isLoading: isRolesLoading, 
    isError: isRolesError, 
    error: rolesError,
    refetch: refetchRoles 
  } = useGetRolesQuery(userId, { 
    skip: !hasRoles || !userId 
  });


 

  // 🔹 Mutations
  const [createRoles, { 
    isLoading: isCreateRolesLoading, 
    isError: isCreateRolesError, 
    error: createRolesError 
  }] = useCreateRolesMutation();

 
  const [deleteRole, { 
    isLoading: isDeleteRoleLoading, 
    isError: isDeleteRoleError, 
    error: deleteRoleError 
  }] = useDeleteRoleMutation();

  const [switchRole, { 
    isLoading: isSwitchRoleLoading, 
    isError: isSwitchRoleError, 
    error: switchRoleError 
  }] = useSwitchRoleMutation();

  // =====================
  // 🚀 Actions
  // =====================

  // Manual refetch roles
  const fetchRoles = useCallback(async () => {
    try {
      const response = await refetchRoles();
      return response.data;
    } catch {
      // ✅ Error handled by axios interceptor
    }
  }, [refetchRoles]);

  // Create new role
  const createUserRoles = useCallback(async (rolesData) => {
    try {
      const response = await createRoles(rolesData).unwrap();
      return response;
    } catch {
      // ✅ Error handled by axios interceptor
    }
  }, [createRoles]);

  // Update existing role


  // Delete role
  const deleteUserRole = useCallback(async (roleId) => {
    try {
      const response = await deleteRole(roleId).unwrap();
      return response;
    } catch {
      // ✅ Error handled by axios interceptor
    }
  }, [deleteRole]);

  // Switch active role
  const changeActiveRole = useCallback(async (payload) => {
    try {
      const response = await switchRole(payload).unwrap();
      return response;
    } catch {
      // ✅ Error handled by axios interceptor
    }
  }, [switchRole]);



  const resetUserRoles = useCallback(() => {
    dispatch(resetRoles());
  }, [dispatch]);

 
  return {
    // State
    allRoles,
    activeRole,

    // Actions
    fetchRoles,
    createUserRoles,
    deleteUserRole,
    changeActiveRole,
    resetUserRoles,

    // Loading states
    isRolesLoading,
    isCreateRolesLoading,
    isDeleteRoleLoading,
    isSwitchRoleLoading,

    // Error flags
    isRolesError,
    isCreateRolesError,
    isDeleteRoleError,
    isSwitchRoleError,

    // Error objects (if needed for specific handling)
    rolesError,
    createRolesError,
    deleteRoleError,
    switchRoleError,

    
  };
};

export default useRoles;