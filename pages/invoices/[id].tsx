import { strings } from 'src/resources/locales/i18n'
import { useRouter } from 'next/navigation'
import Routing from 'src/routing'
import { InvoiceForm } from 'components/form/InvoiceForm'
import MainLayout from 'components/layout/MainLayout'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { clearInvoiceData } from 'src/invoice/InvoiceActions'
import { IInvoiceState } from 'src/types/invoice'

export default function EditInvoicePage () {
  const dispatch = useDispatch()
  const router = useRouter()

  const { invoice } = useSelector(({ InvoiceReducer }) => {
    const { invoice } = InvoiceReducer as IInvoiceState

    return { invoice }
  })

  !invoice?.id && router.push(Routing.dashboard)

  function redirectToCreateInvoice () {
    dispatch(clearInvoiceData())
    router.push(Routing.addInvoice)
  }

  return (
    <>
      <MainLayout isAdminRoute={false}>
        <header className='pt-6 pb-56 gradient-bottom start-blue-800 end-blue-500 shadow border-bottom'>
          <div className='container-xl'>
            <div>
              <div className='row align-items-center'>
                <div className='col'>
                  {/* <!-- Title --> */}
                  <h1 className='h2 mb-0 text-white'>{strings('title.invoice.editInvoice')}</h1>
                </div>
                {/* <!-- Actions --> */}
                <div className='col-auto text-end'>
                  <div className='mx-n1'>
                    <button type='button' className='btn btn-sm btn-primary d-lg-inline-flex mx-1' onClick={() => redirectToCreateInvoice()}>
                      <span className='pe-2'>
                        <i className='bi bi-file-earmark-plus' />
                      </span>
                      <span className='d-none d-lg-inline ps-lg-1'>{strings('button.uploadInvoice')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <InvoiceForm isEdit />
      </MainLayout>
    </>
  )
}
