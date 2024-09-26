import { EUserType } from 'src/types/enums'
import { Verbs, launchAsyncTask } from '../utils'
import { Tags } from './tags'
import moment from 'moment'
import axios from 'axios'
import { IFiles, IInvoice } from 'src/types/invoice'

export const delInvoice = (id, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer

  const url = '/api/v1/app/invoice/' + id
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.DEL_INVOICE, Verbs.DEL, url, config, null, callbackError, callbackSuccess))
}

export const getInvoicesIssued = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken, dataUser: { companyBranchSelected, userType } } = getState().UserReducer
  const { page, limit, filters } = getState().InvoiceReducer
  const { filterInvoiceNumber, filterUserName, filterInvoiceState, filterAllowAdvance } = filters

  let url = '/api/v1/app/invoice/issued'
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
  if (filterUserName) url += `&customer=${filterUserName}`
  if (filterInvoiceState && filterInvoiceState !== 'none') url += `&status=${filterInvoiceState}`
  if (filterAllowAdvance) url += `&paymentInAdvance=${filterAllowAdvance}`
  if (companyBranchSelected && companyBranchSelected?.id !== undefined) url += `&companyBranchSelected=${companyBranchSelected.id}`
  url += '&sort=-createdAt'

  return dispatch(launchAsyncTask(Tags.GET_INVOICES_ISSUED, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getInvoicesIssuedQuickpay = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken, dataUser: { companyBranchSelected, userType } } = getState().UserReducer
  const { page, limit, filters } = getState().InvoiceReducer
  const { filterInvoiceNumber, filterUserName, filterInvoiceState, filterAllowAdvance } = filters

  let url = '/api/v1/app/invoice/issued/quickpay'
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
  if (filterUserName) url += `&customer=${filterUserName}`
  if (filterInvoiceState && filterInvoiceState !== 'none') url += `&status=${filterInvoiceState}`
  if (filterAllowAdvance) url += `&paymentInAdvance=${filterAllowAdvance}`
  if (companyBranchSelected && companyBranchSelected?.id !== undefined) url += `&companyBranchSelected=${companyBranchSelected.id}`
  url += '&sort=-createdAt'

  return dispatch(launchAsyncTask(Tags.GET_INVOICES_ISSUED, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getMyCompanyInvoices = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken, dataUser: { companyBranchSelected, userType } } = getState().UserReducer

  let url = '/api/v1/app/invoice/all'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  url += '?sort=-createdAt'
  if (companyBranchSelected && companyBranchSelected?.id !== undefined) url += `&companyBranchSelected=${companyBranchSelected.id}`

  return dispatch(launchAsyncTask(Tags.GET_COMPANY_INVOICES, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getInvoicesSentMetrics = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken, dataUser: { companyBranchSelected } } = getState().UserReducer

  let url = '/api/v1/app/invoice/sent/metrics'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  url += '?sort=-createdAt'
  if (companyBranchSelected && companyBranchSelected?.id !== undefined) url += `&companyBranchSelected=${companyBranchSelected.id}`

  return dispatch(launchAsyncTask(Tags.GET_COMPANY_INVOICES, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getBilling = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken, dataUser: { companyBranchSelected } } = getState().UserReducer

  let url = process.env.NEXT_PUBLIC_APP_BASE_URL + '/api/v1/app/invoice/billing'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    }
  }

  url += '?sort=-createdAt'
  if (companyBranchSelected && companyBranchSelected?.id !== undefined) url += `&companyBranchSelected=${companyBranchSelected.id}`

  return dispatch(launchAsyncTask(Tags.GET_COMPANY_INVOICES, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getInvoicesSentQuickpayMetrics = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken, dataUser: { companyBranchSelected } } = getState().UserReducer

  let url = '/api/v1/app/invoice/sent/quickpay/metrics'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  url += '?sort=-createdAt'
  if (companyBranchSelected && companyBranchSelected?.id !== undefined) url += `&companyBranchSelected=${companyBranchSelected.id}`

  return dispatch(launchAsyncTask(Tags.GET_COMPANY_INVOICES, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getInvoicesReceivedMetrics = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken, dataUser: { companyBranchSelected } } = getState().UserReducer

  let url = '/api/v1/app/invoice/received/metrics'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  url += '?sort=-createdAt'
  if (companyBranchSelected && companyBranchSelected?.id !== undefined) url += `&companyBranchSelected=${companyBranchSelected.id}`

  return dispatch(launchAsyncTask(Tags.GET_COMPANY_INVOICES, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getInvoicesReceivedQuickpayMetrics = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken, dataUser: { companyBranchSelected } } = getState().UserReducer

  let url = '/api/v1/app/invoice/received/quickpay/metrics'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  url += '?sort=-createdAt'
  if (companyBranchSelected && companyBranchSelected?.id !== undefined) url += `&companyBranchSelected=${companyBranchSelected.id}`

  return dispatch(launchAsyncTask(Tags.GET_COMPANY_INVOICES, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getInvoicesReceivedFinancialMetrics = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken, dataUser: { companyBranchSelected } } = getState().UserReducer

  let url = '/api/v1/app/invoice/received/financial/metrics'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  url += '?sort=-createdAt'
  if (companyBranchSelected && companyBranchSelected?.id !== undefined) url += `&companyBranchSelected=${companyBranchSelected.id}`

  return dispatch(launchAsyncTask(Tags.GET_COMPANY_INVOICES, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getInvoicesReceivedQuickpayFinancialMetrics = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken, dataUser: { companyBranchSelected } } = getState().UserReducer

  let url = '/api/v1/app/invoice/received/quickpay/financial/metrics'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  url += '?sort=-createdAt'
  if (companyBranchSelected && companyBranchSelected?.id !== undefined) url += `&companyBranchSelected=${companyBranchSelected.id}`

  return dispatch(launchAsyncTask(Tags.GET_COMPANY_INVOICES, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getInvoice = (id, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer

  const url = '/api/v1/app/invoice/' + id
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.GET_INVOICE, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const postInvoice = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  let url = '/api/v1/app/invoice'

  const { accessToken, dataUser: { companyBranchSelected, userType } } = getState().UserReducer
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  const { client } = getState().ClientReducer
  const { invoice, currency } = getState().InvoiceReducer
  const {
    customer,
    invoiceNumber,
    issueDate,
    dueDate,
    lines,
    files,
    uploaded,
    observations
  } = invoice

  if (customer?.customerData?.company?.cif?.length <= 0) {
    customer.customerData.company.cif = undefined
  }

  const { code } = currency

  let params = {
    customer: {},
    invoiceNumber: '',
    issueDate: '',
    dueDate: '',
    lines: [],
    uploaded: false,
    docs: [],
    currency: '',
    newBranchForClient: client.newBranchForClient
  }
  if (uploaded) {
    params = {
      customer,
      invoiceNumber,
      issueDate,
      dueDate,
      lines,
      uploaded,
      docs: files,
      currency: code,
      newBranchForClient: client.newBranchForClient
    }
  } else {
    if (customer) params.customer = customer
    if (invoiceNumber) params.invoiceNumber = invoiceNumber
    if (issueDate) params.issueDate = issueDate
    if (dueDate) params.dueDate = dueDate
    if (code) params.currency = code
    if (lines.length !== 0) params.lines = lines
    if (files.length !== 0) params.docs = files
    params.uploaded = false
  }

  if (observations !== "" && observations !== undefined && observations !== null) params['observations'] = observations

  if (userType === EUserType.SUPPLIER || userType === EUserType.BOTH) {
    url += `?companyBranchSelected=${companyBranchSelected?.id}`
  }

  return dispatch(launchAsyncTask(Tags.POST_INVOICE, Verbs.POST, url, config, params, callbackError, callbackSuccess))
}


export const postInvoiceCsv = (invoices, callbackError, callbackSuccess) => async (dispatch, getState) => {
  let url = '/api/v1/app/invoice/csv-create'

  const { accessToken, dataUser: { companyBranchSelected, userType } } = getState().UserReducer
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  let params = {
    invoices
  }

  return dispatch(launchAsyncTask(Tags.POST_INVOICE, Verbs.POST, url, config, params, callbackError, callbackSuccess))
}


export const postCalculateInvoicePrice = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const url = '/api/v1/app/invoice/lines'

  const { accessToken } = getState().UserReducer
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  const { invoice } = getState().InvoiceReducer
  const { lines } = invoice

  if (lines.length > 0) {
    for (let i = 0; i < lines.length; i++) {
      if (typeof lines[i].tax === 'object') lines[i].tax = lines[i].tax.id
    }
  }

  const params = {
    lines
  }

  return dispatch(launchAsyncTask(Tags.POST_CALCULATE_INVOICE_PRICE, Verbs.POST, url, config, params, callbackError, callbackSuccess))
}

export const postSendInvoiceByEmail = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  const { invoice, emails } = getState().InvoiceReducer
  const { id } = invoice

  const url = `/api/v1/app/invoice/email/${id}`
  const params = { emails }

  return dispatch(launchAsyncTask(Tags.POST_SEND_INVOICE_EMAIL, Verbs.POST, url, config, params, callbackError, callbackSuccess))
}

export const putInvoice = (id, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const url = '/api/v1/app/invoice/' + id

  const { accessToken } = getState().UserReducer
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  const { invoice, currency } = getState().InvoiceReducer
  const {
    customer,
    invoiceNumber,
    issueDate,
    lines,
    files,
    uploaded
  } = invoice

  if (customer?.customerData?.company?.cif?.length <= 0) {
    customer.customerData.company.cif = undefined
  }

  const { code } = currency
  if (customer) {
    !customer?.isNewCustomer && customer?.id ? customer.isNewCustomer = false : customer.isNewCustomer = true
  }

  let params = {
    customer: {},
    invoiceNumber: '',
    issueDate: '',
    lines: [],
    uploaded: false,
    docs: [],
    currency: ''
  }

  if (lines.length > 0) {
    for (let i = 0; i < lines.length; i++) {
      if (typeof lines[i].tax === 'object') lines[i].tax = lines[i].tax.id
    }
  }

  if (uploaded) {
    params = {
      customer: customer?.id ? { isNewCustomer: false, id: customer.id } : customer,
      invoiceNumber,
      issueDate,
      lines,
      uploaded,
      docs: files,
      currency: code
    }
  } else {
    customer?.id ? params.customer = { isNewCustomer: false, id: customer.id } : params.customer = customer
    if (invoiceNumber) params.invoiceNumber = invoiceNumber
    if (issueDate) params.issueDate = issueDate
    if (code) params.currency = code
    if (lines.length !== 0) params.lines = lines
    if (files.length !== 0) params.docs = files
    params.uploaded = false
  }

  return dispatch(launchAsyncTask(Tags.PUT_INVOICE, Verbs.PUT, url, config, params, callbackError, callbackSuccess))
}

export const sendMessageInvoice = (id, message, recipientMessage, callbackError, callbackSuccess) => async (dispatch, getState) => {

  const { invoice }: {invoice: IInvoice} =  getState().InvoiceReducer
  const { attachfilesChat }: {attachfilesChat:  IFiles[]} = invoice
  const { accessToken, dataUser: { companyBranchSelected, userType } } = getState().UserReducer
  let url = '/api/v1/app/invoice/message/'+ id
  url += `?companyBranchSelected=${companyBranchSelected?.id}` 

  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  let params = {
    message: message,
    recipients: recipientMessage,
  }

  const allFilesToRemove = attachfilesChat.every(file => file.remove === true);
  if (attachfilesChat.length !== 0 && !allFilesToRemove) params['attachfilesChat'] = attachfilesChat

  return dispatch(launchAsyncTask(Tags.PUT_INVOICE, Verbs.PUT, url, config, params, callbackError, callbackSuccess))
}


export const readMessageInvoice = (id, unreadMessageIds, callbackError, callbackSuccess) => async (dispatch, getState) => {

  const { accessToken, dataUser: { companyBranchSelected, userType } } = getState().UserReducer
  let url = '/api/v1/app/invoice/read/messages/'+ id
  url += `?companyBranchSelected=${companyBranchSelected?.id}` 

  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }
  const params = {
    unreadMessageIds: unreadMessageIds,
  }

  return dispatch(launchAsyncTask(Tags.PUT_INVOICE, Verbs.PUT, url, config, params, callbackError, callbackSuccess))
}


export const putSendEvidenceAdvancePayment = (id, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const url = '/api/v1/app/invoice/advance-payment/' + id

  const { accessToken } = getState().UserReducer
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json' 
    }
  }

  const { invoice, isMarkAsPaid, payToFinancial } = getState().InvoiceReducer
  const {
    evidenceAdvancePayment,
    evidencePaymentToFinancial
  } = invoice
  
  let params = {
    paymentDate: moment().startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
  }

  if (isMarkAsPaid){
    params['isMarkAsPaid'] = true
  }

  if (payToFinancial) {
    params['evidencePaymentToFinancial'] = evidencePaymentToFinancial
  } else {
    params['evidenceAdvancePayment'] = evidenceAdvancePayment
  }

  return dispatch(launchAsyncTask(Tags.PUT_INVOICE, Verbs.PUT, url, config, params, callbackError, callbackSuccess))
}

export const patchMarkAsPaidInvoice = (id, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const url = '/api/v1/app/invoice/paid/' + id

  const { accessToken } = getState().UserReducer
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }
  const params = {}

  return dispatch(launchAsyncTask(Tags.PATCH_MARK_AS_PAID_INVOICE, Verbs.PATCH, url, config, params, callbackError, callbackSuccess))
}

export const postRequestEarlyPayment = (id, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  const url = `/api/v1/app/invoice/earlyPayment/${id}`
  const params = {}

  return dispatch(launchAsyncTask(Tags.POST_REQUEST_EARLY_PAYMENT, Verbs.POST, url, config, params, callbackError, callbackSuccess))
}

export const postValidateUserCompany = (invoice, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  const { customer } = invoice
  if (customer?.customerData?.company?.cif?.length <= 0) {
    customer.customerData.company.cif = undefined
  }

  const url = '/api/v1/app/invoice/validate/user'
  const params = { customer }

  return dispatch(launchAsyncTask(Tags.POST_VALIDATE_USER_COMPANY, Verbs.POST, url, config, params, callbackError, callbackSuccess))
}
