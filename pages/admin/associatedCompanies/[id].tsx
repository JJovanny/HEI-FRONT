import MainLayout from 'components/layout/MainLayout'
import { AssociatedCompanyDetails } from 'components/admin/associatedCompanies/AssociatedCompanyDetails'
import { useSelector } from 'src/redux/hooks'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Routing from 'src/routing'
import { ICompanyState } from 'src/types/admin/company'

export default function AssociatedCompaniesDetailPage () {
  const router = useRouter()
  const { userData } = useSelector(state => state.AdminUserReducer)
  const { companyData } = useSelector(state => state.CompaniesReducer as ICompanyState)

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
                  <h1 className='h2 mb-0 text-white'>{companyData?.name}</h1>
                </div>
              </div>
            </div>
          </div>
        </header>
        <AssociatedCompanyDetails />
      </MainLayout>
    </>
  )
}
