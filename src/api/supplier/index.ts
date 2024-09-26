import { EUserType } from 'src/types/enums'
import { Verbs, launchAsyncTask } from '../utils'
import { Tags } from './tags'

export const getMySuppliers = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken, dataUser: { companyBranchSelected, userType } } = getState().UserReducer
  const { page, limit, filters } = getState().SupplierReducer
  const { filterCompanyName, filterCompanyContactEmail, filterCompanyAllowAdvance } = filters

  let url = '/api/v1/app/user/me/suppliers'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }
  if (page > 0) url += '?page=' + page
  if (limit > 0) url += '&limit=' + limit

  /** filters */
  if (filterCompanyName) url += `&supplier[like]=.*${filterCompanyName}.*`
  if (filterCompanyContactEmail) url += `&email[like]=.*${filterCompanyContactEmail}.*`
  if (filterCompanyAllowAdvance) url += `&paymentInAdvance=${filterCompanyAllowAdvance}`
  if (companyBranchSelected && companyBranchSelected?.id !== undefined) url += `&companyBranchSelected=${companyBranchSelected.id}`

  return dispatch(launchAsyncTask(Tags.GET_MY_SUPPLIERS, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getFinancialSuppliers = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken, dataUser: { companyBranchSelected, userType } } = getState().UserReducer
  const { page, limit, filters } = getState().SupplierReducer
  const { filterCompanyName, filterCompanyContactEmail, filterCompanyAllowAdvance } = filters

  let url = '/api/v1/app/user/me/suppliers/financial'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }
  if (page > 0) url += '?page=' + page
  if (limit > 0) url += '&limit=' + limit

  /** filters */
  if (filterCompanyName) url += `&supplier[like]=.*${filterCompanyName}.*`
  if (filterCompanyContactEmail) url += `&email[like]=.*${filterCompanyContactEmail}.*`
  if (filterCompanyAllowAdvance) url += `&paymentInAdvance=${filterCompanyAllowAdvance}`
  if (companyBranchSelected && companyBranchSelected?.id !== undefined) url += `&companyBranchSelected=${companyBranchSelected.id}`

  return dispatch(launchAsyncTask(Tags.GET_MY_SUPPLIERS, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getSupplierPaymentPreferences = (id, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer

  const url = '/api/v1/app/company/paymentPreferences/' + id
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.GET_SUPPLIER_PAYMENT_PREFERENCES, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const patchSupplierPaymentPreferences = (id, callbackError, callbackSuccess, allowPayment?, days?, discount?, financialCompany?) => async (dispatch, getState) => {
  const url = '/api/v1/app/company/paymentPreferences/' + id

  const { accessToken } = getState().UserReducer
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  type Params = {
    days?: number,
    allowPaymentInAdvance?: boolean,
    discountInAdvance?: number,
    financialCompany?: string
  }

  const params: Params = {
    days,
    allowPaymentInAdvance: allowPayment,
    discountInAdvance: discount,
    financialCompany: financialCompany?.[0]
  }

  return dispatch(launchAsyncTask(Tags.PATCH_SUPPLIER_PAYMENT_PREFERENCES, Verbs.PATCH, url, config, params, callbackError, callbackSuccess))
}
