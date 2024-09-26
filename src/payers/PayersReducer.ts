import { IPayersState } from 'src/types/payers'
import Types from './Types'

const INITIAL_STATE : IPayersState = {
  isLoadingGetMyFinancialCompanies: false,
  financialCompanies: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Types.SET_PAYERS_STATE:
      return { ...state, [action.payload.prop]: action.payload.value }

    default:
      return state
  }
}
