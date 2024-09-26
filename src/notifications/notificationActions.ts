import { isDev } from '../utils/Utils'
import Types from './Types'
import { getNotifications, putNotification, putNotificationAll } from 'src/api/notifications'

export const setNotifications = ({ prop, value }) => ({
  type: Types.SET_NOTIFICATIONS,
  payload: { prop, value }
})


export const apiGetNotifications = () => async (dispatch) => {
  await dispatch(
    getNotifications(
      (tag, response) => {
        if (isDev()) console.log('apiGetInvoice - Error', response)
      },
      async (tag, response) => {
        await dispatch(setNotifications({ prop: 'notifications', value: response?.notifications }))
      }
    )
  )
}

/** put */
export const apiPutNotifications = () => async (dispatch) => {
  await dispatch(
    putNotificationAll(
      (tag, response) => {
        if (isDev()) console.log('apiPutInvoice - Error', response)
      },
      (tag, response) => {
        dispatch(apiGetNotifications())
      }
    )
  )
}

export const apiPutNotification = (id) => async (dispatch) => {
  await dispatch(
    putNotification(
      id,
      (tag, response) => {
        if (isDev()) console.log('apiPutInvoice - Error', response)
      },
      (tag, response) => {
        dispatch(apiGetNotifications())
      }
    )
  )
}
