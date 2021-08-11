export interface Pagination {
  previousCursor: string;
  nextCursor: string;
  total: number;
}

export const PaginationSchema = {
  name: 'Pagination',
  properties: {
    previousCursor: 'string',
    nextCursor: 'string?',
    total: 'int',
  },
};