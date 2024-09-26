import React from 'react'
import Link from 'next/link'
import Routing from 'src/routing'
import { strings } from 'src/resources/locales/i18n'
import AsyncImage from 'ui/image/AsyncImage'

export default function AuthenticationLayout ({ children, isAdminRoute }: { children: React.ReactNode, isAdminRoute: boolean }) {
  return (
    <div className='p-10 p-md-20 p-lg-0 bg-surface-secondary'>
      <div className='d-flex justify-content-center'>

      {/* <div className='col-lg-4 col-xxl-5 p-12 p-xl-20 position-fixed start-0 top-0 h-screen overflow-hidden flex-column gradient-bottom start-blue-900 end-blue-500 d-none d-lg-flex'> */}
      <div className='col-lg-4 col-xxl-5 p-12 p-xl-20 position-fixed start-0 top-0 h-screen overflow-hidden flex-column gradient-bottom start-blue-900 end-blue-500 d-none d-lg-flex'>
      <Link href={isAdminRoute ? Routing.adminLogin : Routing.login} className='d-none d-lg-block'>
            <AsyncImage
              alt={strings('imageAlt.quickPayLogo')}
              source='/images/logo-quickpay-min.svg'
              widthImg='200'
              heightImg='100'
              styleContainer='h-10'
            />
          </Link>
          <div className='mt-32 mb-20 text-secondary'>
            <h1 className='ls-tight font-bolder display-6 text-white mb-5'>
              {isAdminRoute ? strings('title.admin.adminPanel') : strings('global.simplePayments')}
            </h1>
          </div>
          
        </div>
        <div className='col-12 col-lg-8 offset-lg-4 col-xxl-7 offset-xxl-5 min-h-lg-screen d-flex flex-column justify-content-center position-relative'>
          {children}
        </div>

      </div>
    </div>
  )
}
