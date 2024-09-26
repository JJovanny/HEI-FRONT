import Link from 'next/link'
import { strings } from 'src/resources/locales/i18n'
import Routing from 'src/routing'
import AsyncImage from 'ui/image/AsyncImage'
import { RegisterDataForm } from 'components/form/RegisterDataForm'
import AuthenticationLayout from 'components/layout/AuthLayout'

export default function RegisterDataPage () {
  return (
    <AuthenticationLayout isAdminRoute={false}>
      <div className='row'>
        <div className='col-12 col-lg-6 col-xxl-8 mx-lg-auto' style={{ maxWidth: '480px', width: '100%' }}>
          {/** Logo pulsable que te envia al login. */}
          <Link href={Routing.login} className='d-lg-none'>
            <AsyncImage
              alt={strings('imageAlt.quickPayLogo')}
              source='/images/logo-quickpay-min.svg'
              widthImg='200'
              heightImg='100'
              styleContainer='h-9'
            />
          </Link>
          <div className='mt-12 mb-8'>
            <h1 className='ls-tight font-bolder h2 mb-3'>
              {strings('title.auth.registerYourInformation')}
            </h1>
          </div>

          <RegisterDataForm />

          <div className='mt-10 mb-5 text-center'>
            <small>{strings('ask.wantToGoBack')}</small>
            <Link href={Routing.registerEmail} className='text-sm font-semibold'> {strings('button.accessHere')}</Link>
          </div>
        </div>
      </div>
    </AuthenticationLayout>
  )
}
