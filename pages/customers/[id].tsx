import { strings } from 'src/resources/locales/i18n'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import Routing from 'src/routing'
import { UserForm } from 'components/form/UserForm'
import MainLayout from 'components/layout/MainLayout'
import { clearClientData, clearClientDataErrors } from 'src/client/ClientActions'
import { useSelector } from 'src/redux/hooks'

export default function EditCustomerPage () {
  const router = useRouter()
  const dispatch = useDispatch()

  function redirectToCreateClient () {
    dispatch(clearClientData())
    clearClientDataErrors()
    router.push(Routing.addClient)
  }

  const { client } = useSelector(({ ClientReducer }) => {
    const { client } = ClientReducer

    return { client }
  })

  !client?.id && router.push(Routing.dashboard)

  return (
    <>
      <MainLayout isAdminRoute={false}>
        <header className='pt-6 pb-56 gradient-bottom start-blue-800 end-blue-500 shadow border-bottom'>
          <div className='container-xl'>
            <div>
              <div className='row align-items-center'>
                <div className='col'>
                  {/* <!-- Title --> */}
                  <h1 className='h2 mb-0 text-white'>{strings('title.client.editClient')}</h1>
                </div>
                {/* <!-- Actions --> */}
                <div className='col-auto text-end'>
                  <div className='mx-n1'>
                    <button type='button' className='btn btn-sm btn-primary d-lg-inline-flex mx-1' onClick={() => redirectToCreateClient()}>
                      <span className='pe-2'>
                        <i className='bi bi-person-plus' />
                      </span>
                      <span className='d-none d-lg-inline ps-lg-1'>{strings('button.newClient')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <UserForm isSupplier={false} user={client} />
      </MainLayout>
    </>
  )
}
