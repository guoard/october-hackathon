import { Schema, Document, Model } from "mongoose";

export interface ICompany {
  name: string;
  logo: string | null;
  summary: string;
  advocates: Schema.Types.ObjectId[];
}

export interface ICompanyDocument extends ICompany, Document {
  deleteLogo: () => void;
}

export interface ICompanyModel extends Model<ICompanyDocument> {}
