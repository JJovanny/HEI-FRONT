import { launchAsyncTask, Verbs } from 'src/api/utils'
import { Tags } from './tags'

export const getAdminUser = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().AdminUserReducer

  const url = '/api/v1/app/adminUser/me'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.GET_ADMIN_USER, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}
