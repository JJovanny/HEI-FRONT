import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { useRouter } from 'next/navigation'
import Routing from 'src/routing'
/* actions */
import {
  clearUserDataErrors,
  postRegisterEmail,
  setUserDataProps,
  setValuePostDataUser,
  validatePostRegisterEmail
} from 'src/user/UserActions'
import UserManager from 'src/user/UserManager'
import { clearLoginDataError } from 'src/login/LoginActions'
import { apiGetCountries } from 'src/country/CountryActions'
/* resources */
import { strings } from 'src/resources/locales/i18n'
/* components */
import TextInput from 'ui/input/TextInput'
import CheckboxInput from 'ui/input/CheckboxInput'
import { Button } from 'ui/Button'
import { isFocusHere } from 'src/api/utils'

export const SignUpForm = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { postDataUser, isLoadingPostDataUser, submitPost, errorUserData, acceptUseConditions } = useSelector(({ UserReducer }) => {
    const { postDataUser, isLoadingPostDataUser, submitPost, errorUserData, acceptUseConditions } = UserReducer

    return { postDataUser, isLoadingPostDataUser, submitPost, errorUserData, acceptUseConditions }
  })
  const email = UserManager.getEmail(postDataUser)
  const [payer, setPayer] = useState('');

  useEffect(() => {
    const url = new URL(window.location.href);

    const params = new URLSearchParams(url.search);

    const cstmParam = params.get('cstm');

    if (cstmParam) {
      setPayer(cstmParam.replace(/ /g, '+'))
      dispatch(setValuePostDataUser({ prop: 'payerId', value: cstmParam.replace(/ /g, '+') }))
    } else {
      setPayer('')    }
  }, []);

  useEffect(() => {
    dispatch(clearLoginDataError())
    return () => {}
  }, [])


  async function onSubmitPost (e) {
    e.preventDefault()
    dispatch(apiGetCountries())
    if (!submitPost) dispatch(setUserDataProps({ prop: 'submitPost', value: true }))
    const errorFields = await dispatch(validatePostRegisterEmail())
    if (errorFields.length === 0) registerEmail()
    else getFirstInputErrorId(errorFields)?.focus()
  }

  function registerEmail () {
    dispatch(postRegisterEmail(email, payer, () => {
      dispatch(clearUserDataErrors())
      router.push(Routing.registerData)
    }))
  }

  function getFirstInputErrorId (errorFields) {
    if (errorFields.find(error => isFocusHere(error, 'email'))) return document.getElementById('email')
    if (errorFields.find(error => isFocusHere(error, 'acceptUseConditions'))) return document.getElementById('acceptUseConditions')
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
          disabled={isLoadingPostDataUser}
          error={errorUserData}
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
            await dispatch(setValuePostDataUser({ prop: e.target.name, value: e.target.value }))
            if (submitPost) await dispatch(validatePostRegisterEmail())
          }}
        />
      </div>
      <div className='mb-8'>
        <div className='form-check'>
          <CheckboxInput
            checked={acceptUseConditions}
            disabled={isLoadingPostDataUser}
            classLabel='form-check-label'
            error={errorUserData}
            id='acceptUseConditions'
            name='acceptUseConditions'
            textLabel={<a href='#' className='text-dark'>{strings('placeholder.readAndAcceptUseTerms')}</a>}
            onChange={async (e) => {
              await dispatch(setUserDataProps({ prop: e.target.name, value: e.target.checked }))
              if (submitPost) await dispatch(validatePostRegisterEmail())
            }}
          />
        </div>
      </div>
      <div>
        <div>
          <Button
            type='submit'
            className='btn btn-primary btn-lg w-full'
            label={strings('button.continue')}
            isLoading={isLoadingPostDataUser}
          />
        </div>
      </div>
    </form>
  )
}
