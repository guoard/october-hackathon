import { Schema, Document, Model } from "mongoose";

export interface IAdvocate {
  name: string;
  profile_pic: string;
  short_bio: string;
  long_bio: string;
  advocate_years_exp: number;
  company: Schema.Types.ObjectId;
  links: {
    youtube: string;
    twitter: string;
    github: string;
  };
}

export interface IAdvocateDocument extends IAdvocate, Document {}

export interface IAdvocateModel extends Model<IAdvocateDocument> {}
