import { EUserType } from 'src/types/enums'
import { Verbs, launchAsyncTask } from '../utils'
import { Tags } from './tags'

export const getDashboard = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken, dataUser: { companyBranchSelected, userType } } = getState().UserReducer

  let url = '/api/v1/app/dashboard/metrics'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }
  if (companyBranchSelected && companyBranchSelected?.id !== undefined) url += `?companyBranchSelected=${companyBranchSelected.id}`

  return dispatch(launchAsyncTask(Tags.GET_DASHBOARD, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}
