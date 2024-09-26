import { ILoginState } from 'src/types/login'
import Types from './Types'

const INITIAL_STATE: ILoginState = {
  postDataLogin: {
    email: '',
    verificationCode: ''
  },
  hps: true,
  isLoadingPostDataLogin: false,
  errorLoginData: [],
  submitPost: false
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    /* set */
    case Types.SET_LOGIN_STATE:
      return { ...state, [action.payload.prop]: action.payload.value }

    case Types.SET_VALUE_POST_DATA_LOGIN:
      return {
        ...state,
        postDataLogin: { ...state.postDataLogin, [action.payload.prop]: action.payload.value }
      }

    /* clear */
    case Types.CLEAR_LOGIN_DATA:
      return { ...state, ...INITIAL_STATE }

    case Types.CLEAR_LOGIN_DATA_ERROR:
      return {
        ...state,
        errorLoginData: []
      }

    default:
      return state
  }
}
