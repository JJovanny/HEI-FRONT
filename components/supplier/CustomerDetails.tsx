import { strings } from 'src/resources/locales/i18n'
import { ClientInvoiceList } from 'components/client/Invoice/ClientInvoiceList'
import { useSelector } from 'src/redux/hooks'
import { IUserState } from 'src/types/user'
import { EUserType } from 'src/types/enums'
import { formatUSD } from 'src/utils/numbers'

export const CustomerDetails = ({ customer, invoices, isLoadingGetClient }) => {
  const { paymentPreferencesExternal } = useSelector(state => state.ClientReducer)
  const { dataUser: { userType } } = useSelector((state) => state.UserReducer as IUserState)

  return (
    <main id='dashboard' className='pt-3 pb-8 bg-surface-secondary'>
      <div className='container-xl'>
        <div className='mt-n56 position-relative z-index-100'>
          <div className='card shadow overflow-hidden'>
            <div className='card-body p-0'>

              <div className='row g-0'>
                <div className='col-md-4 col-xl-3 filters h-100 p-4 p-md-5 p-xl-7 border-end-md border-bottom border-bottom-md-0 small'>
                  <h5 className='mb-3 pb-3 border-bottom'>{strings('form.placeholder.companyData')}</h5>
                  <div className='mb-3'>
                    <div className='font-semibold text-dark'>{strings('form.placeholder.companyName')}</div>
                    {customer?.name}
                  </div>

                  <div className='mb-3'>
                    <div className='font-semibold text-dark'>{strings('form.placeholder.companyCIF')}</div>
                    {customer?.cif}
                  </div>

                  <div className='mb-3'>
                    <div className='font-semibold text-dark'>{strings('placeholder.address')}</div>
                    {customer?.companyAddress}
                  </div>

                  <div className='mb-3'>
                    <div className='font-semibold text-dark'>{strings('placeholder.postalCode')}</div>
                    {customer?.postalCode}
                  </div>

                  <div className='mb-3'>
                    <div className='font-semibold text-dark'>{strings('placeholder.city')}</div>
                    {customer?.city}
                  </div>

                  <div className='mb-3'>
                    <div className='font-semibold text-dark'>{strings('placeholder.region')}</div>
                    {customer?.companyRegion}
                  </div>

                  <h5 className='mt-6 mb-3 pb-3 border-bottom'>{strings('form.placeholder.userData')}</h5>
                  <div className='mb-3'>
                    <div className='font-semibold text-dark'>{strings('form.placeholder.name')}</div>
                    {customer?.companyName}
                  </div>

                  <div className='mb-3'>
                    <div className='font-semibold text-dark'>{strings('form.placeholder.contactEmail')}</div>
                    <a href={`mailto:${customer?.email}`}> {customer?.email} </a>
                  </div>

                  <h5 className='mt-6 mb-3 pb-3 border-bottom'>{strings('form.placeholder.bankInformation')}</h5>
                  <div className='mb-3'>
                    {customer?.bankInformation && customer.bankInformation.includes('/n') ? (customer.bankInformation.split('/n').map((line, index) => (<p key={index}>{line}</p>))) : (customer?.bankInformation)}
                  </div>
                  {((userType === EUserType.PAYER || userType === EUserType.BOTH) && customer.userType !== EUserType.SUPPLIER) && (
                    <>
                    <h5 className='mt-6 mb-3 pb-3 border-bottom'>{strings('placeholder.creditInformation')}</h5>
                    <div className='mb-3'>
                      <div className='font-semibold text-dark'>{strings('placeholder.creditLimit')}</div>
                      {paymentPreferencesExternal !== undefined && paymentPreferencesExternal?.creditLimit !== undefined ? formatUSD(paymentPreferencesExternal?.creditLimit) : ''}
                    </div>
                    <div className='mb-3'>
                      <div className='font-semibold text-dark'>{strings('placeholder.availableCredit')}</div>
                      {paymentPreferencesExternal !== undefined && paymentPreferencesExternal?.availableCredit !== undefined ? formatUSD(paymentPreferencesExternal?.availableCredit) : ''}
                    </div>
                    <div className='mb-3'>
                      <div className='font-semibold text-dark'>{strings('placeholder.usedCredit')}</div>
                      {paymentPreferencesExternal !== undefined && paymentPreferencesExternal?.usedCredit !== undefined ? formatUSD(paymentPreferencesExternal?.usedCredit) : ''}
                    </div>
                    </>
                  )}

                </div>
                <ClientInvoiceList
                  invoices={invoices}
                  isLoading={isLoadingGetClient}
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
