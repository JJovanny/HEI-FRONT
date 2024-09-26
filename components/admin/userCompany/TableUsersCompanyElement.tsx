import { ICompany, IUserCompanyList } from 'src/types/admin/userCompany'
import { useRouter } from 'next/navigation'
import Routing from 'src/routing'
import { useDispatch } from 'src/redux/hooks'
import { apiGetUserCompanyById, clearUserCompanyData } from 'src/admin/userCompany/UserCompanyActions'
import { strings } from 'src/resources/locales/i18n'
import { AdminChecker } from 'src/validations/roles'

export const TableUsersCompanyElement = ({ userCompany }: { userCompany: IUserCompanyList }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { id, company, firstName, lastName, email } = userCompany
  // const { name, cif } = company as ICompany

  const handleView = async () => {
    dispatch(clearUserCompanyData())
    await dispatch(apiGetUserCompanyById(id))
    router.push(`${Routing.adminUsers}/${id}`)
  }

  return (
    <tr key={id}>
      <td>
        <a className='text-heading font-semibold' style={{ cursor: 'pointer' }} onClick={handleView}>
          {`${firstName} ${lastName}`}
        </a>
      </td>
      <td> <a href={`mailto:${email}`}> {email} </a></td>
      {/* <td><span>{name}</span></td>
      <td><span>{cif}</span></td> */}
      <AdminChecker>
        <td>
          <button
            type='button'
            className='btn btn-sm btn-secondary d-lg-inline-flex mx-1'
            onClick={handleView}
          >
            <span className='d-lg-inline ps-lg-1'>{strings('button.seeAndEdit')}</span>
          </button>
        </td>
      </AdminChecker>
    </tr>
  )
}
