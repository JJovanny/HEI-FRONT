import { useRouter } from 'next/navigation'

export const CreateSuccessModal = ({ title, callback, route, buttonText }) => {
  const router = useRouter()

  const handleClick = () => {
    callback && callback()
    router.push(route)
  }

  return (
    <div className='modal fade' id='modalSuccessOK' tabIndex={-1} aria-hidden='true'>
      <div className='modal-dialog modal-dialog-centered'>
        <div className='modal-content shadow-4'>
          <div className='modal-body'>
            <div className='text-center py-5 px-5'>
              <div className='icon icon-shape icon-xl rounded-circle bg-soft-primary text-primary text-2xl'>
                <i className='bi bi-person-plus' />
              </div>
              <h3 className='mt-7 mb-n4'>{title}</h3>
            </div>
          </div>
          <div className='modal-footer justify-content-center pb-5 pt-0 border-top-0'>
            <a role='button' className='btn btn-neutral' data-bs-dismiss='modal' onClick={handleClick}>{buttonText}</a>
          </div>
        </div>
      </div>
    </div>

  )
}
