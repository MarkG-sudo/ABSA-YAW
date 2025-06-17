import Joi from "joi";



export const registerUserValidator = Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    email: Joi.string().email().required().label("Email"),
    phone: Joi.string().pattern(/^\+?\d{10,15}$/).label("Phone Number"),
    password: Joi.string().min(8).required().label("Password"),
    avatar: Joi.string().uri().allow("").label("Profile Picture"),
    role: Joi.string().lowercase().valid("buyer", "vendor", "farmer", "investor", "admin", "super_admin").default("buyer").label("Role"),
    status: Joi.string().lowercase().valid('pending', 'approved', 'suspended').default('pending'),
    adminSecret: Joi.string().valid(process.env.ADMIN_SECRET).label("Admin Secret").optional()
}).unknown(false); 


export const loginUserValidator = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
});

export const updateUserValidator = Joi.object({
    firstName: Joi.string().label("First Name"),
    lastName: Joi.string().label("Last Name"),
    email: Joi.string().email().label("Email"),
    phone: Joi.string().pattern(/^\+?\d{10,15}$/).label("Phone Number"),
    password: Joi.string().min(6).label("Password"),
    avatar: Joi.string().uri().allow("").label("Profile Picture"),
    role: Joi.string().lowercase().valid("buyer", "vendor", "farmer", "investor", "admin").label("Role"),
});