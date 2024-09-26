import { strings } from 'src/resources/locales/i18n'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { IUserState } from 'src/types/user'
import TextInput from 'ui/input/TextInput'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiPostResetPassord } from 'src/login/LoginActions'

export const ChangePassword = () => {

  const dispatch = useDispatch()
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter()

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setError(strings('forgetPassword.passwordsNotMatch'));
    } else if (String(password).length < 8) {
      setError(strings('forgetPassword.passwordMaximumCharacters'));
    }
    else {
        await dispatch(apiPostResetPassord(password, () => {}))
      setPassword('');
      setConfirmPassword('');
      setError('');
    }
  };

  return (
    <>

      <div className='row align-items-start mb-8 mb-xl-12 mb-xxl-16'>
        <div className='col-lg-4 col-xxl-3 mb-5 mb-lg-0'>
          <h4 className='mb-2'>{strings('myProfile.changePassword')}</h4>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
        <div className='col-lg-8 offset-xxl-1 d-flex flex-column gap-5'>
          <div className='row g-3'>
          <div className='col-md-6'>
              <div className='form-group'>
                <TextInput
                  classNameInput='form-control form-control-sm_'
                  id='password'
                  name='password'
                  noValidate={false}
                  otherId=''
                  readOnly={false}
                  textLabel={strings('placeholder.password')}
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className='col-md-6'>
              <div className='form-group'>
                <TextInput
                  classNameInput='form-control form-control-sm_'
                  id='confirmPassword'
                  name='confirmPassword'
                  noValidate={false}
                  otherId=''
                  readOnly={false}
                  textLabel={strings('placeholder.confirmPassword')}
                  type='password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='row mt-5'>
          <div className='col-lg-8 offset-lg-4 d-flex justify-content-center justify-content-lg-start'>
            <button
              type='button'
              className='btn btn-primary'
              onClick={handleResetPassword}
              disabled={password === ''}
            >
              <span className='btn-text'>{strings('placeholder.restorePassword')}</span>
            </button>
          </div>
        </div>
      </div>

    </>
  )
}
