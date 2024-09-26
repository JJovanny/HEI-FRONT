import toast from 'react-hot-toast'
// api
import { postCalculateInvoicePrice, postInvoice, postSendInvoiceByEmail, getInvoicesIssued, getInvoice, delInvoice, putInvoice, patchMarkAsPaidInvoice, postRequestEarlyPayment, postValidateUserCompany, getMyCompanyInvoices, getInvoicesIssuedQuickpay, putSendEvidenceAdvancePayment, sendMessageInvoice, readMessageInvoice, getInvoicesSentMetrics, getInvoicesSentQuickpayMetrics, getInvoicesReceivedMetrics, getInvoicesReceivedQuickpayMetrics, getInvoicesReceivedFinancialMetrics, getInvoicesReceivedQuickpayFinancialMetrics, getBilling, postInvoiceCsv } from 'src/api/invoice'
import { getCurrencies, getCurrencyByCode } from 'src/api/currency'
import FormValidationManager from '../utils/managers/FormValidationManager'
import ApiResponseValidationManager from '../utils/managers/ApiResponseValidationManager'
/** actions */
import { apiGetOneSuppCustRelationship, apiGetOneCustFinancialRelationship, setClientDataProps, setClientNewBranchProps } from '../client/ClientActions'
// resources
import { strings } from '../resources/locales/i18n'
import { isDev } from '../utils/Utils'
import Types from './Types'
import { IClient } from 'src/types/client'
import { IInvoiceState } from 'src/types/invoice'
import { formatShortDate, sortCurrencies } from 'src/api/utils'
import { apiGetReceivedInvoices, apiGetReceivedInvoicesQuickpay } from 'src/receivedInvoice/ReceivedInvoiceActions'

/** clear */
export const clearInvoiceToInitialState = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_TO_INITIAL_STATE })
}

export const clearInvoicesPagination = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_INVOICES_PAGINATION })
}

export const clearInvoicesFilters = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_INVOICES_FILTERS })
}

export const clearInvoicesDataErrors = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_ERROR_INVOICES_DATA })
}

export const clearInvoiceDataErrors = () => ({ type: Types.CLEAR_ERROR_INVOICE_DATA })

export const clearInvoiceDataErrorsForAdd = () => ({ type: Types.CLEAR_ERROR_INVOICE_DATA_FOR_ADD })

export const clearEmailsDataErrors = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_ERROR_EMAILS_DATA })
}

export const clearInvoiceData = () => ({ type: Types.CLEAR_INVOICE_DATA })

export const clearInvoiceLoadings = () => ({ type: Types.CLEAR_INVOICE_LOADINGS })

export const clearInvoicesData = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_INVOICES_DATA })
}

/** set */
export const setInvoiceDataProps = ({ prop, value }) => ({
  type: Types.SET_INVOICE_DATA_PROPS,
  payload: { prop, value }
})

export const setIsMarkAsPaidProps = ({ prop, value }) => ({
  type: Types.SET_IS_MARK_AS_PAID,
  payload: { prop, value }
})

export const setPayToFinancialProps = ({ prop, value }) => ({
  type: Types.SET_PAID_TO_FINANCIAL,
  payload: { prop, value }
})

export const seSendMessageInvoiceProps = ({ prop, value }) => ({
  type: Types.SET_SEND_MESSAGE,
  payload: { prop, value }
})

export const setValueInvoicesFiltersData = ({ prop, value }) => ({
  type: Types.SET_VALUE_INVOICES_FILTERS_DATA,
  payload: { prop, value }
})

export const setValuePostInvoiceData = ({ prop, value }) => ({
  type: Types.SET_VALUE_POST_INVOICE_DATA,
  payload: { prop, value }
})

export const setValuePostCustomerInvoiceData = ({ prop, value }) => ({
  type: Types.SET_VALUE_POST_CUSTOMER_INVOICE_DATA,
  payload: { prop, value }
})

export const setValueCurrencyData = ({ prop, value }) => ({
  type: Types.SET_VALUE_CURRENCY_DATA,
  payload: { prop, value }
})

