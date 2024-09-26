import { IClientList } from './client'
import { ICompaniesFilter } from './filter'
import { IError } from './global'
import { IPaymentPreferences } from './invoice'
import { IUser } from './user'

export interface ISupplierState {
    /* supplier list */
    suppliers: IClientList[],
    filters: ICompaniesFilter,
    isLoadingGetSuppliers: boolean,
    /* supplier */
    supplier: IUser | IClientList,
    supplierPaymentPreferences: IPaymentPreferences,
    isLoadingGetSupplier: boolean,
    errorSupplierData: IError[],
    count: number,
    page: number,
    limit: number
}
