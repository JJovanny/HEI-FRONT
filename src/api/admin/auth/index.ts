import { launchAsyncTask, Verbs } from 'src/api/utils'
import { Tags } from './tags'

export const postAdminUserRequestLogin = (email, password, enterByCode, callbackError, callbackSuccess) => async (dispatch) => {
  const url = '/api/v1/app/adminUser/request-login'
  const params = {
    email,
    password,
    enterByCode
  } 

  return dispatch(launchAsyncTask(Tags.POST_ADMIN_USER_CONFIRM_LOGIN, Verbs.POST, url, null, params, callbackError, callbackSuccess))
}

export const postAdminUserConfirmLogin = (postDataLogin, callbackError, callbackSuccess) => async (dispatch) => {
  const url = '/api/v1/app/adminUser/confirm-login'
  const { email, verificationCode } = postDataLogin
  const params = {
    email,
    verificationCode
  }

  return dispatch(launchAsyncTask(Tags.POST_ADMIN_USER_CONFIRM_LOGIN, Verbs.POST, url, null, params, callbackError, callbackSuccess))
}

export const postResetAdminPassord = (password, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().AdminUserReducer

  const url = '/api/v1/app/adminUser/me/reset-password'

  const params = {
    password
  }

  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.POST_ADMIN_USER_CONFIRM_LOGIN, Verbs.PUT, url, config, params, callbackError, callbackSuccess))
} 
