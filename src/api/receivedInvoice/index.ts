import { EUserType } from 'src/types/enums'
import { Verbs, launchAsyncTask } from '../utils'
import { Tags } from './tags'

export const getReceivedInvoices = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken, dataUser: { companyBranchSelected, userType } } = getState().UserReducer
  const { page, limit } = getState().ReceivedInvoiceReducer
  const { filters } = getState().InvoiceReducer
  const { filterInvoiceNumber, filterUserName, filterInvoiceState, filterAllowAdvance } = filters

  let url = '/api/v1/app/invoice/received'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }
  if (page > 0) url += '?page=' + page
  if (limit > 0) url += '&limit=' + limit

  /** filters */
  if (filterInvoiceNumber) url += `&invoiceNumber[like]=.*${filterInvoiceNumber}.*`
  if (filterUserName) url += `&supplier=${filterUserName}`
  if (filterInvoiceState && filterInvoiceState !== 'none') url += `&status=${filterInvoiceState}`
  if (filterAllowAdvance) url += `&paymentInAdvance=${filterAllowAdvance}`
  if (companyBranchSelected && companyBranchSelected?.id !== undefined) url += `&companyBranchSelected=${companyBranchSelected.id}`
  url += '&sort=-createdAt'

  return dispatch(launchAsyncTask(Tags.GET_RECEIVED_INVOICES, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getReceivedInvoicesQuickpay = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken, dataUser: { companyBranchSelected } } = getState().UserReducer
  const { page, limit } = getState().ReceivedInvoiceReducer
  const { filters } = getState().InvoiceReducer
  const { filterInvoiceNumber, filterUserName, filterInvoiceState, filterAllowAdvance } = filters

  let url = '/api/v1/app/invoice/received/quickpay'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }
  if (page > 0) url += '?page=' + page
  if (limit > 0) url += '&limit=' + limit

  /** filters */
  if (filterInvoiceNumber) url += `&invoiceNumber[like]=.*${filterInvoiceNumber}.*`
  if (filterUserName) url += `&supplier=${filterUserName}`
  if (filterInvoiceState && filterInvoiceState !== 'none') 
  if (filterInvoiceState && filterInvoiceState !== 'none') {
    if (filterInvoiceState === 'ADVANCE') {
      url += `&status=QUICKPAY&statusQuickpay=false`
    } else {
      url += `&status=${filterInvoiceState}`
    }
  }
  if (filterAllowAdvance) url += `&paymentInAdvance=${filterAllowAdvance}`
  if (companyBranchSelected && companyBranchSelected?.id !== undefined) url += `&companyBranchSelected=${companyBranchSelected.id}`
  url += '&sort=-createdAt'

  return dispatch(launchAsyncTask(Tags.GET_RECEIVED_INVOICES, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const patchDenyInvoice = (id, reason, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const url = '/api/v1/app/invoice/reject/' + id

  const { accessToken } = getState().UserReducer
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }
  const params = {
    reason: reason || ''
  }

  return dispatch(launchAsyncTask(Tags.PATCH_DENY_INVOICE, Verbs.PATCH, url, config, params, callbackError, callbackSuccess))
}

export const patchAcceptInvoice = (id, days, allowPayment, discount, externalPayment, dailyDiscountToApply, offerCutoffBeforeDueDate, dueDate, numberDaysUntilExpirationDate, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const url = '/api/v1/app/invoice/accept/' + id

  const { accessToken, dataUser } = getState().UserReducer
  const { selectedFinancialId } = getState().ClientReducer

  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  } 
  const params = {
    days, // number
    allowPaymentInAdvance: allowPayment, // boolean
    discountInAdvance: discount, // number
    financialCompany: dataUser?.financialCompany?.[0],
    externalPayment, // boolean
    dailyDiscountToApply,
    offerCutoffBeforeDueDate,
    numberDaysUntilExpirationDate,
    dueDate
  }

  if (selectedFinancialId !== '' && externalPayment) {
    params['financialId'] = selectedFinancialId
  }

  return dispatch(launchAsyncTask(Tags.PATCH_ACCEPT_INVOICE, Verbs.PATCH, url, config, params, callbackError, callbackSuccess))
}
