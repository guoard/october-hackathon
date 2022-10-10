import { Document, Model } from "mongoose";

export interface ICompany {
  name: string;
  logo: string;
  summary: string;
}

export interface ICompanyDocument extends ICompany, Document {}

export interface ICompanyModel extends Model<ICompanyDocument> {}
