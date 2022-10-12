import Boom from "@hapi/boom";
import { Request, ResponseToolkit } from "@hapi/hapi";
import advocatePayload from "../types/advocatePayload";

import savePhoto from "../utils/uploadPhoto";
import Company from "../models/companyModel";
import Advocate from "../models/advocateModel";
import runInTransaction from "../utils/runInTransaction";

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

  const createdAdvocate = await runInTransaction(async (session) => {
    let thisCompany: any;

    if (company) {
      thisCompany = await Company.findById(company);
      if (!thisCompany) {
        return false;
      }
    }

    let fileName: string | null = null;
    if (profile_pic) {
      fileName = await savePhoto(profile_pic);
    }

    const advocate = await Advocate.create(
      [
        {
          name,
          profile_pic: fileName,
          short_bio,
          long_bio,
          advocate_years_exp,
          company,
          links,
        },
      ],
      { session }
    );

    if (thisCompany) {
      thisCompany.advocates.push(advocate[0]._id);
    }

    await thisCompany.save({ session });

    return advocate[0];
  });

  if (!createdAdvocate) {
    return Boom.notFound("Company does not exists");
  }

  const populatedAdvocate = await createdAdvocate.populate({
    path: "company",
    select: "id name logo -advocates",
  });

  return h.response(populatedAdvocate).code(201);
};

//TODO: check populate updated advocate
//TODO: use transaction to update advocate
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
//TODO: remove advocate from associated company
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
