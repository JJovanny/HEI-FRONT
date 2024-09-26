import { IError } from '../global'


export interface IProductDataState {
    id: string,
    name: string,
    description: string,
    price: number,
    amount: number,
    showHome: boolean,
    value: number,
    img: string
}

export interface IProductState {
    product: IProductDataState,
    products: IProductDataState[],
    productsHome:  IProductDataState[],
    loadingProduct: boolean,
    count: number
}
