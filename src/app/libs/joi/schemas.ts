import Joi from "joi";
import { esErrors } from "@/utils/joi-es-errors";

export const schemaTask = Joi.object({
  name: Joi.string().required().messages(esErrors),
  description: Joi.string().required().messages(esErrors),
  statusid: Joi.string().required().messages(esErrors),
  priorityid: Joi.string().required().messages(esErrors),
});

export const schemaSignIn = Joi.object({
  email: Joi.string()
    .required()
    .messages(esErrors)
    .email({ tlds: { allow: false } }),
  password: Joi.string().required().min(7).messages(esErrors),
});

export const schemaSignUp = Joi.object({
  email: Joi.string()
    .required()
    .messages(esErrors)
    .email({ tlds: { allow: false } }),
  username: Joi.string().required().messages(esErrors),
  password: Joi.string().required().min(7).messages(esErrors),
  cpassword: Joi.any().valid(Joi.ref("password")).required().messages(esErrors),
});

export const schemaWorkspaces = Joi.object({
  name: Joi.string().min(4).required().messages(esErrors),
});

export const schemaChangePassword = Joi.object({
  old_password: Joi.string().required().min(7).messages(esErrors),
  new_password: Joi.string().required().min(7).messages(esErrors),
  cnew_password: Joi.any()
    .valid(Joi.ref("new_password"))
    .required()
    .messages(esErrors),
});
