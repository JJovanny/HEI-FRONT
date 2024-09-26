import { strings } from 'src/resources/locales/i18n'
import AuthenticationLayout from 'components/layout/AuthLayout'
import { useState } from 'react';
import { apiPostResetPassord } from 'src/login/LoginActions';
import Routing from 'src/routing';
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { apiPostAdminResetPassord } from 'src/admin/login/AdminLoginActions';
import { HeaderTwo } from 'components/HeaderTwo';

export default function setPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter()
  const dispatch = useDispatch()

  const { userData } = useSelector(({ AdminUserReducer }) => {
    const { userData } = AdminUserReducer
    return { userData }
  })


  const email = userData.email

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setError(strings('forgetPassword.passwordsNotMatch'));
    } else if (String(password).length < 8) {
      setError(strings('forgetPassword.passwordMaximumCharacters'));
    } else {
      const redirectDashboard = () => router.push(Routing.adminInvoices)
      const redirectProfile = () => router.push(Routing.profile)
      if (email !== '' && email !== null && email !== undefined) {
        await dispatch(apiPostAdminResetPassord(password, redirectDashboard))
      } else {
        await dispatch(apiPostResetPassord(password, redirectProfile))
      }
      setPassword('');
      setConfirmPassword('');
      setError('');
    }
  };

  return (
    <>
      <HeaderTwo />

      <div className='container-fluid bg-pr' style={{ height: '100vh' }}>

        <div className='justify-content-center d-flex'>
          <div style={{ maxWidth: '480px', width: '100%' }}>
            <div className='mb-8 mt-13'>
              <h1 className='ls-tight font-bolder h2 mb-3 text-center'>
              {strings('placeholder.restorePassword')}
              </h1>

              {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className='form-group'>
              <label htmlFor='password'>{strings('placeholder.password')}</label>
              <input
                type='password'
                className='form-control'
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='confirmPassword'>{strings('placeholder.confirmPassword')}</label>
              <input
                type='password'
                className='form-control'
                id='confirmPassword'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            </div>

            <button className='btn btn-primary w-full' disabled={password === ''} onClick={handleResetPassword}>{strings('placeholder.restorePassword')}</button>


          </div>

        </div>

      </div>
    </>
  )
}
