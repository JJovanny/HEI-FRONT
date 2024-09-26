import { IUser, IUserState } from 'src/types/user'
import Types from './Types'
import { IPaymentPreferences } from 'src/types/invoice'
import { EUserType } from 'src/types/enums'

const INITIAL_STATE: IUserState = {
  accessToken: '',
  refreshToken: '',
  changeEmail: { newEmail: '', verificationCode: '' },
  isLoadingPostChangeEmail: false,
  isLoadingConfirmChangeEmail: false,
  showFormSupplierCraate: false,
  /* user */
  postDataUser: {
    id: '',
    email: '',
    verificationCode: '',
    pinAccess: false,
    pinSuccess: false,
    typeCompany: '',
    ci: '',
    ciInvitation: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    companyName: '',
    currencyCode: '',
    companyCIF: '',
    bankInformation: '',
    companyAddress: '',
    companyPostalCode: '',
    companyCity: '',
    companyCountry: '',
    companyRegion: '',
    region: '',
    financialCompany: [],
    paymentPreferences: {} as IPaymentPreferences,
    externalPayment: false,
    userType: EUserType.BOTH,
    payerId: '',
  },
  acceptUseConditions: false,
  isLoadingPostDataUser: false,
  isLoadingPutDataUser: false,
  errorUserData: [],
  submitPost: false,
  submitPut: false,
  /* supplier me */
  isLoadingGetSupplierMe: false,
  putDataUser: {
    externalPayment: false
  } as IUser,
  dataUser: {
    externalPayment: false,
    companyBranchs: [],
    companyBranchSelected: {},
    companyBranchSelectedId: ''
  } as IUser,
  isLoadingPatchPaymentPreferences: false
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    /* set */
    case Types.SET_USER_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: action.payload.data.accessToken,
        refreshToken: action.payload.data.refreshToken
      }

    case Types.SET_USER_COMPANY_BRANCH_SELECTED:
      return {
        ...state,
        dataUser: { ...state.dataUser, [action.payload.prop]: action.payload.value }
      }

    case Types.SET_USER_DATA_PROPS:
      return { ...state, [action.payload.prop]: action.payload.value }

    case Types.SET_VALUE_POST_DATA_USER:
      return {
        ...state,
        postDataUser: { ...state.postDataUser, [action.payload.prop]: action.payload.value }
      }

    case Types.SET_VALUE_CHANGE_EMAIL:
      return {
        ...state,
        changeEmail: { ...state.changeEmail, [action.payload.prop]: action.payload.value }
      }

    case Types.SET_VALUE_PUT_DATA_USER:
      return {
        ...state,
        putDataUser: { ...state.putDataUser, [action.payload.prop]: action.payload.value }
      }

    case Types.SET_USER_LOGOUT:
      return { ...state, ...INITIAL_STATE }

    case Types.CLEAR_ERROR_USER_DATA:
      return {
        ...state,
        errorUserData: []
      }

    case Types.CLEAR_CHANGE_EMAIL_DATA:
      return {
        ...state,
        changeEmail: INITIAL_STATE.changeEmail
      }

    case Types.CLEAR_USER_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: '',
        refreshToken: ''
      }

    case Types.CLEAR_USER_DATA:
      return {
        ...state,
        dataUser: {} as IUser,
        putDataUser: {} as IUser
      }

    case Types.CLEAR_POST_DATA_USER:
      return {
        ...state,
        postDataUser: {
          email: state.postDataUser.email,
          verificationCode: '',
          firstName: '',
          lastName: '',
          phone: '',
          companyName: '',
          companyCIF: '',
          companyAddress: '',
          companyPostalCode: '',
          companyCity: '',
          companyCountry: '',
          companyRegion: '',
          region: '',
          financialCompany: [],
          payerId: ''
        }
      }

    case Types.CLEAR_ERROR_USER_DATA_PUT:
      return {
        ...state,
        errorUserData: [],
        submitPut: false
      }

    default:
      return state
  }
}
