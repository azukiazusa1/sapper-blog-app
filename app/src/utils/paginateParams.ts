import { PER_PAGE } from "../constants";

export const paginateParams = (page: number) => {
  const limit = PER_PAGE;
  const skip = (page - 1) * PER_PAGE;

  return {
    limit,
    skip,
  };
};
