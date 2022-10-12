import { Schema } from "mongoose";

type advocatePayload = {
  name: string;
  profile_pic: any;
  short_bio: string | null;
  long_bio: string | null;
  advocate_years_exp: number;
  company: Schema.Types.ObjectId | null;
  links: {
    youtube: string | null;
    twitter: string | null;
    github: string | null;
  };
};

export default advocatePayload;
