import { strings } from 'src/resources/locales/i18n'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { useEffect } from 'react'
import { apiGetAssociatedCompanyInvoices } from 'src/admin/companies/CompaniesActions'
import { InvoiceList } from './invoice/InvoiceList'
import { ICompanyState } from 'src/types/admin/company'

export const AssociatedCompanyDetails = () => {
  const dispatch = useDispatch()
  const { companyData, isLoadingGetAssociatedCompanyInvoices } =
  useSelector(state => state.CompaniesReducer as ICompanyState)

  useEffect(() => {
    dispatch(apiGetAssociatedCompanyInvoices())
  }, [])

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
                    {companyData?.name}
                  </div>

                  <div className='mb-3'>
                    <div className='font-semibold text-dark'>{strings('form.placeholder.companyCIF')}</div>
                    {companyData?.cif}
                  </div>

                  <div className='mb-3'>
                    <div className='font-semibold text-dark'>{strings('placeholder.address')}</div>
                    {companyData?.address}
                  </div>

                  <div className='mb-3'>
                    <div className='font-semibold text-dark'>{strings('placeholder.postalCode')}</div>
                    {companyData?.postalCode}
                  </div>

                  <div className='mb-3'>
                    <div className='font-semibold text-dark'>{strings('placeholder.city')}</div>
                    {companyData?.city}
                  </div>

                  <div className='mb-3'>
                    <div className='font-semibold text-dark'>{strings('placeholder.region')}</div>
                    {companyData?.region}
                  </div>

                  <h5 className='mt-6 mb-3 pb-3 border-bottom'>{strings('form.placeholder.paymentPreferences')}</h5>
                  <div className='mb-3'>
                    <div className='font-semibold text-dark'>{strings('placeholder.allowPaymentInAdvance')}</div>
                    {companyData?.paymentPreferences?.allowPaymentInAdvance ? strings('button.yes') : strings('button.no')}
                  </div>

                  <div className='mb-3'>
                    <div className='font-semibold text-dark'>{strings('form.placeholder.externalPayment')}</div>
                    {companyData?.externalPayment ? strings('button.yes') : strings('button.no')}
                  </div>

                  <h5 className='mt-6 mb-3 pb-3 border-bottom'>{strings('form.placeholder.userData')}</h5>
                  <div className='mb-3'>
                    <div className='font-semibold text-dark'>{strings('form.placeholder.name')}</div>
                    {companyData?.contactName}
                  </div>

                  <div className='mb-3'>
                    <div className='font-semibold text-dark'>{strings('form.placeholder.contactEmail')}</div>
                    <a href={`mailto:${companyData?.contactEmail}`}> {companyData?.contactEmail} </a>
                  </div>
                </div>
                <InvoiceList
                  invoices={companyData?.invoices}
                  isLoading={isLoadingGetAssociatedCompanyInvoices}
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>

  )
}
