import { IFinancialCompany } from 'src/types/payers'

export const PayerCard = ({ company } : {company: IFinancialCompany}) => {
  const { name, address, region, contactEmail } = company

  return (
    <div className='col-xl-4 col-sm-6 col-12'>
      <div className='card card-payer'>
        <div className='px-5 py-4'>
          <div className='row align-items-center'>
            <div className='col-auto'>
              {/* <a href='#' className='avatar rounded-circle'>
                <img alt='...' src='' />
              </a> */}
              <div className='bg-primary d-flex align-items-center justify-content-center avatar rounded-circle text-white' style={{ width: '46px', height: '46px', margin: '0 auto' }}>
                <div style={{ fontSize: '20px' }}>  </div>
              </div>
            </div>
            <div className='col ms-md-n2'>
              <a href='#' className='d-block h4 mb-0'>{name}</a>
              <span className='d-block text-xs text-muted'>{`${address}, ${region}`}</span>
            </div>
            {/* <div className='col-auto'>
            <a href='payer-edit.php' className='text-sm font-semibold'>Edit</a>
          </div> */}
          </div>
          {/* <hr /> */}
          {/* <div className='row text-sm'>
            <div className='col-3 text-center'>
              <div className='text-muted'>Clients</div>
              <div className='h5 mb-0'>186</div>
            </div>
            <div className='col-4 text-center'>
              <div className='text-muted'>Credits</div>
              <div className='h5 mb-0'>2,933</div>
            </div>
            <div className='col-5 text-center'>
              <div className='text-muted'>Total financed</div>
              <div className='h5 mb-0'>$150,789.03</div>
            </div>
          </div> */}
          <hr />
          <div className='row align-items-center'>
            <div className='col-6'>
              <a href={`mailto:${contactEmail}`} className='btn btn-sm btn-outline-primary'>{contactEmail}</a>
            </div>
            {/* <div className='col-6 text-end'>
            <a href='#' className='btn btn-sm btn-neutral'>Deactivate</a>
            <a href='#' className='btn btn-sm btn-neutral'><i className='bi bi-trash' /></a>
          </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}
