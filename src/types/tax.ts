import { IError } from './global'

export interface ITax {
    id: string,
    name: string,
    percentage: number,
    isUsed: boolean
}

export interface ITaxState {
  /* taxes list */
  defaultTaxes: ITax[],
  supplierTaxes: ITax[],
  isLoadingGetTaxes: boolean,
  errorTaxesData: IError[],
  /* tax */
  tax: ITax,
  isLoadingGetTax: boolean,
  isLoadingPostDataTax: boolean,
  isLoadingPutDataTax: boolean,
  isLoadingDeleteTax: boolean,
  errorTaxData: IError[],
  submit: boolean,
  count: number,
  page: number,
  limit: number,
  taxIdToDelete: string
  }
