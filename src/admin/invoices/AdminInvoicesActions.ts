import toast from 'react-hot-toast'
import { getAssociatedCompanyInvoiceDetail } from 'src/api/admin/company'
import { getAdminInvoices } from 'src/api/admin/invoices'
import { isDev } from 'src/utils/Utils'
import Types from './Types'

export const clearInvoicesData = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_INVOICES_DATA })
}

export const setInvoicesDataProps = ({ prop, value }) => ({
  type: Types.SET_INVOICES_DATA_PROPS,
  payload: { prop, value }
})

export const apiGetAdminInvoices = () => async (dispatch) => {
  await dispatch(setInvoicesDataProps({ prop: 'isLoadingGetInvoices', value: true }))

  await dispatch(
    getAdminInvoices(
      (tag, response) => {
        if (isDev()) console.log('apiGetInvoices - Error', response)
        if (response?.message) toast.error(response.message)
      },
      async (tag, response) => {
        if (isDev()) console.log('apiGetInvoices', response)
        await dispatch(setInvoicesDataProps({ prop: 'invoices', value: response.data.documents }))
        await dispatch(setInvoicesDataProps({ prop: 'count', value: response.data.count }))
      }
    )
  )

  await dispatch(setInvoicesDataProps({ prop: 'isLoadingGetInvoices', value: false }))
}

export const apiGetAdminInvoice = (id, success?) => async (dispatch) => {
  await dispatch(setInvoicesDataProps({ prop: 'isLoadingGetInvoice', value: true }))

  await dispatch(
    getAssociatedCompanyInvoiceDetail(
      id,
      (tag, response) => {
        if (isDev()) console.log('apiGetInvoice - Error', response)
        if (response?.message) toast.error(response.message)
      },
      async (tag, response) => {
        if (isDev()) console.log('apiGetInvoice', response)
        await dispatch(setInvoicesDataProps({ prop: 'invoice', value: response.data.invoice }))
        success && success()
      }
    )
  )

  await dispatch(setInvoicesDataProps({ prop: 'isLoadingGetInvoice', value: false }))
}