/** post */
export const postCalculatePrice = () => async (dispatch) => {
  await dispatch(setInvoiceDataProps({ prop: 'isLoadingPostDataInvoice', value: true }))

  await dispatch(
    postCalculateInvoicePrice(
      (tag, response) => {
        if (isDev()) console.log('postCalculatePrice - Error', response)
        dispatch(setInvoiceDataProps({ prop: 'errorInvoiceData', value: response }))
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorCalculateInvoicePrice'))
      },
      (tag, response) => {
        if (isDev()) console.log('postCalculatePrice', response)
        dispatch(setValuePostInvoiceData({ prop: 'subtotal', value: response.data?.subtotal }))
        dispatch(setValuePostInvoiceData({ prop: 'grandTotal', value: response.data?.grandTotal }))
      }
    )
  )

  await dispatch(setInvoiceDataProps({ prop: 'isLoadingPostDataInvoice', value: false }))
}

export const apiPostInvoice = (isDraft) => async (dispatch, getState) => {
  await dispatch(setInvoiceDataProps({ prop: 'isLoadingPostDataInvoice', value: true }))
  await dispatch(clearInvoiceDataErrors())

  await dispatch(
    postInvoice(
      (tag, response) => {
        if (isDev()) console.log('apiPostInvoice - Error', response)
        ApiResponseValidationManager.postInvoice(response, dispatch, setInvoiceDataProps)
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorPostInvoice'))
      },
      (tag, response) => {
        if (isDev()) console.log('apiPostInvoice', response)
        dispatch(setValuePostInvoiceData({ prop: 'id', value: response?.data?.invoice?.id }))
        dispatch(apiGetInvoicesIssued())
        dispatch(setInvoiceDataProps({ prop: 'submitPost', value: false }))
        if (!isDraft) document.getElementById('modal-open-modalok_new')?.click()
        if (isDraft) document.getElementById('modal-open-modalok_draft')?.click()
      }
    )
  )
  await dispatch(setInvoiceDataProps({ prop: 'isLoadingPostDataInvoice', value: false }))
}

export const apiPostInvoiceCsv = (invoices) => async (dispatch, getState) => {
  await dispatch(setInvoiceDataProps({ prop: 'isLoadingPostDataInvoice', value: true }))
  await dispatch(clearInvoiceDataErrors())

  await dispatch(
    postInvoiceCsv(
      invoices,
      (tag, response) => {
        if (isDev()) console.log('apiPostInvoice - Error', response)
        ApiResponseValidationManager.postInvoice(response, dispatch, setInvoiceDataProps)
        if (response?.message) {
          toast.error(response.message)
        } else if (response?.data?.message) {
          toast.error(response?.data?.message)
        } 
        else toast.error(strings('toasts.alert.errorPostInvoice'))
      },
      (tag, response) => {
        if (isDev()) console.log('apiPostInvoice', response)
        // dispatch(setValuePostInvoiceData({ prop: 'id', value: response?.data?.invoice?.id }))
        dispatch(apiGetInvoicesIssued())
        dispatch(setInvoiceDataProps({ prop: 'submitPost', value: false }))
        toast.success('csv importado exitosamente')
        document.getElementById('close-mod')?.click()
      }
    )
  )
  await dispatch(setInvoiceDataProps({ prop: 'isLoadingPostDataInvoice', value: false }))
}

export const validatePostInvoice = () => async (dispatch, getState) => {
  const { invoice, currency } = getState().InvoiceReducer
  const { invoiceNumber, issueDate, lines, files } = invoice
  const { code } = currency
  const error = FormValidationManager.formInvoiceInformation({
    invoiceNumber,
    issueDate,
    code,
    lines,
    files
  })

  await dispatch(setInvoiceDataProps({ prop: 'errorInvoiceData', value: error }))
  return error
}

export const apiPostSendInvoiceByEmail = () => async (dispatch) => {
  await dispatch(setInvoiceDataProps({ prop: 'isLoadingPostDataEmails', value: true }))

  await dispatch(
    postSendInvoiceByEmail(
      (tag, response) => {
        if (isDev()) console.log('apiPostSendInvoiceByEmail - Error', response)
        dispatch(setInvoiceDataProps({ prop: 'errorEmailsData', value: [{ key: 'emails', value: 'Invalid emails.' }] }))
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorSendInvoiceByEmail'))
      },
      (tag, response) => {
        if (isDev()) console.log('apiPostSendInvoiceByEmail', response)
        document.getElementById('modal-open-sendOK')?.click()
        dispatch(setInvoiceDataProps({ prop: 'emails', value: '' }))
        dispatch(setInvoiceDataProps({ prop: 'submitPost', value: false }))
      }
    )
  )

  await dispatch(clearInvoiceDataErrors())
  await dispatch(setInvoiceDataProps({ prop: 'isLoadingPostDataEmails', value: false }))
}

