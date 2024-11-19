export interface About {
    data: Data;
    meta: Meta;
}

export interface Data {
    id:                      number;
    documentId:              string;
    createdAt:               Date;
    updatedAt:               Date;
    publishedAt:             Date;
    locale:                  string;
    HistoriaMision:          string;
    HistoriaFundadores:      string[];
    HistoriaVision:          string;
    HistoriaFundacion:       Date;
    ValorNombre:             string;
    ValorDescripcion:        string;
    ContactoEmail:           string;
    ContactoTelefono:        number;
    EquipoNombreNombre:      string;
    EquipoNombreCargo:       string;
    EquipoNombreDescripcion: string;
    Contacto:                string;
    CoordenadasLatitud:      number;
    CoordenadasLongitud:     string;
    UbicacionTipo:           string;
    UbicacionDireccion:      string;
    UbicacionCiudad:         string;
    UbicacionCodigoPostal:   string;
}

export interface Meta {
}
