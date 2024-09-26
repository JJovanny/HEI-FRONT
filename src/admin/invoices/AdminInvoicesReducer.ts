import { IInvoiceState } from 'src/types/admin/invoice'
import Types from './Types'

const INITIAL_STATE: IInvoiceState = {
  invoices: [],
  isLoadingGetInvoices: false,
  isLoadingGetInvoice: false,
  invoice: {},
  count: 0
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Types.SET_INVOICES_DATA_PROPS:
      return { ...state, [action.payload.prop]: action.payload.value }

    case Types.CLEAR_INVOICES_DATA:
      return {
        ...INITIAL_STATE
      }

    default:
      return state
  }
}
