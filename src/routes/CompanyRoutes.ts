import { ServerRoute } from "@hapi/hapi";

import {
  getCompany,
  listCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../controllers/CompanyController";

import {
  getCompanyValidate,
  createCompanyValidate,
  updateCompanyValidate,
  deleteCompanyValidate,
} from "../validations/CompanyValidation";

const companyRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/companies",
    handler: listCompanies,
  },
  {
    method: "GET",
    path: "/companies/{id}",
    handler: getCompany,
    options: {
      validate: getCompanyValidate,
    },
  },
  {
    method: "POST",
    path: "/companies",
    handler: createCompany,
    options: {
      payload: {
        multipart: {
          output: "stream",
        },
        maxBytes: 1024 * 1024 * 1, // 1 Mb
      },
      validate: createCompanyValidate,
    },
  },
  {
    method: "PUT",
    path: "/companies/{id}",
    handler: updateCompany,
    options: {
      validate: updateCompanyValidate,
    },
  },
  {
    method: "DELETE",
    path: "/companies/{id}",
    handler: deleteCompany,
    options: {
      validate: deleteCompanyValidate,
    },
  },
];

export default companyRoutes;
