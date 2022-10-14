import { ServerRoute } from "@hapi/hapi";

import {
  getAdvocate,
  listAdvocates,
  createAdvocate,
  updateAdvocate,
  deleteAdvocate,
} from "../controllers/AdvocateController";

import {
  getAllAdvocates,
  getAdvocateValidate,
  createAdvocateValidate,
  updateAdvocateValidate,
  deleteAdvocateValidate,
} from "../validations/AdvocateValidation";

const advocateRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/advocates",
    handler: listAdvocates,
    options: {
      validate: getAllAdvocates,
    },
  },
  {
    method: "GET",
    path: "/advocates/{id}",
    handler: getAdvocate,
    options: {
      validate: getAdvocateValidate,
    },
  },
  {
    method: "POST",
    path: "/advocates",
    handler: createAdvocate,
    options: {
      payload: {
        multipart: {
          output: "data",
        },
      },
      validate: createAdvocateValidate,
    },
  },
  {
    method: "PUT",
    path: "/advocates/{id}",
    handler: updateAdvocate,
    options: {
      payload: {
        multipart: {
          output: "data",
        },
      },
      validate: updateAdvocateValidate,
    },
  },
  {
    method: "DELETE",
    path: "/advocates/{id}",
    handler: deleteAdvocate,
    options: {
      validate: deleteAdvocateValidate,
    },
  },
];

export default advocateRoutes;
