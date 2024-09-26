import { strings } from 'src/resources/locales/i18n'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { IUserState } from 'src/types/user'
import TextInput from 'ui/input/TextInput'
import Loading from 'ui/Loading'
import {
  apiPostConfirmUpdateEmail,
  apiPostRequestUpdateEmail,
  clearChangeEmailData,
  setUserDataProps,
  setValueChangeEmail,
  validatePostConfirmUpdateEmail,
  validatePostUpdateEmail
} from 'src/user/UserActions'
import { useState } from 'react'

export const ChangeEmail = () => {
  const dispatch = useDispatch()
  const [viewCode, setViewCode] = useState(false)
  const { changeEmail, isLoadingPostChangeEmail, errorUserData, submitPost, isLoadingConfirmChangeEmail } =
  useSelector((state) => state.UserReducer as IUserState)

  const onSubmitRequestPost = async () => {
    if (!submitPost) dispatch(setUserDataProps({ prop: 'submitPost', value: true }))
    const error = await dispatch(validatePostUpdateEmail())
    if (error?.length === 0) await dispatch(apiPostRequestUpdateEmail(() => setViewCode(true)))
  }

  const onSubmitConfirmPost = async () => {
    if (!submitPost) dispatch(setUserDataProps({ prop: 'submitPost', value: true }))
    const error = await dispatch(validatePostConfirmUpdateEmail())
    if (error?.length === 0) {
      await dispatch(apiPostConfirmUpdateEmail(() => {
        setViewCode(false)
        dispatch(clearChangeEmailData())
      }
      ))
    }
  }

  return (
    <>

      <div className='row align-items-start mb-8 mb-xl-12 mb-xxl-16'>
        <div className='col-lg-4 col-xxl-3 mb-5 mb-lg-0'>
          <h4 className='mb-2'>{strings('form.placeholder.changeEmail')}</h4>
        </div>
        <div className='col-lg-8 offset-xxl-1 d-flex flex-column gap-5'>
          <div className='row g-3'>
            <div className='col-md-6'>
              <div className='form-group'>
                <TextInput
                  classNameInput='form-control form-control-sm_'
                  disabled={isLoadingPostChangeEmail || isLoadingConfirmChangeEmail}
                  error={errorUserData}
                  id='newEmail'
                  name='newEmail'
                  noValidate={false}
                  otherId=''
                  readOnly={false}
                  submit={submitPost}
                  textLabel={strings('placeholder.newEmail')}
                  type='text'
                  value={changeEmail?.newEmail}
                  onChange={async (e) => {
                    await dispatch(setValueChangeEmail({ prop: e.target.name, value: e.target.value }))
                  }}
                />
              </div>
            </div>
            {viewCode &&
              <div className='col-md-6'>
                <div className='form-group'>
                  <TextInput
                    classNameInput='form-control form-control-sm_'
                    disabled={isLoadingPostChangeEmail || isLoadingConfirmChangeEmail}
                    error={errorUserData}
                    id='verificationCode'
                    name='verificationCode'
                    noValidate={false}
                    otherId=''
                    readOnly={false}
                    submit={submitPost}
                    textLabel={strings('form.placeholder.verificationCode')}
                    type='text'
                    value={changeEmail?.verificationCode}
                    onChange={async (e) => {
                      await dispatch(setValueChangeEmail({ prop: e.target.name, value: e.target.value }))
                    }}
                  />
                </div>
              </div>}
          </div>
        </div>
        <div className='row mt-5'>
          <div className='col-lg-8 offset-lg-4 d-flex justify-content-center justify-content-lg-start'>
            <button
              type='button'
              className='btn btn-secondary'
              onClick={!viewCode ? onSubmitRequestPost : onSubmitConfirmPost}
            >
              {(isLoadingConfirmChangeEmail || isLoadingPostChangeEmail)
                ? <span className='spinner-border spinner-border-sm' role='status' aria-hidden='true' />
                : <span className='btn-text'>{!viewCode ? strings('button.sendCode') : strings('button.updateEmail')}</span>}

            </button>
          </div>
        </div>
      </div>

    </>
  )
}
