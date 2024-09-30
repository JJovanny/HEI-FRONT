import { IProductDataState, IProductState } from "./admin/products"
import { IUserState } from "./user"


export interface IPurchaseDetailState {
    id: string,
    total: number,
    amount: number,
    product: IProductDataState,
    purchase: string,
    createdAt: string,
}

export interface IPurchaseDataState {
    id: string,
    user: IUserState,
    createdAt: string,
    subtotal: number,
    operationNumber: string,
    totalToPay: number,
    totalPts: number,
    approved: boolean,
    purchaseDetail: IPurchaseDetailState[],
}

export interface IPurchaseState {
    purchase: IPurchaseDataState,
    purchases: IPurchaseDataState[],
    loadingPurchase: boolean,
    count: number
}
