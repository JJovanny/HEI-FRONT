export interface ICompanyAdmin {
    id: string,
    name: string,
    address: string,
    cif: string,
    city: string,
    postalCode: string,
    region: string,
    contactEmail: string,
    contactName: string,
    externalPayment: boolean,
    financialCompany: string[],
    paymentPreferences: any,
    invoices?: any[],
    invoice: any
}

export interface ICompanyState {
    companies: ICompanyAdmin[],
    isLoadingGetAssociatedCompanies: boolean,
    isLoadingGetAssociatedCompanyInvoices: boolean,
    isLoadingGetAssociatedCompanyInvoiceDetail: boolean,
    count: number,
    companyData: ICompanyAdmin
}
