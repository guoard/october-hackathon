import Boom from "@hapi/boom";
import { Request, ResponseToolkit } from "@hapi/hapi";
import advocatePayload from "../types/advocatePayload";

import savePhoto from "../utils/uploadPhoto";
import Company from "../models/companyModel";
import Advocate from "../models/advocateModel";

export const getAdvocate = async (req: Request, h: ResponseToolkit) => {
  const { id } = req.params;

  const advocate = await Advocate.findById(id);
  if (!advocate) {
    return Boom.notFound("Advocate does not exists");
  }

  return h.response(advocate);
};

export const listAdvocates = async (req: Request, h: ResponseToolkit) => {
  const advocates = await Advocate.find({}).sort({ createdAt: -1 });

  return h.response(advocates);
};

export const createAdvocate = async (req: Request, h: ResponseToolkit) => {
  const {
    name,
    profile_pic,
    short_bio,
    long_bio,
    advocate_years_exp,
    company,
    links,
  } = req.payload as advocatePayload;

  if (company) {
    const thisCompany = await Company.findById(company);
    if (!thisCompany) {
      return Boom.notFound("Company does not exists");
    }
  }

  let fileName: string | null = null;
  if (profile_pic) {
    fileName = await savePhoto(profile_pic);
  }

  const advocate = await Advocate.create({
    name,
    profile_pic: fileName,
    short_bio,
    long_bio,
    advocate_years_exp,
    company,
    links,
  });

  const populatedAdvocate = await advocate.populate({
    path: "company",
    select: "id name logo",
  });

  return h.response(populatedAdvocate).code(201);
};

export const updateAdvocate = async (req: Request, h: ResponseToolkit) => {
  const { id } = req.params;
  const {
    name,
    profile_pic,
    short_bio,
    long_bio,
    advocate_years_exp,
    company,
    links,
  } = req.payload as advocatePayload;

  const advocate = await Advocate.findById(id);
  if (!advocate) {
    return Boom.notFound("Advocate does not exists");
  }

  if (company) {
    const thisCompany = await Company.findById(company);
    if (!thisCompany) {
      return Boom.notFound("Company does not exists");
    }
  }

  //TODO: Check if it is same picture
  advocate.deleteProfilePic();

  let fileName: string | null = null;
  if (profile_pic) {
    fileName = await savePhoto(profile_pic);
  }

  advocate.name = name;
  advocate.profile_pic = fileName;
  advocate.short_bio = short_bio;
  advocate.long_bio = long_bio;
  advocate.advocate_years_exp = advocate_years_exp;
  advocate.company = company;
  advocate.links = links;

  const populatedAdvocate = await advocate.populate({
    path: "company",
    select: "id name logo",
  });

  return h.response(populatedAdvocate);
};

export const deleteAdvocate = async (req: Request, h: ResponseToolkit) => {
  const { id } = req.params;

  const advocate = await Advocate.findById(id);
  if (!advocate) {
    return Boom.notFound("Advocate does not exists");
  }

  advocate.deleteProfilePic();
  await advocate.delete();

  return h.response().code(204);
};
