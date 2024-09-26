import toast from 'react-hot-toast'
// api
import { postCompanyTax, getDefaultTaxes, getCompanyTaxes, getCompanyTax, delCompanyTax, putCompanyTax } from 'src/api/tax'
import FormValidationManager from '../utils/managers/FormValidationManager'
import ApiResponseValidationManager from '../utils/managers/ApiResponseValidationManager'
// resources
import { strings } from '../resources/locales/i18n'
import { isDev } from '../utils/Utils'
import Types from './Types'

/** clear */
export const clearTaxesDataErrors = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_ERROR_TAXES_DATA })
}

export const clearTaxDataErrors = () => ({ type: Types.CLEAR_ERROR_TAX_DATA })

export const clearTaxData = () => ({ type: Types.CLEAR_TAX_DATA })

export const clearTaxesData = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_TAXES_DATA })
}

/** set */
export const setTaxDataProps = ({ prop, value }) => ({
  type: Types.SET_TAX_DATA_PROPS,
  payload: { prop, value }
})

export const setValueTaxData = ({ prop, value }) => ({
  type: Types.SET_VALUE_TAX_DATA,
  payload: { prop, value }
})

/** post */
export const apiPostCompanyTax = () => async (dispatch) => {
  await dispatch(setTaxDataProps({ prop: 'isLoadingPostDataTax', value: true }))
  await dispatch(clearTaxDataErrors())

  await dispatch(
    postCompanyTax(
      (tag, response) => {
        if (isDev()) console.log('apiPostCompanyTax - Error', response)
        ApiResponseValidationManager.supplierTax(response, dispatch, setTaxDataProps)
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorPostTax'))
      },
      (tag, response) => {
        if (isDev()) console.log('apiPostCompanyTax', response)
        document.getElementById('modal-open-newTaxOK')?.click()
      }
    )
  )

  await dispatch(setTaxDataProps({ prop: 'isLoadingPostDataTax', value: false }))
}

export const validateTaxData = () => async (dispatch, getState) => {
  const { tax } = getState().TaxReducer
  const { name, percentage } = tax
  const error = FormValidationManager.formTaxInformation({
    name,
    percentage
  })

  await dispatch(setTaxDataProps({ prop: 'errorTaxData', value: error }))
  return error
}

/** get */
export const apiGetTaxes = () => async (dispatch, getState) => {
  await dispatch(clearTaxesData())
  await dispatch(clearTaxesDataErrors())
  await dispatch(setTaxDataProps({ prop: 'isLoadingGetTaxes', value: true }))

  /** Default Taxes (The supplier can only view and use them) */
  await dispatch(
    getDefaultTaxes(
      (tag, response) => {
        if (isDev()) console.log('apiGetTaxes - getDefaultTaxes - Error', response)
        dispatch(setTaxDataProps({ prop: 'errorTaxesData', value: response }))
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorGetDefaultTaxes'))
      },
      (tag, response) => {
        if (isDev()) console.log('apiGetTaxes - getDefaultTaxes', response)
        dispatch(setTaxDataProps({ prop: 'defaultTaxes', value: response.data?.taxes || [] }))
      }
    )
  )

  /** Supplier Taxes */
  await dispatch(
    getCompanyTaxes(
      (tag, response) => {
        if (isDev()) console.log('apiGetTaxes - getCompanyTaxes - Error', response)
        dispatch(setTaxDataProps({ prop: 'errorTaxesData', value: response }))
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorGetCompanyTaxes'))
      },
      (tag, response) => {
        if (isDev()) console.log('apiGetTaxes - getCompanyTaxes', response)
        dispatch(setTaxDataProps({ prop: 'supplierTaxes', value: response.data?.taxes || [] }))
      }
    )
  )

  await dispatch(setTaxDataProps({ prop: 'isLoadingGetTaxes', value: false }))
}

export const apiGetTax = (id) => async (dispatch) => {
  await dispatch(clearTaxData())
  await dispatch(clearTaxesDataErrors())
  await dispatch(setTaxDataProps({ prop: 'isLoadingGetTax', value: true }))

  await dispatch(
    getCompanyTax(
      id,
      (tag, response) => {
        if (isDev()) console.log('apiGetTax - Error', response)
        dispatch(setTaxDataProps({ prop: 'errorTaxData', value: response }))
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorGetTax'))
      },
      (tag, response) => {
        if (isDev()) console.log('apiGetTax', response)
        /** tax data */
        const taxData = response?.data?.tax
        dispatch(setTax(taxData))
      }
    )
  )

  await dispatch(setTaxDataProps({ prop: 'isLoadingGetTax', value: false }))
}

export const setTax = (taxData) => async (dispatch) => {
  const tax = {
    id: taxData?.id,
    name: taxData?.name,
    percentage: taxData?.percentage,
    isUsed: taxData?.isUsed
  }
  await dispatch({
    type: Types.GET_TAX,
    payload: tax
  })
}

/** delete */
export const apiDeleteCompanyTax = (id) => async (dispatch) => {
  await dispatch(setTaxDataProps({ prop: 'isLoadingDeleteTax', value: true }))

  let success = false
  await dispatch(
    delCompanyTax(
      id,
      (tag, response) => {
        if (isDev()) console.log('apiDeleteCompanyTax - Error', response)
      },
      (tag, response) => {
        if (isDev()) console.log('apiDeleteCompanyTax - Success', response)
        success = true
        document.getElementById('modalDisplayDeleteItemOK')?.click()
      }
    )
  )
  await dispatch(setTaxDataProps({ prop: 'isLoadingDeleteTax', value: false }))
}

/** put */
export const apiPutCompanyTax = (id) => async (dispatch) => {
  await dispatch(setTaxDataProps({ prop: 'isLoadingPutDataTax', value: true }))
  await dispatch(clearTaxDataErrors())

  await dispatch(
    putCompanyTax(
      id,
      (tag, response) => {
        if (isDev()) console.log('apiPutCompanyTax - Error', response)
        ApiResponseValidationManager.supplierTax(response, dispatch, setTaxDataProps)
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorPutTax'))
      },
      (tag, response) => {
        if (isDev()) console.log('apiPutCompanyTax', response)
        dispatch(setTaxDataProps({ prop: 'submit', value: false }))
        document.getElementById('modal-open-updateOK')?.click()
      }
    )
  )

  await dispatch(setTaxDataProps({ prop: 'isLoadingPutDataTax', value: false }))
}
