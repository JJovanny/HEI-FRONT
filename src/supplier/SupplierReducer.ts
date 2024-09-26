import { ISupplierState } from 'src/types/supplier'
import Types from './Types'
import { IUser } from 'src/types/user'
import { ICompaniesFilter } from 'src/types/filter'
import { IPaymentPreferences } from 'src/types/invoice'

const INITIAL_STATE: ISupplierState = {
  suppliers: [],
  filters: { clear: false } as ICompaniesFilter,
  isLoadingGetSuppliers: false,
  supplier: {} as IUser,
  supplierPaymentPreferences: {} as IPaymentPreferences,
  isLoadingGetSupplier: false,
  errorSupplierData: [],
  count: 0,
  page: 1,
  limit: 10
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    /* set */
    case Types.SET_SUPPLIER_DATA_PROPS:
      return { ...state, [action.payload.prop]: action.payload.value }

    case Types.SET_VALUE_SUPPLIER_FILTERS_DATA:
      return {
        ...state,
        filters: { ...state.filters, [action.payload.prop]: action.payload.value }
      }

    case Types.SET_VALUE_SUPPLIER_PAYMENT_PREFERENCES_DATA:
      return {
        ...state,
        supplierPaymentPreferences: { ...state.supplierPaymentPreferences, [action.payload.prop]: action.payload.value }
      }

    /* clear */
    case Types.CLEAR_ERROR_SUPPLIER_DATA:
      return {
        ...state,
        errorSupplierData: []
      }

    case Types.CLEAR_SUPPLIER_FILTERS:
      return {
        ...state,
        filters: {} as ICompaniesFilter
      }

    case Types.CLEAR_SUPPLIER_DATA:
      return {
        ...state,
        supplier: INITIAL_STATE.supplier,
        errorSupplierData: []
      }

    case Types.CLEAR_SUPPLIERS_DATA:
      return {
        ...state,
        suppliers: INITIAL_STATE.suppliers
      }

    /* get */
    case Types.GET_SUPPLIER:
      return {
        ...state,
        supplier: action.payload
      }

    default:
      return state
  }
}
