import Joi from "joi";
import failAction from "../utils/failAction";

const AdvocateValidation = {
  name: Joi.string().required().min(2).max(50).trim(),
  profile_pic: Joi.binary()
    .max(1024 * 1024 * 1)
    .meta({ swaggerType: "file" })
    .description("image file")
    .allow(null)
    .default(null),
  short_bio: Joi.string().min(10).max(100).trim().allow(null).default(null),
  long_bio: Joi.string().min(10).max(1000).trim().allow(null).default(null),
  advocate_years_exp: Joi.number().default(0).min(1).max(40),
  company: Joi.string()
    .regex(new RegExp("^[0-9a-fA-F]{24}$"))
    .messages({ "string.pattern.base": "Invalid id" })
    .allow(null)
    .default(null),
  links: Joi.object({
    youtube: Joi.string().uri().allow(null).default(null),
    twitter: Joi.string().uri().allow(null).default(null),
    github: Joi.string().uri().allow(null).default(null),
  }).default({
    youtube: null,
    twitter: null,
    github: null,
  }),
};

const paramWithIdValidation = {
  id: Joi.string()
    .regex(new RegExp("^[0-9a-fA-F]{24}$"))
    .required()
    .messages({ "string.pattern.base": "Invalid id" }),
};

export const getAdvocateValidate = {
  params: paramWithIdValidation,
  failAction,
};
export const createAdvocateValidate = {
  payload: AdvocateValidation,
  failAction,
};
export const updateAdvocateValidate = {
  payload: AdvocateValidation,
  params: paramWithIdValidation,
  failAction,
};
export const deleteAdvocateValidate = {
  params: paramWithIdValidation,
  failAction,
};
