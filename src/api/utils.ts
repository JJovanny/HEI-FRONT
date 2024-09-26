import axios from 'axios'
import { isDev } from '../utils/Utils'
import { setUserLogout } from 'src/user/UserActions'
import { apiRefreshToken } from 'src/login/LoginActions'
import { Tags } from './auth/tags'
import { InvoiceStatus, NotificationStatus, TypeCompany } from 'src/types/enums'
import { ICountry } from 'src/types/country'
import { getLocale, strings } from 'src/resources/locales/i18n'
import { ICurrency } from 'src/types/invoice'
import { EnumDeclaration, EnumType } from 'typescript'
import moment from 'moment'

export enum Verbs {
    DEL = 'DELETE',
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH'
}

export const formatShortDate = (issueDate) => {
  if (issueDate) {
    const Date = issueDate.substring(0, 10).split('-') // Format: yyyy-mm-dd
    const formatDate = Date[2] + '/' + Date[1] + '/' + Date[0].substring(2) // Format: dd/mm/yy
    return formatDate
  } else {
    return strings('placeholder.hasNotDate')
  }
}

export const formatShortDateWithHour = (issueDate) => {

  function addZero(num) {
    return num < 10 ? `0${num}` : num
  }
  
  if (issueDate) {
    const date = new Date(issueDate)
    const formattedDate = `${addZero(date.getDate())}/${addZero(date.getMonth() + 1)}/${date.getFullYear().toString().substring(2)}`
    const formattedTime = `${addZero(date.getHours())}:${addZero(date.getMinutes())}`
    return `${formattedDate} ${formattedTime}`
  } else {
    return strings('placeholder.hasNotDate')
  }
}

/** download invoice PDF admin */
export const getAdminInvoicePdf = async (id, accessToken) => {
  return axios({
    url: process.env.NEXT_PUBLIC_APP_BASE_URL + '/api/v1/app/adminUser/pdf/invoice/' + id,
    method: 'GET',
    headers: { Authorization: 'Bearer ' + accessToken, 'app-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJodHRwczovL3F1aWNrcGF5LnNpbmd1bGFyZGV2cy5uZXQifQ.nw-Y9i3s9qczTAdEEsNy0qg3YH6LTpJ4MeABi9h7-A8' },
    responseType: 'blob'
  })
}

export const handleAdminDownloadPdf = async (id, invoiceNumber, issueDate, accessToken) => {
  const response = await getAdminInvoicePdf(id, accessToken)
  const href = URL.createObjectURL(response.data)

  const link = document.createElement('a')
  link.href = href
  link.setAttribute('download', `${invoiceNumber}_${formatShortDate(issueDate)}.pdf`)
  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  URL.revokeObjectURL(href)
}

/** download invoice PDF */
export const getInvoicePdf = async (id, accessToken) => {
  return axios({
    url: process.env.NEXT_PUBLIC_APP_BASE_URL + '/api/v1/app/invoice/pdf/' + id,
    method: 'GET',
    headers: { Authorization: 'Bearer ' + accessToken, 'app-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJodHRwczovL3F1aWNrcGF5LnNpbmd1bGFyZGV2cy5uZXQifQ.nw-Y9i3s9qczTAdEEsNy0qg3YH6LTpJ4MeABi9h7-A8' },
    responseType: 'blob'
  })
}

export const getInvoiceBillingPdf = async (monthAndYear,accessToken,companyBranchSelected) => {
  let url = process.env.NEXT_PUBLIC_APP_BASE_URL + '/api/v1/app/invoice/report/pdf/billing'

  if (companyBranchSelected && companyBranchSelected?.id !== undefined) url += `?companyBranchSelected=${companyBranchSelected.id}&monthAndYear=${monthAndYear}`

  return axios({
    url,
    method: 'GET',
    headers: { Authorization: 'Bearer ' + accessToken, 'app-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJodHRwczovL3F1aWNrcGF5LnNpbmd1bGFyZGV2cy5uZXQifQ.nw-Y9i3s9qczTAdEEsNy0qg3YH6LTpJ4MeABi9h7-A8' },
    responseType: 'blob'
  })
}

export const handleDownloadPdfBilling = async (monthAndYear,accessToken,companyBranchSelected) => {
  const response = await getInvoiceBillingPdf(monthAndYear,accessToken,companyBranchSelected)
  const href = URL.createObjectURL(response.data)

  const link = document.createElement('a')
  link.href = href
  link.setAttribute('download', `${monthAndYear}_${moment().format('YYYY-MM-DD')}.pdf`)
  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  URL.revokeObjectURL(href)
}

