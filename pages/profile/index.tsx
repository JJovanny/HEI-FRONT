import MainLayout from 'components/layout/MainLayout'
import { Header } from 'components/Header'
import { ProfileForm } from 'components/form/ProfileForm'

export default function EditProfilePage () {
  return (
    <>
      <MainLayout isAdminRoute={false}>
        <Header title='title.supplier.myProfile' />
        <ProfileForm />
      </MainLayout>
    </>
  )
}
