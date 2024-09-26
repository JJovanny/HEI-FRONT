import moment from 'moment'
import { useRouter } from 'next/router'
import { apiGetClient, apiGetCompanyInvoices } from 'src/client/ClientActions'
import { useDispatch } from 'src/redux/hooks'
import Routing from 'src/routing'
import { EUserType } from 'src/types/enums'

export const TableClient = ({ id, firstName, lastName, email, phoneNumber, ci, createdAt }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const hancleRedirectClientProfile = async () => {
    await dispatch(apiGetClient(id))
    await dispatch(apiGetCompanyInvoices(id, EUserType.SUPPLIER))
    router.push(`${Routing.suppliersCustomers}/${id}`)
  }

  return (
    <>
      <tr onClick={() => { hancleRedirectClientProfile() }}>
        <td>
          <a className='text-heading font-semibold' style={{ cursor: 'pointer' }}>{firstName}</a>
        </td>
        <td>
          <a className='text-heading font-semibold' style={{ cursor: 'pointer' }}>{lastName}</a>
        </td>
        <td>
          <a className='text-heading font-semibold' style={{ cursor: 'pointer' }}>{ci}</a>
        </td>
        <td className='d-none d-lg-table-cell'>
          <div className='text-wrap'> <a href={`mailto:${email}`}> {email} </a></div>
        </td>
        <td> {phoneNumber} </td>
        <td>{moment(createdAt).format('DD/MM/YYYY')}</td>
        </tr>
    </>
  )
}
