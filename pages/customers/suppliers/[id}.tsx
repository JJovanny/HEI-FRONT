import MainLayout from 'components/layout/MainLayout'
import { useSelector } from 'src/redux/hooks'
import { CustomerDetails } from 'components/supplier/CustomerDetails'

export default function CustomerInforDetailPage () {
  const { client, isLoadingGetClient } = useSelector(({ ClientReducer }) => {
    const { client, isLoadingGetClient } = ClientReducer
    return { client, isLoadingGetClient }
  })
  return (
    <>
      <MainLayout isAdminRoute={false}>
        <header className='pt-6 pb-56 gradient-bottom start-blue-800 end-blue-500 shadow border-bottom'>
          <div className='container-xl'>
            <div>
              <div className='row align-items-center'>
                <div className='col'>
                  <h1 className='h2 mb-0 text-white'>{client?.companyName}</h1>
                </div>
              </div>
            </div>
          </div>
        </header>
        <CustomerDetails customer={client} invoices={client.invoicesList} isLoadingGetClient={isLoadingGetClient} />
      </MainLayout>
    </>
  )
}