export const validatePostSendInvoiceByEmail = async (dispatch, emails) => {
  const error = FormValidationManager.formSendInvoiceEmail({ emails })
  await dispatch(setInvoiceDataProps({ prop: 'errorEmailsData', value: error }))
  return error
}

export const postNewInvoiceClient = (client) => async (dispatch, getState) => {
  const customer: IClient = {
    isNewCustomer: true,
    customerData: {
      email: client?.email,
      firstName: client?.firstName,
      lastName: client?.lastName,
      phone: client?.phone || undefined,
      company: {
        name: client?.companyName,
        region: client?.companyRegion,
        cif: client?.companyCIF || undefined,
        country: client?.companyCountry,
        city: client?.companyCity,
        address: client?.companyAddress,
        postalCode: client?.companyPostalCode
      }
    }
  }
  await dispatch(setValuePostInvoiceData({ prop: 'customer', value: customer }))
  await dispatch(setClientDataProps({ prop: 'submitPost', value: false }))
}

/** get */
export const apiGetInvoicesIssued = () => async (dispatch, getState) => {
  await dispatch(setInvoiceDataProps({ prop: 'isLoadingGetInvoices', value: true }))

  await dispatch(
    getInvoicesIssued(
      (tag, response) => {
        if (isDev()) console.log('apiGetInvoicesIssued - Error', response)
        dispatch(setInvoiceDataProps({ prop: 'errorInvoicesData', value: response }))
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorGetInvoices'))
      },
      (tag, response) => {
        if (isDev()) console.log('apiGetInvoicesIssued', response)
        dispatch(setInvoiceDataProps({ prop: 'invoices', value: response.data?.documents || [] }))
        dispatch(setInvoiceDataProps({ prop: 'count', value: response.data?.count || 0 }))
      }
    )
  )

  await dispatch(setInvoiceDataProps({ prop: 'isLoadingGetInvoices', value: false }))
}

export const apiGetInvoicesIssuedQuickpay = () => async (dispatch, getState) => {
  await dispatch(setInvoiceDataProps({ prop: 'isLoadingGetInvoices', value: true }))

  await dispatch(
    getInvoicesIssuedQuickpay(
      (tag, response) => {
        if (isDev()) console.log('apiGetInvoicesIssued - Error', response)
        dispatch(setInvoiceDataProps({ prop: 'errorInvoicesData', value: response }))
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorGetInvoices'))
      },
      (tag, response) => {
        if (isDev()) console.log('apiGetInvoicesIssued', response)
        dispatch(setInvoiceDataProps({ prop: 'invoices', value: response.data?.documents || [] }))
        dispatch(setInvoiceDataProps({ prop: 'count', value: response.data?.count || 0 }))
      }
    )
  )

  await dispatch(setInvoiceDataProps({ prop: 'isLoadingGetInvoices', value: false }))
}

export const apiGetMyCompanyInvoices = () => async (dispatch, getState) => {
  await dispatch(setInvoiceDataProps({ prop: 'isLoadingGetInvoices', value: true }))

  await dispatch(
    getMyCompanyInvoices(
      (tag, response) => {
        if (isDev()) console.log('apiGetMyCompanyInvoices - Error', response)
        dispatch(setInvoiceDataProps({ prop: 'errorInvoicesData', value: response }))
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorGetInvoices'))
      },
      (tag, response) => {
        if (isDev()) console.log('apiGetMyCompanyInvoices', response)
        dispatch(setInvoiceDataProps({ prop: 'invoices', value: response.data?.documents || [] }))
        dispatch(setInvoiceDataProps({ prop: 'count', value: response.data?.count || 0 }))
      }
    )
  )

  await dispatch(setInvoiceDataProps({ prop: 'isLoadingGetInvoices', value: false }))
}