export const handleDownloadPdf = async (id, invoiceNumber, issueDate, accessToken) => {
  const response = await getInvoicePdf(id, accessToken)
  const href = URL.createObjectURL(response.data)

  const link = document.createElement('a')
  link.href = href
  link.setAttribute('download', `${invoiceNumber}_${formatShortDate(issueDate)}.pdf`)
  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  URL.revokeObjectURL(href)
}

/** download invoice attachments */
export const postDownloadInvoiceAttachment = async (path, invoiceId, accessToken) => {
  return axios({
    url: process.env.NEXT_PUBLIC_APP_BASE_URL + '/api/v1/app/file?path=' + path + '&invoiceId=' + invoiceId,
    method: 'POST',
    headers: { Authorization: 'Bearer ' + accessToken, 'app-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJodHRwczovL3F1aWNrcGF5LnNpbmd1bGFyZGV2cy5uZXQifQ.nw-Y9i3s9qczTAdEEsNy0qg3YH6LTpJ4MeABi9h7-A8' },
    responseType: 'blob'
  })
}

/** ADMIN download invoice attachments */
export const postDownloadInvoiceAttachmentAdmin = async (path, adminAccessToken) => {
  return axios({
    url: process.env.NEXT_PUBLIC_APP_BASE_URL + '/api/v1/app/adminUser/file?path=' + path,
    method: 'POST',
    headers: { Authorization: 'Bearer ' + adminAccessToken, 'app-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJodHRwczovL3F1aWNrcGF5LnNpbmd1bGFyZGV2cy5uZXQifQ.nw-Y9i3s9qczTAdEEsNy0qg3YH6LTpJ4MeABi9h7-A8' },
    responseType: 'blob'
  })
}

/** invoice status */
export const getInvoiceStatus = (status: string) => {
  switch (status) {
    case undefined: return 'advance'
    case InvoiceStatus.DRAFT: return 'draft'
    case InvoiceStatus.APPROVAL_PENDING: return 'pending'
    case InvoiceStatus.ACCEPTED: return 'accepted'
    case InvoiceStatus.REJECTED: return 'rejected'
    case InvoiceStatus.PAID: return 'paid'
    case InvoiceStatus.OVERDUE: return 'overdue'
    case InvoiceStatus.QUICKPAY_AVAILABLE: return 'quickpayAvailable'
    case InvoiceStatus.QUICKPAY: return 'quickpay'
    case InvoiceStatus.IN_PROGRESS: return 'inProgress'
    case InvoiceStatus.ADVANCED: return 'advanced'
    case InvoiceStatus.PREPAYMENT: return 'prepayment'
    default: return ''
  }
}

export const getInvoiceStatusNotification = (status: string) => {
  switch (status) {
    case NotificationStatus.SUPPLIER_UPLOADS_INVOICE: return 'supplierUploadInvoice'
    case NotificationStatus.SUPPLIER_ACCEPTS_QUICKPAY_OFFER: return 'supplierAcceptsQuickpay'
    case NotificationStatus.INVOICE_DUE_DAY: return 'invoiceDueDay'
    case NotificationStatus.PAYER_ACCEPTS_INVOICE_WITHOUT_QUICKPAY: return 'payerAcceptInvoiceWithoutQuickpay'
    case NotificationStatus.PAYER_ACCEPTS_INVOICE_WITH_QUICKPAY_OFFER: return 'payerAcceptInvoiceWithQuickpay'
    case NotificationStatus.PAYER_REJECTS_INVOICE: return 'payerRejectInvoice'
    case NotificationStatus.INVOICE_EXTERNAL: return 'invoiceExternal'
    case NotificationStatus.INVOICE_MARKED_AS_PAID_OR_ADVANCED: return 'invoiceMarkedAsPaidOrAdvanced'
    case NotificationStatus.PAY_PAYER_TO_FINANCIAL: return 'payPayerToFinancial'
    default: return ''
  }
}

export const getInvoiceStatusNotificationColor = (status: string) => {
  switch (status) {
    case NotificationStatus.SUPPLIER_UPLOADS_INVOICE: return 'bg-warning'
    case NotificationStatus.SUPPLIER_ACCEPTS_QUICKPAY_OFFER: return 'bg-success'
    case NotificationStatus.INVOICE_DUE_DAY: return 'bg-danger'
    case NotificationStatus.PAYER_ACCEPTS_INVOICE_WITHOUT_QUICKPAY: return 'bg-success'
    case NotificationStatus.PAYER_ACCEPTS_INVOICE_WITH_QUICKPAY_OFFER: return 'bg-success'
    case NotificationStatus.PAYER_REJECTS_INVOICE: return 'bg-danger'
    case NotificationStatus.INVOICE_EXTERNAL: return 'bg-success'
    case NotificationStatus.INVOICE_MARKED_AS_PAID_OR_ADVANCED: return 'bg-success'
    case NotificationStatus.PAY_PAYER_TO_FINANCIAL: return 'bg-success'
    default: return ''
  }
}

