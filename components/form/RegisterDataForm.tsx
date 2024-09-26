import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { useRouter } from 'next/navigation'
import Routing from 'src/routing'
import { postRegisterUser, setUserDataProps, setValuePostDataUser, validatePostUser } from 'src/user/UserActions'
import { strings } from 'src/resources/locales/i18n'
import TextInput from 'ui/input/TextInput'
import { Button } from 'ui/Button'
import { getCountries, isFocusHere } from 'src/api/utils'
import { apiGetCountries, apiGetRegions } from 'src/country/CountryActions'
import SelectInput from 'ui/input/SelectInput'

export const RegisterDataForm = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { postDataUser, isLoadingPostDataUser, submitPost, errorUserData } = useSelector(({ UserReducer }) => {
    const { postDataUser, isLoadingPostDataUser, submitPost, errorUserData } = UserReducer
    return { postDataUser, isLoadingPostDataUser, submitPost, errorUserData }
  })
  const { firstName, lastName, ciInvitation, ci, phone, email} = postDataUser


  useEffect(() => {
    submitPost && dispatch(validatePostUser())
    return () => {}
  }, [firstName, lastName, ciInvitation, ci, phone])


  async function onSubmitPost (e) {
    e.preventDefault()
    !submitPost && dispatch(setUserDataProps({ prop: 'submitPost', value: true }))
    let errorFields = await dispatch(validatePostUser())
    errorFields.length === 0 && await dispatch(postRegisterUser(postDataUser, () => router.push(Routing.resetPassword)))
    if (errorFields.length === 0 && errorUserData > 0) errorFields = errorUserData
    errorFields.length > 0 && await getFirstInputErrorId(errorFields)?.focus()
  }

  function getFirstInputErrorId (errorFields) {
    if (errorFields.find(error => isFocusHere(error, 'firstName'))) return document.getElementById('firstName')
    if (errorFields.find(error => isFocusHere(error, 'lastName'))) return document.getElementById('lastName')
    return null
  }

  return (
    <form
    onSubmit={(e) => {
      onSubmitPost(e)
    }}
    >
      <p className='mt-8 mb-3 font-semibold text-dark'>{strings('ask.howCallYou')}</p>
      <div className='form-floating mb-5'>
        <TextInput
          classNameInput=''
          disabled={isLoadingPostDataUser}
          error={errorUserData}
          id='firstName'
          name='firstName'
          noValidate={false}
          otherId=''
          placeholder={strings('form.placeholder.firstName')}
          readOnly={false}
          submit={submitPost}
          type='text'
          value={firstName}
          onChange={async (e) => {
            await dispatch(setValuePostDataUser({ prop: e.target.name, value: e.target.value }))
          }}
        />
      </div>
      <div className='form-floating mb-5 w-50'>
        <TextInput
          classNameInput=''
          disabled={isLoadingPostDataUser}
          error={errorUserData}
          id='lastName'
          name='lastName'
          noValidate={false}
          otherId=''
          placeholder={strings('form.placeholder.surnames')}
          readOnly={false}
          submit={submitPost}
          type='text'
          value={lastName}
          onChange={async (e) => {
            await dispatch(setValuePostDataUser({ prop: e.target.name, value: e.target.value }))
          }}
        />
      </div>
      <div className='form-floating mb-5'>
        <TextInput
          classNameInput=''
          disabled={isLoadingPostDataUser}
          error={errorUserData}
          id='email'
          name='email'
          noValidate={false}
          otherId=''
          placeholder={strings('placeholder.email')}
          readOnly={false}
          submit={submitPost}
          type='text'
          value={email}
          onChange={async (e) => {
            await dispatch(setValuePostDataUser({ prop: e.target.name, value: e.target.value }))
          }}
        />
      </div>
      <div className='form-floating mb-5 w-50'>
        <TextInput
          classNameInput=''
          disabled={isLoadingPostDataUser}
          error={errorUserData}
          id='phone'
          name='phone'
          noValidate={false}
          otherId=''
          placeholder="Telefono"
          readOnly={false}
          submit={submitPost}
          type='text'
          value={phone}
          onChange={async (e) => {
            await dispatch(setValuePostDataUser({ prop: e.target.name, value: e.target.value }))
          }}
        />
      </div>
      <div className='form-floating mb-5 w-50'>
        <TextInput
          classNameInput=''
          disabled={isLoadingPostDataUser}
          error={errorUserData}
          id='ci'
          name='ci'
          noValidate={false}
          otherId=''
          placeholder="Cedula"
          readOnly={false}
          submit={submitPost}
          type='text'
          value={ci}
          onChange={async (e) => {
            await dispatch(setValuePostDataUser({ prop: e.target.name, value: e.target.value }))
          }}
        />
      </div>
      <div className='form-floating mb-5 w-50'>
        <TextInput
          classNameInput=''
          disabled={isLoadingPostDataUser}
          error={errorUserData}
          id='ciInvitation'
          name='ciInvitation'
          noValidate={false}
          otherId=''
          placeholder="Cedula de quien te invito"
          readOnly={false}
          submit={submitPost}
          type='text'
          value={ciInvitation}
          onChange={async (e) => {
            await dispatch(setValuePostDataUser({ prop: e.target.name, value: e.target.value }))
          }}
        />
      </div>

      
      <div className='mt-8'>

        <Button
          className='btn btn-primary btn-lg w-full'
          label={strings('button.continue')}
          type='submit'
          isLoading={isLoadingPostDataUser}
        />
      </div>

    </form>
  )
}
