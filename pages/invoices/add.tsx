import { InvoiceForm } from 'components/form/InvoiceForm'
import MainLayout from 'components/layout/MainLayout'
import { Header } from 'components/Header'

export default function AddInvoicePage () {
  return (
    <>
      <MainLayout isAdminRoute={false}>
        <Header title='title.invoice.uploadNewInvoice' />
        <InvoiceForm isEdit={false} />
      </MainLayout>
    </>
  )
}
