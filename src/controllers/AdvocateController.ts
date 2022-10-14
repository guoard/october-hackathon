import Boom from "@hapi/boom";
import { Request, ResponseToolkit } from "@hapi/hapi";

import savePhoto from "../utils/uploadPhoto";
import Company from "../models/companyModel";
import APIFeatures from "../utils/apiFeatures";
import Advocate from "../models/advocateModel";
import advocatePayload from "../types/advocatePayload";
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
  const features = new APIFeatures(Advocate.find(), req.query)
    .filter()
    .sort()
    .paginate();

  const advocates = await features.query;

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
        throw Boom.notFound("Company does not exists");
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
      await thisCompany.save({ session });
    }

    return advocate[0];
  });

  const populatedAdvocate = await createdAdvocate.populate({
    path: "company",
    select: "id name logo -advocates",
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

  const updatedAdvocate = await runInTransaction(async (session) => {
    let thisCompany: any;

    if (company) {
      thisCompany = await Company.findById(company);
      if (!thisCompany) {
        throw Boom.notFound("Company does not exists");
      }
    }

    //TODO: Check if it is same picture
    advocate.deleteProfilePic();

    let fileName: string | null = null;
    if (profile_pic) {
      fileName = await savePhoto(profile_pic);
    }

    //TODO: do not delete if is same with next company
    //Remove this advocate from privious company
    if (advocate.company) {
      const previousComapny = await Company.findById(advocate.company);
      previousComapny!.advocates = previousComapny!.advocates.filter(
        (element: any) => {
          element._id !== advocate._id;
        }
      );
      await previousComapny!.save({ session });
    }

    //Add this advocage to new company
    if (thisCompany) {
      thisCompany.advocates.push(advocate._id);
      await thisCompany.save({ session });
    }

    advocate.name = name;
    advocate.profile_pic = fileName;
    advocate.short_bio = short_bio;
    advocate.long_bio = long_bio;
    advocate.advocate_years_exp = advocate_years_exp;
    advocate.company = company;
    advocate.links = links;

    await advocate.save({ session });

    return advocate;
  });

  const populatedAdvocate = await updatedAdvocate.populate({
    path: "company",
    select: "id name logo -advocates",
  });

  return h.response(populatedAdvocate);
};

export const deleteAdvocate = async (req: Request, h: ResponseToolkit) => {
  const { id } = req.params;

  const advocate = await Advocate.findById(id);
  if (!advocate) {
    return Boom.notFound("Advocate does not exists");
  }

  runInTransaction(async (session) => {
    if (advocate.company) {
      const comapny = await Company.findById(advocate.company);
      comapny!.advocates = comapny!.advocates.filter((element: any) => {
        element._id !== advocate._id;
      });
      await comapny!.save({ session });
    }

    advocate.deleteProfilePic();

    await advocate.delete({ session });
  });

  return h.response().code(204);
};
