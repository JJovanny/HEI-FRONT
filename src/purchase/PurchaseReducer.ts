import Types from './Types'
import { IPurchaseState } from 'src/types/purchase'
import { IUserState } from 'src/types/user'

const INITIAL_STATE: IPurchaseState = {
  purchases: [],
  purchase: {
    id: '',
    user: {} as IUserState,
    subtotal: 0,
    totalToPay: 0,
    totalPts: 0,
    operationNumber: '',
    approved: false,
    purchaseDetail: [],
    createdAt: '',
  },
  loadingPurchase: false,
  count: 0
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Types.SET_PURCHASE:
      return { ...state, [action.payload.prop]: action.payload.value }

    case Types.CLEAR_PURCHASE:
      return {
        ...INITIAL_STATE
      }

    default:
      return state
  }
}
