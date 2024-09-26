import { Verbs, launchAsyncTask } from '../utils'
import { Tags } from './tags'



export const postPurchase = (props, callbackError, callbackSuccess) => async (dispatch, getState) => {
    const { accessToken } = getState().UserReducer

    const url = '/api/v1/app/purchase'
    const config = {
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      }
    }
  
    const params = props
  
    return dispatch(launchAsyncTask(Tags.POST_PURCHASE, Verbs.POST, url, config, params, callbackError, callbackSuccess))
  }
