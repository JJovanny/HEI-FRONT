export interface IFinancialCompany {
    id: string,
    name: string,
    address: string,
    cif: string,
    contactEmail: string,
    phone: string,
    country: string,
    region: string
    city: string,
    postalCode: string,
}

export interface IPayersState {
    isLoadingGetMyFinancialCompanies: boolean,
    financialCompanies: IFinancialCompany[]
}
