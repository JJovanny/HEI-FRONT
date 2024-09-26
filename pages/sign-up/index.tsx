import Link from 'next/link'
import { strings } from 'src/resources/locales/i18n'
import Routing from 'src/routing'
import { SignUpForm } from 'components/form/SignUpForm'
import { HeaderTwo } from 'components/HeaderTwo'
import { RegisterDataForm } from 'components/form/RegisterDataForm'

export default function SignUpPage() {
  return (
    <>
      <HeaderTwo />

      <div className='container-fluid bg-pr' style={{height: '100vh'}}>

        <div className='justify-content-center d-flex'>
          <div style={{ maxWidth: '480px', width: '100%' }}>
            <div className='mb-8 mt-13'>
              <h1 className='ls-tight font-bolder h2 mb-3 text-center'>
                {strings('title.auth.registerHere')}
              </h1>
            </div>

            <RegisterDataForm />

            <div className='mt-10 mb-5 text-center'>
              <small>{strings('ask.usingQuickPay')}</small>
              <Link href={Routing.login} className='text-sm font-semibold'> {strings('button.accessHere')}</Link>
            </div>

          </div>

        </div>
      
      </div>
    </>
  )
}
