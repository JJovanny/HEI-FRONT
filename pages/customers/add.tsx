import { AddClientForm } from 'components/form/AddClientForm'
import MainLayout from 'components/layout/MainLayout'
import { Header } from 'components/Header'
import { useRouter } from 'next/navigation'
import Routing from 'src/routing'

export default function AddCustomerPage () {
  /** hidden this page */
  const router = useRouter()
  router.push(Routing.dashboard)

  return (
    <>
      <MainLayout isAdminRoute={false}>
        <Header title='title.client.newClient' />
        <AddClientForm />
      </MainLayout>
    </>
  )
}