export const apiGetInvoicesSentMetrics = () => async (dispatch, getState) => {
  await dispatch(setInvoiceDataProps({ prop: 'isLoadingGetInvoices', value: true }))

  await dispatch(
    getInvoicesSentMetrics(
      (tag, response) => {
        if (isDev()) console.log('apiGetMyCompanyInvoices - Error', response)
        dispatch(setInvoiceDataProps({ prop: 'errorInvoicesData', value: response }))
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorGetInvoices'))
      },
      async (tag, response) => {
        if (isDev()) console.log('apiGetMyCompanyInvoices', response)
        if (response && response?.metrics){
          const metrics = response?.metrics
          await dispatch(setInvoiceDataProps({prop: 'eligibleForEarlyPayment', value: metrics?.eligibleForEarlyPayment}))
          await dispatch(setInvoiceDataProps({prop: 'totalReceivable', value: metrics?.totalReceivable}))
          await dispatch(setInvoiceDataProps({prop: 'monthlyAdvancedAverage', value: metrics?.monthlyAdvancedAverage}))
        }
       
      }
    )
  )

  await dispatch(setInvoiceDataProps({ prop: 'isLoadingGetInvoices', value: false }))
}

export const apiGetBilling = () => async (dispatch, getState) => {
  await dispatch(setInvoiceDataProps({ prop: 'isLoadingGetInvoices', value: true }))

  await dispatch(
    getBilling(
      (tag, response) => {
        if (isDev()) console.log('apiGetMyCompanyInvoices - Error', response)
        dispatch(setInvoiceDataProps({ prop: 'errorInvoicesData', value: response }))
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorGetInvoices'))
      },
      async (tag, response) => {
        if (isDev()) console.log('apiGetMyCompanyInvoices', response)
        if (response && response?.data){
          const metrics = response?.data
          await dispatch(setInvoiceDataProps({prop: 'totalDuethisMonth', value: metrics?.totalDuethisMonth}))
          await dispatch(setInvoiceDataProps({prop: 'earnings', value: metrics?.earnings}))
          await dispatch(setInvoiceDataProps({prop: 'billing', value: metrics?.billings}))
          await dispatch(setInvoiceDataProps({prop: 'totalDueAfterDeductingMonthlyEarnings', value: metrics?.totalDueAfterDeductingMonthlyEarnings}))
        }
       
      }
    )
  )

  await dispatch(setInvoiceDataProps({ prop: 'isLoadingGetInvoices', value: false }))
}


export const apiGetInvoicesQuickpaySentMetrics = () => async (dispatch, getState) => {
  await dispatch(setInvoiceDataProps({ prop: 'isLoadingGetInvoices', value: true }))

  await dispatch(
    getInvoicesSentQuickpayMetrics(
      (tag, response) => {
        if (isDev()) console.log('apiGetMyCompanyInvoices - Error', response)
        dispatch(setInvoiceDataProps({ prop: 'errorInvoicesData', value: response }))
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorGetInvoices'))
      },
      async (tag, response) => {
        if (isDev()) console.log('apiGetMyCompanyInvoices', response)
        if (response && response?.metrics){
          const metrics = response?.metrics
          await dispatch(setInvoiceDataProps({prop: 'averageDaysAdvanced', value: metrics?.averageDaysAdvanced}))
          await dispatch(setInvoiceDataProps({prop: 'currentAdvancedAmount', value: metrics?.currentAdvancedAmount}))
          await dispatch(setInvoiceDataProps({prop: 'totalSettledEarly', value: metrics?.totalSettledEarly}))
        }
       
      }
    )
  )

  await dispatch(setInvoiceDataProps({ prop: 'isLoadingGetInvoices', value: false }))
}

export const apiGetInvoicesReceivedMetrics = () => async (dispatch, getState) => {
  await dispatch(setInvoiceDataProps({ prop: 'isLoadingGetInvoices', value: true }))

  await dispatch(
    getInvoicesReceivedMetrics(
      (tag, response) => {
        if (isDev()) console.log('apiGetMyCompanyInvoices - Error', response)
        dispatch(setInvoiceDataProps({ prop: 'errorInvoicesData', value: response }))
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorGetInvoices'))
      },
      async (tag, response) => {
        if (isDev()) console.log('apiGetMyCompanyInvoices', response)
        if (response && response?.metrics){
          const metrics = response?.metrics
          await dispatch(setInvoiceDataProps({prop: 'totalDue', value: metrics?.totalDue}))
          await dispatch(setInvoiceDataProps({prop: 'averageInvoiceAge', value: metrics?.averageInvoiceAge || 0}))
          await dispatch(setInvoiceDataProps({prop: 'totalAmountOfferedEarlyPayment', value: metrics?.totalAmountOfferedEarlyPayment}))
        }
       
      }
    )
  )

  await dispatch(setInvoiceDataProps({ prop: 'isLoadingGetInvoices', value: false }))
}