export const getInvoiceStatusBadgeColor = (status: string) => {
  switch (status) {
    case undefined: return 'bg-primary'
    case InvoiceStatus.DRAFT: return 'bg-gray-400'
    case InvoiceStatus.APPROVAL_PENDING: return 'bg-warning'
    case InvoiceStatus.ACCEPTED: return 'bg-success'
    case InvoiceStatus.REJECTED: return 'bg-danger'
    case InvoiceStatus.PAID: return 'bg-success'
    case InvoiceStatus.OVERDUE: return 'bg-danger'
    case InvoiceStatus.QUICKPAY_AVAILABLE: return 'bg-success'
    case InvoiceStatus.QUICKPAY: return 'bg-primary'
    case InvoiceStatus.IN_PROGRESS: return 'bg-primary'
    case InvoiceStatus.ADVANCED: return 'bg-success'
    case InvoiceStatus.PREPAYMENT: return 'bg-success'
    default: return ''
  }
}

export const isInvoiceStatusQuickPay = (status: string) => {
  return status === InvoiceStatus.QUICKPAY_AVAILABLE
}

export const getInvoiceStatusList = () => {
  const status: {id: string, value: string}[] = [] 
    status.push({ id: 'none', value: 'None' })
    status.push({ id: InvoiceStatus.DRAFT, value: strings('invoiceStatus.draft') })
    status.push({ id: InvoiceStatus.APPROVAL_PENDING, value: strings('invoiceStatus.pending') })
    status.push({ id: InvoiceStatus.ACCEPTED, value: strings('invoiceStatus.accepted') })
    status.push({ id: InvoiceStatus.ADVANCED, value: strings('invoiceStatus.advanced') })
    status.push({ id: InvoiceStatus.REJECTED, value: strings('invoiceStatus.rejected') })
    status.push({ id: InvoiceStatus.OVERDUE, value: strings('invoiceStatus.overdue') })
    status.push({ id: InvoiceStatus.PAID, value: strings('invoiceStatus.paid') })
    status.push({ id: InvoiceStatus.IN_PROGRESS, value: strings('invoiceStatus.quickpay')})
    status.push({ id: InvoiceStatus.QUICKPAY, value: strings('invoiceStatus.quickpay') })
    status.push({ id: InvoiceStatus.QUICKPAY_AVAILABLE, value: strings('button.quickpayAvaiLable') })
  return status
}

/** errors control methods for forms */
export function isFocusHere (error, id) {
  if (error?.key?.includes(id)) return true
  return false
}

/** get country */
export const getCountries = (countries: ICountry[]) => {
  return countries.map((country) => {
    return { id: country.code, value: country.name }
  })
}

/** get user types */
export const getUserTypes = (enumName: string, enumList: {}) => {
  return Object.keys(enumList).map((userType) => {
    return { id: enumList[userType], value: strings(`enums.${enumName}.${enumList[userType].toLowerCase()}`) }
  })
}

export const getCompanyTypes = (enumList: {}) => {
  return Object.keys(enumList).map((typeCompany) => {
    return { id: enumList[typeCompany], value: strings(`placeholder.${enumList[typeCompany].toLowerCase()}`) }
  })
}

export const capitalize = (string:string) => {
  return string.charAt(0).toUpperCase() + string?.toLowerCase().slice(1)
}

/** get currencies sorted list
 * order: USD and EUR (firts and second). The rest order by alphabetically
 */
export const sortCurrencies = (currencies: ICurrency[]) => {
  return currencies.sort((currency1, currency2) => {
    if ((currency1.code === 'USD' && currency2.code === 'EUR') || (currency2.code === 'USD' && currency1.code === 'EUR')) return 0
    else if (currency1.code === 'USD' || currency1.code === 'EUR') return -1
    else if (currency2.code === 'USD' || currency2.code === 'EUR') return 1
    else return currency1.label > currency2.label ? 1 : -1
  })
}

/** *************** **/
/** PRIVATE METHODS **/
/** *************** **/

