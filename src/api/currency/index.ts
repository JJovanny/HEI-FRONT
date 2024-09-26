import { Verbs, launchAsyncTask } from '../utils'
import { Tags } from './tags'

export const getCurrencies = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer

  const url = '/api/v1/app/currency/all'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.GET_CURRENCIES, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getCurrencyByCode = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer
  const { currency } = getState().InvoiceReducer
  const { code } = currency

  const url = '/api/v1/app/currency?code=' + code
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.GET_CURRENCYBYCODE, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}
