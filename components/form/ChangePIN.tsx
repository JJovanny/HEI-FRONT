import { strings } from 'src/resources/locales/i18n'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { IUserState } from 'src/types/user'
import TextInput from 'ui/input/TextInput'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiPostResetPassord, apiPostResetPin } from 'src/login/LoginActions'

export const ChangePIN = () => {

  const dispatch = useDispatch()
  const [pin, setPin] = useState('');
  const [confirmPIN, setConfirmPIN] = useState('');
  const [error, setError] = useState('');
  const router = useRouter()

  const handleResetPIN = async () => {
    if (pin !== confirmPIN) {
      setError(strings('placeholder.pinNotMatch'));
    }
    else {
        await dispatch(apiPostResetPin(pin, () => {}))
        setPin('');
        setConfirmPIN('');
        setError('');
    }
  };

  return (
    <>

      <div className='row align-items-start mb-8 mb-xl-12 mb-xxl-16'>
        <div className='col-lg-4 col-xxl-3 mb-5 mb-lg-0'>
          <h4 className='mb-2'>{strings('button.changePIN')}</h4>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
        <div className='col-lg-8 offset-xxl-1 d-flex flex-column gap-5'>
          <div className='row g-3'>
          <div className='col-md-6'>
              <div className='form-group'>
                <TextInput
                  classNameInput='form-control form-control-sm_'
                  id='pin'
                  name='pin'
                  noValidate={false}
                  otherId=''
                  readOnly={false}
                  textLabel={strings('placeholder.PIN')}
                  type='password'
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </div>
            </div>
            <div className='col-md-6'>
              <div className='form-group'>
                <TextInput
                  classNameInput='form-control form-control-sm_'
                  id='confirmPIN'
                  name='confirmPIN'
                  noValidate={false}
                  otherId=''
                  readOnly={false}
                  textLabel={strings('placeholder.confirmPIN')}
                  type='password'
                  value={confirmPIN}
                  onChange={(e) => setConfirmPIN(e.target.value)}
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
              onClick={handleResetPIN}
              disabled={pin === ''}
            >
              <span className='btn-text'>{strings('placeholder.restorePIN')}</span>
            </button>
          </div>
        </div>
      </div>

    </>
  )
}
