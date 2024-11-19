// types/banner.ts
export interface Banner {
    data: BannerData[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

export interface BannerData {
    id: number;
    attributes: {
        title: string;
        subtitle: string;
        price: number;
        discount: number;
        image: {
            data: {
                attributes: {
                    url: string;
                };
            };
        };
        brand: string;
        createdAt: string;
        updatedAt: string;
        locale: string;
    };
}

export interface Slide {
    title: string;
    subtitle: string;
    price: number;
    discount: number;
    image: string;
    brand: string;
}
