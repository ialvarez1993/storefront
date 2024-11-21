export interface Feature {
    titleData?: TitleData;
}

export interface TitleData {
    data?: Data;
    meta?: Meta;
}

export interface Data {
    id?: number;
    documentId?: string;
    TitleDiscount?: string;
    createdAt?: Date;
    updatedAt?: Date;
    publishedAt?: Date;
    locale?: string;
}

export interface Meta {
}
