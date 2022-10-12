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
      default: null,
    },
    summary: {
      type: String,
    },
    advocates: [
      {
        type: Schema.Types.ObjectId,
        ref: "Advocate", 
      }
    ]
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        console.log(ret)
        return {
          id: ret._id,
          name: ret.name,
          logo: ret.logo ? `/media/${ret.logo}` : ret.logo,
          summary: ret.summary,
          advocates: ret.advocates,
          href: ret.summary ? undefined : ret.href,
        };
      },
    },
    timestamps: true,
  }
);

CompanySchema.virtual("href").get(function () {
  return `/companies/${this._id}`;
});

CompanySchema.pre(/^find/, function () {
  this.populate({ path: "advocates", select: "id name short_bio -company" });
});

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
