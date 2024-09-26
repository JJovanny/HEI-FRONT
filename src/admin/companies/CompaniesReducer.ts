import { ICompanyAdmin, ICompanyState } from 'src/types/admin/company'
import Types from './Types'

const INITIAL_STATE: ICompanyState = {
  companies: [],
  companyData: {} as ICompanyAdmin,
  isLoadingGetAssociatedCompanies: false,
  isLoadingGetAssociatedCompanyInvoices: false,
  isLoadingGetAssociatedCompanyInvoiceDetail: false,
  count: 0
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Types.SET_MY_COMPANIES_DATA_PROPS:
      return { ...state, [action.payload.prop]: action.payload.value }

    case Types.SET_INVOICE_PROPS:
      return {
        ...state,
        companyData: { ...state.companyData, invoice: action.payload.value }
      }

    case Types.CLEAR_COMPANIES_DATA:
      return {
        ...INITIAL_STATE
      }

    default:
      return state
  }
}
