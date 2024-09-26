import Types from './Types'

const INITIAL_STATE = {
  isLoadingApp: false,
  url: ''
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Types.GET_CONFIG_FAILED:
      return { ...state, error: action.payload }

    case Types.GET_CONFIG_SUCCESS:
      return { ...state, ...action.payload }

    case Types.SET_LOADING_APP_CONFIG:
      return { ...state, isLoadingApp: action.payload }

    case Types.SET_APP_CONFIG_STATE:
      return { ...state, [action.payload.prop]: action.payload.value }

    default:
      return state
  }
}
