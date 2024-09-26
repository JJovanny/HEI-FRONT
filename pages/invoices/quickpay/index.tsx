import { strings } from 'src/resources/locales/i18n'
import MainLayout from 'components/layout/MainLayout'
import { useSelector } from 'src/redux/hooks'
import { IUserState } from 'src/types/user'
import { EUserType } from 'src/types/enums'
import { InvoiceQuickPayListPayer } from 'components/invoice/InvoiceQuickPayListPayer'
import { InvoiceQuickPayListSupplier } from 'components/invoice/InvoiceQuickPayListSupplier'
import { InvoiceQuickPayList } from 'components/invoice/InvoiceQuickPayList'
import { containerQuickpay } from 'styles/js/globalStyles'

export default function InvoicesQuickpayPage () {
  const { dataUser } = useSelector(state => state.UserReducer as IUserState)
  const userType = dataUser?.userType

  return (
    <>
      <MainLayout isAdminRoute={false}>
        <header className='pt-6 pb-56 gradient-bottom start-blue-800 end-blue-500 shadow border-bottom'>
        <div 
          className='container'
          style={containerQuickpay}
        >
            <div>
              <div className='row align-items-center'>
                <div className='col'>
                  <h1 className='h2 mb-0 text-white'>
                    {(!userType || userType === EUserType.BOTH) && strings('title.invoice.invoicesQuickpay')}
                    {userType === EUserType.SUPPLIER && strings('title.invoice.quickpaySentInvoices')}
                    {userType === EUserType.PAYER && strings('title.invoice.quickpayReceivedInvoices')}
                    {userType === EUserType.FINANCIAL && strings('dashboard.receivables')}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        {userType === EUserType.PAYER && <InvoiceQuickPayListPayer />}
        {userType === EUserType.FINANCIAL && <InvoiceQuickPayListPayer />}
        {userType === EUserType.SUPPLIER && <InvoiceQuickPayListSupplier />}
        {(!userType || dataUser.userType === EUserType.BOTH) && <InvoiceQuickPayList />}

      </MainLayout>
    </>
  )
}
