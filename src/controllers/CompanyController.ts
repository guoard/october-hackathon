import Boom from "@hapi/boom";
import { Request, ResponseToolkit } from "@hapi/hapi";

import Company from "../models/companyModel";
import savePhoto from "../utils/uploadPhoto";
import Advocate from "../models/advocateModel";
import APIFeatures from "../utils/apiFeatures";
import companyPayload from "../types/companyPayload";

export const getCompany = async (req: Request, h: ResponseToolkit) => {
  const { id } = req.params;

  const company = await Company.findById(id);
  if (!company) {
    return Boom.notFound("Company does not exists");
  }

  return h.response(company);
};

export const listCompanies = async (req: Request, h: ResponseToolkit) => {
  const features = new APIFeatures(Company.find(), req.query)
    .filter()
    .sort()
    .paginate();

  const companies = await features.query;

  return h.response(companies);
};

export const createCompany = async (req: Request, h: ResponseToolkit) => {
  const { name, logo, summary } = req.payload as companyPayload;

  let fileName: string | null = null;
  if (logo) {
    fileName = await savePhoto(logo);
  }

  const company = await Company.create({
    name,
    summary,
    logo: fileName,
  });
  return h.response(company).code(201);
};

export const updateCompany = async (req: Request, h: ResponseToolkit) => {
  const { id } = req.params;
  const { name, logo, summary } = req.payload as companyPayload;

  const company = await Company.findById(id);
  if (!company) {
    return Boom.notFound("Company does not exists");
  }

  //TODO: Check if it is same picture
  company.deleteLogo();

  let fileName: string | null = null;
  if (logo) {
    fileName = await savePhoto(logo);
  }

  company.name = name;
  company.summary = summary;
  company.logo = fileName;
  await company.save();

  return h.response(company);
};

export const deleteCompany = async (req: Request, h: ResponseToolkit) => {
  const { id } = req.params;

  const company = await Company.findById(id);
  if (!company) {
    return Boom.notFound("Company does not exists");
  }

  const advocateCount = await Advocate.countDocuments({ company: id });
  if (advocateCount > 0) {
    return Boom.badRequest(
      "Can not delete company, because it associated with advocates."
    );
  }

  company.deleteLogo();
  await company.delete();

  return h.response().code(204);
};
