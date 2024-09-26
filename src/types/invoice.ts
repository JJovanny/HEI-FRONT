import { ICompany } from './admin/userCompany'
import { IClient, IClientList } from './client'
import { IInvoicesFilter } from './filter'
import { IError } from './global'
import { ITax } from './tax'

export interface ILines {
    concept: string,
    items: number,
    amount: number,
    tax: string | ITax
}

export interface IMessage {
    id: string,
    message: string,
    company: ICompany,
    createdAt: string,
    isEliminated: boolean,
    attachfilesChat: IFiles[],
}


export interface IFiles {
    filename: string,
    remove: boolean,
    stream: string,
    size: number,
    file: string,
    format: string
}

export interface ICurrency {
    id: string,
    label: string,
    code: string,
    symbol: string
}

export interface ICompanyUser {
    id: string,
    name: string,
    cif: string,
    address: string,
    postalCode: string,
    city: string,
    region: string,
    financialCompany: string[]
}

export interface ICreatedUser {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    roles: any[],
    company: string,
    firstLoginAfterInvite: boolean
}

export interface IPaymentPreferences {
    days: number,
    allowPaymentInAdvance: boolean,
    discountInAdvance: number,
    externalPayment: boolean,
    dailyDiscountToApply: number,
    numberDaysUntilExpirationDate: number,
    offerCutoffBeforeDueDate: number,
    interestArrears: number,
}

export interface ICompanyBasicInformation {
    name: string,
    address: string,
    cif: string
    postalCode: string,
    city: string,
}

export interface IEventRegistration {
    approvedBy: string,
    approvedByCustomer: string,
    offerMadeBy: string,
	acceptedBy: string,
	rejectedBy: string,
	advanceCompletedBy: string,
	paymentCompletedBy: string,
}

export interface IInvoice {
    id: string,
    supplier: IClientList,
    eventRegistration?: IEventRegistration,
    definedByRule: boolean,
    customer: IClient | IClientList,
    attachfilesChat: IFiles[],
    financial: IClientList,
    invoiceNumber: string,
    issueDate: string,
    lines: ILines[],
    messages: IMessage[],
    subtotal: number,
    grandTotal: number,
    totalTaxes: number,
    totalTaxPercentage: number,
    files: IFiles[],
    evidenceAdvancePayment: IFiles[],
    evidencePaymentToFinancial: IFiles[],
    currency: ICurrency,
    status: string,
    statusQuickpay?: string,
    acceptedWhenExpired?: boolean,
    paymentPreferences: IPaymentPreferences,
    earlyPaymentRequested: boolean,
    uploaded: boolean,
    earlyPaymentDiscount?: number,
    grandTotalWithDiscount: number,
    dueDate?: string,
    observations?: string,
    customerBasicInformation?: ICompanyBasicInformation,
    paymentDate?: string,
    invoiceDatePaidOrAdvanced?: string,
    rejectedReason?: string
    isQuickpay?: boolean
}

export interface IInvoiceList {
    id: string,
    supplier: {
        id: string,
        name: string
    },
    customer: IClient,
    createdBy: {
        firstName: string,
        lastName: string
    },
    statusQuickpay?: string,
    acceptedWhenExpired?: boolean,
    lines: ILines[],
    messages: IMessage[],
    files: number,
    evidenceAdvancePayment?: number,
    evidencePaymentToFinancial?: number,
    totalTaxes: number,
    dueDate: string,
    observations?: string,
    customerBasicInformation?: ICompanyBasicInformation,
    paymentDate: string,
    invoiceDatePaidOrAdvanced?: string,
    invoiceNumber: string,
    issueDate: string,
    subtotal: number,
    grandTotal: number,
    totalTaxPercentage: number,
    currency: ICurrency,
    status: string,
    financial: {}
    paymentPreferences: IPaymentPreferences
    uploaded: boolean,
    createdAt: string,
    updatedAt: string,
    earlyPaymentRequested: boolean,
    issued: boolean
}
/** issued invoices */
export interface IInvoiceState {
  /* invoices list */
  invoices: IInvoiceList[],
  filters: IInvoicesFilter,
  isLoadingGetInvoices: boolean,
  errorInvoicesData: IError[],
  /* invoice */
  invoice: IInvoice,
  isLoadingGetInvoice: boolean,
  isLoadingPostDataInvoice: boolean,
  isLoadingPutDataInvoice: boolean,
  isLoadingDeleteInvoice: boolean,
  isLoadingPostRequestEarlyPayment: boolean,
  isLoadingPostValidateUserForInvoice: boolean,
  errorInvoiceData: IError[],
  submitPost: boolean,
  /* send email */
  emails: string,
  isLoadingSendMessage: boolean,
  isLoadingPostDataEmails: boolean,
  errorEmailsData: IError[],
  /* download attachment */
  isLoadingPostDownloadAttachment: boolean,
  /* currencies */
  isMarkAsPaid: boolean,
  payToFinancial: boolean,
  currencies: ICurrency[],
  currency: ICurrency,
  isLoadingGetCurrencies: boolean,
  isLoadingGetCurrency: boolean,
  eligibleForEarlyPayment: number,
  totalReceivable: number,
  monthlyAdvancedAverage: number,
  billing: [],
  averageDaysAdvanced: number,
  currentAdvancedAmount: number,
  totalSettledEarly: number,

  totalDue: number,
  averageInvoiceAge: number,
  totalAmountOfferedEarlyPayment: number,

  totalEarningsfromEarlySettlementbyFinancialInstitution: number,
  totalEarningsfromEarlyPayments: number,
  totalSettledEarlybyFinancialInstitution: number,

  pendingEarlyPayment: number,
  earningsFromEarlyPayment: number,

  overdueInvoicesAmount: number,
  monthlySettlementAverage: number,
  averageInterestRate: number,

  totalDuethisMonth: number,
  earnings: number,
  totalDueAfterDeductingMonthlyEarnings: number,

  count: number,
  page: number,
  limit: number,
  invoiceStatusType: string,
  invoiceIdToDelete: string
}

export interface IReceivedInvoiceState {
  /* invoices list */
  receivedInvoices: IInvoiceList[],
  receivedQuickpayInvoices:  IInvoiceList[],
  isLoadingReceivedInvoices: boolean,
  errorReceivedInvoicesData: IError[],
  /* download attachment */
  isLoadingPostDownloadAttachment: boolean,
  /* currencies */
  currency: ICurrency,
  isLoadingGetCurrency: boolean,
  count: number,
  page: number,
  limit: number
}
