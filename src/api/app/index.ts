import { launchAsyncTask, Verbs } from '../utils'
import { Tags } from './tags'

export const getAppConfig = (callbackError, callbackSuccess) => async (dispatch) => {
  const url = '/api/v1/app/config'
  const config = {
    headers: {
      'app-token': process?.env?.NEXT_PUBLIC_APP_SECURITY_TOKEN
    }
  }

  return dispatch(launchAsyncTask(Tags.GET_APP_CONFIG, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getI18n = (code: string, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  const url = `api/v1/app/i18n/${code}`
  const params = {}

  return dispatch(launchAsyncTask(Tags.GET_I18N, Verbs.GET, url, config, params, callbackError, callbackSuccess))
}
