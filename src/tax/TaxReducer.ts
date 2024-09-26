import { ITaxState } from 'src/types/tax'
import Types from './Types'
const INITIAL_STATE: ITaxState = {
  /* taxes list */
  defaultTaxes: [],
  supplierTaxes: [],
  isLoadingGetTaxes: false,
  errorTaxesData: [],
  /* tax */
  tax: {
    id: '',
    name: '',
    percentage: 0,
    isUsed: false
  },
  isLoadingGetTax: false,
  isLoadingPostDataTax: false,
  isLoadingPutDataTax: false,
  isLoadingDeleteTax: false,
  errorTaxData: [],
  submit: false,
  count: 0,
  page: 1,
  limit: 10,
  taxIdToDelete: ''
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    /* set */
    case Types.SET_TAX_DATA_PROPS:
      return { ...state, [action.payload.prop]: action.payload.value }

    case Types.SET_VALUE_TAX_DATA:
      return {
        ...state,
        tax: { ...state.tax, [action.payload.prop]: action.payload.value }
      }

    /** get */
    case Types.GET_TAX:
      return {
        ...state,
        tax: action.payload
      }

    /* clear */
    case Types.CLEAR_ERROR_TAXES_DATA:
      return {
        ...state,
        errorTaxesData: []
      }

    case Types.CLEAR_ERROR_TAX_DATA:
      return {
        ...state,
        errorTaxData: []
      }

    case Types.CLEAR_TAX_DATA:
      return {
        ...state,
        submit: false,
        tax: { ...INITIAL_STATE.tax }
      }

    case Types.CLEAR_TAXES_DATA:
      return {
        ...state,
        defaultTaxes: [],
        supplierTaxes: []
      }

    default:
      return state
  }
}
