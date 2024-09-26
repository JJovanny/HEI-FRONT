import { IOnboardingProfileCompany, IOnboardingProfileUser, IOnboardingProfilesState } from 'src/types/admin/onboardingProfile'
import Types from './Types'

const INITIAL_STATE: IOnboardingProfilesState = {
  onboardingProfiles: [],
  isLoadingGetOnboardingProfiles: false,
  onboardingProfile: {
    id: '',
    company: {} as IOnboardingProfileCompany,
    user: {} as IOnboardingProfileUser,
    email: '',
    financialCompany: [],
    createdAt: '',
    status: ''
  },
  isLoadingOnboardingProfile: false,
  errorOnboardingProfilesData: [],
  count: 0
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Types.SET_ONBOARDING_PROFILE_DATA_PROPS:
      return { ...state, [action.payload.prop]: action.payload.value }

    case Types.CLEAR_TO_INITIAL_STATE:
      return {
        ...INITIAL_STATE
      }

    case Types.CLEAR_ERROR_ONBOARDING_PROFILES_DATA:
      return {
        ...state,
        errorOnboardingProfilesData: []
      }

    case Types.CLEAR_ONBOARDING_PROFILES_DATA:
      return {
        ...state,
        onboardingProfiles: [],
        errorOnboardingProfilesData: [],
        isLoadingGetOnboardingProfiles: false,
        count: 0
      }

    case Types.CLEAR_ONBOARDING_PROFILE_DATA:
      return {
        ...state,
        onboardingProfile: INITIAL_STATE.onboardingProfile,
        errorOnboardingProfilesData: [],
        isLoadingOnboardingProfile: false
      }

    default:
      return state
  }
}
