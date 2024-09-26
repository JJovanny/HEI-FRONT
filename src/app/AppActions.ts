import toast from 'react-hot-toast'
import { getAppConfig, getI18n } from 'src/api/app'
import { addTranslation } from 'src/resources/locales/i18n'
import { isDev } from 'src/utils/Utils'
import Types from './Types'

export const setAppState = ({ prop, value }) => ({
  type: Types.SET_APP_CONFIG_STATE,
  payload: { prop, value }
})

export const setLoadingState = (value) => async (dispatch) => {
  dispatch({
    type: Types.SET_LOADING_APP_CONFIG,
    payload: value
  })
}

export const apiGetAppConfig = () => async (dispatch) => {
  dispatch(setLoadingState(true))
  await dispatch(
    getAppConfig(
      (tag, response) => {
        if (isDev()) console.log('apiGetGlobalConfig - Error: ', response)
        dispatch({ type: Types.GET_CONFIG_FAILED })
        if (response?.message) {
          toast.error(response?.message)
        }
      },
      (tag, response) => {
        if (isDev()) console.log('apiGetGlobalConfig - Success: ', response)
        dispatch({
          type: Types.GET_CONFIG_SUCCESS,
          payload: response?.data
        })
      }
    )
  )
  dispatch(setLoadingState(false))
}

export const apiGetI18n = (code?: string) => async (dispatch, getState) => {
  await dispatch(setLoadingState(true))
  await dispatch(
    getI18n(
      code || 'EN_US',
      (_, response) => {
        if (isDev()) console.log('apiGetI18n - Error', response)
      },
      async (_, response) => {
        if (isDev()) console.log('apiGetI18n - Success', response)
        addTranslation(code || 'en', { back: { ...response?.data } })
      }
    )
  )
  await dispatch(setLoadingState(false))
}
