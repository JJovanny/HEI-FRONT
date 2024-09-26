import { IReceivedInvoiceState } from 'src/types/invoice'
import Types from './Types'
const INITIAL_STATE: IReceivedInvoiceState = {
  /* invoices list */
  receivedInvoices: [],
  receivedQuickpayInvoices: [],
  isLoadingReceivedInvoices: false,
  errorReceivedInvoicesData: [],
  /* download attachment */
  isLoadingPostDownloadAttachment: false,
  /* currencies */
  currency: {
    id: '',
    label: '',
    code: '',
    symbol: ''
  },
  isLoadingGetCurrency: false,
  count: 0,
  page: 1,
  limit: 10
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    /* set */
    case Types.SET_RECEIVED_INVOICE_DATA_PROPS:
      return { ...state, [action.payload.prop]: action.payload.value }

    case Types.SET_VALUE_CURRENCY_DATA:
      return {
        ...state,
        currency: { ...state.currency, [action.payload.prop]: action.payload.value }
      }

    /** get */
    case Types.GET_CURRENCY:
      return {
        ...state,
        currency: action.payload
      }

    /* clear */
    case Types.CLEAR_TO_INITIAL_STATE:
      return {
        ...INITIAL_STATE
      }

    case Types.CLEAR_RECEIVED_INVOICES_PAGINATION:
      return {
        ...state,
        page: 1,
        limit: 10
      }

    case Types.CLEAR_ERROR_RECEIVED_INVOICES_DATA:
      return {
        ...state,
        errorReceivedInvoicesData: []
      }

    case Types.CLEAR_RECEIVED_INVOICES_DATA:
      return {
        ...state,
        receivedInvoices: [],
        isLoadingReceivedInvoice: false,
        isLoadingReceivedInvoices: false,
        isLoadingPostDownloadAttachment: false,
        isLoadingGetCurrency: false
      }

    default:
      return state
  }
}
