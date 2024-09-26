import { Verbs, launchAsyncTask } from '../utils'
import { Tags } from './tags'

export const delCompanyTax = (id, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer

  const url = '/api/v1/app/company/tax/' + id
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.DEL_COMPANY_TAX, Verbs.DEL, url, config, null, callbackError, callbackSuccess))
}

export const getDefaultTaxes = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer

  const url = '/api/v1/app/tax/all'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.GET_DEFAULT_TAXES, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getCompanyTaxes = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer

  const url = '/api/v1/app/company/tax'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.GET_COMPANY_TAXES, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getCompanyTax = (id, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer

  const url = '/api/v1/app/company/tax/' + id
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.GET_COMPANY_TAX, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const postCompanyTax = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const url = '/api/v1/app/company/tax'

  const { accessToken } = getState().UserReducer
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  const { tax } = getState().TaxReducer
  const { name, percentage } = tax

  const params = {
    name,
    percentage
  }

  return dispatch(launchAsyncTask(Tags.POST_COMPANY_TAX, Verbs.POST, url, config, params, callbackError, callbackSuccess))
}

export const putCompanyTax = (id, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const url = '/api/v1/app/company/tax/' + id

  const { accessToken } = getState().UserReducer
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  const { tax } = getState().TaxReducer
  const { name, percentage } = tax

  const params = {
    name,
    percentage
  }

  return dispatch(launchAsyncTask(Tags.PUT_COMPANY_TAX, Verbs.PUT, url, config, params, callbackError, callbackSuccess))
}
