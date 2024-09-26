import { TaxForm } from 'components/form/TaxForm'
import MainLayout from 'components/layout/MainLayout'
import { Header } from 'components/Header'

export default function AddTaxPage () {
  return (
    <>
      <MainLayout isAdminRoute={false}>
        <Header title='title.tax.newTax' />
        <TaxForm isEdit={false} />
      </MainLayout>
    </>
  )
}
