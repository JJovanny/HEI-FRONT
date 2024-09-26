// api
import { getFinancialSuppliers, getMySuppliers, getSupplierPaymentPreferences, patchSupplierPaymentPreferences } from 'src/api/supplier'
// resources
import { isDev } from '../utils/Utils'

// resources
import Types from './Types'
import toast from 'react-hot-toast'
import { strings } from 'src/resources/locales/i18n'

/** clear */
export const clearSupplierDataErrors = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_ERROR_SUPPLIER_DATA })
}

export const clearSupplierFilters = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_SUPPLIER_FILTERS })
}

export const clearSupplierData = () => ({ type: Types.CLEAR_SUPPLIER_DATA })

export const clearSuppliersData = () => ({ type: Types.CLEAR_SUPPLIERS_DATA })

/** set */
export const setSupplierDataProps = ({ prop, value }) => ({
  type: Types.SET_SUPPLIER_DATA_PROPS,
  payload: { prop, value }
})

export const setValueSupplierFiltersData = ({ prop, value }) => ({
  type: Types.SET_VALUE_SUPPLIER_FILTERS_DATA,
  payload: { prop, value }
})

export const setValueSupplierPaymentPreferencesData = ({ prop, value }) => ({
  type: Types.SET_VALUE_SUPPLIER_PAYMENT_PREFERENCES_DATA,
  payload: { prop, value }
})

/** get */
export const apiGetMySuppliers = () => async (dispatch) => {
  await dispatch(setSupplierDataProps({ prop: 'isLoadingGetSuppliers', value: true }))
  await dispatch(
    getMySuppliers(
      (tag, response) => {
        if (isDev()) console.log('apiGetMySuppliers - Error', response)
      },
      (tag, response) => {
        if (isDev()) console.log('apiGetMySuppliers - Success', response)
        dispatch(setSupplierDataProps({ prop: 'suppliers', value: response?.data?.data?.documents || [] }))
        dispatch(setSupplierDataProps({ prop: 'count', value: response.data?.data?.count || 0 }))
      }
    )
  )
  await dispatch(setSupplierDataProps({ prop: 'isLoadingGetSuppliers', value: false }))
}

export const apiGetFinancialSuppliers = () => async (dispatch) => {
  await dispatch(setSupplierDataProps({ prop: 'isLoadingGetSuppliers', value: true }))
  await dispatch(
    getFinancialSuppliers(
      (tag, response) => {
        if (isDev()) console.log('apiGetMySuppliers - Error', response)
      },
      (tag, response) => {
        if (isDev()) console.log('apiGetMySuppliers - Success', response)
        dispatch(setSupplierDataProps({ prop: 'suppliers', value: response?.data?.data?.documents || [] }))
        dispatch(setSupplierDataProps({ prop: 'count', value: response.data?.data?.count || 0 }))
      }
    )
  )
  await dispatch(setSupplierDataProps({ prop: 'isLoadingGetSuppliers', value: false }))
}


export const apiGetSupplierPaymentPreferences = (id) => async (dispatch) => {
  await dispatch(
    getSupplierPaymentPreferences(
      id,
      (tag, response) => {
        if (isDev()) console.log('apiGetSupplierPaymentPreferences - Error', response)
      },
      (tag, response) => {
        if (isDev()) console.log('apiGetSupplierPaymentPreferences - Success', response)
        dispatch(setSupplierDataProps({ prop: 'supplierPaymentPreferences', value: response?.data || {} }))
      }
    )
  )
}

/** patch */
export const apiPatchSupplierPaymentPreferences = (id, modal, allowPayment?, days?, discount?, finantial?) => async (dispatch, getState) => {
  await dispatch(
    patchSupplierPaymentPreferences(
      id,
      (tag, response) => {
        if (isDev()) console.log('apiPatchSupplierPaymentPreferences - Error', response)
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorPatchAcceptInvoice'))
      },
      (tag, response) => {
        if (isDev()) console.log('apiPatchSupplierPaymentPreferences', response)
        dispatch(apiGetMySuppliers())
        if (modal) document.getElementById('modal-open-updateOK')?.click()
      },
      allowPayment,
      days,
      discount,
      finantial
    )
  )
}
