import { ICompanyBasicInformation, ICurrency, IEventRegistration, IInvoiceState, IPaymentPreferences } from 'src/types/invoice'
import Types from './Types'
import { IClient, IClientList } from 'src/types/client'
import { IInvoicesFilter } from 'src/types/filter'

const INITIAL_STATE: IInvoiceState = {
  /* invoices list */
  invoices: [],
  filters: { clear: false } as IInvoicesFilter,
  isLoadingGetInvoices: false,
  errorInvoicesData: [],
  /* invoice */
  invoice: {
    definedByRule: false,
    eventRegistration: {} as IEventRegistration,
    id: '',
    supplier: {} as IClientList,
    customer: {} as IClient | IClientList, // IClient for post or put, IClientList for get
    invoiceNumber: '',
    issueDate: '',
    dueDate: '',
    observations: '',
    customerBasicInformation: {} as ICompanyBasicInformation,
    totalTaxes: 0,
    totalTaxPercentage: 0,
    paymentDate: '',
    invoiceDatePaidOrAdvanced: '',
    lines: [],
    financial: {} as IClientList,
    messages: [],
    subtotal: 0.00,
    grandTotal: 0.00,
    files: [],
    evidenceAdvancePayment: [],
    evidencePaymentToFinancial: [],
    statusQuickpay: '',
    acceptedWhenExpired: false,
    currency: {} as ICurrency,
    status: '',
    grandTotalWithDiscount: 0,
    paymentPreferences: {} as IPaymentPreferences,
    earlyPaymentRequested: false,
    uploaded: false,
    isQuickpay: false,
    attachfilesChat: [],
  },
  isLoadingSendMessage: false,
  isLoadingGetInvoice: false,
  isLoadingPostDataInvoice: false,
  isLoadingPutDataInvoice: false,
  isLoadingDeleteInvoice: false,
  isLoadingPostRequestEarlyPayment: false,
  isLoadingPostValidateUserForInvoice: false,
  errorInvoiceData: [],
  submitPost: false,
  /* send email */
  emails: '',
  isLoadingPostDataEmails: false,
  errorEmailsData: [],
  /* download attachment */
  isLoadingPostDownloadAttachment: false,
  /* currencies */
  currencies: [],
  currency: {
    id: '',
    label: '',
    code: '',
    symbol: ''
  },
  isMarkAsPaid: false,
  payToFinancial: false,
  isLoadingGetCurrencies: false,
  isLoadingGetCurrency: false,

  // sent
  eligibleForEarlyPayment: 0,
  totalReceivable: 0,
  monthlyAdvancedAverage: 0,

  // sent quickpay
  averageDaysAdvanced: 0,
  currentAdvancedAmount: 0,
  totalSettledEarly: 0,

  // received

  totalDue: 0,
  averageInvoiceAge: 0,
  totalAmountOfferedEarlyPayment: 0,

  // received quick

  // totalSettledEarly: 0,
  totalEarningsfromEarlyPayments: 0,
  totalSettledEarlybyFinancialInstitution: 0,
  totalEarningsfromEarlySettlementbyFinancialInstitution: 0,

  // received f

  pendingEarlyPayment: 0,
  earningsFromEarlyPayment: 0,
  // totalSettledEarly

  // received quick f
  overdueInvoicesAmount: 0,
  monthlySettlementAverage: 0,
  averageInterestRate: 0,


  totalDuethisMonth: 0,
  earnings: 0,
  totalDueAfterDeductingMonthlyEarnings: 0,
  billing: [],

  count: 0,
  page: 1,
  limit: 10,
  invoiceStatusType: 'sent',
  invoiceIdToDelete: ''
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    /* set */
    case Types.SET_INVOICE_DATA_PROPS:
      return { ...state, [action.payload.prop]: action.payload.value }

    case Types.SET_IS_MARK_AS_PAID:
      return { 
        ...state, 
        isMarkAsPaid: action.payload.value 
      }

    case Types.SET_PAID_TO_FINANCIAL:
        return { 
          ...state, 
          payToFinancial: action.payload.value 
        }
        
    case Types.SET_VALUE_POST_INVOICE_DATA:
      return {
        ...state,
        invoice: { ...state.invoice, [action.payload.prop]: action.payload.value }
      }

    case Types.SET_VALUE_INVOICES_FILTERS_DATA:
      return {
        ...state,
        filters: { ...state.filters, [action.payload.prop]: action.payload.value }
      }

    case Types.SET_VALUE_POST_CUSTOMER_INVOICE_DATA:
      return {
        ...state,
        customer: { ...state.invoice.customer, [action.payload.prop]: action.payload.value }
      }

    case Types.SET_VALUE_CURRENCY_DATA:
      return {
        ...state,
        currency: { ...state.currency, [action.payload.prop]: action.payload.value }
      }

    /** get */
    case Types.GET_INVOICE:
      return {
        ...state,
        invoice: action.payload
      }

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

    case Types.CLEAR_INVOICES_PAGINATION:
      return {
        ...state,
        page: 1,
        limit: 10
      }

    case Types.CLEAR_INVOICES_FILTERS:
      return {
        ...state,
        filters: {
          filterInvoiceNumber: '',
          filterUserName: '',
          filterInvoiceState: '',
          filterAllowAdvance: false
        }
      }

    case Types.CLEAR_ERROR_INVOICES_DATA:
      return {
        ...state,
        errorInvoicesData: []
      }

    case Types.CLEAR_ERROR_INVOICE_DATA:
      return {
        ...state,
        errorInvoiceData: []
      }

    case Types.CLEAR_ERROR_INVOICE_DATA_FOR_ADD:
      return {
        ...state,
        errorInvoiceData: []
      }

    case Types.CLEAR_ERROR_EMAILS_DATA:
      return {
        ...state,
        errorEmailsData: []
      }

    case Types.CLEAR_INVOICE_DATA:
      return {
        ...state,
        submitPost: false,
        invoice: { ...INITIAL_STATE.invoice, lines: [], messages: [], files: [], evidenceAdvancePayment: [] },
        currency: { ...INITIAL_STATE.currency },
        isLoadingGetInvoices: false,
        isLoadingPostDataInvoice: false,
        isLoadingPutDataInvoice: false,
        isLoadingDeleteInvoice: false
      }

    case Types.SET_SEND_MESSAGE:
      return { ...state, [action.payload.prop]: action.payload.value }

    case Types.CLEAR_INVOICE_LOADINGS:
      return {
        ...state,
        submitPost: false,
        isLoadingGetInvoices: false,
        isLoadingPostDataInvoice: false,
        isLoadingPutDataInvoice: false,
        isLoadingDeleteInvoice: false,
        isLoadingPostDataEmails: false,
        isLoadingPostDownloadAttachment: false,
        isLoadingGetCurrencies: false,
        isLoadingGetCurrency: false
      }

    case Types.CLEAR_INVOICES_DATA:
      return {
        ...state,
        invoices: [],
        isLoadingGetInvoices: false,
        isLoadingPostDataInvoice: false,
        isLoadingPutDataInvoice: false,
        isLoadingDeleteInvoice: false
      }

    default:
      return state
  }
}
