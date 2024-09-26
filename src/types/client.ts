import { ICountry } from './country'
import { ICompaniesFilter } from './filter'
import { IError } from './global'
import { IPaymentPreferences } from './invoice'
import { IUser } from './user'

export interface ICompanyBranch {
    name: string,
    id: string
}

export interface IPaymentPreferencesSuppCustRelationship {
    allowPaymentInAdvance: boolean,
    discountInAdvance: number,
    externalPayment: boolean,
    dailyDiscountToApply: number,
    paymentPreferences: number,
    creditLimit: number,
    availableCredit?: number,
	usedCredit?: number,
    interestArrears?: number,
    numberDaysUntilExpirationDate?: number,
}

export interface IClient {
    isNewCustomer?: boolean,
    newBranchForClient?: boolean,
    paymentPreferences?: any,
    customerData?: {
        email: string,
        firstName: string,
        lastName: string,
        phone: string,
        company: {
            name: string,
            region: string,
            cif: string,
            country: string | ICountry,
            city: string,
            address: string,
            postalCode: string
        }
    },
    country?: string | ICountry,
    id?: string
    name?: string
}

export interface IClientList {
    id: string,
    name: string,
    contactEmail: string,
    firstName: string,
    currencyCode: string,
    email: string,
    bankInformation: string,
    companyRegion: string,
    contactName: string,
    region: string,
    cif: string,
    country: string | ICountry,
    companyCountry: string | ICountry,
    companyAddress: string,
    postalCode: string,
    city: string,
    address: string,
    financialCompany: string[],
    paymentPreferences: IPaymentPreferences,
    invoices: number,
    totalAmount: number,
    currentAdvancedBalance: number, 
    averageMonthlyAdvance: number, 
    totalAdvanced: number, 
    discountRate: number,
    receivableBalance:  number, 
    totalOverdue:  number, 
    totalFinanced: number,
    newBranchForClient?: boolean,
    invoicesList: [],
    invoiceDetail: {}
}


export interface AutomationRules {
    type: string,
    logicalOperator: string,
    value: number,
    status: string,
    andOr?: string,
    secondValue: number
    secondLogicalOperator: string,
}

export interface IClientState {
    /* clients list */
    showSupplier: false,
    clients: IClientList[],
    usersCompany: IUser[],
    searchClient: '',
    financialExistsRelatedToClient: boolean,
    selectedCustomerId: '',
    selectedFinancialId: '',
    selectedSupplierId: '',
    isLoadingGetClients: boolean,
    isLoadingGetClient: boolean,
    filters: ICompaniesFilter,
    /* client */
    financial: {},
    client: IUser | IClientList,
    isLoadingPostDataClient: boolean,
    isLoadingPutDataClient: boolean,
    isLoadingDeleteClient: boolean,
    errorClientData: IError[],
    submitPost: boolean,
    submitPut: boolean,
    companyRelationshipId: '',
    count: number,
    page: number,
    limit: number,
    automationRules: AutomationRules[],
    paymentPreferences: IPaymentPreferencesSuppCustRelationship,
    paymentPreferencesExternal: IPaymentPreferencesSuppCustRelationship
}
