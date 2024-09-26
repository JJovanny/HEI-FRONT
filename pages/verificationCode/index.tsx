import Link from 'next/link'
import { strings } from 'src/resources/locales/i18n'
import Routing from 'src/routing'
import { VerificationCodeForm } from 'components/form/VerificationCodeForm'
import AsyncImage from 'ui/image/AsyncImage'
import AuthenticationLayout from 'components/layout/AuthLayout'
import { useSelector, useDispatch } from 'src/redux/hooks'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiPostLogin } from 'src/login/LoginActions'

export default function VerificationCodePage () {
  const { hps, email} = useSelector(({ LoginReducer, AdminLoginReducer, UserReducer }) => {
    const hps = LoginReducer?.hps
    const postDataLogin = LoginReducer?.postDataLogin
    const {email} = postDataLogin

    return { hps, email }
  })
  const router = useRouter()
  const dispatch = useDispatch()

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const handleLogin = async () => {
    if (password === '') {
      setError('La contraseña no puede estar vacia');
    } else {
      await dispatch(apiPostLogin(password, email, () => {router.push(Routing.invoices)}))
      setPassword('');
      setError('');
    }
  };

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

          <>
          <div className='mt-12 mb-8'>
            <h1 className='ls-tight font-bolder h2 mb-3'>
              {strings('form.placeholder.verificationCode')}
            </h1>
            <p>{strings('placeholder.verificationCode')}</p>
          </div>
          <VerificationCodeForm isAdminRoute={false} />

          <div className='text-sm d-flex align-items-start flex-row gap-3 mt-5 mb-5 p-0'>
            <i className='bi bi-magic' />
            <p>{strings('placeholder.magicCode')}</p>
          </div>

          <div className='text-center mb-5 border-top pt-5'>
            <small>{strings('ask.wantToGoToLogin')}</small>
            <Link href={Routing.login} className='text-sm font-semibold'> {strings('button.accessHere')}</Link>
          </div>
          </>

         
        </div>
      </div>
    </AuthenticationLayout>
  )
}
