import Joi from "joi";
import { Request, ResponseToolkit } from "@hapi/hapi";

const CompanyValidation = {
  name: Joi.string().required().max(100),
  logo: Joi.any()
    .meta({ swaggerType: "file" })
    .optional()
    .allow("")
    .description("image file"),
  summary: Joi.string().required().min(10),
};

const paramWithIdValidation = {
  id: Joi.string()
    .regex(new RegExp("^[0-9a-fA-F]{24}$"))
    .required()
    .messages({ "string.pattern.base": "Invalid id" }),
};

const failAction = (_request: Request, _h: ResponseToolkit, err: any) => {
  throw err;
};

export const createCompanyValidate = {
  payload: CompanyValidation,
  failAction,
};

export const updateCompanyValidate = {
  payload: CompanyValidation,
  params: paramWithIdValidation,
  failAction,
};

export const deleteCompanyValidate = {
  params: paramWithIdValidation,
  failAction,
};

export const getCompanyValidate = {
  params: paramWithIdValidation,
  failAction,
};
