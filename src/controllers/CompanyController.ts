import fs from "fs";
import Path from "path";

import mime from "mime-types";
import { v4 as uuidv4 } from "uuid";
import { Request, ResponseToolkit } from "@hapi/hapi";

import Company from "../models/companyModel";
import companyPayload from "../types/companyPayload";

const handleFileUpload = (
  file: any,
  filename: string
): Promise<void | Error> => {
  return new Promise((resolve, reject) => {
    const data = file._data;
    fs.writeFile(
      Path.join(__dirname, "..", "..", "media", filename),
      data,
      (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      }
    );
  });
};

export const getCompany = async (req: Request, h: ResponseToolkit) => {};
export const listCompanies = async (req: Request, h: ResponseToolkit) => {};
export const createCompany = async (req: Request, h: ResponseToolkit) => {
  const { name, logo, summary } = req.payload as companyPayload;

  //TODO: check mimetype is image
  let filename = "";
  if (logo) {
    const ext = mime.extension(logo.hapi.headers["content-type"]);
    filename = `${uuidv4()}.${ext}`;
    await handleFileUpload(logo, filename);
  }

  const company = await Company.create({
    name,
    summary,
    logo: filename,
  });
  return h.response(company).code(201);
};
export const updateCompany = async (req: Request, h: ResponseToolkit) => {};
export const deleteCompany = async (req: Request, h: ResponseToolkit) => {};
