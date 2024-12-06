export interface Feature {
    data?: FeatureData;
    meta?: Meta;
}

export interface FeatureData {
    id?:           number;
    documentId?:   string;
    data?:         DataData;
    createdAt?:    Date;
    updatedAt?:    Date;
    publishedAt?:  Date;
    locale?:       string;
    logocabecera?: Logocabecera;
}

export interface DataData {
    title?:       string;
    language?:    string;
    currency?:    Currency;
    search?:      Search;
    user?:        User;
    categories?:  string[];
    information?: Information;
}

export interface Currency {
    symbol?: string;
    code?:   string;
}

export interface Information {
    aboutUs?: string;
    contact?: string;
}

export interface Search {
    placeholder?: string;
    buttonText?:  string;
}

export interface User {
    cart?:            string;
    customerSupport?: CustomerSupport;
    myAccount?:       string;
    cartItems?:       string;
}

export interface CustomerSupport {
    text?:    string;
    options?: Option[];
}

export interface Option {
    type?:   string;
    action?: string;
}

export interface Logocabecera {
    id?:                number;
    documentId?:        string;
    name?:              string;
    alternativeText?:   null;
    caption?:           null;
    width?:             number;
    height?:            number;
    formats?:           null;
    hash?:              string;
    ext?:               string;
    mime?:              string;
    size?:              number;
    url?:               string;
    previewUrl?:        null;
    provider?:          string;
    provider_metadata?: null;
    createdAt?:         Date;
    updatedAt?:         Date;
    publishedAt?:       Date;
    locale?:            null;
}

export interface Meta {
}
