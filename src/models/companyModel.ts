import fs from "fs";
import Path from "path";
import Boom from "@hapi/boom";
import { Schema, model } from "mongoose";

import { ICompanyDocument, ICompanyModel } from "../interfaces/ICompany";

const CompanySchema: Schema<ICompanyDocument> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
    },
    summary: {
      type: String,
    },
  },
  {
    toJSON: {
      transform: function (_doc, ret) {
        return {
          id: ret._id,
          name: ret.name,
          logo: ret.logo ? `/media/${ret.logo}` : ret.logo,
          summary: ret.summary,
        };
      },
    },
    timestamps: true,
  }
);

CompanySchema.methods.deleteLogo = async function () {
  if (this.logo) {
    console.log("deleting logo...");
    fs.unlink(Path.join(__dirname, "..", "..", "media", this.logo), (err) => {
      if (err) {
        throw Boom.internal();
      }
      console.log("logo deleted successfully");
    });
  }
};

const Company = model<ICompanyDocument, ICompanyModel>(
  "Company",
  CompanySchema,
  "companies"
);

export default Company;
