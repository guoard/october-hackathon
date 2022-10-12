import { Request, ResponseToolkit } from "@hapi/hapi";

export default (_request: Request, _h: ResponseToolkit, err: any) => {
  throw err;
};
