import toast from 'react-hot-toast'
import { strings } from 'src/resources/locales/i18n'
import { isDev } from 'src/utils/Utils'
import Types from './Types'
import { getReceivedInvoices, getReceivedInvoicesQuickpay, patchAcceptInvoice, patchDenyInvoice } from 'src/api/receivedInvoice'

/** clear */
export const clearReceivedInvoiceToInitialState = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_TO_INITIAL_STATE })
}

export const clearReceivedInvoicesPagination = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_RECEIVED_INVOICES_PAGINATION })
}

export const clearReceivedInvoicesDataErrors = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_ERROR_RECEIVED_INVOICES_DATA })
}

export const clearReceivedInvoicesData = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_RECEIVED_INVOICES_DATA })
}

/** set */
export const setReceivedInvoiceDataProps = ({ prop, value }) => ({
  type: Types.SET_RECEIVED_INVOICE_DATA_PROPS,
  payload: { prop, value }
})

export const setReceivedQuickpayInvoiceDataProps = ({ prop, value }) => ({
  type: Types.SET_RECEIVED_QUICKPAY_INVOICE_DATA_PROPS,
  payload: { prop, value }
})

export const setValueCurrencyData = ({ prop, value }) => ({
  type: Types.SET_VALUE_CURRENCY_DATA,
  payload: { prop, value }
})

/** get */
export const apiGetReceivedInvoices = () => async (dispatch, getState) => {
  await dispatch(setReceivedInvoiceDataProps({ prop: 'isLoadingReceivedInvoices', value: true }))

  await dispatch(
    getReceivedInvoices(
      (tag, response) => {
        if (isDev()) console.log('apiGetReceivedInvoices - Error', response)
        dispatch(setReceivedInvoiceDataProps({ prop: 'errorReceivedInvoicesData', value: response }))
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorGetInvoices'))
      },
      (tag, response) => {
        if (isDev()) console.log('apiGetReceivedInvoices', response)
        dispatch(setReceivedInvoiceDataProps({ prop: 'receivedInvoices', value: response.data?.documents || [] }))
        dispatch(setReceivedInvoiceDataProps({ prop: 'count', value: response.data?.count || 0 }))
      }
    )
  )

  await dispatch(setReceivedInvoiceDataProps({ prop: 'isLoadingReceivedInvoices', value: false }))
}

export const apiGetReceivedInvoicesQuickpay = () => async (dispatch, getState) => {
  await dispatch(setReceivedInvoiceDataProps({ prop: 'isLoadingReceivedInvoices', value: true }))

  await dispatch(
    getReceivedInvoicesQuickpay(
      (tag, response) => {
        if (isDev()) console.log('apiGetReceivedInvoices - Error', response)
        dispatch(setReceivedInvoiceDataProps({ prop: 'errorReceivedInvoicesData', value: response }))
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorGetInvoices'))
      },
      (tag, response) => {
        if (isDev()) console.log('apiGetReceivedInvoices', response)
        dispatch(setReceivedInvoiceDataProps({ prop: 'receivedInvoices', value: response.data?.documents || [] }))
        dispatch(setReceivedInvoiceDataProps({ prop: 'count', value: response.data?.count || 0 }))
      }
    )
  )
  await dispatch(setReceivedInvoiceDataProps({ prop: 'isLoadingReceivedInvoices', value: false }))
}

/** patch */
export const apiPatchDenyInvoice = (id, reason) => async (dispatch, getState) => {
  await dispatch(setReceivedInvoiceDataProps({ prop: 'isLoadingReceivedInvoices', value: true }))

  await dispatch(
    patchDenyInvoice(
      id,
      reason,
      (tag, response) => {
        if (isDev()) console.log('apiPatchDenyInvoice - Error', response)
        dispatch(setReceivedInvoiceDataProps({ prop: 'errorReceivedInvoicesData', value: response }))
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorPatchDenyInvoice'))
      },
      (tag, response) => {
        if (isDev()) console.log('apiPatchDenyInvoice', response)
        dispatch(apiGetReceivedInvoices())
      }
    )
  )

  await dispatch(setReceivedInvoiceDataProps({ prop: 'isLoadingReceivedInvoices', value: false }))
}

export const apiPatchAcceptInvoice = (id, days, allowPayment, discount, externalPayment, dailyDiscountToApply, offerCutoffBeforeDueDate, dueDate,numberDaysUntilExpirationDate) => async (dispatch, getState) => {
  await dispatch(setReceivedInvoiceDataProps({ prop: 'isLoadingReceivedInvoices', value: true }))

  await dispatch(
    patchAcceptInvoice(
      id,
      days,
      allowPayment,
      discount,
      externalPayment,
      dailyDiscountToApply,
      offerCutoffBeforeDueDate,
      dueDate,
      numberDaysUntilExpirationDate,
      (tag, response) => {
        if (isDev()) console.log('apiPatchAcceptInvoice - Error', response)
        dispatch(setReceivedInvoiceDataProps({ prop: 'errorReceivedInvoicesData', value: response }))
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorPatchAcceptInvoice'))
      },
      (tag, response) => {
        if (isDev()) console.log('apiPatchAcceptInvoice', response)
        dispatch(apiGetReceivedInvoices())
      }
    )
  )

  await dispatch(setReceivedInvoiceDataProps({ prop: 'isLoadingReceivedInvoices', value: false }))
}
