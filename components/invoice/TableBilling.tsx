import Loading from 'ui/Loading'
import React from 'react'
import { strings } from 'src/resources/locales/i18n'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { apiGetInvoicesIssued, setInvoiceDataProps, apiDeleteInvoice } from 'src/invoice/InvoiceActions'
import { IInvoiceState } from 'src/types/invoice'
import { NotFound } from 'ui/NotFound'
import { DeleteModal } from '../modal/DeleteModal'
import Routing from '../../src/routing'
import { handleDownloadPdfBilling } from 'src/api/utils'
import { IUserState } from 'src/types/user'

export const TableBilling = () => {
  const dispatch = useDispatch()
  const { billing, isLoadingGetInvoices, page, count, limit, invoiceIdToDelete } = useSelector((state) => state.InvoiceReducer as IInvoiceState)
  const { accessToken, dataUser: { companyBranchSelected } } =  useSelector((state) => state. UserReducer as IUserState )


  const handleDownload = async (date) => {
   return handleDownloadPdfBilling(date,accessToken,companyBranchSelected)
  }

  return (
    <>
      {isLoadingGetInvoices
        ? <div className='mt-5'><Loading /></div>
        : (
          <div className='table-responsive bg-white'>
            <table className='table table-hover table-nowrap table-white'>
              <thead className='gradient-top table-white'>
                <tr>
                  <th scope='col' className='d-none d-xl-table-cell'>{strings('placeholder.date').toUpperCase()}</th>
                  <th scope='col' className='d-none d-xl-table-cell'>{strings('placeholder.description').toUpperCase()}</th>
                  <th scope='col' className='d-none d-xl-table-cell'>{strings('placeholder.state').toUpperCase()}</th>
                  <th scope='col' className='d-none d-xl-table-cell'>{strings('placeholder.invoice').toUpperCase()}</th>
                </tr>
              </thead>
              <tbody>
              {Array.isArray(billing) && billing.map((invoice: any, id) => (
                <tr key={id}>
                    <td>{invoice?.date}</td>
                    <td>{strings('placeholder.queickpayMonthlyCommission')}</td>
                    <td><i className='bi bi-check-circle'/>&nbsp;{strings('placeholder.settledOn')}&nbsp;{invoice?.date}</td>
                    <td className='cursor-pointer' onClick={(e) => {handleDownload(invoice?.date)}}>
                        <i className='bi bi-download' />
                    </td>
                </tr>
                ))}
              </tbody>
            </table>
            {(Array.isArray(billing) && !(billing.length > 0))
              ? <NotFound string={strings('alert.notInvoices')} />
              : <></>}

            {!(billing)
              ? <NotFound string={strings('alert.notInvoices')} />
              : <></>}

          </div>
          )}
    </>
  )
}
