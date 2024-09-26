import Types from './Types'
import { INotificationState } from 'src/types/notification'

const INITIAL_STATE: INotificationState = {
  notifications: [],
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    /* set */
    case Types.SET_NOTIFICATIONS:
      return { ...state, [action.payload.prop]: action.payload.value }

    default:
      return state
  }
}
