import { Verbs, launchAsyncTask } from '../utils'
import { Tags } from './tags'

export const getCountries = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const url = '/api/v1/app/geodata/countries'
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.GET_COUNTRIES, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getRegions = (countryCode, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const url = '/api/v1/app/geodata/countries/' + countryCode
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.GET_REGIONS, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}
