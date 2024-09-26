import { IPaymentPreferences } from 'src/types/invoice'
import { Verbs, launchAsyncTask } from '../utils'
import { Tags } from './tags'

export const delUser = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer

  const url = '/api/v1/app/user/me'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.DEL_USER, Verbs.DEL, url, config, null, callbackError, callbackSuccess))
}

export const getUserMe = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken, dataUser: { companyBranchSelected } } = getState().UserReducer
  
  let url = '/api/v1/app/user/me'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  if (companyBranchSelected && companyBranchSelected?.id !== undefined) url += '?companyBranchSelected=' + companyBranchSelected.id

  return dispatch(launchAsyncTask(Tags.GET_USER_ME, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}


export const putUser = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer
  const url = '/api/v1/app/user/me'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  const { putDataUser } = getState().UserReducer
  const {
    firstName,
    lastName,
  } = putDataUser
  let { phone } = putDataUser
  if (!phone || phone?.length <= 0) phone = undefined

  const params = {
    firstName,
    lastName,
    phoneNumber: phone,
  } 


  return dispatch(launchAsyncTask(Tags.PUT_USER, Verbs.PUT, url, config, params, callbackError, callbackSuccess))
}

export const postUserApi = (data,callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer
  const url = '/api/v1/app/user/offspring'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  const params = {
    ...data
  } 

  return dispatch(launchAsyncTask(Tags.PUT_USER, Verbs.POST, url, config, params, callbackError, callbackSuccess))
}

export const putUserType = (email:string, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer
  const url = '/api/v1/app/user/me/type'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  const { dataUser } = getState().UserReducer
  const { userType } = dataUser

  const params = {
    userType,
    email
  }

  return dispatch(launchAsyncTask(Tags.PUT_USER_TYPE, Verbs.PUT, url, config, params, callbackError, callbackSuccess))
}

export const postExternalPayment = (props, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer
  const url = '/api/v1/app/company/externalPayment'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  const params = props

  return dispatch(launchAsyncTask(Tags.POST_EXTERNAL_PAYMENT, Verbs.POST, url, config, params, callbackError, callbackSuccess))
}

export const patchPaymentPreferences = (props : IPaymentPreferences, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer
  const url = '/api/v1/app/company/paymentPreferences'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  const params = props

  return dispatch(launchAsyncTask(Tags.PATCH_PAYMENT_PREFERENCES, Verbs.PATCH, url, config, params, callbackError, callbackSuccess))
}
