import Joi from "joi";



export const registerUserValidator = Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    email: Joi.string().email().required().label("Email"),
    phone: Joi.string().pattern(/^\+?\d{10,15}$/).label("Phone Number"),
    password: Joi.string().min(6).required().label("Password"),
    avatar: Joi.string().uri().allow("").label("Profile Picture"),
    role: Joi.string().valid("buyer", "vendor", "farmer", "investor").default("buyer").label("Role"),
});


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
    role: Joi.string().valid("buyer", "vendor", "farmer", "investor").label("Role"),
  });