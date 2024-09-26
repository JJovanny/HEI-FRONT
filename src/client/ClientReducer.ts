import { IClientState, IPaymentPreferencesSuppCustRelationship } from 'src/types/client'
import Types from './Types'
import { IPaymentPreferences } from 'src/types/invoice'
import { ICompaniesFilter } from 'src/types/filter'
import { EUserType } from 'src/types/enums'

const INITIAL_STATE: IClientState = {
  /* clients list */
  clients: [],
  isLoadingGetClients: false,
  isLoadingGetClient: false,
  filters: { clear: false } as ICompaniesFilter,
  /* client */
  client: {
    id: '',
    firstName: '',
    typeCompany: '',
    bankInformation: '',
    lastName: '',
    email: '',
    contactEmail: '',
    phone: '',
    companyName: '',
    companyCIF: '',
    companyAddress: '',
    currencyCode: '',
    companyPostalCode: '',
    companyCity: '',
    ci: '',
    ciInvitation: '',
    password: '',
    companyCountry: '',
    companyRegion: '',
    verificationCode: '',
    region: '',
    pinAccess: false,
    pinSuccess: false,
    financialCompany: [],
    paymentPreferences: {} as IPaymentPreferences,
    externalPayment: false,
    userType: EUserType.BOTH,
    newBranchForClient: false,
    invoiceDetail: {},
    invoicesList: [],
    payerId: ''
  },
  usersCompany: [],
  showSupplier: false,
  financial: {},
  paymentPreferences: {} as IPaymentPreferencesSuppCustRelationship,
  paymentPreferencesExternal: {} as IPaymentPreferencesSuppCustRelationship,
  automationRules: [],
  selectedSupplierId: '',
  selectedCustomerId: '',
  selectedFinancialId: '',
  searchClient: '',
  companyRelationshipId: '',
  financialExistsRelatedToClient: false,
  isLoadingPostDataClient: false,
  isLoadingPutDataClient: false,
  isLoadingDeleteClient: false,
  errorClientData: [],
  submitPost: false,
  submitPut: false,
  count: 0,
  page: 1,
  limit: 10
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    /* set */
    case Types.SET_CLIENT_DATA_PROPS:
      return { ...state, [action.payload.prop]: action.payload.value }

    case Types.SET_CLIENT_INVOICES_DATA_PROPS:
      return {
        ...state,
        client: { ...state.client, [action.payload.prop]: action.payload.value }
      }

    case Types.SET_VALUE_CLIENT_FILTERS_DATA:
      return {
        ...state,
        filters: { ...state.filters, [action.payload.prop]: action.payload.value }
      }

    case Types.SET_VALUE_POST_CLIENT_DATA:
      return {
        ...state,
        client: { ...state.client, [action.payload.prop]: action.payload.value }
      }

    case Types.SET_SELECTED_SUPPLIER:
      return {
        ...state,
        selectedSupplierId: action.payload.value
      }

      case Types.SET_FINANCIAL_EXISTS_RELATED_TO_CLIENT:
        return {
          ...state,
          financialExistsRelatedToClient: action.payload.value
        }

    case Types.SET_SHOW_SUPPLIER:
        return {
          ...state,
          showSupplier: action.payload.value
        }

    case Types.SET_FINANCIAL_COMPANY:
      return {
        ...state,
        financial: action.payload.value
      }

    case Types.SET_PAYMENT_PREFERENCES:
      return {
        ...state,
        paymentPreferences: action.payload.value
      }

    case Types.SET_PAYMENT_PREFERENCES_EXTERNAL:
      return {
        ...state,
        paymentPreferencesExternal: action.payload.value
      }

    case Types.SET_CLIENT_SELECTED_BY_CIF:
      return {
        ...state,
        selectedCustomerId: action.payload.value
      }

    case Types.SET_FINANCIAL_SELECTED_BY_CIF:
      return {
        ...state,
        selectedFinancialId: action.payload.value
      }

    case Types.SET_VALUE_POST_CLIENT_COMPANY_DATA:
      return {
        ...state,
        client: { ...state.client, [action.payload.prop]: action.payload.value }
      }

    case Types.SET_CLIENT_NEW_BRANCH_PROPS:
      return {
        ...state,
        client: { ...state.client, [action.payload.prop]: action.payload.value }
      }

    case Types.SET_VALUE_PUT_CLIENT_DATA:
      return {
        ...state,
        client: { ...state.client, [action.payload.prop]: action.payload.value }
      }

    case Types.SET_SEARCH_CLIENT:
      return {
        ...state,
        searchClient: action.payload.value,
      }

    /* clear */
    case Types.CLEAR_ERROR_CLIENT_DATA:
      return {
        ...state,
        errorClientData: []
      }

    case Types.CLEAR_CLIENT_DATA:
      return {
        ...state,
        client: INITIAL_STATE.client,
        errorClientData: [],
        submitPost: false,
        isLoadingPostDataClient: false,
        isLoadingPutDataClient: false,
        isLoadingDeleteClient: false
      }

    case Types.CLEAR_CLIENTS_DATA:
      return {
        ...state,
        clients: INITIAL_STATE.clients
      }

    case Types.CLEAR_CLIENT_FILTERS:
      return {
        ...state,
        filters: {} as ICompaniesFilter
      }

    /* get */
    case Types.GET_SUPPLIER_CLIENTS:
      return {
        ...state,
        clients: action.payload
      }

    case Types.GET_CLIENTS_BY_CIF:
        return {
          ...state,
          clients: action.payload
        }

    case Types.GET_USERS_COMPANY:
        return {
          ...state,
          usersCompany: action.payload
        }

    case Types.GET_CLIENT:
      return {
        ...state,
        client: action.payload
      }

    case Types.GET_SUPPLIER_CLIENTS_WITH_INVOICES:
      return {
        ...state,
        clients: action.payload
      }

    default:
      return state
  }
}
