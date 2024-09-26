import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Routing from 'src/routing'
/* actions */
import {
  clearLoginData,
  postRequestEmailLogin,
  setLoginState,
  setValuePostDataLogin,
  validatePostRequestLogin
} from 'src/login/LoginActions'
import LoginManager from 'src/login/LoginManager'
import { clearUserDataErrors } from 'src/user/UserActions'
/** components */
import TextInput from 'ui/input/TextInput'
import { strings } from 'src/resources/locales/i18n'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { isFocusHere } from 'src/api/utils'
import { IError } from 'src/types/global'
import { Button } from 'ui/Button'

export const LoginForm = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { postDataLogin, hps, isLoadingPostDataLogin, submitPost, errorLoginData, submitPut } = useSelector(({ LoginReducer, UserReducer }) => {
    const { postDataLogin, hps, isLoadingPostDataLogin, submitPost, errorLoginData } = LoginReducer
    const { submitPut } = UserReducer
    return { postDataLogin, hps, isLoadingPostDataLogin, submitPost, errorLoginData, submitPut }
  })
  const email = LoginManager.getEmail(postDataLogin)
  const [password, setPassword] = useState('')
  const [enterByCode, setEnterByCode] = useState(false);

  useEffect(() => {
    dispatch(clearLoginData())
    dispatch(clearUserDataErrors())
    return () => {}
  }, [])

  async function onSubmitPost (e) {
    e.preventDefault()

    if (!submitPost) dispatch(setLoginState({ prop: 'submitPost', value: true }))
    const errorFields = validatePostLogin()
    if ((await errorFields).length === 0) await requestLogin()
    else getFirstInputErrorId((await errorFields))?.focus()
  }

  async function validatePostLogin () {
    return dispatch(validatePostRequestLogin())
  }

  const redirectVerifyCode = () => router.push(Routing.verificationCode)
  const redirectInvoices = () => router.push(Routing.dashboard)

  async function requestLogin () {
   await dispatch(postRequestEmailLogin(email,password,enterByCode,redirectVerifyCode,redirectInvoices))
  }

  function getFirstInputErrorId (errorFields: IError[]) {
    if (errorFields.find(error => isFocusHere(error, 'email'))) return document.getElementById('email')
    return null
  }

  useEffect(() => {

    if (!hps) {
      setEnterByCode(true)
    } else {
      setPassword('')
    }

  },[hps])

  console.log('enterByCode',enterByCode)

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
            await dispatch(setValuePostDataLogin({ prop: e.target.name, value: e.target.value }))
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
          disabled={email === '' || (enterByCode ? false : password === '')}
          type='submit'
          className='btn btn-primary w-full'
          label={strings('button.login')}
          isLoading={isLoadingPostDataLogin}
        />

      </div>
    </form>
  )
}
