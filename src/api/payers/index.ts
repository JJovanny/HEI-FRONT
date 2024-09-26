import { Verbs, launchAsyncTask } from '../utils'
import { Tags } from './tags'

export const getMyFinancialCompanies = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer

  const url = '/api/v1/app/user/financialCompanies'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.GET_MY_FINANCIAL_COMPANIES, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}
