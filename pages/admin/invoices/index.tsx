import MainLayout from 'components/layout/MainLayout'
import { useSelector } from 'src/redux/hooks'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Routing from 'src/routing'
import { InvoicesContainer } from 'components/admin/invoices/InvoicesContainer'
import { strings } from 'src/resources/locales/i18n'

export default function InvoicesPage () {
  const router = useRouter()
  const { userData } = useSelector(state => state.AdminUserReducer)

  useEffect(() => {
    !userData?.financialCompany && router.push(Routing.adminOnboardingProfiles)
  }, [])

  return (
    <>
      <MainLayout isAdminRoute>
        <header className='pt-6 pb-56 gradient-bottom start-gray-800 end-gray-500 shadow border-bottom'>
          <div className='container-xl'>
            <div>
              <div className='row align-items-center'>
                <div className='col'>
                  <h1 className='h2 mb-0 text-white'>{strings('title.invoice.allInvoices')}</h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        <InvoicesContainer />
      </MainLayout>
    </>
  )
}
