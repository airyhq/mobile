export interface Pagination {
  previousCursor: string | null;
  nextCursor: string | null;
  total: number | null;
  loading?: boolean | null;
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

export const FilterConversationPaginationSchema = {
  name: 'FilterConversationPagination',
  properties: {
    loading: 'bool?',
    previousCursor: 'string?',
    nextCursor: 'string?',
    total: 'int?',
  },
};
