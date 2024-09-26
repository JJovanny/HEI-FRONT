// api
import { getCountries, getRegions } from 'src/api/country'
// resources
import { isDev } from '../utils/Utils'
import Types from './Types'
import { ICountry } from 'src/types/country'

export const clearCountryData = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_COUNTRY_DATA })
}

export const clearCountryDataError = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_ERROR_COUNTRY_DATA })
}

export const setCountryDataProps = ({ prop, value }) => ({
  type: Types.SET_COUNTRY_DATA_PROPS,
  payload: { prop, value }
})

export const apiGetCountries = () => async (dispatch) => {
  await dispatch(setCountryDataProps({ prop: 'isLoadingCountries', value: true }))
  await dispatch(
    getCountries(
      (tag, response) => {
        if (isDev()) console.log('apiGetCountries - Error', response)
      },
      (tag, response) => {
        if (isDev()) console.log('apiGetCountries - Success', response)
        const countriesData: ICountry[] = response?.data?.countries
        dispatch(setCountryDataProps({ prop: 'countries', value: countriesData }))
      }
    )
  )
  await dispatch(setCountryDataProps({ prop: 'isLoadingCountries', value: false }))
}

export const apiGetRegions = (countryCode) => async (dispatch) => {
  await dispatch(setCountryDataProps({ prop: 'isLoadingCountries', value: true }))
  await dispatch(
    getRegions(
      countryCode,
      (tag, response) => {
        if (isDev()) console.log('apiGetRegions - Error', response)
      },
      (tag, response) => {
        if (isDev()) console.log('apiGetRegions - Success', response)
        const countryData: ICountry = response?.data?.country
        dispatch(setCountryDataProps({ prop: 'country', value: countryData }))
      }
    )
  )
  await dispatch(setCountryDataProps({ prop: 'isLoadingCountries', value: false }))
}
