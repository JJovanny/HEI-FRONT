import { strings } from 'src/resources/locales/i18n'
import MainLayout from 'components/layout/MainLayout'
import { DashboardList } from '../../components/dashboard/DashboardList'
import { useRouter } from 'next/router'
import Routing from '../../src/routing'
import { useEffect } from 'react'
import { clearInvoiceData } from 'src/invoice/InvoiceActions'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { IUserState } from 'src/types/user'
import { EUserType } from 'src/types/enums'

export default function DashboardPage () {
  const dispatch = useDispatch()
  const router = useRouter()
  const { dataUser } = useSelector(state => state.UserReducer as IUserState)
  const redirectUserType = dataUser.userType === EUserType.SUPPLIER || dataUser.userType === EUserType.PAYER

  useEffect(() => {
    if (window.location.pathname === router.pathname && redirectUserType) {
      router.push(Routing.dashboard)
    }
    if (window.location.pathname !== router.pathname) {
      router.push(`${window.location.pathname}`)
    }
  }, [])

  // function redirectToCreateInvoice () {
  //   dispatch(clearInvoiceData())
  //   router.push(Routing.addInvoice)
  // }

  return (
    <>
      <MainLayout isAdminRoute={false}>
        <header className='pt-6 pb-56 gradient-bottom start-blue-800 end-blue-500 shadow border-bottom'>
          <div className='container-xl'>
            <div>
              <div className='row align-items-center'>
                <div className='col'>
                  <h1 className='h2 mb-0 text-white'>
                    {strings('dashboard.title')}
                  </h1>
                </div>
                <div className='col-auto text-end'>
                  <div className='mx-n1'>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </header>

        <DashboardList />

      </MainLayout>
    </>
  )
}
