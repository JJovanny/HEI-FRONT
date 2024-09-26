import toast from 'react-hot-toast'
import { isDev } from 'src/utils/Utils'
import Types from './Types'
import { getAssociatedCompanies, getAssociatedCompanyInvoiceDetail, getAssociatedCompanyInvoices } from 'src/api/admin/company'
import { ICompanyState } from 'src/types/admin/company'

export const clearCompaniesData = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_COMPANIES_DATA })
}

export const setAssociatedCompaniesDataProps = ({ prop, value }) => ({
  type: Types.SET_MY_COMPANIES_DATA_PROPS,
  payload: { prop, value }
})

export const setInvoiceProps = (value) => ({
  type: Types.SET_INVOICE_PROPS,
  payload: { value }
})

export const apiGetAssociatedCompanies = () => async (dispatch) => {
  await dispatch(setAssociatedCompaniesDataProps({ prop: 'isLoadingGetAssociatedCompanies', value: true }))

  await dispatch(
    getAssociatedCompanies(
      (tag, response) => {
        if (isDev()) console.log('apiGetAssociatedCompanies - Error', response)
        if (response?.message) toast.error(response.message)
      },
      (tag, response) => {
        if (isDev()) console.log('apiGetAssociatedCompanies', response)
        dispatch(setAssociatedCompaniesDataProps({ prop: 'companies', value: response?.data?.documents || [] }))
        dispatch(setAssociatedCompaniesDataProps({ prop: 'count', value: response?.data?.count || 0 }))
      }
    )
  )

  await dispatch(setAssociatedCompaniesDataProps({ prop: 'isLoadingGetAssociatedCompanies', value: false }))
}

export const apiGetAssociatedCompanyInvoices = () => async (dispatch, getState) => {
  const { companyData } = getState().CompaniesReducer as ICompanyState
  await dispatch(setAssociatedCompaniesDataProps({ prop: 'isLoadingGetAssociatedCompanyInvoices', value: true }))

  await dispatch(
    getAssociatedCompanyInvoices(
      companyData?.id,
      (tag, response) => {
        if (isDev()) console.log('apiGetAssociatedCompanyInvoices - Error', response)
        if (response?.message) toast.error(response.message)
      },
      async (tag, response) => {
        if (isDev()) console.log('apiGetAssociatedCompanyInvoices', response)
        await dispatch(setAssociatedCompaniesDataProps({ prop: 'companyData', value: { ...companyData, invoices: response?.data?.invoices } }))
      }
    )
  )

  await dispatch(setAssociatedCompaniesDataProps({ prop: 'isLoadingGetAssociatedCompanyInvoices', value: false }))
}

export const apiGetAssociatedCompanyInvoiceDetail = (id, success?) => async (dispatch) => {
  await dispatch(setAssociatedCompaniesDataProps({ prop: 'isLoadingGetAssociatedCompanyInvoiceDetail', value: true }))

  await dispatch(
    getAssociatedCompanyInvoiceDetail(
      id,
      (tag, response) => {
        if (isDev()) console.log('apiGetAssociatedCompanyInvoiceDetail - Error', response)
        if (response?.message) toast.error(response.message)
      },
      async (tag, response) => {
        if (isDev()) console.log('apiGetAssociatedCompanyInvoiceDetail', response)
        await dispatch(setInvoiceProps(response?.data?.invoice))
        success && success()
      }
    )
  )

  await dispatch(setAssociatedCompaniesDataProps({ prop: 'isLoadingGetAssociatedCompanyInvoiceDetail', value: false }))
}
