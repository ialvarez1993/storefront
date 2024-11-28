export interface Feature {
  data?: Datum[];
  meta?: Meta;
}

export interface Datum {
  id?: number;
  documentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date;
  locale?: string;
  ImageCategoriesHome?: ImageCategoriesHome[];
  localizations?: any[];
}

export interface ImageCategoriesHome {
  id?: number;
  documentId?: string;
  name?: string;
  alternativeText?: null;
  caption?: null;
  width?: number;
  height?: number;
  formats?: Formats;
  hash?: string;
  ext?: string;
  mime?: string;
  size?: number;
  url?: string;
  previewUrl?: null;
  provider?: string;
  provider_metadata?: null;
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date;
  locale?: null;
}

export interface Formats {
  thumbnail?: Large;
  medium?: Large;
  small?: Large;
  large?: Large;
}

export interface Large {
  name?: string;
  hash?: string;
  ext?: string;
  mime?: string;
  path?: null;
  width?: number;
  height?: number;
  size?: number;
  sizeInBytes?: number;
  url?: string;
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

