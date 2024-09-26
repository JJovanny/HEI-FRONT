import { strings } from 'src/resources/locales/i18n'
import MainLayout from 'components/layout/MainLayout'
import { SuppliersList } from 'components/supplier/SuppliersList'

export default function FinancialSuppliersPage () {
  return (
    <>
      <MainLayout isAdminRoute={false}>
        <header className='pt-6 pb-56 gradient-bottom start-blue-800 end-blue-500 shadow border-bottom'>
          <div className='container-xl'>
            <div>
              <div className='row align-items-center'>
                <div className='col'>
                  <h1 className='h2 mb-0 text-white'>
                    {strings('title.supplier.suppliers')}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        <SuppliersList />
      </MainLayout>
    </>
  )
}
