import { launchAsyncTask, Verbs } from 'src/api/utils'
import { Tags } from './tags'

export const getProducts = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().AdminUserReducer

  const url = '/api/v1/app/product'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.GET_PRODUCT, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getProductsUser = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer

  const url = '/api/v1/app/product/user'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.GET_PRODUCT, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}


export const getProductsHome = (callbackError, callbackSuccess) => async (dispatch, getState) => {

  const url = '/api/v1/app/product/home'
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.GET_PRODUCT, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const postOrPutProduct = (props, callbackError, callbackSuccess) => async (dispatch, getState) => {
    const { accessToken } = getState().AdminUserReducer

    const url = '/api/v1/app/product'
    const config = {
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      }
    }
  
    const params = props
  
    return dispatch(launchAsyncTask(Tags.POST_PUT_PRODUCT, Verbs.POST, url, config, params, callbackError, callbackSuccess))
  }
