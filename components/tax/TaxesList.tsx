import { TableTax } from './TableTax'
import { strings } from 'src/resources/locales/i18n'
import Loading from 'ui/Loading'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { useEffect } from 'react'
import { apiGetTaxes, clearTaxData, clearTaxesData } from 'src/tax/TaxActions'

export const TaxesList = () => {
  const dispatch = useDispatch()

  const { defaultTaxes, supplierTaxes, isLoadingGetTaxes } = useSelector(({ TaxReducer, UserReducer }) => {
    const { defaultTaxes, supplierTaxes, isLoadingGetTaxes } = TaxReducer
    const { accessToken } = UserReducer

    return { accessToken, defaultTaxes, supplierTaxes, isLoadingGetTaxes }
  })

  useEffect(() => {
    dispatch(clearTaxesData())
    dispatch(clearTaxData())
    dispatch(apiGetTaxes())
    return () => {}
  }, [])

  if (isLoadingGetTaxes) return <div className='mt-5'><Loading /></div>

  return (
    <>
      <main className='pt-5 pt-lg-8 bg-surface-secondary'>
        <div className='container-xl'>
          <div className='mt-n56 position-relative z-index-100'>
            <div className='card rounded shadow'>
              <div className='card-body p-0'>
                <div className='table-responsive'>
                  <table className='table table-hover table-nowrap'>
                    <thead className='gradient-top start-blue-100 end-gray-100 table-light'>
                      <tr>
                        <th scope='col'>{strings('placeholder.name').toUpperCase()}</th>
                        <th scope='col' className='text-end'>{strings('placeholder.percentage').toUpperCase()}</th>
                        <th scope='col' />
                      </tr>
                    </thead>
                    <tbody>
                      {defaultTaxes.map((tax, index) =>
                        tax.percentage > 0 && <TableTax
                          key={'defaultTax-' + index}
                          id={tax.id}
                          name={tax.name}
                          percentage={tax.percentage}
                          isDefault
                          isUsed={null}
                                              />)}
                      {supplierTaxes.map((tax, index) =>
                        <TableTax
                          key={'companyTax-' + index}
                          id={tax.id}
                          name={tax.name}
                          percentage={tax.percentage}
                          isUsed={tax.isUsed}
                          isDefault={false}
                        />)}
                    </tbody>
                  </table>
                </div>
                <div className='py-4 text-center'>
                  <p className='text-xs text-muted'>
                    {strings('placeholder.showResults',
                      { actualResultsShowed: defaultTaxes.length + supplierTaxes.length, totalResults: defaultTaxes.length + supplierTaxes.length })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
