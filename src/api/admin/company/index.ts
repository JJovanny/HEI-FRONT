import { launchAsyncTask, Verbs } from 'src/api/utils'
import { Tags } from './tags'

export const getAssociatedCompanies = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().AdminUserReducer

  const url = '/api/v1/app/adminUser/financialCompanies/associated'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.GET_MY_COMPANIES, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getAssociatedCompanyInvoices = (id, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().AdminUserReducer

  const url = `/api/v1/app/adminUser/financialCompanies/associated/invoices/${id}`
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.GET_INVOICES_COMPANY, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getAssociatedCompanyInvoiceDetail = (id, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().AdminUserReducer

  const url = `/api/v1/app/adminUser/invoice/${id}`
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.GET_INVOICE_COMPANY, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}
