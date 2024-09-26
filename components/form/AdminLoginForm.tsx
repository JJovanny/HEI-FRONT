import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Routing from 'src/routing'
/* actions */
import LoginManager from 'src/login/LoginManager'
import { clearAdminLoginData, postAdminUserRequestEmailLogin, setAdminLoginState, setValuePostDataAdminLogin, validatePostAdminRequestLogin } from 'src/admin/login/AdminLoginActions'
/** components */
import TextInput from 'ui/input/TextInput'
import { strings } from 'src/resources/locales/i18n'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { Button } from 'ui/Button'
import { isFocusHere } from 'src/api/utils'
import { IError } from 'src/types/global'

export const AdminLoginForm = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { postDataLogin, hps ,isLoadingPostDataLogin, submitPost, errorLoginData } = useSelector(({ AdminLoginReducer }) => {
    const { postDataLogin, hps, isLoadingPostDataLogin, submitPost, errorLoginData } = AdminLoginReducer
    return { postDataLogin, hps, isLoadingPostDataLogin, submitPost, errorLoginData }
  })

  const email = LoginManager.getEmail(postDataLogin)
  const [password, setPassword] = useState('')
  const [enterByCode, setEnterByCode] = useState(false);

  useEffect(() => {
    dispatch(clearAdminLoginData())
    return () => {}
  }, [])

  async function onSubmitPost (e) {
    e.preventDefault()

    if (!submitPost) dispatch(setAdminLoginState({ prop: 'submitPost', value: true }))
    const errorFields = validatePostLogin()
    if ((await errorFields).length === 0) await requestLogin()
    else getFirstInputErrorId((await errorFields))?.focus()
  }

  async function validatePostLogin () {
    return dispatch(validatePostAdminRequestLogin())
  }

  const redirectVerifyCode = () => router.push(Routing.adminVerificationCode)
  const redirectDashboard = () => router.push(Routing.adminOnboardingProfiles)

  async function requestLogin () {
    await dispatch(postAdminUserRequestEmailLogin(email,password,enterByCode,redirectVerifyCode,redirectDashboard))
   }

  function getFirstInputErrorId (errorFields: IError[]) {
    if (errorFields.find(error => isFocusHere(error, 'email'))) return document.getElementById('email')
    return null
  }

  useEffect(() => {

    if (!hps) {
      setEnterByCode(true)
    }

  },[hps])

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
          id='email'
          name='email'
          noValidate={false}
          otherId=''
          placeholder={strings('placeholder.email2')}
          readOnly={false}
          submit={submitPost}
          type='text'
          value={email}
          onChange={async (e) => {
            await dispatch(setValuePostDataAdminLogin({ prop: e.target.name, value: e.target.value }))
            if (submitPost) validatePostLogin()
          }}
        />
      </div>
      {(!enterByCode && hps) && (
      <div className='form-floating mb-5'>
        <TextInput
          classNameInput=''
          disabled={isLoadingPostDataLogin}
          id='password'
          name='password'
          noValidate={false}
          otherId=''
          placeholder={strings('placeholder.password')}
          readOnly={false}
          type='password'
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
      </div>
      )}

      {/* <div className='text-sm d-flex align-items-start flex-row gap-3 mb-5 p-0'>
            <i className='bi bi-magic' />
            <p>
              {strings('placeholder.receivedCode')}:
              &nbsp;<strong
              className='cursor-pointer'
              onClick={() => {
                setEnterByCode(!enterByCode)
              }} 
              ><u>{strings('placeholder.enterByCode')}</u></strong></p>
      </div> */}

      <div className='vstack gap-2'>
        <Button
          disabled={email === '' || (enterByCode ?  password !=='' : password ==='')}
          type='submit'
          className='btn btn-lg btn-primary w-full'
          label={strings('button.login')}
          isLoading={isLoadingPostDataLogin}
        />

      </div>
    </form>
  )
}
