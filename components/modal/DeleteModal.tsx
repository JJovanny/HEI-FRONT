import { useEffect, useState } from 'react'
import { strings } from 'src/resources/locales/i18n'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'src/redux/hooks'

export const DeleteModal = ({ id, apiDelete, route, callback, question, warning, success }:
  { id?, apiDelete, route, callback, question, warning, success }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [deleteItem, setDeleteItem] = useState(false)

  useEffect(() => {
    id && deleteItem && apiDelete && dispatch(apiDelete(id))
    !id && deleteItem && apiDelete && dispatch(apiDelete())
    setDeleteItem(false)
    return () => {}
  }, [deleteItem, id, apiDelete, dispatch])

  const handleDeleteClick = () => {
    if (callback) dispatch(callback())
    document.getElementById(id ? `closeDeleteModal-${id}` : 'closeDeleteModal')?.click()
    router.push(route)
  }

  return (
    <>
      <div className='modal fade' id={id ? `modalDeleteItem-${id}` : 'modalDeleteItem'} tabIndex={-1} aria-labelledby='modalDeleteItem' aria-hidden='true'>
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content shadow-4'>
            <div className='modal-body'>
              <div className='text-center py-5 px-5'>
                <div className='icon icon-shape rounded-circle bg-soft-danger text-danger text-xl'>
                  <i className='bi bi-exclamation-triangle-fill' />
                </div>
                <h3 className='mt-7 mb-4'>{question}</h3>
                <p className='text-sm text-muted'>{warning}</p>
              </div>
            </div>
            <div className='modal-footer justify-content-center'>
              <a role='button' id={id ? `closeDeleteModal-${id}` : 'closeDeleteModal'} className='btn btn-sm btn-neutral' data-bs-dismiss='modal'>{strings('button.cancel')}</a>
              <a role='button' className='btn btn-sm btn-danger' onClick={() => setDeleteItem(true)} data-bs-dismiss='modal'>{strings('button.delete')}</a>
              <a id='modalDisplayDeleteItemOK' role='button' className='d-none' data-bs-toggle='modal' data-bs-target='#modalDeleteItemOK' />
            </div>
          </div>
        </div>
      </div>

      <div className='modal fade' id='modalDeleteItemOK' tabIndex={-1} aria-labelledby='modalDeleteItemOK' aria-hidden='true'>
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content shadow-4'>
            <div className='modal-body'>
              <div className='text-center py-5 px-5'>
                <div className='icon icon-shape icon-xl rounded-circle bg-soft-danger text-danger text-2xl'>
                  <i className='bi bi-trash' />
                </div>
                <h3 className='mt-7 mb-n4'>{success}</h3>
              </div>
            </div>
            <div className='modal-footer justify-content-center pb-5 pt-0 border-top-0'>
              <a role='button' className='btn btn-sm btn-neutral' data-bs-dismiss='modal' onClick={handleDeleteClick}>{strings('button.close')}</a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
