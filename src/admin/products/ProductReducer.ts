import { IProductState } from 'src/types/admin/products'
import Types from './Types'

const INITIAL_STATE: IProductState = {
  products: [],
  productsHome: [],
  product: {
    id: '',
    name: '',
    description: '',
    price: 0,
    amount: 0,
    value: 0,
    img: '',
    showHome: false
  },
  loadingProduct: false,
  count: 0
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Types.SET:
      return { ...state, [action.payload.prop]: action.payload.value }

    case Types.CLEAR:
      return {
        ...INITIAL_STATE
      }

    default:
      return state
  }
}
