import BusinessRole from "../models/business-role-schema.js";


export const createBusinessRole = async (req, res) => {
    try {
        const { user, roles } = req.body;

        // Check if roles already exist for this user
        const existingRole = await BusinessRole.findOne({ user });

        if (existingRole) {
            return res.status(400).json({
                success: false,
                message: "Business roles already exist for this user",
            });
        }

        const businessRole = await BusinessRole.create({
            user,
            roles,
        });
        res.status(201).json({
            success: true,
            message: "Business roles created successfully",
            allRoles: roles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create business roles",
            error: error.message,
        });
    }
};


export const getBusinessRoleByUser = async (req, res) => {
    console.log("get controller hit")
    try {
        const { id } = req.query;

        const businessRole = await BusinessRole.findOne({ user: id })
            .select(
                "-roles.admin.secretKey -roles.manager.secretKey -roles.chef.secretKey -roles.deliveryPartner.secretKey"
            )

        //   console.log(id);

        if (!businessRole) {
            return res.status(404).json({
                success: false,
                message: "Business roles not found",
            });
        }

        res.status(200).json({
            success: true,
            allRoles: businessRole.roles,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch business roles",
            error: error.message,
        });
    }
};


// Helper for veriybusiness roles

export const verifyRoleSecretKey = async (req, res ) => {
    console.log("verify route hit")
    try {
        const { userId, roleName,secretKey } = req.body;

        if (!userId || !secretKey) {
            return res.status(400).json({
                success: false,
                message: "userId and secretKey are required",
            });
        }

        const businessRole = await BusinessRole.findOne({
            user: userId,
            [`roles.${roleName}.secretKey`]: secretKey,
            [`roles.${roleName}.isSet`]: true,
        });

        if (!businessRole) {
            return res.status(401).json({
                success: false,
                message: `${roleName} secret key is invalid`,
            });
        }

        res.status(200).json({
            success: true,
            message: `${roleName} verified successfully`,
            activeRole: {
                name: businessRole.roles[roleName].personName,
                role: roleName,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Role verification failed",
            error: error.message,
        });
    }
};

