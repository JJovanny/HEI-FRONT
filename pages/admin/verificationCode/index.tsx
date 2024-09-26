import Link from 'next/link'
import { strings } from 'src/resources/locales/i18n'
import Routing from 'src/routing'
import { VerificationCodeForm } from 'components/form/VerificationCodeForm'
import AsyncImage from 'ui/image/AsyncImage'
import AuthenticationLayout from 'components/layout/AuthLayout'

export default function AdminVerificationCodePage () {
  return (
    <AuthenticationLayout isAdminRoute>
      <div className='row'>
        <div className='col-12 col-lg-6 col-xxl-8 mx-lg-auto' style={{ maxWidth: '480px', width: '100%' }}>
          {/** Logo pulsable que te envia al login. */}
          <Link href={Routing.adminLogin} className='d-lg-none'>
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
              {strings('form.placeholder.verificationCode')}
            </h1>
            <p>{strings('placeholder.verificationCode')}</p>
          </div>

          <VerificationCodeForm isAdminRoute />

          <div className='text-sm d-flex align-items-start flex-row gap-3 mt-5 mb-5 p-0'>
            <i className='bi bi-magic' />
            <p>{strings('placeholder.magicCode')}</p>
          </div>

          <div className='text-center mb-5 border-top pt-5'>
            <small>{strings('ask.wantToGoToLogin')}</small>
            <Link href={Routing.adminLogin} className='text-sm font-semibold'> {strings('button.accessHere')}</Link>
          </div>
        </div>
      </div>
    </AuthenticationLayout>
  )
}
