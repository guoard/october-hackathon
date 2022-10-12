import Joi from "joi";

import failAction from "../utils/failAction";

const CompanyValidation = {
  name: Joi.string().required().min(2).max(50).trim(),
  logo: Joi.binary()
    .max(1024 * 1024 * 1)
    .meta({ swaggerType: "file" })
    .optional()
    .description("image file")
    .allow(null)
    .default(null),
  summary: Joi.string().required().min(10).max(1000).trim(),
};

const paramWithIdValidation = {
  id: Joi.string()
    .regex(new RegExp("^[0-9a-fA-F]{24}$"))
    .required()
    .messages({ "string.pattern.base": "Invalid id" }),
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
