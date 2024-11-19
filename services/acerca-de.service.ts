// services/acerca-de.service.ts
import { ApiService } from '~/compasables/useApi';
import type { Data as AcercaDe, AcercaDeResponse } from '~/types/aceda-de';

export class AcercaDeApi extends ApiService<AcercaDe> {
    private static instance: AcercaDeApi;
    private readonly baseEndpoint = 'http://localhost:1337/api/acerca-de?pagination%5BwithCount%5D=true';


    public static getInstance(): AcercaDeApi {
        if (!AcercaDeApi.instance) {
            AcercaDeApi.instance = new AcercaDeApi();
        }
        return AcercaDeApi.instance;
    }

    public useGetAcercaDe() {
        return this.useGet<AcercaDeResponse>(
            this.baseEndpoint,
            ['acerca-de'],
            {
                queryParams: {
                    'pagination[withCount]': 'true'
                }
            }
        );
    }
}
