import Link from 'next/link'
import { strings } from 'src/resources/locales/i18n'
import Routing from 'src/routing'
import AsyncImage from 'ui/image/AsyncImage'
import AuthenticationLayout from 'components/layout/AuthLayout'
import { AdminLoginForm } from 'components/form/AdminLoginForm'
import { useDispatch } from 'src/redux/hooks'
import { setAdminLoginState } from 'src/admin/login/AdminLoginActions'

export default function AdminLoginPage () {
  const dispatch = useDispatch()

  return (
    <div className='container-fluid bg-pr' style={{height: '100vh'}}>

      <div className='justify-content-center d-flex'>
          <div style={{ maxWidth: '480px', width: '100%' }}>
            <div className='mb-8 mt-13'>
              <h1 className='ls-tight font-bolder h2 mb-3 text-center'>
              {strings('title.admin.login')}
              </h1>
            </div>

          <AdminLoginForm />

          <div className='text-center border-top pt-5 mb-10'>
              <small>{strings('ask.haventGotAccount')}</small>
              <a
                onClick={() => {
                  dispatch(setAdminLoginState({ prop: 'hps', value: false }))              
                }}
                className='text-sm font-semibold cursor-pointer'> {strings('placeholder.forgotPassword')}</a>
          </div>


        </div>
        </div>
      </div>
      )
}
