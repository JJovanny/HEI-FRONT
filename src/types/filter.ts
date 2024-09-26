export interface IInvoicesFilter {
    filterInvoiceNumber: string,
    filterUserName: string,
    filterInvoiceState: string,
    filterAllowAdvance: false,
    clear: boolean
}

/** companies = suppliers or customers */
export interface ICompaniesFilter {
    filterCompanyName: string,
    filterCompanyContactEmail: string,
    filterCompanyAllowAdvance?: boolean,
    clear: boolean
}
