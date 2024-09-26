import { useEffect } from 'react'
import { apiGetMyFinancialCompanies } from 'src/payers/PayersActions'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { strings } from 'src/resources/locales/i18n'
import { IFinancialCompany } from 'src/types/payers'
import Loading from 'ui/Loading'
import { NotFound } from 'ui/NotFound'
import { PayerCard } from './PayerCard'

export const PayersList = () => {
  const dispatch = useDispatch()
  const { financialCompanies, isLoadingGetMyFinancialCompanies } = useSelector(state => state.PayersReducer)

  useEffect(() => {
    dispatch(apiGetMyFinancialCompanies())
  }, [])

  return (
    <main className='py-5 py-lg-8 bg-surface-secondary'>
      <div className='container-xl'>
        <div className='mt-n56 position-relative z-index-100'>
          <div className='card rounded shadow overflow-hidden'>
            <div className='card-body p-4 p-lg-5 p-xl-6'>
              <div className='row g-6 mb-6'>
                {isLoadingGetMyFinancialCompanies && <div className='d-flex justify-content-center' style={{ margin: '10px 0px', height: '30vh' }}><Loading /></div>}
                {financialCompanies?.length > 0 &&
                !isLoadingGetMyFinancialCompanies &&
                 financialCompanies?.map((company: IFinancialCompany, index) =>
                   <PayerCard
                     key={index}
                     company={company}
                   />)}
              </div>
              {financialCompanies.length === 0 && !isLoadingGetMyFinancialCompanies && <NotFound string={strings('alert.creditProviders')} />}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
