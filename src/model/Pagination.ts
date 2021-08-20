export interface Pagination {
  previousCursor: string;
  nextCursor: string;
  total: number;
  loading?: null | boolean;
}

export const PaginationSchema = {
  name: 'Pagination',
  properties: {
    loading: 'bool?',
    previousCursor: 'string?',
    nextCursor: 'string?',
    total: 'int?',
  },
};