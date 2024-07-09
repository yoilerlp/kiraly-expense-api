export type BasicPaginationData = {
  page: number;
  limit: number;
};

export enum OrderBy {
  HIGHEST = 'HIGHEST',
  LOWEST = 'LOWEST',
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
}
