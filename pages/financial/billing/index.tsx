import { strings } from 'src/resources/locales/i18n'
import MainLayout from 'components/layout/MainLayout'
import { TableBilling } from 'components/invoice/TableBilling'
import { InvoiceBillingFinancialMetrics } from 'components/invoice/InvoiceBillingFinancialMetrics'
import { containerQuickpay } from 'styles/js/globalStyles'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { apiGetBilling } from 'src/invoice/InvoiceActions'
import { useEffect } from 'react'

export default function FinancialBilling () {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(apiGetBilling())
    return () => {}
  }, [])

  return (
    <>
      <MainLayout isAdminRoute={false}>
        <div style={{paddingTop: '7%'}} className='pb-3 gradient-bottom start-blue-800 end-blue-500 shadow border-bottom'>
        </div>

        <div style={containerQuickpay} className='bg-white border border-1 border-gray shadow border-radius'>
          <h1 className='h2 mb-0 text-dark p-2'>
            {strings('placeholder.billingHistory')}
          </h1>
          <InvoiceBillingFinancialMetrics />
          <TableBilling />
        </div>
      </MainLayout>
    </>
  )
}
