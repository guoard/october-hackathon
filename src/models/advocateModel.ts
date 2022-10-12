import fs from "fs";
import Path from "path";
import Boom from "@hapi/boom";
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
      default: null,
    },

    short_bio: {
      type: String,
      default: null,
    },
    long_bio: {
      type: String,
      default: null,
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
        default: null,
      },
      twitter: {
        type: String,
        default: null,
      },
      github: {
        type: String,
        default: null,
      },
    },
  },
  {
    toJSON: {
      transform: function (_doc, ret) {
        return {
          id: ret._id,
          name: ret.name,
          profile_pic: ret.profile_pic
            ? `/media/${ret.profile_pic}`
            : ret.profile_pic,
          short_bio: ret.short_bio,
          long_bio: ret.long_bio,
          advocate_years_exp: ret.advocate_years_exp,
          company: ret.company,
          links: ret.links,
        };
      },
    },
    timestamps: true,
  }
);

AdvocateSchema.pre("find", function () {
  this.populate({ path: "company", select: "id name logo" });
});

AdvocateSchema.methods.deleteProfilePic = async function () {
  if (this.profile_pic) {
    console.log("deleting profile picture...");
    fs.unlink(
      Path.join(__dirname, "..", "..", "media", this.profile_pic),
      (err) => {
        if (err) {
          throw Boom.internal();
        }
        console.log("profile picture deleted successfully");
      }
    );
  }
};

const Advocate = model<IAdvocateDocument, IAdvocateModel>(
  "Advocate",
  AdvocateSchema,
  "advocates"
);

export default Advocate;
