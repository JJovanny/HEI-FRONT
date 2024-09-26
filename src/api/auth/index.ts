import { EUserType } from 'src/types/enums'
import { Verbs, launchAsyncTask } from '../utils'
import { Tags } from './tags'

export const postRequestRegister = (email, payer, callbackError, callbackSuccess) => async (dispatch) => {
  const url = '/api/v1/app/auth/request-register'
  const params = {
    email 
  }

  if (payer !== '' && payer !== null && payer !== undefined) {
    params["customerId"] = payer
  }
  return dispatch(launchAsyncTask(Tags.POST_REQUEST_REGISTER, Verbs.POST, url, null, params, callbackError, callbackSuccess))
}

export const postConfirmRegister = (postDataUser, callbackError, callbackSuccess) => async (dispatch) => {
  const url = '/api/v1/app/auth/confirm-register'
  const {
    email,
    firstName,
    lastName,
    phone,
    ci, 
    ciInvitation,
  } = postDataUser

  const params = {
    email,
    firstName,
    lastName,
    phone,
    ci,
    ciInvitation,
    userType: EUserType.SUPPLIER,
  }

  return dispatch(launchAsyncTask(Tags.POST_CONFIRM_REGISTER, Verbs.POST, url, null, params, callbackError, callbackSuccess))
}

export const postRefreshToken = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { refreshToken } = getState().UserReducer

  const url = '/api/v1/app/auth/refresh-token'
  const config = {}
  const params = {
    token: refreshToken
  }

  return dispatch(launchAsyncTask(Tags.POST_REFRESH_TOKEN, Verbs.POST, url, config, params, callbackError, callbackSuccess))
}

export const postRequestLogin = (email, password, enterByCode, callbackError, callbackSuccess) => async (dispatch) => {
  const url = '/api/v1/app/auth/request-login'
  const params = {
    email,
    password,
    enterByCode
  }

  return dispatch(launchAsyncTask(Tags.POST_CONFIRM_LOGIN, Verbs.POST, url, null, params, callbackError, callbackSuccess))
}

export const postConfirmLogin = (postDataLogin, callbackError, callbackSuccess) => async (dispatch) => {
  const url = '/api/v1/app/auth/confirm-login'
  const { email, verificationCode } = postDataLogin
  const params = {
    email,
    verificationCode
  }

  return dispatch(launchAsyncTask(Tags.POST_CONFIRM_LOGIN, Verbs.POST, url, null, params, callbackError, callbackSuccess))
}

export const postConfirmPin = (pin,id, callbackError, callbackSuccess) => async (dispatch,getState) => {
  const url = '/api/v1/app/user/request-pin'
  const { accessToken } = getState().UserReducer

  const params = {
    pin,
    userId: id
  }

  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.POST_CONFIRM_LOGIN, Verbs.POST, url, config, params, callbackError, callbackSuccess))
}

export const postResetPassord = (password, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer

  const url = '/api/v1/app/user/me/reset-password'

  const params = {
    password
  }

  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.POST_CONFIRM_LOGIN, Verbs.PUT, url, config, params, callbackError, callbackSuccess))
} 

export const postResetPin = (pin, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer

  const url = '/api/v1/app/user/me/reset-pin'

  const params = {
    pin
  }

  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.POST_CONFIRM_LOGIN, Verbs.PUT, url, config, params, callbackError, callbackSuccess))
} 



export const postFetchLogin = (password, email,callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer

  const url = '/api/v1/app/auth/login'

  const params = {
    password,
    email
  }

  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.POST_CONFIRM_LOGIN, Verbs.POST, url, null, params, callbackError, callbackSuccess))
}
export const postRequestUpdateEmail = (newEmail, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer
  const url = '/api/v1/app/auth/request-email-update'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  const params = { email: newEmail }

  return dispatch(launchAsyncTask(Tags.POST_REQUEST_UPDATE_EMAIL, Verbs.POST, url, config, params, callbackError, callbackSuccess))
}

export const postConfirmUpdateEmail = (changeEmailData, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer
  const url = '/api/v1/app/auth/confirm-email-update'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  const { newEmail, verificationCode } = changeEmailData
  const params = {
    email: newEmail,
    verificationCode
  }

  return dispatch(launchAsyncTask(Tags.POST_CONFIRM_UPDATE_EMAIL, Verbs.POST, url, config, params, callbackError, callbackSuccess))
}
