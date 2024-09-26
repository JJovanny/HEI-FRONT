import { launchAsyncTask, Verbs } from 'src/api/utils'
import { Tags } from './tags'

export const getAdminInvoices = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().AdminUserReducer

  const url = '/api/v1/app/adminUser/financialCompanies/associated/invoices'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.GET_ADMIN_INVOICES, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}
