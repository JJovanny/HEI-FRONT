import { IInvoice } from '../invoice'

export interface IInvoiceState {
    invoices: {invoice:IInvoice, company:any}[],
    invoice: any,
    isLoadingGetInvoices: boolean,
    isLoadingGetInvoice: boolean,
    count: number,
}