export const apiGetInvoicesQuickpayReceivedMetrics = () => async (dispatch, getState) => {
  await dispatch(setInvoiceDataProps({ prop: 'isLoadingGetInvoices', value: true }))

  await dispatch(
    getInvoicesReceivedQuickpayMetrics(
      (tag, response) => {
        if (isDev()) console.log('apiGetMyCompanyInvoices - Error', response)
        dispatch(setInvoiceDataProps({ prop: 'errorInvoicesData', value: response }))
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorGetInvoices'))
      },
      async (tag, response) => {
        if (isDev()) console.log('apiGetMyCompanyInvoices', response)
        if (response && response?.metrics){
          const metrics = response?.metrics
          await dispatch(setInvoiceDataProps({prop: 'totalSettledEarly', value: metrics?.totalSettledEarly}))
          await dispatch(setInvoiceDataProps({prop: 'totalEarningsfromEarlyPayments', value: metrics?.totalEarningsfromEarlyPayments}))
          await dispatch(setInvoiceDataProps({prop: 'totalSettledEarlybyFinancialInstitution', value: metrics?.totalSettledEarlybyFinancialInstitution}))
          await dispatch(setInvoiceDataProps({prop: 'totalEarningsfromEarlySettlementbyFinancialInstitution', value: metrics?.totalEarningsfromEarlySettlementbyFinancialInstitution}))
        }
       
      }
    )
  )

  await dispatch(setInvoiceDataProps({ prop: 'isLoadingGetInvoices', value: false }))
}

export const apiGetInvoicesReceivedFinancialMetrics = () => async (dispatch, getState) => {
  await dispatch(setInvoiceDataProps({ prop: 'isLoadingGetInvoices', value: true }))

  await dispatch(
    getInvoicesReceivedFinancialMetrics(
      (tag, response) => {
        if (isDev()) console.log('apiGetMyCompanyInvoices - Error', response)
        dispatch(setInvoiceDataProps({ prop: 'errorInvoicesData', value: response }))
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorGetInvoices'))
      },
      async (tag, response) => {
        if (isDev()) console.log('apiGetMyCompanyInvoices', response)
        if (response && response?.metrics){
          const metrics = response?.metrics
          await dispatch(setInvoiceDataProps({prop: 'pendingEarlyPayment', value: metrics?.pendingEarlyPayment}))
          await dispatch(setInvoiceDataProps({prop: 'earningsFromEarlyPayment', value: metrics?.earningsFromEarlyPayment}))
          await dispatch(setInvoiceDataProps({prop: 'totalSettledEarly', value: metrics?.totalSettledEarly}))
        }
       
      }
    )
  )

  await dispatch(setInvoiceDataProps({ prop: 'isLoadingGetInvoices', value: false }))
}

export const apiGetInvoicesQuickpayReceivedFinancialMetrics = () => async (dispatch, getState) => {
  await dispatch(setInvoiceDataProps({ prop: 'isLoadingGetInvoices', value: true }))

  await dispatch(
    getInvoicesReceivedQuickpayFinancialMetrics(
      (tag, response) => {
        if (isDev()) console.log('apiGetMyCompanyInvoices - Error', response)
        dispatch(setInvoiceDataProps({ prop: 'errorInvoicesData', value: response }))
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorGetInvoices'))
      },
      async (tag, response) => {
        if (isDev()) console.log('apiGetMyCompanyInvoices', response)
        if (response && response?.metrics){
          const metrics = response?.metrics
          await dispatch(setInvoiceDataProps({prop: 'overdueInvoicesAmount', value: metrics?.overdueInvoicesAmount}))
          await dispatch(setInvoiceDataProps({prop: 'monthlySettlementAverage', value: metrics?.monthlySettlementAverage}))
          await dispatch(setInvoiceDataProps({prop: 'averageInterestRate', value: metrics?.averageInterestRate}))
        }
       
      }
    )
  )

  await dispatch(setInvoiceDataProps({ prop: 'isLoadingGetInvoices', value: false }))
}

