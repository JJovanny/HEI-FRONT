import { strings } from 'src/resources/locales/i18n'
import MainLayout from 'components/layout/MainLayout'
import { OnboardingProfilesList } from 'components/admin/onboarding/OnboardingProfilesList'
import { useSelector } from 'src/redux/hooks'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Routing from 'src/routing'

export default function OnboardingProfilesPage () {
  const router = useRouter()
  const { userData } = useSelector(state => state.AdminUserReducer)

  useEffect(() => {
    userData?.financialCompany && router.push(Routing.adminAssociatedCompanies)
  }, [])

  return (
    <>
      <MainLayout isAdminRoute>
        <header className='pt-6 pb-56 gradient-bottom start-gray-800 end-gray-500 shadow border-bottom'>
          <div className='container-xl'>
            <div>
              <div className='row align-items-center'>
                <div className='col'>
                  <h1 className='h2 mb-0 text-white'>{strings('title.admin.products')}</h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        <OnboardingProfilesList />
      </MainLayout>
    </>
  )
}
