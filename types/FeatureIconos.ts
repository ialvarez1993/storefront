export interface featureIconos {
  data?: Datum[];
  meta?: Meta;
}

export interface Datum {
  id?: number;
  documentId?: string;
  Title?: string;
  Subtext?: string;
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date;
  locale?: string;
}

export interface Meta {
  pagination?: Pagination;
}

export interface Pagination {
  page?: number;
  pageSize?: number;
  pageCount?: number;
  total?: number;
}
