import { useRouter } from 'next/navigation'
import Routing from 'src/routing'
import {
  apiGetInvoicesIssuedQuickpay,
  clearInvoiceData,
  clearInvoicesData,
  clearInvoicesPagination,
  setInvoiceDataProps
} from 'src/invoice/InvoiceActions'
import AsyncImage from '../../ui/image/AsyncImage'
import { strings } from 'src/resources/locales/i18n'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { useEffect, useState } from 'react'
import { TableReceivedQuickpay } from './TableReceivedQuickpay'
import { IInvoicesType } from 'src/types/enums'
import { clearReceivedInvoicesPagination, clearReceivedInvoicesData, apiGetReceivedInvoicesQuickpay } from 'src/receivedInvoice/ReceivedInvoiceActions'
import { IInvoiceList, IInvoiceState } from 'src/types/invoice'
import { IInvoicesFilter } from 'src/types/filter'
import { InvoiceFilter } from 'components/filter/InvoiceFilter'
import { clearClientData } from 'src/client/ClientActions'
import { TableQuickpayInvoice } from './TableQuickpayInvoice'
import { containerQuickpay } from 'styles/js/globalStyles'

export const InvoiceQuickPayList = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [apiCall, setApiCall] = useState('')
  const queryString = window.location.search
  const searchParams = new URLSearchParams(queryString)
  const paramTypeInvoice = searchParams.get('typeInvoice')

  const { issuedInvoicePage, receivedInvoicepage, filters, invoiceStatusType, dataUser } = useSelector(({ UserReducer, InvoiceReducer, ReceivedInvoiceReducer }) => {
    const { invoices, isLoadingGetInvoices, page, filters, invoiceStatusType } : {
      invoices: IInvoiceList[],
      isLoadingGetInvoices: boolean,
      page: number,
      filters: IInvoicesFilter,
      invoiceStatusType: string
    } = InvoiceReducer as IInvoiceState
    const { receivedInvoices, isLoadingReceivedInvoices } = ReceivedInvoiceReducer
    const { accessToken, dataUser } = UserReducer

    return { accessToken, invoices, dataUser, isLoadingGetInvoices, invoiceStatusType, receivedInvoices, isLoadingReceivedInvoices, issuedInvoicePage: page, receivedInvoicepage: ReceivedInvoiceReducer.page, filters }
  })
  const { clear, filterAllowAdvance, filterInvoiceState } = filters
  const { companyBranchSelected } = dataUser

  useEffect(() => {
    invoiceStatusType === IInvoicesType.SENT ? dispatch(clearInvoicesPagination()) : dispatch(clearReceivedInvoicesPagination())
    dispatch(clearInvoiceData())
    dispatch(clearClientData())
    return () => {}
  }, [])

  useEffect(() => {
    if (paramTypeInvoice === 'send') {
      dispatch(setInvoiceDataProps({ prop: 'invoiceStatusType', value: IInvoicesType.SENT }))
      dispatch(clearInvoicesPagination())
      document.getElementById('clear-invoices-filters')?.click()
    }

    if (paramTypeInvoice === 'received') {
      dispatch(setInvoiceDataProps({ prop: 'invoiceStatusType', value: IInvoicesType.RECEIVED }))
      dispatch(clearReceivedInvoicesPagination())
      document.getElementById('clear-invoices-filters')?.click()
    }
  }, [paramTypeInvoice])

  useEffect(() => {
    if (invoiceStatusType === IInvoicesType.RECEIVED) {
      dispatch(clearReceivedInvoicesData())
      dispatch(apiGetReceivedInvoicesQuickpay())
    } else if (invoiceStatusType === IInvoicesType.SENT) {
      dispatch(clearInvoicesData())
      dispatch(apiGetInvoicesIssuedQuickpay())
    }
    return () => {}
  }, [issuedInvoicePage, receivedInvoicepage, companyBranchSelected, invoiceStatusType, apiCall, clear, filterAllowAdvance, filterInvoiceState])

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
    if (invoiceStatusType === IInvoicesType.SENT) return <TableQuickpayInvoice />
    if (invoiceStatusType === IInvoicesType.RECEIVED) return <TableReceivedQuickpay />
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
    <>
      <div 
        className='container'
        style={containerQuickpay}
      >
        <div className='mt-n56 mt-lg-n64 position-relative z-index-100'>
          <ul className='nav nav-tabs my-0 justify-content-center' id='invoicesTabs' role='tablist'>
            <li className='nav-item' role='presentation'>
              <button
                className={invoiceStatusType === IInvoicesType.RECEIVED ? 'nav-link active' : 'nav-link'}
                type='button'
                role='tab'
                aria-controls='received-tab-pane'
                aria-selected='true'
                onClick={() => {
                  dispatch(setInvoiceDataProps({ prop: 'invoiceStatusType', value: IInvoicesType.RECEIVED }))
                  dispatch(clearReceivedInvoicesPagination())
                  document.getElementById('clear-invoices-filters')?.click()
                  const newUrl = window.location.pathname
                  window.history.replaceState({}, '', newUrl)
                }}
              >{strings('title.invoice.received')}
              </button>
            </li>
            <li className='nav-item' role='presentation'>
              <button
                className={invoiceStatusType === IInvoicesType.SENT ? 'nav-link active' : 'nav-link'}
                type='button'
                role='tab'
                aria-controls='sent-tab-pane'
                aria-selected='false'
                onClick={() => {
                  dispatch(setInvoiceDataProps({ prop: 'invoiceStatusType', value: IInvoicesType.SENT }))
                  dispatch(clearInvoicesPagination())
                  document.getElementById('clear-invoices-filters')?.click()
                  const newUrl = window.location.pathname
                  window.history.replaceState({}, '', newUrl)
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
                    <div className='col-md-12 col-xl-12 h-100'>
                      <div className='col-md-12 col-xl-12 filters h-100 ps-4 ps-md-4 ps-xl-4 pt-3 pt-md-3 pt-xl-3 border-end-md border-bottom border-bottom-md-0'>
                        <InvoiceFilter top/>
                      </div>
                      <RenderTableInvoices />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