export const apiGetInvoice = (id, isQuickpay = false) => async (dispatch) => {
  await dispatch(setInvoiceDataProps({ prop: 'isLoadingGetInvoice', value: true }))
  await dispatch(clearInvoicesDataErrors())

  await dispatch(
    getInvoice(
      id,
      (tag, response) => {
        if (isDev()) console.log('apiGetInvoice - Error', response)
        dispatch(setInvoiceDataProps({ prop: 'errorInvoicesData', value: response }))
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorGetInvoice'))
      },
      async (tag, response) => {
        if (isDev()) console.log('apiGetInvoice', response)
        /** invoice data */
        const invoiceData = response?.data?.invoice
        await dispatch(setInvoice(invoiceData, isQuickpay))
        const currencyData = invoiceData?.currency
        dispatch(setCurrency(currencyData))
        await dispatch(apiGetOneSuppCustRelationship(invoiceData?.supplier?.id))
        await dispatch(apiGetOneCustFinancialRelationship())
      }
    )
  )

  await dispatch(setInvoiceDataProps({ prop: 'isLoadingGetInvoice', value: false }))
}

export const setInvoice = (invoiceData, isQuickpay = false) => async (dispatch) => {
  const invoice = {
    id: invoiceData?.id,
    customer: invoiceData?.customer,
    supplier: invoiceData?.supplier,
    invoiceNumber: invoiceData?.invoiceNumber,
    issueDate: invoiceData?.issueDate ? invoiceData?.issueDate.substring(0, 10) : '', // yyyy-mm-dd
    lines: invoiceData?.lines,
    messages: invoiceData?.messages,
    files: invoiceData?.files,
    evidenceAdvancePayment: invoiceData?.evidenceAdvancePayment ? invoiceData?.evidenceAdvancePayment : [],
    evidencePaymentToFinancial: invoiceData?.evidencePaymentToFinancial ? invoiceData?.evidencePaymentToFinancial : [],
    attachfilesChat: [],
    subtotal: invoiceData?.subtotal,
    grandTotal: invoiceData?.grandTotal,
    financial: invoiceData?.financial,
    totalTaxes: invoiceData?.totalTaxes,
    totalTaxPercentage: invoiceData?.totalTaxPercentage,
    grandTotalWithDiscount: invoiceData?.grandTotalWithDiscount,
    status: invoiceData?.status,
    uploaded: invoiceData?.uploaded,
    earlyPaymentRequested: invoiceData?.earlyPaymentRequested,
    earlyPaymentDiscount: invoiceData?.earlyPaymentDiscount,
    dueDate: invoiceData?.dueDate,
    observations: invoiceData?.observations,
    customerBasicInformation: invoiceData?.customerBasicInformation,
    eventRegistration: invoiceData?.eventRegistration,
    definedByRule: invoiceData?.definedByRule,
    paymentDate: invoiceData?.paymentDate,
    invoiceDatePaidOrAdvanced: invoiceData?.invoiceDatePaidOrAdvanced,
    statusQuickpay: invoiceData?.statusQuickpay,
    acceptedWhenExpired: invoiceData?.acceptedWhenExpired,
    paymentPreferences: invoiceData?.paymentPreferences,
    issued: invoiceData?.issued,
    rejectedReason: invoiceData?.rejectedReason,
    isQuickpay
  }
  await dispatch({
    type: Types.GET_INVOICE,
    payload: invoice
  })
}

export const setCurrency = (currencyData) => async (dispatch) => {
  const currency = {
    id: currencyData?.id,
    label: currencyData?.label,
    code: currencyData?.code,
    symbol: currencyData?.symbol
  }
  await dispatch({
    type: Types.GET_CURRENCY,
    payload: currency
  })
}

