import { IAdminUserState } from 'src/types/admin/user'
import Types from './Types'

const INITIAL_STATE: IAdminUserState = {
  accessToken: '',
  refreshToken: '', 
  isLoadingGetAdminUser: false,
  page: 1, 
  limit: 30,
  count: 0,
  userData: {
    email: '',
    firstName: '',
    lastName: '',
    roles: []
  }
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Types.SET_ADMIN_USER_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: action.payload.data.accessToken,
        refreshToken: action.payload.data.refreshToken
      }

    case Types.SET_ADMIN_USER_DATA_PROPS:
      return { ...state, [action.payload.prop]: action.payload.value }

    case Types.SET_ADMIN_USER_LOGOUT:
      return { ...state, ...INITIAL_STATE }

    case Types.CLEAR_ADMIN_USER_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: '',
        refreshToken: ''
      }

    default:
      return state
  }
}
