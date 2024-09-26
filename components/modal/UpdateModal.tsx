import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { strings } from 'src/resources/locales/i18n'

export const UpdateModal = ({ success, callback, route }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const handleClick = () => {
    dispatch(callback())
    router.push(route)
  }

  return (
    <div className='modal fade' id='modalUpdateOK' tabIndex={-1} aria-hidden='true'>
      <div className='modal-dialog modal-dialog-centered'>
        <div className='modal-content shadow-4'>
          <div className='modal-body'>
            <div className='text-center py-5 px-5'>
              {/* Icon */}
              <div className='icon icon-shape icon-xl rounded-circle bg-soft-primary text-primary text-2xl'>
                <i className='bi bi-person-plus' />
              </div>
              {/* Title */}
              <h3 className='mt-7 mb-n4'>{strings(`placeholder.${success}`)}</h3>
            </div>
          </div>
          <div className='modal-footer justify-content-center pb-5 pt-0 border-top-0'>
            <a role='button' className='btn btn-neutral' data-bs-dismiss='modal' onClick={handleClick}>{strings('button.accept')}</a>
          </div>
        </div>
      </div>
    </div>

  )
}