export const apiGetCurrencies = () => async (dispatch) => {
  await dispatch(setInvoiceDataProps({ prop: 'isLoadingGetCurrencies', value: true }))

  await dispatch(
    getCurrencies(
      (tag, response) => {
        if (isDev()) console.log('apiGetCurrencies - Error', response)
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorGetCurrencies'))
      },
      (tag, response) => {
        if (isDev()) console.log('apiGetCurrencies', response)
        dispatch(setInvoiceDataProps({ prop: 'currencies', value: sortCurrencies(response.data?.allCurrency) }))
      }
    )
  )

  await dispatch(setInvoiceDataProps({ prop: 'isLoadingGetCurrencies', value: false }))
}
export const apiGetCurrencyByCode = () => async (dispatch) => {
  await dispatch(setInvoiceDataProps({ prop: 'isLoadingGetCurrency', value: true }))

  await dispatch(
    getCurrencyByCode(
      (tag, response) => {
        if (isDev()) console.log('apiGetCurrencyByCode - Error', response)
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorGetCurrency'))
      },
      (tag, response) => {
        if (isDev()) console.log('apiGetCurrencyByCode', response)
        dispatch(setInvoiceDataProps({ prop: 'currency', value: response.data?.currency }))
      }
    )
  )

  await dispatch(setInvoiceDataProps({ prop: 'isLoadingGetCurrency', value: false }))
}

/** delete */

export const apiDeleteInvoice = (id) => async (dispatch) => {
  await dispatch(setInvoiceDataProps({ prop: 'isLoadingDeleteInvoice', value: true }))

  await dispatch(
    delInvoice(
      id,
      (tag, response) => {
        if (isDev()) console.log('apiDeleteInvoice - Error', response)
      },
      (tag, response) => {
        if (isDev()) console.log('apiDeleteInvoice - Success', response)
        dispatch({ type: Types.CLEAR_INVOICE_DATA })
        document.getElementById('modalDisplayDeleteItemOK')?.click()
      }
    )
  )

  await dispatch(setInvoiceDataProps({ prop: 'isLoadingDeleteInvoice', value: false }))
}

/** put */
export const apiPutInvoice = (id, isDraft) => async (dispatch) => {
  await dispatch(setInvoiceDataProps({ prop: 'isLoadingPutDataInvoice', value: true }))
  await dispatch(clearInvoiceDataErrors())

  await dispatch(
    putInvoice(
      id,
      (tag, response) => {
        if (isDev()) console.log('apiPutInvoice - Error', response)
        ApiResponseValidationManager.postInvoice(response, dispatch, setInvoiceDataProps)
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorPutInvoice'))
      },
      (tag, response) => {
        if (isDev()) console.log('apiPutInvoice', response)
        dispatch(setValuePostInvoiceData({ prop: 'id', value: response?.data?.invoice?.id }))
        dispatch(apiGetInvoicesIssued())
        dispatch(setInvoiceDataProps({ prop: 'submitPost', value: false }))
        if (!isDraft) document.getElementById('modal-open-modalok_new')?.click()
        if (isDraft) document.getElementById('modal-open-modalok_draft')?.click()
      }
    )
  )

  await dispatch(setInvoiceDataProps({ prop: 'isLoadingPutDataInvoice', value: false }))
}

export const apiSendMessageInvoice = (id, message, recipientMessage) => async (dispatch) => {
  await dispatch(seSendMessageInvoiceProps({ prop: 'isLoadingSendMessage', value: true }))
  await dispatch(clearInvoiceDataErrors())

  await dispatch(
    sendMessageInvoice(
      id,
      message,
      recipientMessage,
      (tag, response) => {
        if (isDev()) console.log('apiPutInvoice - Error', response)
        ApiResponseValidationManager.postInvoice(response, dispatch, setInvoiceDataProps)
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorPutInvoice'))
      },
      (tag, response) => {
        if (isDev()) console.log('apiPutInvoice', response)
        dispatch(setValuePostInvoiceData({ prop: 'id', value: response?.data?.invoice?.id }))
        dispatch(setInvoiceDataProps({ prop: 'submitPost', value: false }))
        dispatch(apiGetInvoice(id))
      }
    )
  )

  await dispatch(seSendMessageInvoiceProps({ prop: 'isLoadingSendMessage', value: false }))
}


export const apiReadMessageInvoice = (id, unreadMessageIds) => async (dispatch) => {
  await dispatch(clearInvoiceDataErrors())
  await dispatch(
    readMessageInvoice(
      id,
      unreadMessageIds,
      (tag, response) => {
        if (isDev()) console.log('apiPutInvoice - Error', response)
        ApiResponseValidationManager.postInvoice(response, dispatch, setInvoiceDataProps)
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorPutInvoice'))
      },
      (tag, response) => {
        if (isDev()) console.log('apiPutInvoice', response)
      }
    )
  )

  await dispatch(seSendMessageInvoiceProps({ prop: 'isLoadingSendMessage', value: false }))
}

