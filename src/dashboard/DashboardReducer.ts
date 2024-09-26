import Types from './Types'
import { IDashboardState } from '../types/dashboard'

const INITIAL_STATE: IDashboardState = {
  dataDashboard: [],
  isLoadingGetDashboard: false
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Types.CLEAR_DATA_DASHBOARD:
      return { ...INITIAL_STATE }

    case Types.GET_DASHBOARD_METRICS_SUCCESS:
      return { ...state, dataDashboard: action.payload.data }

    case Types.SET_DASHBOARD_STATE:
      return { ...state, [action.payload.prop]: action.payload.value }

    default:
      return state
  }
}
