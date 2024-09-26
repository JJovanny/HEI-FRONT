import { IUserCompany, EditUserDTO, IUserCompanyState, IUserCompanyList } from 'src/types/admin/userCompany'
import { IError } from 'src/types/global'
import Types from './Types'

const INITIAL_STATE: IUserCompanyState = {
  isLoadingPostUserCompany: false,
  isLoadingPutUserCompany: false,
  isLoadingDelUserCompany: false,
  isLoadingGetMyUsersCompany: false,
  isLoadingGetUserCompanyById: false,
  userCompanyData: {} as IUserCompany,
  submitPost: false,
  submitPut: false,
  errorCreateUserCompany: [] as IError[],
  errorEditUserCompany: [] as IError[],
  myUsersCompany: [],
  userCompanyDetails: {} as IUserCompanyList,
  editUserCompanyDetails: {
    userData: {}, userId: ''
  } as EditUserDTO
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Types.SET_USER_COMPANY_DATA_PROPS:
      return { ...state, [action.payload.prop]: action.payload.value }

    case Types.SET_VALUE_POST_USER_COMPANY:
      return {
        ...state,
        userCompanyData: { ...state.userCompanyData, [action.payload.prop]: action.payload.value }
      }

    case Types.CLEAR_POST_DATA_USER_COMPANY:
      return {
        ...state,
        userCompanyData: {} as IUserCompany
      }

    case Types.CLEAR_ERROR_POST_USER_COMPANY:
      return {
        ...state,
        errorCreateUserCompany: []
      }

    case Types.SET_VALUE_PUT_USER_COMPANY:
      return {
        ...state,
        editUserCompanyDetails: { ...state.editUserCompanyDetails, [action.payload.prop]: action.payload.value }
      }

    case Types.SET_VALUE_PUT_USER_DATA:
      return {
        ...state,
        editUserCompanyDetails: {
          ...state.editUserCompanyDetails,
          userData: { ...state.editUserCompanyDetails?.userData, [action.payload.prop]: action.payload.value }
        }
      }

    case Types.SET_VALUE_PUT_COMPANY_DATA:
      return {
        ...state,
        editUserCompanyDetails: {
          ...state.editUserCompanyDetails,
          userData: {
            ...state.editUserCompanyDetails.userData,
            company: { ...state.editUserCompanyDetails?.userData?.company, [action.payload.prop]: action.payload.value }
          }
        }
      }

    case Types.CLEAR_PUT_DATA_USER_COMPANY:
      return {
        ...state,
        userCompanyDetails: {} as IUserCompanyList,
        editUserCompanyDetails: {} as EditUserDTO
      }

    case Types.CLEAR_ERROR_PUT_USER_COMPANY:
      return {
        ...state,
        errorEditUserCompany: [],
        submitPut: false
      }

    case Types.CLEAR_USER_COMPANY_DATA:
      return {
        ...state,
        userCompanyDetails: {} as IUserCompanyList,
        editUserCompanyDetails: {} as EditUserDTO,
        errorEditUserCompany: [],
        submitPut: false,
        isLoadingPostUserCompany: false,
        isLoadingPutUserCompany: false,
        isLoadingDelUserCompany: false
      }

    default:
      return state
  }
}
