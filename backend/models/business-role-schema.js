import mongoose from "mongoose";

const  BusinessRoleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User", // or "Vendor"
    required: true,
    unique: true, // ensure one document per user/vendor
  },
  roles: {
    admin: {
      secretKey: { type: String, default: "", required: true },
      isSet: { type: Boolean, default: false }, // admin is always set
      index: true,
    },
    manager: {
      secretKey: { type: String, default: "" },
      isSet: { type: Boolean, default: false },
      index: true,
    },
    chef: {
      secretKey: { type: String, default: "" },
      isSet: { type: Boolean, default: false },
      index: true,
    },
    deliveryPartner: {
      secretKey: { type: String, default: "" },
      isSet: { type: Boolean, default: false },
      index: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Optional: Compound index if you query by multiple roles frequently
RestaurantAdminSchema.index(
  { "roles.admin.secretKey": 1, "roles.manager.secretKey": 1 },
  { name: "roles_admin_manager_index" }
);

export const BusinessRole = mongoose.model(
  "BusinessRole",
  BusinessRoleSchema
);
