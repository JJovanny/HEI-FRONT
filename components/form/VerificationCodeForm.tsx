import { useRouter } from 'next/navigation'
import Routing from 'src/routing'
/* actions */
import {
  postLogin,
  setLoginState,
  setValuePostDataLogin,
  validatePostConfirmLogin
} from 'src/login/LoginActions'
import LoginManager from 'src/login/LoginManager'
import { postAdminUserLogin, setAdminLoginState, setValuePostDataAdminLogin, validatePostAdminConfirmLogin } from 'src/admin/login/AdminLoginActions'
/** components */
import TextInput from 'ui/input/TextInput'
/** resources */
import { strings } from 'src/resources/locales/i18n'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { Button } from 'ui/Button'
import { isFocusHere } from 'src/api/utils'
import { apiGetAdminUser } from 'src/admin/user/AdminUserActions'
import { IUserState } from 'src/types/user'
import { EUserType } from 'src/types/enums'

export const VerificationCodeForm = ({ isAdminRoute } : {isAdminRoute: boolean}) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { postDataLogin, hps, isLoadingPostDataLogin, submitPost, errorLoginData, userType } = useSelector(({ LoginReducer, AdminLoginReducer, UserReducer }) => {
    const postDataLogin = isAdminRoute ? AdminLoginReducer?.postDataLogin : LoginReducer?.postDataLogin
    const hps = isAdminRoute ? AdminLoginReducer.hps : LoginReducer?.hps
    const isLoadingPostDataLogin = isAdminRoute ? AdminLoginReducer?.isLoadingPostDataLogin : LoginReducer?.isLoadingPostDataLogin
    const submitPost = isAdminRoute ? AdminLoginReducer?.submitPost : LoginReducer?.submitPost
    const errorLoginData = isAdminRoute ? AdminLoginReducer?.errorLoginData : LoginReducer?.errorLoginData
    const userType = (UserReducer as IUserState).dataUser?.userType

    return { postDataLogin, hps, isLoadingPostDataLogin, submitPost, errorLoginData, userType }
  })
  const verificationCode = LoginManager.getVerificationCode(postDataLogin)

  async function onSubmitPost (e) {
    e.preventDefault()

    if (submitPost === false) isAdminRoute ? dispatch(setAdminLoginState({ prop: 'submitPost', value: true })) : dispatch(setLoginState({ prop: 'submitPost', value: true }))
    const errorFields = validatePostLogin()
    if ((await errorFields).length === 0) await confirmLogin()
    else await getFirstInputErrorId((await errorFields))?.focus()
  }

  async function validatePostLogin () {
    if (isAdminRoute) return await dispatch(validatePostAdminConfirmLogin())
    return await dispatch(validatePostConfirmLogin())
  }

  function confirmLogin () {
    isAdminRoute
      ? dispatch(postAdminUserLogin(postDataLogin, () => {
        dispatch(apiGetAdminUser((data) => {
          if (!hps) {
            router.push(Routing.resetPassword)
            return
          }
          data?.financialCompany ? router.push(Routing.adminInvoices) : router.push(Routing.adminInvoices)
        }))
      }))
      : dispatch(postLogin(postDataLogin, () => {

        if (!hps) {
          router.push(Routing.resetPassword)
          return
        }

        if (userType === EUserType.SUPPLIER || userType === EUserType.PAYER) {
          router.push(Routing.users)
        }

        if (userType === EUserType.FINANCIAL) {
          router.push(Routing.invoices)
        }

        if (userType !== EUserType.SUPPLIER && userType !== EUserType.PAYER) {
          router.push(Routing.users)
        }
      }))
  }

  function getFirstInputErrorId (errorFields) {
    if (errorFields.find(error => isFocusHere(error, 'verificationCode'))) return document.getElementById('verificationCode')
    return null
  }

  return (
    <form
      className='p-0' onSubmit={(e) => {
        onSubmitPost(e)
      }}
    >
      <div className='form-floating mb-5'>
        <TextInput
          classNameInput=''
          disabled={isLoadingPostDataLogin}
          error={errorLoginData}
          id='verificationCode'
          name='verificationCode'
          noValidate={false}
          otherId=''
          placeholder={strings('form.placeholder.verificationCode')}
          readOnly={false}
          submit={submitPost}
          type='text'
          value={verificationCode}
          onChange={async (e) => {
            isAdminRoute
              ? await dispatch(setValuePostDataAdminLogin({ prop: e.target.name, value: e.target.value }))
              : await dispatch(setValuePostDataLogin({ prop: e.target.name, value: e.target.value }))
            if (submitPost) validatePostLogin()
          }}
        />
      </div>
      <div>
        <Button
          type='submit'
          className='btn btn-primary btn-lg w-full'
          label={strings('button.continue')}
          isLoading={isLoadingPostDataLogin}
        />
      </div>
    </form>
  )
}
