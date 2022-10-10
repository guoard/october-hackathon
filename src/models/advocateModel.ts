import { Schema, model } from "mongoose";

import { IAdvocateDocument, IAdvocateModel } from "../interfaces/IAdvocate";

const AdvocateSchema: Schema<IAdvocateDocument> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    profile_pic: {
      type: String,
    },

    short_bio: {
      type: String,
    },
    long_bio: {
      type: String,
    },
    advocate_years_exp: {
      type: Number,
      default: 0,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    links: {
      youtube: {
        type: String,
      },
      twitter: {
        type: String,
      },
      github: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Advocate = model<IAdvocateDocument, IAdvocateModel>(
  "Advocate",
  AdvocateSchema,
  "advocates"
);

export default Advocate;