export const parseCodeHTMLToString = (codeHTML: string) => {
  let dataParsed = codeHTML

  dataParsed = dataParsed?.replace(/&quot;/gm, '\'\'')
  dataParsed = new DOMParser().parseFromString(
    decodeURIComponent(encodeURIComponent(dataParsed)),
    'text/html'
  )?.body?.textContent || ''
  dataParsed = dataParsed?.replace(/\\/gm, '/')

  return dataParsed
}

export function removeUndefinedProperties (obj: object) {
  for (const key in obj) {
    const value = obj[key]

    if (value === undefined) {
      delete obj[key]
    } else if (Array.isArray(value)) {
      obj[key] = value.filter((el) => el !== undefined)
      obj[key].forEach((el, i) => {
        if (typeof el === 'object') {
          removeUndefinedProperties(el)
        }
        if (Array.isArray(el)) {
          obj[key][i] = el.filter((nestedEl) => nestedEl !== undefined)
        }
      })
    } else if (typeof value === 'object') {
      removeUndefinedProperties(value)
    }
  }

  return obj
}

export const parseHTMLDataAPI = (data: object, toBack: boolean) => {
  // if (typeof data === 'string') return parseCodeHTMLToString(data);
  if (typeof data !== 'object') return data

  if (data) data = removeUndefinedProperties(data)
  if (toBack) return data

  return data ? JSON.parse(parseCodeHTMLToString(JSON.stringify(data))) : data
}

export const launchAsyncTask = (tag, verb, url, config, params, callbackError, callbackSuccess) => async dispatch => {
  let response: any = null

  if (!config) {
    config = {
      headers: {
        'app-token': ''
      }
    }
  }
  config.headers['app-token'] = process?.env?.NEXT_PUBLIC_APP_SECURITY_TOKEN

  const httpClient = axios.create()
  httpClient.defaults.baseURL = process.env.NEXT_PUBLIC_APP_BASE_URL

  params = parseHTMLDataAPI(params, true)

  if (verb === Verbs.DEL) {
    await httpClient
      .delete(url, config)
      .then(result => {
        response = result
      })
      .catch(error => {
        response = error.response
      })
  }

  if (verb === Verbs.GET) {
    await httpClient
      .get(url, config)
      .then(result => {
        response = result
      })
      .catch(error => {
        response = error.response
      })
  }

  if (verb === Verbs.POST) {
    await httpClient
      .post(url, params, config)
      .then(result => {
        response = result
      })
      .catch(error => {
        response = error.response
      })
  }

  if (verb === Verbs.PUT) {
    await httpClient
      .put(url, params, config)
      .then(result => {
        response = result
      })
      .catch(error => {
        response = error.response
      })
  }

  if (verb === Verbs.PATCH) {
    await httpClient
      .patch(url, params, config)
      .then(result => {
        response = result
      })
      .catch(error => {
        response = error.response
      })
  }

  dispatch(onResponse(tag, response, callbackError, callbackSuccess, { verb, url, config, params }))
}

export const onResponse = (tag, response, callbackError, callbackSuccess, props) => async (dispatch) => {
  if (isDev()) console.log('TAG: ', tag, ' | Response: ', response)

  let parsedResponseData = response?.data
  parsedResponseData = parseHTMLDataAPI(response?.data, false)

  if (response === undefined || response === null) {
    return
  }

  const { verb, url, params } = props

  switch (response.status) {
    case 200:
    case 201:
    case 204:
      callbackSuccess(tag, parsedResponseData)
      break

    case 400:
      callbackError(tag, parsedResponseData)
      break

    case 401:

      if (isDev()) console.log('Invalid credentials 401 - refresh token')

      if ((response.data && tag === Tags.POST_CONFIRM_LOGIN) ||
          (response.data && tag === Tags.POST_CONFIRM_REGISTER)
      ) {
        return await callbackError(tag, parsedResponseData)
      }

      if (tag === Tags.POST_REFRESH_TOKEN) return await dispatch(setUserLogout())

      await dispatch(apiRefreshToken((config) => dispatch(launchAsyncTask(tag, verb, url, config, params, callbackError, callbackSuccess))))
      break

    case 402:
      if (response.data && response.data.error && response.data.error === 'invalidUsername') {
        callbackSuccess(tag, response) // We don't give any clues about the invalid username
      }
      break

    case 403:
      if (response.data && response.data.error && response.data.error === 'passwordAlreadyRequested') { /* empty */ }
      if (response.data && response.data.response && response.data.response.length > 0) {
        // DialogManager.singleAlert(response.data.response);
        callbackError(tag, parsedResponseData)
      }
      break

    case 404:
      callbackError(tag, response)
      break

    case 500:
      callbackError(tag, response)
      break

    default:
      break
  }
}
