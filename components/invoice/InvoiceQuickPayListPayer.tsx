import { clearInvoiceData } from 'src/invoice/InvoiceActions'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { useEffect, useState } from 'react'
import { TableReceivedInvoices } from './TableReceivedInvoices'
import { clearReceivedInvoicesPagination, clearReceivedInvoicesData, apiGetReceivedInvoicesQuickpay } from 'src/receivedInvoice/ReceivedInvoiceActions'
import { IInvoiceList, IInvoiceState } from 'src/types/invoice'
import { IInvoicesFilter } from 'src/types/filter'
import { InvoiceFilter } from 'components/filter/InvoiceFilter'
import { clearClientData } from 'src/client/ClientActions'
import { TableReceivedQuickPayInvoices } from './TableReceivedQuickPayInvoices'
import { containerQuickpay } from 'styles/js/globalStyles'
import { InvoiceQuickpayReceivdMetrics } from './InvoiceQuickpayReceivdMetrics'

export const InvoiceQuickPayListPayer = () => {
  const dispatch = useDispatch()
  const [apiCall, setApiCall] = useState('')

  const { receivedInvoicepage, companyBranchSelected, filters, invoiceStatusType } = useSelector(({ UserReducer, InvoiceReducer, ReceivedInvoiceReducer }) => {
    const { invoices, isLoadingGetInvoices, filters, invoiceStatusType } : {
      invoices: IInvoiceList[],
      isLoadingGetInvoices: boolean,
      page: number,
      filters: IInvoicesFilter,
      invoiceStatusType: string
    } = InvoiceReducer as IInvoiceState
    const { receivedInvoices, isLoadingReceivedInvoices } = ReceivedInvoiceReducer
    const { accessToken, dataUser } = UserReducer
    const { companyBranchSelected } = dataUser

    return { accessToken, companyBranchSelected, invoices, isLoadingGetInvoices, invoiceStatusType, receivedInvoices, isLoadingReceivedInvoices, receivedInvoicepage: ReceivedInvoiceReducer.page, filters }
  })
  const { clear, filterAllowAdvance, filterInvoiceState } = filters

  useEffect(() => {
    dispatch(clearReceivedInvoicesPagination())
    dispatch(clearInvoiceData())
    dispatch(clearClientData())
    return () => {}
  }, [])

  useEffect(() => {
    dispatch(clearReceivedInvoicesData())
    dispatch(apiGetReceivedInvoicesQuickpay())
    return () => {}
  }, [receivedInvoicepage, invoiceStatusType, apiCall, clear, filterAllowAdvance, filterInvoiceState, companyBranchSelected])

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

  function RenderTableInvoices () {
    return <TableReceivedQuickPayInvoices />
  }

  return (
    <>
      <div 
      className='container pt-5'
      style={containerQuickpay}
      >
        <div className='mt-n56 position-relative z-index-100'>
          <div className='card rounded shadow overflow-hidden'>
            <div className='card-body p-0'>
              <div className='tab-content' id='invoicesTabsContent'>
                <div className='tab-pane fade show active' id='received-tab-pane' role='tabpanel' aria-labelledby='received-tab' tabIndex={0}>
                  <div className='row g-0'>
                    <div className='col-md-12 col-xl-12 h-100'>
                    <div className='col-md-12 col-xl-12 filters h-50 p-1 p-md-1 p-xl-1 border-end-md border-bottom border-bottom-md-0'>
                      <InvoiceQuickpayReceivdMetrics />
                    </div>
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
