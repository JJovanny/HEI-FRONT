import toast from 'react-hot-toast'
import { delOnboarding, getOnboardingProfiles, postApproveOnboarding } from 'src/api/admin/onboarding'
import { isDev } from 'src/utils/Utils'
import { strings } from 'src/resources/locales/i18n'
import Types from './Types'

export const clearOnbardingProfileToInitialState = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_TO_INITIAL_STATE })
}

export const clearOnbardingProfilesDataErrors = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_ERROR_ONBOARDING_PROFILES_DATA })
}

export const clearOnbardingProfilesData = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_ONBOARDING_PROFILES_DATA })
}

export const clearOnbardingProfileData = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_ONBOARDING_PROFILE_DATA })
}

export const setOnbardingProfileDataProps = ({ prop, value }) => ({
  type: Types.SET_ONBOARDING_PROFILE_DATA_PROPS,
  payload: { prop, value }
})

export const apiGetOnboardingProfiles = () => async (dispatch, getState) => {
  await dispatch(setOnbardingProfileDataProps({ prop: 'isLoadingGetOnboardingProfiles', value: true }))

  await dispatch(
    getOnboardingProfiles(
      (tag, response) => {
        if (isDev()) console.log('apiGetOnboardingProfiles - Error', response)
        dispatch(setOnbardingProfileDataProps({ prop: 'errorOnboardingProfilesData', value: response }))
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorOnboardingProfiles'))
      },
      (tag, response) => {
        if (isDev()) console.log('apiGetOnboardingProfiles', response)
        dispatch(setOnbardingProfileDataProps({ prop: 'onboardingProfiles', value: response?.data?.documents || [] }))
        dispatch(setOnbardingProfileDataProps({ prop: 'count', value: response?.data?.count || 0 }))
      }
    )
  )

  await dispatch(setOnbardingProfileDataProps({ prop: 'isLoadingGetOnboardingProfiles', value: false }))
}

export const apiPostApproveOnboarding = (id) => async (dispatch) => {
  await dispatch(setOnbardingProfileDataProps({ prop: 'isLoadingOnboardingProfile', value: true }))

  await dispatch(
    postApproveOnboarding(
      id,
      (tag, response) => {
        if (isDev()) console.log('apiPostApproveOnboarding - Error', response)
        if (response?.data?.document) {
          toast.error(strings('toasts.adminAlert.errorOnboardingProfileExist'))
        }
      },
      (tag, response) => {
        if (isDev()) console.log('apiPostApproveOnboarding', response)
        document.getElementById('modal-open-approveOk')?.click()
      }
    )
  )

  await dispatch(setOnbardingProfileDataProps({ prop: 'isLoadingOnboardingProfile', value: false }))
}

export const apiDeleteOnboarding = (id) => async (dispatch) => {
  await dispatch(setOnbardingProfileDataProps({ prop: 'isLoadingOnboardingProfile', value: true }))

  await dispatch(
    delOnboarding(
      id,
      (tag, response) => {
        if (isDev()) console.log('apiDeleteOnboarding - Error', response)
      },
      (tag, response) => {
        if (isDev()) console.log('apiDeleteOnboarding - Success', response)
        document.getElementById('modal-open-denyOk')?.click()
        document.getElementById('modalDisplayDeleteItemOK')?.click()
      }
    )
  )

  await dispatch(setOnbardingProfileDataProps({ prop: 'isLoadingOnboardingProfile', value: false }))
}
