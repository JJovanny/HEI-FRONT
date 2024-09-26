
import { launchAsyncTask, Verbs } from 'src/api/utils'
import { Tags } from './tags'

export const getOnboardingProfiles = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().AdminUserReducer

  let url = '/api/v1/app/adminUser/onboardingProfiles'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  /** sort */
  url += '?sort=-createdAt'

  return dispatch(launchAsyncTask(Tags.GET_ONBOARDING_PROFILES, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const postApproveOnboarding = (id, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const url = '/api/v1/app/adminUser/onboardingProfiles/approve/' + id

  const { accessToken } = getState().AdminUserReducer
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  const params = {}

  return dispatch(launchAsyncTask(Tags.POST_APPROVE_ONBOARDING, Verbs.POST, url, config, params, callbackError, callbackSuccess))
}

export const delOnboarding = (id, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().AdminUserReducer

  const url = '/api/v1/app/adminUser/onboardingProfiles/' + id
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.DEL_ONBOARDING, Verbs.DEL, url, config, null, callbackError, callbackSuccess))
}
