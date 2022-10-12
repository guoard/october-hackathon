import { Document, Model } from "mongoose";

export interface ICompany {
  name: string;
  logo: string | null;
  summary: string;
}

export interface ICompanyDocument extends ICompany, Document {
  deleteLogo: () => void;
}

export interface ICompanyModel extends Model<ICompanyDocument> {}
