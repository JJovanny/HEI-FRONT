import { ICountry } from 'src/types/country'

export default class CountryManager {
  static getCountryRegions = (country: ICountry) => {
    return country?.regions ? country.regions : []
  }

  static getCountryTaxIdRequired = (country: ICountry) => {
    return country?.taxIdRequired ? country.taxIdRequired : false
  }
}
