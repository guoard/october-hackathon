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

const Company = model<ICompanyDocument, ICompanyModel>(
  "Company",
  CompanySchema,
  "companies"
);

export default Company;