export const apiSendEvidenceAdvancePayment = (id, isInvoicesQuickPay = false) => async (dispatch) => {
  await dispatch(setInvoiceDataProps({ prop: 'isLoadingPutDataInvoice', value: true }))
  await dispatch(clearInvoiceDataErrors())

  await dispatch(
    putSendEvidenceAdvancePayment(
      id,
      (tag, response) => {
        if (isDev()) console.log('apiPutInvoice - Error', response)
        ApiResponseValidationManager.postInvoice(response, dispatch, setInvoiceDataProps)
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorPutInvoice'))
      },
      async (tag, response) => {
        if (isDev()) console.log('apiPutInvoice', response)
        dispatch(setValuePostInvoiceData({ prop: 'id', value: response?.data?.invoice?.id }))
        if (isInvoicesQuickPay) {
          dispatch(apiGetReceivedInvoicesQuickpay())
        } else {
          dispatch(apiGetReceivedInvoices())
        }
        await dispatch(setPayToFinancialProps({prop: 'payToFinancial', value: false}))
        await dispatch(setIsMarkAsPaidProps({prop: 'isMarkPaid', value: false}))
        dispatch(setInvoiceDataProps({ prop: 'submitPost', value: false }))
      }
    )
  )

  await dispatch(setInvoiceDataProps({ prop: 'isLoadingPutDataInvoice', value: false }))
}

/** patch */

export const apiPatchMarkAsPaidInvoice = (id) => async (dispatch, getState) => {
  await dispatch(
    patchMarkAsPaidInvoice(
      id,
      (tag, response) => {
        if (isDev()) console.log('apiPatchMarkAsPaidInvoice - Error', response)
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorPatchMarkAsPaidInvoice'))
      },
      (tag, response) => {
        if (isDev()) console.log('apiPatchMarkAsPaidInvoice', response)
        document.getElementById('modal-open-markAsPaid')?.click()
      }
    )
  )
}

export const apiPostRequestEarlyPayment = () => async (dispatch, getState) => {
  const { invoice } = getState().InvoiceReducer as IInvoiceState
  await dispatch(setInvoiceDataProps({ prop: 'isLoadingPostRequestEarlyPayment', value: true }))

  await dispatch(
    postRequestEarlyPayment(
      invoice?.id,
      (tag, response) => {
        if (isDev()) console.log('apiPostRequestEarlyPayment - Error', response)
        if (response?.message) {
          toast.error(response.message)
        }
      },
      (tag, response) => {
        if (isDev()) console.log('apiPostRequestEarlyPayment', response)
        document.getElementById('close-early-payment-data')?.click()
        document?.getElementById('modal-success-early-payment')?.click()
        dispatch(apiGetInvoicesIssued())
      }
    )
  )

  await dispatch(setInvoiceDataProps({ prop: 'isLoadingPostRequestEarlyPayment', value: false }))
}

export const apiPostValidateUserForInvoice = () => async (dispatch, getState) => {
  const { invoice } = getState().InvoiceReducer

  await dispatch(setInvoiceDataProps({ prop: 'isLoadingPostValidateUserForInvoice', value: true }))
  await dispatch(clearInvoiceDataErrors())

  await dispatch(
    postValidateUserCompany(
      invoice,
      (tag, response) => {
        if (isDev()) console.log('apiPostValidateUserForInvoice - Error', response)
        ApiResponseValidationManager.postValidateUserForInvoice(response, dispatch, setClientDataProps)
      },
      async (tag, response) => {
        if (isDev()) console.log('apiPostValidateUserForInvoice', response)
        await dispatch(setInvoiceDataProps({ prop: 'submitPost', value: false }))
        await dispatch(setClientNewBranchProps({ prop: 'newBranchForClient', value: response.data?.exist }))
        document.getElementById('closeNewClientModal')?.click()
      }
    )
  )

  await dispatch(setInvoiceDataProps({ prop: 'isLoadingPostValidateUserForInvoice', value: false }))
}
