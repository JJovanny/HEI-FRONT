import { strings } from 'src/resources/locales/i18n'

export const SectionFinancialCompany = ({ financialCompany }) => {
  return (
    <section>
      <div className='collapse show' id='collapseDetails'>
        <div className='card card-body p-4 mb-md-3'>
          <div className='mb-4'>
            <h6 className='pb-2 mb-3 border-bottom'>{strings('title.admin.myFinancialCompany')}</h6>
            <div className='row g-2'>
              <div className='col-12 col-md-3'>
                <p><span className='font-semibold'>{strings('form.placeholder.companyName')}</span>
                  <br />{financialCompany?.name}
                </p>
              </div>
              <div className='col-12 col-md-3'>
                <p><span className='font-semibold'>{strings('form.placeholder.companyCIF')}</span>
                  <br />{financialCompany?.cif}
                </p>
              </div>
              <div className='col-6 col-md-2'>
                <p><span className='font-semibold'>{strings('placeholder.address')}</span>
                  <br />{financialCompany?.address}
                </p>
              </div>
              <div className='col-6 col-md-2'>
                <p><span className='font-semibold'>{strings('placeholder.city')}</span>
                  <br />{financialCompany?.city}
                </p>
              </div>
              <div className='col-12 col-md-2'>
                <p><span className='font-semibold'>{strings('placeholder.region')}</span>
                  <br />{financialCompany?.region}
                </p>
              </div>
              <div className='col-12 col-md-3'>
                <p><span className='font-semibold'>{strings('placeholder.postalCode')}</span>
                  <br />{financialCompany?.postalCode}
                </p>
              </div>
              <div className='col-12 col-md-3'>
                <p><span className='font-semibold'>{strings('placeholder.phone')}</span>
                  <br />{financialCompany?.phone}
                </p>
              </div>
              <div className='col-12 col-md-3'>
                <p><span className='font-semibold'>{strings('form.placeholder.contactEmail')}</span>
                  <br />
                  <a href={`mailto:${financialCompany?.contactEmail}`}>
                    {financialCompany?.contactEmail}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
