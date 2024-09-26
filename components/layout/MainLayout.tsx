/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { Navigation } from 'components/navigation/Navigation'
import { Footer } from 'components/Footer'
import { useSelector, useDispatch } from 'src/redux/hooks'
import { useRouter } from 'next/router'
import Routing from 'src/routing'
import { IUser } from 'src/types/user'
import { strings } from 'src/resources/locales/i18n'
import { ViewInvoiceModal } from 'components/modal/ViewInvoiceModal'
import { EUserType } from 'src/types/enums'
import { ViewInvoiceModalPaymentToFinancial } from 'components/modal/ViewInvoiceModalPaymentToFinancial'
import { ViewInvoiceModalAdvancePayment } from 'components/modal/ViewInvoiceModalAdvancePayment'
import { AcceptInvoiceModal } from 'components/modal/invoiceActions/AcceptInvoiceModal'
import { DenyInvoiceModal } from 'components/modal/invoiceActions/DenyInvoiceModal'
import { AddSuccessModal } from 'components/modal/AddSuccessModal'
import { apiGetInvoicesIssued, apiGetInvoicesIssuedQuickpay } from 'src/invoice/InvoiceActions'
import { apiGetReceivedInvoices, apiGetReceivedInvoicesQuickpay } from 'src/receivedInvoice/ReceivedInvoiceActions'
import { apiGetUserMe } from 'src/user/UserActions'

export default function MainLayout ({ children, isAdminRoute }: { children: React.ReactNode, isAdminRoute: boolean }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const { accessToken, adminAccessToken, dataUser } = useSelector(({ UserReducer, AdminUserReducer }) => {
    const { accessToken, dataUser }: {accessToken: string, dataUser: IUser} = UserReducer
    const adminAccessToken: string = AdminUserReducer?.accessToken

    return { accessToken, adminAccessToken, dataUser }
  })

  useEffect(() => {
    !isAdminRoute && !accessToken && router.push(Routing.login)
    isAdminRoute && !adminAccessToken && router.push(Routing.adminLogin)
  }, [])


  // useEffect(() => {
  //   dispatch(apiGetUserMe())
  // }, [])
  
  const validateMyUserAddress = () => {
    if (router.pathname.includes('admin')) return true
    if (!(dataUser?.companyAddress) ||
    !(dataUser?.companyCIF) ||
    !(dataUser?.companyCity) ||
    !(dataUser?.companyCountry) ||
    !(dataUser?.companyPostalCode)) {
      return false
    }
    return true
  }

  const isSupplier = () => {
    return dataUser?.userType === EUserType.BOTH || dataUser?.userType === EUserType.SUPPLIER
  }

  const isInvoicesQuickPay = window.location.pathname === '/invoices/quickpay'
  const isInvoices = window.location.pathname === '/invoices'

  const callBackInvoices = async () => {
    if (isSupplier()) {

      if (isInvoicesQuickPay) return  await dispatch(apiGetInvoicesIssuedQuickpay())

      if (isInvoices) return await dispatch(apiGetInvoicesIssued())

    } else {

      if (isInvoicesQuickPay) return await dispatch(apiGetReceivedInvoicesQuickpay())
      
      if (isInvoices) return await dispatch(apiGetReceivedInvoices())

    }
  }

  return (
    <>
      <div className='pb-8 bg-surface-secondary'>
        <div className='mainContainer'>
          {accessToken || adminAccessToken ? <Navigation isAdminRoute={isAdminRoute} /> : null}
          {/* {!validateMyUserAddress() && (
            <div className='p-4 bg-blue-800'>
              <div className='container-xl'>
                <div className='alert alert-warning rounded-pill' role='alert'>
                  {strings('alert.warnings.rememberComplete')} &nbsp;
                  <a href={Routing.profile} className='alert-link'>{strings('alert.warnings.information.yourBillingInformation')}</a> &nbsp;
                  {strings('alert.warnings.for.exchangeInvoices')}
                </div>
              </div> 
            </div>
          )} */}
          {((isAdminRoute && adminAccessToken) || (!isAdminRoute && accessToken)) && children}
          <ViewInvoiceModal iAmTheSupplier={isSupplier() ? true : false} /> 
          <AcceptInvoiceModal
            route={Routing.invoices}
          />
          <DenyInvoiceModal
            route={Routing.invoices}
          />
          <ViewInvoiceModalAdvancePayment iAmTheSupplier={isSupplier() ? true : false} isInvoicesQuickPay={isInvoicesQuickPay}/>
          {dataUser?.userType !== EUserType.FINANCIAL && ( 
            <ViewInvoiceModalPaymentToFinancial iAmTheSupplier={isSupplier() ? true : false} />
          )}
          <AddSuccessModal
            redirect={false}
            route={null}
            callback={callBackInvoices()}
            icon='bi bi-check-circle-fill'
            successText='markAsPaidSuccess'
          />
          </div>
      </div>
      {(accessToken || adminAccessToken) && <Footer />}
    </>
  )
}
