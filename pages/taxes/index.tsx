import { strings } from 'src/resources/locales/i18n'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import Routing from 'src/routing'
import { TaxesList } from 'components/tax/TaxesList'
import MainLayout from 'components/layout/MainLayout'
import { clearTaxDataErrors, clearTaxData, apiDeleteCompanyTax, setTaxDataProps, apiGetTaxes } from 'src/tax/TaxActions'
import { DeleteModal } from '../../components/modal/DeleteModal'
import { useSelector } from '../../src/redux/hooks'

export default function TaxesPage () {
  const router = useRouter()
  const dispatch = useDispatch()
  const { taxIdToDelete } = useSelector(state => state.TaxReducer)

  function redirectToCreateTax () {
    dispatch(clearTaxData())
    dispatch(clearTaxDataErrors())
    router.push(Routing.addTax)
  }

  return (
    <>
      <MainLayout isAdminRoute={false}>
        <header className='pt-6 pb-56 gradient-bottom start-blue-800 end-blue-500 shadow border-bottom'>
          <div className='container-xl'>
            <div>
              <div className='row align-items-center'>
                <div className='col'>
                  <h1 className='h2 mb-0 text-white'>{strings('title.tax.taxes')}</h1>
                </div>
                <div className='col-auto text-end'>
                  <div className='mx-n1'>
                    <button type='button' className='btn btn-sm btn-primary d-lg-inline-flex mx-1' onClick={() => redirectToCreateTax()}>
                      <span className='pe-2'>
                        <i className='bi bi-cash-coin' />
                      </span>
                      <span className='d-none d-lg-inline ps-lg-1'>{strings('button.newTax')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <TaxesList />

        <DeleteModal
          id={taxIdToDelete}
          apiDelete={() => apiDeleteCompanyTax(taxIdToDelete)}
          route={Routing.taxes}
          callback={apiGetTaxes}
          question={strings('placeholder.deleteElementQuestion', { element: strings('placeholder.tax').toLowerCase() })}
          warning={strings('placeholder.deleteElementWarning', { element: strings('placeholder.tax').toLowerCase() })}
          success={strings('placeholder.deleteElementSuccess', { element: strings('placeholder.tax') })}
        />
      </MainLayout>
    </>
  )
}
