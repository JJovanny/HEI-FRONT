import { useRouter } from 'next/navigation'
import Routing from 'src/routing'
import {
  apiGetInvoicesIssued,
  clearInvoiceData,
  clearInvoicesData,
  clearInvoicesPagination,
  setInvoiceDataProps
} from 'src/invoice/InvoiceActions'
import AsyncImage from '../../ui/image/AsyncImage'
import { TableInvoice } from './TableInvoice'
import { strings } from 'src/resources/locales/i18n'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { useEffect, useState } from 'react'
import { TableReceivedInvoices } from './TableReceivedInvoices'
import { IInvoicesType } from 'src/types/enums'
import { apiGetReceivedInvoices, clearReceivedInvoicesPagination, clearReceivedInvoicesData } from 'src/receivedInvoice/ReceivedInvoiceActions'
import { IInvoiceList, IInvoiceState } from 'src/types/invoice'
import { IInvoicesFilter } from 'src/types/filter'
import { InvoiceFilter } from 'components/filter/InvoiceFilter'
import { clearClientData } from 'src/client/ClientActions'
import { containerQuickpay } from 'styles/js/globalStyles'

export const InvoicesList = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [apiCall, setApiCall] = useState('')

  const { issuedInvoicePage, receivedInvoicepage, filters, invoiceStatusType } = useSelector(({ UserReducer, InvoiceReducer, ReceivedInvoiceReducer }) => {
    const { invoices, isLoadingGetInvoices, page, filters, invoiceStatusType } : {
      invoices: IInvoiceList[],
      isLoadingGetInvoices: boolean,
      page: number,
      filters: IInvoicesFilter,
      invoiceStatusType: string
    } = InvoiceReducer as IInvoiceState
    const { receivedInvoices, isLoadingReceivedInvoices } = ReceivedInvoiceReducer
    const { accessToken } = UserReducer

    return { accessToken, invoices, isLoadingGetInvoices, invoiceStatusType, receivedInvoices, isLoadingReceivedInvoices, issuedInvoicePage: page, receivedInvoicepage: ReceivedInvoiceReducer.page, filters }
  })
  const { clear, filterAllowAdvance, filterInvoiceState } = filters

  useEffect(() => {
    invoiceStatusType === IInvoicesType.SENT ? dispatch(clearInvoicesPagination()) : dispatch(clearReceivedInvoicesPagination())
    dispatch(clearInvoiceData())
    dispatch(clearClientData())
    return () => {}
  }, [])

  useEffect(() => {
    if (invoiceStatusType === IInvoicesType.RECEIVED) {
      dispatch(clearReceivedInvoicesData())
      dispatch(apiGetReceivedInvoices())
    } else if (invoiceStatusType === IInvoicesType.SENT) {
      dispatch(clearInvoicesData())
      dispatch(apiGetInvoicesIssued())
    }
    return () => {}
  }, [issuedInvoicePage, receivedInvoicepage, invoiceStatusType, apiCall, clear, filterAllowAdvance, filterInvoiceState])

  useEffect(() => {
    const filterInvoiceNumber = document.getElementById('filterInvoiceNumber')
    const filterUserName = document.getElementById('filterUserName')
    let timeoutInvoiceNumber, timeoutUserName

    filterInvoiceNumber?.addEventListener('keydown', () => {
      clearTimeout(timeoutInvoiceNumber)
      timeoutInvoiceNumber = setTimeout(() => {
        setApiCall((filterInvoiceNumber as HTMLInputElement).value)
        clearTimeout(timeoutInvoiceNumber)
      }, 1000)
    })

    filterUserName?.addEventListener('keydown', () => {
      clearTimeout(timeoutUserName)
      timeoutUserName = setTimeout(() => {
        setApiCall((filterUserName as HTMLInputElement).value)
        clearTimeout(timeoutUserName)
      }, 700)
    })
  }, [])

  function redirectToCreateInvoice () {
    dispatch(clearInvoiceData())
    router.push(Routing.addInvoice)
  }

  function RenderTableInvoices () {
    if (invoiceStatusType === IInvoicesType.SENT) return <TableInvoice />
    if (invoiceStatusType === IInvoicesType.RECEIVED) return <TableReceivedInvoices />
    return emptyInvoicesTable()
  }

  function emptyInvoicesTable () {
    return (
      <div className='card rounded shadow overflow-hidden'>
        <div className='card-body p-0'>

          <div className='py-10 py-lg-24'>
            <div className='container max-w-screen-xl'>
              <div className='row justify-content-center text-center'>
                <div className='col-lg-10'>
                  <h4 className='ls-tight font-semibold text-muted mb-3'>{strings('global.appWelcome')}</h4>
                  <h1 className='ls-tight font-bolder mb-0'>
                    {strings('placeholder.uploadFirstInvoice')}
                  </h1>
                  <AsyncImage
                    alt={strings('imageAlt.noInvoices')}
                    source='/images/no-invoices.svg'
                    widthImg='300'
                    heightImg='400'
                    styleContainer='img-fluid mx-auto h-72 mb-0'
                  />

                  <div className='mx-n1'>
                    <button type='button' className='btn btn-primary d-inline mx-1' onClick={() => redirectToCreateInvoice()}>
                      <span className='pe-1'>
                        <i className='bi bi-file-earmark-plus' />
                      </span>
                      {strings('button.uploadInvoice')}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className='pt-5 pb-8 bg-surface-secondary'>
      <div 
        className='container pt-6'
        style={containerQuickpay}
      >
        <div className='mt-n56 mt-lg-n64 position-relative z-index-100'>

          <ul className='nav nav-tabs my-0 justify-content-center' id='invoicesTabs' role='tablist'>
            <li className='nav-item' role='presentation'>
              <button
                className={invoiceStatusType === IInvoicesType.RECEIVED ? 'nav-link active' : 'nav-link'}
                id='received-tab'
                data-bs-toggle='tab'
                data-bs-target='#received-tab-pane'
                type='button'
                role='tab'
                aria-controls='received-tab-pane'
                aria-selected='true'
                onClick={() => {
                  dispatch(setInvoiceDataProps({ prop: 'invoiceStatusType', value: IInvoicesType.RECEIVED }))
                  dispatch(clearReceivedInvoicesPagination())
                  document.getElementById('clear-invoices-filters')?.click()
                }}
              >{strings('title.invoice.received')}
              </button>
            </li>
            <li className='nav-item' role='presentation'>
              <button
                className={invoiceStatusType === IInvoicesType.SENT ? 'nav-link active' : 'nav-link'}
                id='sent-tab'
                data-bs-toggle='tab'
                data-bs-target='#sent-tab-pane'
                type='button'
                role='tab'
                aria-controls='sent-tab-pane'
                aria-selected='false'
                onClick={() => {
                  dispatch(setInvoiceDataProps({ prop: 'invoiceStatusType', value: IInvoicesType.SENT }))
                  dispatch(clearInvoicesPagination())
                  document.getElementById('clear-invoices-filters')?.click()
                }}
              >{strings('title.invoice.sent')}
              </button>
            </li>
          </ul>

          <div className='card shadow overflow-hidden'>
            <div className='card-body p-0'>
              <div className='tab-content' id='invoicesTabsContent'>
                <div className='tab-pane fade show active' id='received-tab-pane' role='tabpanel' aria-labelledby='received-tab' tabIndex={0}>
                  <div className='row g-0'>
                    <div className='col-md-12 col-xl-12 filters h-100 p-4 p-md-5 p-xl-7 border-end-md border-bottom border-bottom-md-0'>
                      <InvoiceFilter />
                    </div>
                    <div className='col-md-12 col-xl-12 h-100'>
                      <RenderTableInvoices />
                    </div>
                  </div>

                </div>
                {/* <div className='tab-pane fade' id='sent-tab-pane' role='tabpanel' aria-labelledby='sent-tab' tabIndex={0}>
                  <div className='row g-0'>
                    <div className='col-md-4 col-xl-3 filters h-100 p-4 p-md-5 p-xl-7 border-end-md border-bottom border-bottom-md-0'>
                      <InvoiceFilter />
                    </div>
                    <div className='col-md-8 col-xl-9 h-100'>
                      <RenderTableInvoices />
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
