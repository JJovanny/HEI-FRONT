import { strings } from 'src/resources/locales/i18n'
import { useRouter } from 'next/navigation'
import Routing from 'src/routing'
import { clearTaxDataErrors, apiGetTax, setTaxDataProps } from 'src/tax/TaxActions'
import { useDispatch } from 'src/redux/hooks'

export const TableTax = ({ id, name, percentage, isDefault, isUsed }) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const handleEditClick = async () => {
    if (isDefault) return
    dispatch(clearTaxDataErrors())
    await dispatch(apiGetTax(id))
    router.push(`${Routing.taxes}/${id}`)
  }

  const setIdToDelete = async () => {
    dispatch(setTaxDataProps({ prop: 'taxIdToDelete', value: id }))
  }

  return (
    <>
      <tr>
        <td>
          {
            isUsed
              ? <label className='text-heading font-semibold'> {name} </label>
              : <a className='text-heading font-semibold' onClick={handleEditClick} style={{ cursor: 'pointer' }}> {name} </a>
          }
        </td>
        <td className='text-end'> {percentage} </td>
        <td className='text-end'>
          {isDefault
            ? <span className='badge bg-soft-primary-tax text-white' style={{ width: '75px' }}>{strings('placeholder.default')}</span>
            : <></>}
          {isUsed
            ? <span className='badge bg-warning text-white' style={{ width: '75px' }}>{strings('placeholder.inUse')}</span>
            : <></>}
          {isUsed || isDefault
            ? <></>
            : (
              <>
                <div className='dropdown'>
                  <a className='ps-2 text-lg text-muted' href='#' role='button' data-bs-toggle='dropdown' aria-haspopup='true' aria-expanded='false' onClick={async () => await setIdToDelete()}>
                    <i className='bi bi-three-dots-vertical' />
                  </a>
                  <div className='dropdown-menu'>
                    <a className='dropdown-item' style={{ cursor: 'pointer' }} onClick={handleEditClick}>
                      <i className='bi bi-pencil me-1' />
                      {strings('button.edit')}
                    </a>
                    <a role='button' className='dropdown-item text-danger' data-bs-toggle='modal' data-bs-target={`#modalDeleteItem-${id}`}>
                      <i className='bi bi-trash me-1' />
                      {strings('button.delete')}
                    </a>
                  </div>
                </div>
              </>)}
        </td>
      </tr>
    </>
  )
}
