import mongoose from "mongoose";

const BusinessRoleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  roles: {
    admin: {
      personName: { type: String, default: "" },
      secretKey: { type: String, default: "" },
      isSet: { type: Boolean, default: false },
    },
    manager: {
      personName: { type: String, default: "" },
      secretKey: { type: String, default: "" },
      isSet: { type: Boolean, default: false },
    },
    chef: {
      personName: { type: String, default: "" },
      secretKey: { type: String, default: "" },
      isSet: { type: Boolean, default: false },
    },
    deliveryPartner: {
      personName: { type: String, default: "" },
      secretKey: { type: String, default: "" },
      isSet: { type: Boolean, default: false },
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/* ✅ PASTE MIDDLEWARE HERE */
BusinessRoleSchema.pre("save", function (next) {
  const roles = this.roles;

  Object.keys(roles).forEach((role) => {
    const { personName, secretKey } = roles[role];

    roles[role].isSet =
      Boolean(personName && personName.trim()) ||
      Boolean(secretKey && secretKey.trim());
  });

  next();
});

/* (Optional) indexes */
BusinessRoleSchema.index({ "roles.admin.secretKey": 1 });
BusinessRoleSchema.index({ "roles.manager.secretKey": 1 });

/* ✅ Model creation MUST be last */
const BusinessRole = mongoose.model("BusinessRole", BusinessRoleSchema);

export default BusinessRole;
