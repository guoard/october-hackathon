import { Schema, Document, Model } from "mongoose";

export interface IAdvocate {
  name: string;
  profile_pic: string | null;
  short_bio: string | null;
  long_bio: string | null;
  advocate_years_exp: number;
  company: Schema.Types.ObjectId | null;
  links: {
    youtube: string | null;
    twitter: string | null;
    github: string | null;
  };
}

export interface IAdvocateDocument extends IAdvocate, Document {
  deleteProfilePic: () => void;
}

export interface IAdvocateModel extends Model<IAdvocateDocument> {}
