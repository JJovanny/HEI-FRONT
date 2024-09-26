import { ICompany } from "./admin/userCompany";
import { IInvoice, IInvoiceList } from "./invoice";

export interface INotificationState {
    notifications: INotificationsList[],
  }

  export interface INotificationsList {
    id: string,
    supplier: string,
    customer: string,
    financial: string,
    invoice: IInvoice,
    status: string,
    read: boolean,
    readIndividually: boolean,
    createdAt: string,
    updatedAt: string,
}