import { IError } from './global'

export interface IRegion {
    code: string,
    name: string
}

export interface ICountry {
    code: string,
    name: string,
    regions: IRegion[],
    taxIdRequired: boolean
}

export interface ICountryState {
    countries: ICountry[],
    isLoadingCountries: boolean,
    errorCountryData: IError[],
    country: ICountry
}
