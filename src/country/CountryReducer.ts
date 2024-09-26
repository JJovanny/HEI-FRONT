import Types from './Types'
import { ICountry, ICountryState } from 'src/types/country'
const INITIAL_STATE: ICountryState = {
  countries: [],
  isLoadingCountries: false,
  errorCountryData: [],
  country: {
    code: '',
    name: '',
    regions: [],
    taxIdRequired: false
  }
}

export default (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    /* set */
    case Types.SET_COUNTRY_DATA_PROPS:
      return { ...state, [action.payload.prop]: action.payload.value }

    case Types.CLEAR_ERROR_COUNTRY_DATA:
      return {
        ...state,
        errorCountryData: []
      }

    case Types.CLEAR_COUNTRY_DATA:
      return {
        ...state,
        country: {} as ICountry
      }

    default:
      return state
  }
}
