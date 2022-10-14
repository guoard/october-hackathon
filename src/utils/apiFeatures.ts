import { RequestQuery } from "@hapi/hapi";

class APIFeatures {
  constructor(public query: any, public readonly queryString: RequestQuery) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    if (this.queryString.query) {
      this.query.find({ name: { $regex: this.queryString.query } });
    }

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;
