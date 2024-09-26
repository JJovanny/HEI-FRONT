import { strings } from 'src/resources/locales/i18n'
import { useRouter } from 'next/navigation'
import Routing from 'src/routing'
import { InvoicesList } from 'components/invoice/InvoicesList'
import MainLayout from 'components/layout/MainLayout'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { InvoicesListPayer } from 'components/invoice/InvoicesListPayer'
import { IUserState } from 'src/types/user'
import { EUserType, InvoiceStatus } from 'src/types/enums'
import { containerQuickpay } from 'styles/js/globalStyles'
import { InvoicesListSupplier } from 'components/invoice/InvoicesListSupplier'
import CrateBatchInvoiceModal from 'components/modal/CrateBatchInvoiceModal'

export default function InvoicesPage() {
  const router = useRouter()
  const { dataUser } = useSelector(state => state.UserReducer as IUserState)
  const userType = dataUser?.userType

  function redirectToCreateInvoice() {
    router.push(Routing.addInvoice)
  }
 
  return (
    <>
      <MainLayout isAdminRoute={false}>
        <header className='pt-6 pb-56 gradient-bottom start-blue-800 end-blue-500 shadow border-bottom'>
          <div
            className='container'
            style={containerQuickpay}>
            <div>
              <div className='row align-items-center'>
                <div className='col'>
                  <h1 className='h2 mb-0 text-white'>
                    {(!userType || userType === EUserType.BOTH) && strings('title.invoice.invoices')}
                    {userType === EUserType.SUPPLIER && strings('title.invoice.sentInvoices')}
                    {userType === EUserType.PAYER && strings('title.invoice.receivedInvoices')}
                    {userType === EUserType.FINANCIAL && strings('title.invoice.invoices')}
                  </h1>
                </div>
                {(userType !== EUserType.FINANCIAL) &&
                  <div className='col-auto text-end'>
                    <div className='mx-n1'>
                      {(userType !== EUserType.PAYER) && (
                        <button type='button' className='btn btn-sm btn-primary d-lg-inline-flex mx-1' onClick={(e) => redirectToCreateInvoice()}>
                          <span className='pe-1'>
                            <i className='bi bi-file-earmark-plus-fill' />
                          </span>
                          <span className='d-none d-lg-inline ps-lg-1'>{strings('button.createNewInvoice')}</span>
                        </button>
                      )}
                      <button type='button' data-bs-target='#modalInvoiceCsv' data-bs-toggle='modal' className='btn btn-sm btn-primary d-lg-inline-flex mx-1'>
                        <span className='pe-1'>
                          <i className='bi bi-cloud-upload' />
                        </span>
                        <span className='d-none d-lg-inline ps-lg-1'>{strings('button.importCsv')}</span>
                      </button>
                    </div>
                  </div>}
              </div>
            </div>
          </div>
        </header>

        <CrateBatchInvoiceModal />
        
        
        {userType === EUserType.PAYER && <InvoicesListPayer />}
        {userType === EUserType.SUPPLIER && <InvoicesListSupplier />}
        {(!userType || dataUser.userType === EUserType.BOTH) && <InvoicesList />}
        {userType === EUserType.FINANCIAL && <InvoicesListPayer />}

      </MainLayout>
    </>
  )
}
